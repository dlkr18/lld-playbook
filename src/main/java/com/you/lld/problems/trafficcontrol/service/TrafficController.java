package com.you.lld.problems.trafficcontrol.service;

public interface TrafficController {

    void register(TrafficComponent component);

    void start();

    void stop();

    void tickOnce();

    void enterEmergency(String componentId);

    void exitEmergency(String componentId);

    TrafficComponent get(String componentId);
}
