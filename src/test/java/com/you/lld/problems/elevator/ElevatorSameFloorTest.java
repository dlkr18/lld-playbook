package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.model.Elevator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ElevatorSameFloorTest {

    @Test
    void requestForTheCurrentFloorDoesNotMoveTheCar() {
        Elevator elevator = new Elevator(1, 0, 10);
        elevator.addDestination(0);
        elevator.moveToNextFloor();

        assertEquals(0, elevator.getCurrentFloor());
        assertTrue(elevator.isIdle());
        assertTrue(elevator.getDestinationFloors().isEmpty());
    }
}
