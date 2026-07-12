package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import java.util.List;

/** Nearest idle or same-direction elevator moving toward the request floor. */
public class ScanElevatorScheduler implements ElevatorScheduler {
    @Override
    public Elevator selectElevator(Request request, List<Elevator> elevators) {
        Elevator bestMoving = null;
        int bestMovingDistance = Integer.MAX_VALUE;
        Elevator bestIdle = null;
        int bestIdleDistance = Integer.MAX_VALUE;

        for (Elevator elevator : elevators) {
            int distance = elevator.distanceToFloor(request.getFloor());
            if (elevator.isIdle()) {
                if (distance < bestIdleDistance) {
                    bestIdle = elevator;
                    bestIdleDistance = distance;
                }
            } else if (elevator.getDirection() == request.getDirection()) {
                boolean toward = (request.getDirection() == Direction.UP
                        && elevator.getCurrentFloor() <= request.getFloor())
                        || (request.getDirection() == Direction.DOWN
                        && elevator.getCurrentFloor() >= request.getFloor());
                if (toward && distance < bestMovingDistance) {
                    bestMoving = elevator;
                    bestMovingDistance = distance;
                }
            }
        }
        return bestMoving != null ? bestMoving : bestIdle;
    }
}
