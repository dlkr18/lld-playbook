package com.you.lld.problems.trafficcontrol.service.state;

import com.you.lld.problems.trafficcontrol.model.Signal;

public final class GreenState implements SignalState {

    private final long durationMs;

    public GreenState(long durationMs) {
        this.durationMs = durationMs;
    }

    @Override
    public Signal signal() {
        return Signal.GREEN;
    }

    @Override
    public long durationMs() {
        return durationMs;
    }

    @Override
    public SignalState next() {
        return new YellowState(1000L);
    }
}
