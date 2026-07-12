package com.you.lld.problems.trafficcontrol.service.impl;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Composite node — coordinates multiple intersections in sequence.
 */
public final class IntersectionGroup implements TrafficComponent {

    private final String id;
    private final List<TrafficComponent> children = new ArrayList<TrafficComponent>();
    private int activeIndex;

    public IntersectionGroup(String id) {
        this.id = id;
    }

    public void add(TrafficComponent component) {
        children.add(component);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public synchronized void tick() {
        if (children.isEmpty()) {
            return;
        }
        children.get(activeIndex).tick();
        activeIndex = (activeIndex + 1) % children.size();
    }

    @Override
    public synchronized void enterEmergency() {
        for (TrafficComponent child : children) {
            child.enterEmergency();
        }
    }

    @Override
    public synchronized void exitEmergency() {
        for (TrafficComponent child : children) {
            child.exitEmergency();
        }
    }

    public List<TrafficComponent> getChildren() {
        return Collections.unmodifiableList(children);
    }
}
