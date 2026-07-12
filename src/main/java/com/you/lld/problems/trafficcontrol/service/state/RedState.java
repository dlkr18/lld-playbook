package com.you.lld.problems.trafficcontrol.service.state;

import com.you.lld.problems.trafficcontrol.model.Signal;

public final class RedState implements SignalState {

    private final long greenDurationMs;

    public RedState(long greenDurationMs) {
        this.greenDurationMs = greenDurationMs;
    }

    @Override
    public Signal signal() {
        return Signal.RED;
    }

    @Override
    public long durationMs() {
        return 1000L;
    }

    @Override
    public SignalState next() {
        return new GreenState(greenDurationMs);
    }
}
