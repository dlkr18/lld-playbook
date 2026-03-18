package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.impl.TrafficControllerImpl;
import com.you.lld.problems.trafficcontrol.model.Direction;
import com.you.lld.problems.trafficcontrol.model.TrafficLight;

import java.util.Map;

/**
 * Demo: Traffic Control system with signal cycles, emergency mode, intersections.
 */
public class TrafficControlDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Traffic Control Demo ===\n");

        TrafficControllerImpl controller = new TrafficControllerImpl();

        // Add intersections
        System.out.println("--- Setup ---");
        com.you.lld.problems.trafficcontrol.model.Intersection i1 = 
            new com.you.lld.problems.trafficcontrol.model.Intersection("INT-1", "Main St & 1st Ave");
        com.you.lld.problems.trafficcontrol.model.Intersection i2 = 
            new com.you.lld.problems.trafficcontrol.model.Intersection("INT-2", "Broadway & 5th Ave");
        controller.addIntersection(i1);
        controller.addIntersection(i2);
        System.out.println("Added 2 intersections");

        // Print initial light state
        printLights(controller, "INT-1");

        // Start traffic cycle
        System.out.println("\n--- Start cycle ---");
        controller.startCycle();
        System.out.println("Cycle started, waiting 3 seconds...");
        Thread.sleep(3000);
        printLights(controller, "INT-1");

        // Emergency mode
        System.out.println("\n--- Emergency mode ---");
        controller.enableEmergencyMode("INT-1");
        com.you.lld.problems.trafficcontrol.model.Intersection after = 
            controller.getIntersection("INT-1");
        System.out.println("INT-1 emergency: " + after.isEmergencyMode());
        printLights(controller, "INT-1");

        // Disable emergency
        controller.disableEmergencyMode("INT-1");
        System.out.println("Emergency disabled");

        Thread.sleep(2000);
        printLights(controller, "INT-2");

        // Stop cycle
        System.out.println("\n--- Stop ---");
        controller.stopCycle();
        controller.shutdown();
        System.out.println("Cycle stopped");

        System.out.println("\n=== Demo complete ===");
    }

    private static void printLights(TrafficControllerImpl controller, String intersectionId) {
        com.you.lld.problems.trafficcontrol.model.Intersection inter = 
            controller.getIntersection(intersectionId);
        if (inter == null) return;
        System.out.println("  " + inter.getName() + ":");
        Map<Direction, TrafficLight> lights = inter.getLights();
        for (Map.Entry<Direction, TrafficLight> e : lights.entrySet()) {
            System.out.println("    " + e.getKey() + ": " + e.getValue().getCurrentSignal());
        }
    }
}
