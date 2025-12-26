package com.you.lld.problems.trafficcontrol.api;

import com.you.lld.problems.trafficcontrol.model.*;

public interface TrafficController {
    void startCycle();
    void stopCycle();
    void enableEmergencyMode(String intersectionId);
    void disableEmergencyMode(String intersectionId);
    Intersection getIntersection(String intersectionId);
}
