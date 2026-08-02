package com.you.lld.problems.trafficcontrol.model;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;

/**
 * Leaf composite node — four-way intersection cycling N-S and E-W phases.
 *
 * <p>The cycle is six phases, not four, because <b>every green must be preceded by
 * an all-red clearance interval</b>. Going straight from one direction's yellow to
 * the opposing green gives vehicles still inside the box no time to leave it — that
 * is the safety invariant of a signalled intersection, and the reason real
 * controllers are specified in terms of clearance time.
 */
public final class Intersection implements TrafficComponent {

    private final String id;
    private final TrafficLight north = new TrafficLight(Direction.NORTH);
    private final TrafficLight south = new TrafficLight(Direction.SOUTH);
    private final TrafficLight east = new TrafficLight(Direction.EAST);
    private final TrafficLight west = new TrafficLight(Direction.WEST);
    /** GREEN -> YELLOW -> ALL-RED -> (opposing) GREEN -> YELLOW -> ALL-RED. */
    private static final int PHASE_COUNT = 6;
    private static final int PHASE_NS_GREEN = 0;
    private static final int PHASE_NS_YELLOW = 1;
    private static final int PHASE_CLEAR_AFTER_NS = 2;
    private static final int PHASE_EW_GREEN = 3;
    private static final int PHASE_EW_YELLOW = 4;
    private static final int PHASE_CLEAR_AFTER_EW = 5;

    private int phase;
    private boolean emergency;

    public Intersection(String id) {
        this.id = id;
        applyPhase();
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public synchronized void tick() {
        if (emergency) {
            return;
        }
        phase = (phase + 1) % PHASE_COUNT;
        applyPhase();
    }

    @Override
    public synchronized void enterEmergency() {
        emergency = true;
        setAll(Signal.RED);
    }

    /**
     * Leaves the intersection in the all-red clearance phase rather than jumping
     * straight to a green. Coming out of an emergency hold is exactly when cross
     * traffic may still be moving through the box.
     */
    @Override
    public synchronized void exitEmergency() {
        emergency = false;
        phase = PHASE_CLEAR_AFTER_EW;
        applyPhase();
    }

    /** True while all four approaches are red — the clearance interval. */
    public synchronized boolean isAllRed() {
        return north.getSignal() == Signal.RED && south.getSignal() == Signal.RED
                && east.getSignal() == Signal.RED && west.getSignal() == Signal.RED;
    }

    public TrafficLight getLight(Direction direction) {
        if (direction == Direction.NORTH) {
            return north;
        }
        if (direction == Direction.SOUTH) {
            return south;
        }
        if (direction == Direction.EAST) {
            return east;
        }
        return west;
    }

    private void applyPhase() {
        if (phase == PHASE_NS_GREEN) {
            setPair(Signal.GREEN, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == PHASE_NS_YELLOW) {
            setPair(Signal.YELLOW, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == PHASE_EW_GREEN) {
            setPair(Signal.RED, north, south);
            setPair(Signal.GREEN, east, west);
        } else if (phase == PHASE_EW_YELLOW) {
            setPair(Signal.RED, north, south);
            setPair(Signal.YELLOW, east, west);
        } else {
            // PHASE_CLEAR_AFTER_NS / PHASE_CLEAR_AFTER_EW
            setAll(Signal.RED);
        }
    }

    private void setPair(Signal signal, TrafficLight a, TrafficLight b) {
        a.setSignal(signal);
        b.setSignal(signal);
    }

    private void setAll(Signal signal) {
        north.setSignal(signal);
        south.setSignal(signal);
        east.setSignal(signal);
        west.setSignal(signal);
    }
}
