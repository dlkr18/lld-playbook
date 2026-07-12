package com.you.lld.problems.carrental;

import com.you.lld.problems.carrental.model.Car;
import com.you.lld.problems.carrental.model.CarStatus;
import com.you.lld.problems.carrental.model.CarType;
import com.you.lld.problems.carrental.model.Charges;
import com.you.lld.problems.carrental.model.Customer;
import com.you.lld.problems.carrental.model.DateRange;
import com.you.lld.problems.carrental.model.Location;
import com.you.lld.problems.carrental.model.Reservation;
import com.you.lld.problems.carrental.service.LateFeePolicy;
import com.you.lld.problems.carrental.service.PricingStrategy;
import com.you.lld.problems.carrental.service.ReservationObserver;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Facade / orchestrator for the car-rental system — the "god object" an
 * interviewer sees first. Owns the fleet, the customer directory and every
 * reservation, and wires in the pluggable {@link PricingStrategy},
 * {@link LateFeePolicy} and {@link ReservationObserver}s.
 *
 * <h3>Concurrency model (stated explicitly)</h3>
 * <ul>
 *   <li>Registries ({@code cars}, {@code customers}, {@code reservationsById})
 *       are {@link ConcurrentHashMap}s for safe publication and lock-free reads.</li>
 *   <li>The <b>check-then-reserve</b> critical section is guarded by a
 *       <b>per-car {@link ReentrantLock}</b>. Threads racing for <i>different</i>
 *       cars never contend; only threads targeting the <i>same</i> car serialize.
 *       This makes "no two overlapping reservations for one car" an invariant
 *       even under a stampede.</li>
 *   <li>Every operation that reads or mutates a car's schedule — reserve,
 *       search, pickUp, returnCar, cancel — takes that car's lock, so overlap
 *       checks always see a consistent snapshot of the car's reservation list.</li>
 *   <li>Observers are notified <i>after</i> the lock is released, so slow
 *       listeners never widen the critical section or risk deadlock.</li>
 * </ul>
 */
public final class CarRental {

    private final Map<String, Location> locations = new ConcurrentHashMap<String, Location>();
    private final Map<String, Customer> customers = new ConcurrentHashMap<String, Customer>();
    private final Map<String, Car> cars = new ConcurrentHashMap<String, Car>();
    private final Map<String, Reservation> reservationsById = new ConcurrentHashMap<String, Reservation>();

    /** carId -> that car's reservations. Each list is only touched under the car's lock. */
    private final Map<String, List<Reservation>> reservationsByCar =
            new ConcurrentHashMap<String, List<Reservation>>();
    /** carId -> the lock guarding its check-then-reserve section. */
    private final Map<String, ReentrantLock> carLocks = new ConcurrentHashMap<String, ReentrantLock>();

    private final List<ReservationObserver> observers = new CopyOnWriteArrayList<ReservationObserver>();
    private final AtomicLong reservationSeq = new AtomicLong();

    private final PricingStrategy pricingStrategy;
    private final LateFeePolicy lateFeePolicy;

    public CarRental(PricingStrategy pricingStrategy, LateFeePolicy lateFeePolicy) {
        if (pricingStrategy == null || lateFeePolicy == null) {
            throw new IllegalArgumentException("pricingStrategy and lateFeePolicy required");
        }
        this.pricingStrategy = pricingStrategy;
        this.lateFeePolicy = lateFeePolicy;
    }

    // ---- setup ----

    public void addLocation(Location location) {
        require(location, "location");
        locations.put(location.getId(), location);
    }

    public void registerCustomer(Customer customer) {
        require(customer, "customer");
        customers.put(customer.getId(), customer);
    }

    public void addCar(Car car) {
        require(car, "car");
        cars.put(car.getId(), car);
        reservationsByCar.putIfAbsent(car.getId(), new ArrayList<Reservation>());
        carLocks.putIfAbsent(car.getId(), new ReentrantLock());
    }

    public void addObserver(ReservationObserver observer) {
        require(observer, "observer");
        observers.add(observer);
    }

    /** Pull a car out for maintenance / put it back / retire it. */
    public void setCarStatus(String carId, CarStatus status) {
        requireCar(carId).setStatus(status);
    }

    // ---- queries ----

    /** Price a hypothetical rental without booking it. */
    public BigDecimal quote(String carId, DateRange period) {
        Car car = requireCar(carId);
        require(period, "period");
        return pricingStrategy.price(car.getType(), period);
    }

    /**
     * All cars that (a) match the optional type filter, (b) match the optional
     * location filter, (c) are in service, and (d) have no active reservation
     * overlapping {@code period}. {@code type} and/or {@code location} may be
     * null to widen the search.
     */
    public List<Car> searchAvailableCars(CarType type, Location location, DateRange period) {
        require(period, "period");
        List<Car> result = new ArrayList<Car>();
        for (Car car : cars.values()) {
            if (type != null && car.getType() != type) {
                continue;
            }
            if (location != null && !car.getHomeLocation().equals(location)) {
                continue;
            }
            if (car.getStatus() != CarStatus.ACTIVE) {
                continue;
            }
            ReentrantLock lock = lockFor(car.getId());
            lock.lock();
            try {
                if (!hasOverlap(car.getId(), period)) {
                    result.add(car);
                }
            } finally {
                lock.unlock();
            }
        }
        Collections.sort(result, new Comparator<Car>() {
            @Override
            public int compare(Car a, Car b) {
                return a.getId().compareTo(b.getId());
            }
        });
        return result;
    }

    public Reservation getReservation(String reservationId) {
        return reservationsById.get(reservationId);
    }

    // ---- lifecycle ----

    /**
     * Atomically verify the car is free over {@code period} and, if so, book it.
     * Throws {@link CarUnavailableException} if the car is out of service or the
     * window overlaps an existing active reservation.
     */
    public Reservation reserve(String customerId, String carId, DateRange period) {
        Customer customer = requireCustomer(customerId);
        Car car = requireCar(carId);
        require(period, "period");

        Reservation reservation;
        ReentrantLock lock = lockFor(carId);
        lock.lock();
        try {
            if (car.getStatus() != CarStatus.ACTIVE) {
                throw new CarUnavailableException("Car " + carId + " is not in service (" + car.getStatus() + ")");
            }
            if (hasOverlap(carId, period)) {
                throw new CarUnavailableException(
                        "Car " + carId + " already has a reservation overlapping " + period);
            }
            BigDecimal base = pricingStrategy.price(car.getType(), period);
            String id = "R" + reservationSeq.incrementAndGet();
            reservation = new Reservation(id, car, customer, period, base);
            reservationsByCar.get(carId).add(reservation);
            reservationsById.put(id, reservation);
        } finally {
            lock.unlock();
        }
        notifyReserved(reservation);
        return reservation;
    }

    public void pickUp(String reservationId, LocalDateTime at) {
        Reservation reservation = requireReservation(reservationId);
        ReentrantLock lock = lockFor(reservation.getCar().getId());
        lock.lock();
        try {
            reservation.pickUp(at);
        } finally {
            lock.unlock();
        }
        notifyPickedUp(reservation);
    }

    public void pickUp(String reservationId) {
        pickUp(reservationId, LocalDateTime.now());
    }

    /** End the rental and return the finalized charges (base + any late fee). */
    public Charges returnCar(String reservationId, LocalDateTime at) {
        Reservation reservation = requireReservation(reservationId);
        Car car = reservation.getCar();
        Charges charges;
        ReentrantLock lock = lockFor(car.getId());
        lock.lock();
        try {
            BigDecimal lateFee = lateFeePolicy.lateFee(car.getType(), reservation.getScheduledDropoff(), at);
            charges = reservation.returnCar(at, lateFee);
        } finally {
            lock.unlock();
        }
        notifyReturned(reservation);
        return charges;
    }

    public Charges returnCar(String reservationId) {
        return returnCar(reservationId, LocalDateTime.now());
    }

    public void cancel(String reservationId) {
        Reservation reservation = requireReservation(reservationId);
        ReentrantLock lock = lockFor(reservation.getCar().getId());
        lock.lock();
        try {
            reservation.cancel();
        } finally {
            lock.unlock();
        }
        notifyCancelled(reservation);
    }

    // ---- internals ----

    /** Caller must hold {@code carId}'s lock. */
    private boolean hasOverlap(String carId, DateRange period) {
        List<Reservation> existing = reservationsByCar.get(carId);
        for (int i = 0; i < existing.size(); i++) {
            Reservation r = existing.get(i);
            if (r.isActive() && r.getPeriod().overlaps(period)) {
                return true;
            }
        }
        return false;
    }

    private ReentrantLock lockFor(String carId) {
        ReentrantLock lock = carLocks.get(carId);
        if (lock == null) {
            carLocks.putIfAbsent(carId, new ReentrantLock());
            lock = carLocks.get(carId);
        }
        return lock;
    }

    private void notifyReserved(Reservation r) {
        for (ReservationObserver o : observers) {
            o.onReserved(r);
        }
    }

    private void notifyPickedUp(Reservation r) {
        for (ReservationObserver o : observers) {
            o.onPickedUp(r);
        }
    }

    private void notifyReturned(Reservation r) {
        for (ReservationObserver o : observers) {
            o.onReturned(r);
        }
    }

    private void notifyCancelled(Reservation r) {
        for (ReservationObserver o : observers) {
            o.onCancelled(r);
        }
    }

    private Car requireCar(String carId) {
        Car car = cars.get(carId);
        if (car == null) {
            throw new IllegalArgumentException("Unknown car: " + carId);
        }
        return car;
    }

    private Customer requireCustomer(String customerId) {
        Customer customer = customers.get(customerId);
        if (customer == null) {
            throw new IllegalArgumentException("Unknown customer: " + customerId);
        }
        return customer;
    }

    private Reservation requireReservation(String reservationId) {
        Reservation reservation = reservationsById.get(reservationId);
        if (reservation == null) {
            throw new IllegalArgumentException("Unknown reservation: " + reservationId);
        }
        return reservation;
    }

    private static void require(Object value, String name) {
        if (value == null) {
            throw new IllegalArgumentException(name + " required");
        }
    }
}
