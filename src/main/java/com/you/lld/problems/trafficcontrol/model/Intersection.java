package com.you.lld.problems.trafficcontrol.model;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;

/**
 * Leaf composite node — four-way intersection with phased N-S / E-W cycles.
 */
public final class Intersection implements TrafficComponent {

    private final String id;
    private final TrafficLight north = new TrafficLight(Direction.NORTH);
    private final TrafficLight south = new TrafficLight(Direction.SOUTH);
    private final TrafficLight east = new TrafficLight(Direction.EAST);
    private final TrafficLight west = new TrafficLight(Direction.WEST);
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
        phase = (phase + 1) % 4;
        applyPhase();
    }

    @Override
    public synchronized void enterEmergency() {
        emergency = true;
        setAll(Signal.RED);
    }

    @Override
    public synchronized void exitEmergency() {
        emergency = false;
        phase = 0;
        applyPhase();
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
        if (phase == 0) {
            setPair(Signal.GREEN, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == 1) {
            setPair(Signal.YELLOW, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == 2) {
            setPair(Signal.RED, north, south);
            setPair(Signal.GREEN, east, west);
        } else {
            setPair(Signal.RED, north, south);
            setPair(Signal.YELLOW, east, west);
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
