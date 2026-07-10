package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * State pattern: encapsulates the behaviour of a {@link Reservation} in one phase
 * of its lifecycle. Each concrete state permits only its legal transitions and
 * throws {@link IllegalStateException} for the rest, so the illegal-transition
 * matrix lives in the type system instead of a tangle of {@code if (status == ..)}
 * checks scattered across the orchestrator.
 *
 * <p>Concrete states are stateless singletons. The late fee is passed in
 * (already computed by the orchestrator's {@code LateFeePolicy}) so the model
 * layer stays free of any dependency on the service layer.
 */
public interface ReservationState {

    /** The enum tag for this state. */
    ReservationStatus status();

    /** Begin the rental (customer collects the car). */
    void pickUp(Reservation reservation, LocalDateTime at);

    /**
     * End the rental and finalize charges.
     *
     * @param lateFee fee already computed by the orchestrator (0 if on time)
     * @return the finalized {@link Charges}
     */
    Charges returnCar(Reservation reservation, LocalDateTime at, BigDecimal lateFee);

    /** Abandon the reservation before pickup. */
    void cancel(Reservation reservation);
}
