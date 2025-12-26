package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.*;
import java.util.List;

public interface ElevatorScheduler {
    Elevator selectElevator(Request request, List<Elevator> elevators);
}
