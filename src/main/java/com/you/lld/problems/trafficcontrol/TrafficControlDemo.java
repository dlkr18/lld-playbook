package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.model.Direction;
import com.you.lld.problems.trafficcontrol.model.Intersection;
import com.you.lld.problems.trafficcontrol.model.Signal;
import com.you.lld.problems.trafficcontrol.service.impl.IntersectionGroup;

public class TrafficControlDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Traffic Control Demo ===\n");
        demoPhaseCycle();
        demoYellowTransition();
        demoEmergency();
        demoCompositeGroup();
        demoShutdown();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoPhaseCycle() {
        System.out.println("--- 1. N-S GREEN → YELLOW → E-W GREEN → YELLOW ---");
        Intersection intersection = new Intersection("A1");
        for (int i = 0; i < 4; i++) {
            printSignals(intersection);
            intersection.tick();
        }
    }

    private static void demoYellowTransition() {
        System.out.println("\n--- 2. Yellow transition ---");
        Intersection intersection = new Intersection("A2");
        intersection.tick();
        System.out.println("  NORTH after N-S green: " + intersection.getLight(Direction.NORTH).getSignal());
        intersection.tick();
        System.out.println("  NORTH after N-S yellow: " + intersection.getLight(Direction.NORTH).getSignal());
    }

    private static void demoEmergency() {
        System.out.println("\n--- 3. Emergency all-red ---");
        Intersection intersection = new Intersection("A3");
        intersection.enterEmergency();
        printSignals(intersection);
        intersection.exitEmergency();
        System.out.println("  restored:");
        printSignals(intersection);
    }

    private static void demoCompositeGroup() {
        System.out.println("\n--- 4. Composite intersection group ---");
        IntersectionGroup group = new IntersectionGroup("downtown");
        group.add(new Intersection("1st-Main"));
        group.add(new Intersection("2nd-Main"));
        group.tick();
        System.out.println("  coordinated intersections=" + group.getChildren().size());
    }

    private static void demoShutdown() throws InterruptedException {
        System.out.println("\n--- 5. Controller start/stop ---");
        TrafficControl control = new TrafficControl();
        control.register(new Intersection("A4"));
        control.getController().start();
        Thread.sleep(1500);
        control.getController().stop();
        System.out.println("  scheduler stopped cleanly");
    }

    private static void printSignals(Intersection intersection) {
        StringBuilder sb = new StringBuilder("  ");
        for (Direction d : Direction.values()) {
            sb.append(d.name()).append('=')
                    .append(intersection.getLight(d).getSignal()).append(' ');
        }
        System.out.println(sb.toString());
    }
}
