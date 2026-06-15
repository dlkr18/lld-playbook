package com.you.lld.problems.trafficcontrol.service.state;

import com.you.lld.problems.trafficcontrol.model.Signal;

public interface SignalState {

    Signal signal();

    long durationMs();

    SignalState next();
}
