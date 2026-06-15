package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import java.util.List;

/**
 * LOOK variant: pick the elevator with minimum distance regardless of direction,
 * but prefer non-idle cars already serving nearby floors (reduces reversal).
 */
public class LookElevatorScheduler implements ElevatorScheduler {
    @Override
    public Elevator selectElevator(Request request, List<Elevator> elevators) {
        Elevator best = null;
        int bestScore = Integer.MAX_VALUE;
        for (Elevator elevator : elevators) {
            int distance = elevator.distanceToFloor(request.getFloor());
            int penalty = elevator.isIdle() ? 0 : 1;
            int score = distance * 10 + penalty;
            if (score < bestScore) {
                bestScore = score;
                best = elevator;
            }
        }
        return best;
    }
}
