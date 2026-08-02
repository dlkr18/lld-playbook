package com.you.lld.problems.trafficcontrol.model;

/**
 * One approach's lamp. Holds a {@link Signal} and nothing else.
 *
 * <p>This used to carry a per-light State machine ({@code SignalState} with
 * GREEN -> YELLOW -> RED -> GREEN and a duration per state). It was dead: nothing
 * ever called {@code advance()}, the durations were never read, and
 * {@link Intersection} drove the lamps directly via {@code setSignal}, replacing the
 * state object wholesale.
 *
 * <p>It was also the <b>wrong seam</b>, which is why it was bypassed. A per-light
 * machine cannot express the constraint that actually matters — "N-S may turn green
 * only once E-W has been red for the clearance interval" — because that is a
 * property of the intersection, not of any one lamp. Safety lives where the
 * conflicting directions are visible together, so the phase cycle on
 * {@code Intersection} is the real state machine.
 */
public final class TrafficLight {

    private final Direction direction;
    private Signal signal = Signal.RED;

    public TrafficLight(Direction direction) {
        this.direction = direction;
    }

    public Direction getDirection() {
        return direction;
    }

    public Signal getSignal() {
        return signal;
    }

    void setSignal(Signal signal) {
        this.signal = signal;
    }

    @Override
    public String toString() {
        return direction + "=" + signal;
    }
}
