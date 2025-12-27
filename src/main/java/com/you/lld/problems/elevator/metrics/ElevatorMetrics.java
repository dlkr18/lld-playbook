package com.you.lld.problems.elevator.metrics;

public class ElevatorMetrics {
    private int totalTrips;
    private long totalWaitTime;
    private int floorsTraversed;
    
    public void recordTrip(long waitTime, int floors) {
        totalTrips++;
        totalWaitTime += waitTime;
        floorsTraversed += floors;
    }
    
    public double getAverageWaitTime() {
        return totalTrips == 0 ? 0 : (double) totalWaitTime / totalTrips;
    }
    
    public int getTotalTrips() { return totalTrips; }
    public int getFloorsTraversed() { return floorsTraversed; }
}
