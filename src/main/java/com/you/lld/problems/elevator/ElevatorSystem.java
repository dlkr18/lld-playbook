package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.impl.OptimalElevatorController;
import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.scheduler.ElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.LookElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.ScanElevatorScheduler;

/** Facade for multi-elevator simulation with pluggable scheduling. */
public class ElevatorSystem {
    private final OptimalElevatorController controller;

    public ElevatorSystem(int numElevators, int minFloor, int maxFloor, boolean useLook) {
        ElevatorScheduler scheduler = useLook ? new LookElevatorScheduler() : new ScanElevatorScheduler();
        this.controller = new OptimalElevatorController(numElevators, minFloor, maxFloor, scheduler);
    }

    public void request(int floor, Direction direction) {
        controller.requestElevator(floor, direction);
    }

    public void selectFloor(int elevatorId, int floor) {
        controller.selectFloor(elevatorId, floor);
    }

    public void step() {
        controller.step();
    }

    public Elevator status(int id) {
        return controller.getElevatorStatus(id);
    }

    public OptimalElevatorController controller() {
        return controller;
    }
}
