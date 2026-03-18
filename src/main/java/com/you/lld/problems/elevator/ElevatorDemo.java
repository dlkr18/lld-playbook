package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.impl.OptimalElevatorController;
import com.you.lld.problems.elevator.model.Direction;

/**
 * Demo: Elevator system with SCAN algorithm, multi-elevator dispatch, step simulation.
 */
public class ElevatorDemo {

    public static void main(String[] args) {
        System.out.println("=== Elevator System Demo ===\n");

        // 3 elevators, floors 0–20
        OptimalElevatorController controller = new OptimalElevatorController(3, 0, 20);

        // --- Scenario 1: Basic request ---
        System.out.println("--- Scenario 1: Single request ---");
        controller.requestElevator(5, Direction.UP);
        controller.printStatus();

        // Step until elevator reaches floor 5
        for (int i = 0; i < 6; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 2: Multiple requests ---
        System.out.println("--- Scenario 2: Multiple requests ---");
        controller.requestElevator(3, Direction.UP);
        controller.requestElevator(10, Direction.DOWN);
        controller.requestElevator(15, Direction.UP);

        controller.printStatus();

        for (int i = 0; i < 16; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 3: Floor selection inside elevator ---
        System.out.println("--- Scenario 3: Passenger selects floor inside elevator ---");
        controller.selectFloor(0, 12);
        controller.selectFloor(0, 18);
        System.out.println("Elevator 0 destinations: " + 
            controller.getElevatorStatus(0).getDestinationFloors());

        for (int i = 0; i < 20; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 4: Concurrent requests from different floors ---
        System.out.println("--- Scenario 4: Rush hour simulation ---");
        controller.requestElevator(1, Direction.UP);
        controller.requestElevator(2, Direction.UP);
        controller.requestElevator(3, Direction.UP);
        controller.requestElevator(8, Direction.DOWN);
        controller.requestElevator(12, Direction.DOWN);

        // Simulate 25 steps
        for (int i = 0; i < 25; i++) {
            controller.step();
        }
        controller.printStatus();

        System.out.println("=== Demo complete ===");
    }
}
