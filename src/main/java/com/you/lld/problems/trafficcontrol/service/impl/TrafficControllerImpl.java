package com.you.lld.problems.trafficcontrol.service.impl;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import com.you.lld.problems.trafficcontrol.service.TrafficController;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public final class TrafficControllerImpl implements TrafficController {

    private final Map<String, TrafficComponent> components = new HashMap<String, TrafficComponent>();
    private ScheduledExecutorService scheduler;

    @Override
    public void register(TrafficComponent component) {
        components.put(component.getId(), component);
    }

    @Override
    public synchronized void start() {
        if (scheduler != null) {
            return;
        }
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                tickOnce();
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    @Override
    public synchronized void stop() {
        if (scheduler != null) {
            scheduler.shutdownNow();
            scheduler = null;
        }
    }

    @Override
    public void tickOnce() {
        for (TrafficComponent component : components.values()) {
            component.tick();
        }
    }

    @Override
    public void enterEmergency(String componentId) {
        TrafficComponent component = components.get(componentId);
        if (component != null) {
            component.enterEmergency();
        }
    }

    @Override
    public void exitEmergency(String componentId) {
        TrafficComponent component = components.get(componentId);
        if (component != null) {
            component.exitEmergency();
        }
    }

    @Override
    public TrafficComponent get(String componentId) {
        return components.get(componentId);
    }
}
