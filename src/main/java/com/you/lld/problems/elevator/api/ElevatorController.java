package com.you.lld.problems.elevator.api;

import com.you.lld.problems.elevator.model.*;

public interface ElevatorController {
    void requestElevator(int floor, Direction direction);
    void selectFloor(int elevatorId, int floor);
    Elevator getElevatorStatus(int elevatorId);
    void step(); // Simulate one time step
}
