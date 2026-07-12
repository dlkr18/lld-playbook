package com.you.lld.problems.trafficcontrol.service.state;

import com.you.lld.problems.trafficcontrol.model.Signal;

public final class YellowState implements SignalState {

    private final long durationMs;

    public YellowState(long durationMs) {
        this.durationMs = durationMs;
    }

    @Override
    public Signal signal() {
        return Signal.YELLOW;
    }

    @Override
    public long durationMs() {
        return durationMs;
    }

    @Override
    public SignalState next() {
        return new RedState(3000L);
    }
}
