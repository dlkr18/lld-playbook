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
import com.you.lld.problems.carrental.service.impl.DailyPricingStrategy;
import com.you.lld.problems.carrental.service.impl.EmailNotificationObserver;
import com.you.lld.problems.carrental.service.impl.GracePeriodLateFeePolicy;
import com.you.lld.problems.carrental.service.impl.SeasonalPricingStrategy;
import com.you.lld.problems.carrental.service.impl.SmsReminderObserver;
import com.you.lld.problems.carrental.service.impl.StandardLateFeePolicy;
import com.you.lld.problems.carrental.service.impl.WeeklyPricingStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

/**
 * Interview-style walkthrough of the Car Rental System. Each scenario proves one
 * design point; run with:
 *
 * <pre>
 *   mvn -q compile exec:java \
 *     -Dexec.mainClass="com.you.lld.problems.carrental.CarRentalDemo"
 * </pre>
 */
public final class CarRentalDemo {

    private CarRentalDemo() {
    }

    private static Map<CarType, BigDecimal> rateTable() {
        Map<CarType, BigDecimal> rates = new EnumMap<CarType, BigDecimal>(CarType.class);
        rates.put(CarType.ECONOMY, new BigDecimal("40"));
        rates.put(CarType.SUV, new BigDecimal("70"));
        rates.put(CarType.LUXURY, new BigDecimal("120"));
        return rates;
    }

    public static void main(String[] args) {
        Map<CarType, BigDecimal> rates = rateTable();

        // Pricing = Daily tariff. Late fee = 12h grace, then 1.5x daily per late day.
        PricingStrategy pricing = new DailyPricingStrategy(rates);
        LateFeePolicy lateFee =
                new GracePeriodLateFeePolicy(new StandardLateFeePolicy(rates, new BigDecimal("1.5")), 12);

        CarRental rental = new CarRental(pricing, lateFee);
        rental.addObserver(new EmailNotificationObserver());
        rental.addObserver(new SmsReminderObserver());

        // Two branches, mixed fleet.
        Location downtown = new Location("LOC-DT", "Downtown");
        Location airport = new Location("LOC-AP", "Airport");
        rental.addLocation(downtown);
        rental.addLocation(airport);

        Car eco1 = new Car("C1", "KA01-ECO-1", CarType.ECONOMY, downtown);
        Car eco2 = new Car("C2", "KA01-ECO-2", CarType.ECONOMY, airport);
        Car suv1 = new Car("C3", "KA01-SUV-1", CarType.SUV, downtown);
        Car lux1 = new Car("C4", "KA01-LUX-1", CarType.LUXURY, airport);
        rental.addCar(eco1);
        rental.addCar(eco2);
        rental.addCar(suv1);
        rental.addCar(lux1);

        Customer alice = new Customer("U1", "Alice", "alice@example.com");
        Customer bob = new Customer("U2", "Bob", "bob@example.com");
        rental.registerCustomer(alice);
        rental.registerCustomer(bob);

        DateRange jul10to13 = new DateRange(LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 13)); // 3 days
        DateRange jul13to15 = new DateRange(LocalDate.of(2026, 7, 13), LocalDate.of(2026, 7, 15)); // back-to-back

        // -------------------------------------------------------------------
        scenario("1. Search by type + location + dates, then reserve");
        List<Car> economyDowntown = rental.searchAvailableCars(CarType.ECONOMY, downtown, jul10to13);
        System.out.println("Available ECONOMY @Downtown for " + jul10to13 + ": " + economyDowntown);
        System.out.println("Quote for C1 over that window: " + rental.quote("C1", jul10to13));
        Reservation r1 = rental.reserve("U1", "C1", jul10to13);
        System.out.println("Reserved: " + r1 + " (base=" + r1.getBaseCost() + ")");

        // -------------------------------------------------------------------
        scenario("2. Overlap rejected; back-to-back allowed");
        try {
            rental.reserve("U2", "C1", new DateRange(LocalDate.of(2026, 7, 12), LocalDate.of(2026, 7, 14)));
        } catch (CarUnavailableException e) {
            System.out.println("Overlap correctly rejected: " + e.getMessage());
        }
        Reservation r2 = rental.reserve("U2", "C1", jul13to15); // starts the day r1 ends -> allowed
        System.out.println("Back-to-back reserved: " + r2);
        System.out.println("Search now excludes C1 for the original window: "
                + rental.searchAvailableCars(CarType.ECONOMY, downtown, jul10to13));

        // -------------------------------------------------------------------
        scenario("3. Full lifecycle, on-time return (no late fee)");
        rental.pickUp(r1.getId(), LocalDate.of(2026, 7, 10).atTime(9, 0));
        System.out.println("State after pickup: " + r1.getStatus());
        Charges onTime = rental.returnCar(r1.getId(), LocalDate.of(2026, 7, 12).atTime(20, 0)); // before day 13
        System.out.println("State after return: " + r1.getStatus());
        System.out.println("Charges (on time): " + onTime);

        // -------------------------------------------------------------------
        scenario("4. Late return -> late fee applied");
        rental.pickUp(r2.getId(), LocalDate.of(2026, 7, 13).atTime(10, 0));
        // Due back 2026-07-15 00:00; returned 2026-07-16 10:00 -> ~1.4 days late -> 2 late days.
        Charges late = rental.returnCar(r2.getId(), LocalDate.of(2026, 7, 16).atTime(10, 0));
        System.out.println("Charges (late): " + late);
        System.out.println("  base=" + late.getBaseCost() + " lateFee=" + late.getLateFee()
                + " (2 late days x 1.5 x $40)");

        // -------------------------------------------------------------------
        scenario("5. Cancel frees the car");
        Reservation r3 = rental.reserve("U1", "C4", jul10to13);
        System.out.println("Luxury reserved: " + r3);
        System.out.println("Search LUXURY @Airport (should be empty): "
                + rental.searchAvailableCars(CarType.LUXURY, airport, jul10to13));
        rental.cancel(r3.getId());
        System.out.println("After cancel, state=" + r3.getStatus() + "; search again: "
                + rental.searchAvailableCars(CarType.LUXURY, airport, jul10to13));

        // -------------------------------------------------------------------
        scenario("6. Pricing strategies are pluggable (Strategy + Decorator)");
        DateRange nineDays = new DateRange(LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 10)); // 9 days, Dec
        PricingStrategy daily = new DailyPricingStrategy(rates);
        PricingStrategy weekly = new WeeklyPricingStrategy(rates, 6); // 1 free day per week
        PricingStrategy holidaySurge = new SeasonalPricingStrategy(
                daily, EnumSet.of(Month.DECEMBER), new BigDecimal("1.25"));
        System.out.println("SUV, 9 days:");
        System.out.println("  Daily          = " + daily.price(CarType.SUV, nineDays));
        System.out.println("  Weekly(6/7)    = " + weekly.price(CarType.SUV, nineDays));
        System.out.println("  Daily + Dec25% = " + holidaySurge.price(CarType.SUV, nineDays));

        System.out.println("\nDemo complete.");
    }

    private static void scenario(String title) {
        System.out.println("\n=== " + title + " ===");
    }
}
