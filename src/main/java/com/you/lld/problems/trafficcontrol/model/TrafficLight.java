package com.you.lld.problems.trafficcontrol.model;

import com.you.lld.problems.trafficcontrol.service.state.GreenState;
import com.you.lld.problems.trafficcontrol.service.state.RedState;
import com.you.lld.problems.trafficcontrol.service.state.SignalState;
import com.you.lld.problems.trafficcontrol.service.state.YellowState;

public final class TrafficLight {

    private final Direction direction;
    private SignalState state = new RedState(4000L);

    public TrafficLight(Direction direction) {
        this.direction = direction;
    }

    public Direction getDirection() {
        return direction;
    }

    public Signal getSignal() {
        return state.signal();
    }

    public void advance() {
        state = state.next();
    }

    void setSignal(Signal signal) {
        if (signal == Signal.GREEN) {
            state = new GreenState(4000L);
        } else if (signal == Signal.YELLOW) {
            state = new YellowState(1000L);
        } else {
            state = new RedState(4000L);
        }
    }
}
