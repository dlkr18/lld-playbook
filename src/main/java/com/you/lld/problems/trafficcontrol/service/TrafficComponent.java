package com.you.lld.problems.trafficcontrol.service;

public interface TrafficComponent {

    String getId();

    void tick();

    void enterEmergency();

    void exitEmergency();
}
