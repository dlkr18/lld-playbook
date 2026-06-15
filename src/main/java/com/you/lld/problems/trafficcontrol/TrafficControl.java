package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import com.you.lld.problems.trafficcontrol.service.TrafficController;
import com.you.lld.problems.trafficcontrol.service.impl.TrafficControllerImpl;

public final class TrafficControl {

    private final TrafficController controller;

    public TrafficControl() {
        this.controller = new TrafficControllerImpl();
    }

    public void register(TrafficComponent component) {
        controller.register(component);
    }

    public TrafficController getController() {
        return controller;
    }
}
