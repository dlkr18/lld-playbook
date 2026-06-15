package com.you.lld.problems.elevator.impl;

import com.you.lld.problems.elevator.api.ElevatorController;
import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import com.you.lld.problems.elevator.scheduler.ElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.ScanElevatorScheduler;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

public class OptimalElevatorController implements ElevatorController {
    private final Map<Integer, Elevator> elevators = new ConcurrentHashMap<Integer, Elevator>();
    private final Queue<Request> pendingRequests = new LinkedList<Request>();
    private final ElevatorScheduler scheduler;

    public OptimalElevatorController(int numElevators, int minFloor, int maxFloor) {
        this(numElevators, minFloor, maxFloor, new ScanElevatorScheduler());
    }

    public OptimalElevatorController(int numElevators, int minFloor, int maxFloor, ElevatorScheduler scheduler) {
        this.scheduler = scheduler;
        for (int i = 0; i < numElevators; i++) {
            elevators.put(i, new Elevator(i, minFloor, maxFloor));
        }
    }

    @Override
    public void requestElevator(int floor, Direction direction) {
        Request request = new Request(floor, direction);
        dispatch(request);
    }

    private void dispatch(Request request) {
        Elevator best = scheduler.selectElevator(request, new ArrayList<Elevator>(elevators.values()));
        if (best != null) {
            best.addDestination(request.getFloor());
        } else {
            pendingRequests.offer(request);
        }
    }

    @Override
    public void selectFloor(int elevatorId, int floor) {
        Elevator elevator = elevators.get(elevatorId);
        if (elevator != null) {
            elevator.addDestination(floor);
        }
    }

    @Override
    public Elevator getElevatorStatus(int elevatorId) {
        return elevators.get(elevatorId);
    }

    @Override
    public void step() {
        for (Elevator elevator : elevators.values()) {
            elevator.moveToNextFloor();
        }
        while (!pendingRequests.isEmpty()) {
            Request request = pendingRequests.peek();
            Elevator best = scheduler.selectElevator(request, new ArrayList<Elevator>(elevators.values()));
            if (best == null) {
                break;
            }
            pendingRequests.poll();
            best.addDestination(request.getFloor());
        }
    }

    public void printStatus() {
        for (Elevator elevator : elevators.values()) {
            System.out.println("  " + elevator);
        }
    }
}
