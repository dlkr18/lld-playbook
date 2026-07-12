package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.model.Direction;

public class ElevatorDemo {

    public static void main(String[] args) {
        System.out.println("=== Elevator System Demo ===\n");

        ElevatorSystem scan = new ElevatorSystem(3, 0, 20, false);
        System.out.println("--- SCAN scheduler ---");
        scan.request(5, Direction.UP);
        runSteps(scan, 6);
        scan.request(10, Direction.DOWN);
        scan.request(15, Direction.UP);
        runSteps(scan, 10);

        ElevatorSystem look = new ElevatorSystem(2, 0, 10, true);
        System.out.println("\n--- LOOK scheduler ---");
        look.request(3, Direction.UP);
        look.request(7, Direction.DOWN);
        runSteps(look, 12);

        System.out.println("\n=== Demo complete ===");
    }

    private static void runSteps(ElevatorSystem system, int steps) {
        for (int i = 0; i < steps; i++) {
            system.step();
        }
        system.controller().printStatus();
    }
}
