package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.api.exceptions.*;
import com.you.lld.problems.parkinglot.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Demonstration of the parking lot system with complete implementation.
 * Shows vehicle entry, parking, payment, and exit flow.
 */
public class ParkingLotDemo {
  
  public static void main(String[] args) {
    System.out.println("=== Parking Lot System Demo ===\n");
    
    // Step 1: Initialize parking lot with spaces
    System.out.println("1. Initializing parking lot...");
    List<ParkingSpace> parkingSpaces = createParkingSpaces();
    System.out.println("   Created " + parkingSpaces.size() + " parking spaces across 3 floors\n");
    
    // Step 2: Create parking service with strategies
    System.out.println("2. Setting up parking service with strategies...");
    HourlyPricingStrategy pricingStrategy = new HourlyPricingStrategy();
    NearestSpaceAllocationStrategy allocationStrategy = new NearestSpaceAllocationStrategy();
    SimplePaymentProcessor paymentProcessor = new SimplePaymentProcessor();
    
    ParkingService parkingService = new InMemoryParkingService(
        parkingSpaces, 
        pricingStrategy, 
        allocationStrategy, 
        paymentProcessor
    );
    System.out.println("   Service initialized with:");
    System.out.println("   - " + pricingStrategy.getDescription());
    System.out.println("   - " + allocationStrategy.getDescription() + "\n");
    
    // Step 3: Check initial occupancy
    System.out.println("3. Initial Occupancy Report:");
    displayOccupancyReport(parkingService.getOccupancyReport());
    
    // Step 4: Park some vehicles
    System.out.println("\n4. Parking vehicles...");
    
    try {
      // Park a motorcycle
      Vehicle motorcycle = new Vehicle("MH-01-1234", VehicleType.MOTORCYCLE);
      ParkingTicket ticket1 = parkingService.enterVehicle(motorcycle);
      System.out.println("   ✓ Motorcycle parked: " + ticket1.getTicketId() + 
          " at space " + ticket1.getParkingSpace().getSpaceId());
      
      // Park a car
      Vehicle car = new Vehicle("MH-02-5678", VehicleType.CAR);
      ParkingTicket ticket2 = parkingService.enterVehicle(car);
      System.out.println("   ✓ Car parked: " + ticket2.getTicketId() + 
          " at space " + ticket2.getParkingSpace().getSpaceId());
      
      // Park a car with disabled permit
      Vehicle disabledCar = new Vehicle("MH-03-9999", VehicleType.CAR, true);
      ParkingTicket ticket3 = parkingService.enterVehicle(disabledCar);
      System.out.println("   ✓ Car with disabled permit parked: " + ticket3.getTicketId() + 
          " at space " + ticket3.getParkingSpace().getSpaceId());
      
      // Park a truck
      Vehicle truck = new Vehicle("MH-04-7777", VehicleType.TRUCK);
      ParkingTicket ticket4 = parkingService.enterVehicle(truck);
      System.out.println("   ✓ Truck parked: " + ticket4.getTicketId() + 
          " at space " + ticket4.getParkingSpace().getSpaceId());
      
      // Step 5: Check updated occupancy
      System.out.println("\n5. Updated Occupancy Report:");
      displayOccupancyReport(parkingService.getOccupancyReport());
      
      // Step 6: Simulate some time passing (in real scenario)
      System.out.println("\n6. Simulating parking duration...");
      Thread.sleep(1000); // Simulate 1 second (in real scenario, this would be hours)
      System.out.println("   Vehicles have been parked for some time\n");
      
      // Step 7: Calculate fees
      System.out.println("7. Calculating parking fees:");
      Money fee1 = parkingService.calculateParkingFee(ticket1.getTicketId());
      System.out.println("   Motorcycle (" + ticket1.getTicketId() + "): " + fee1);
      
      Money fee2 = parkingService.calculateParkingFee(ticket2.getTicketId());
      System.out.println("   Car (" + ticket2.getTicketId() + "): " + fee2);
      
      Money fee4 = parkingService.calculateParkingFee(ticket4.getTicketId());
      System.out.println("   Truck (" + ticket4.getTicketId() + "): " + fee4);
      
      // Step 8: Process exits
      System.out.println("\n8. Processing vehicle exits:");
      
      // Exit motorcycle with credit card payment
      Payment payment1 = parkingService.exitVehicle(ticket1.getTicketId(), PaymentMethod.CREDIT_CARD);
      System.out.println("   ✓ Motorcycle exited:");
      System.out.println("     Payment ID: " + payment1.getPaymentId());
      System.out.println("     Amount: " + payment1.getAmount());
      System.out.println("     Method: " + payment1.getPaymentMethod().getDisplayName());
      System.out.println("     Status: " + payment1.getStatus());
      
      // Exit car with cash payment
      Payment payment2 = parkingService.exitVehicle(ticket2.getTicketId(), PaymentMethod.CASH);
      System.out.println("   ✓ Car exited:");
      System.out.println("     Payment ID: " + payment2.getPaymentId());
      System.out.println("     Amount: " + payment2.getAmount());
      System.out.println("     Method: " + payment2.getPaymentMethod().getDisplayName());
      System.out.println("     Status: " + payment2.getStatus());
      
      // Step 9: Final occupancy
      System.out.println("\n9. Final Occupancy Report:");
      displayOccupancyReport(parkingService.getOccupancyReport());
      
      // Step 10: Demonstrate error handling
      System.out.println("\n10. Demonstrating error handling:");
      
      try {
        // Try to park already parked vehicle
        parkingService.enterVehicle(disabledCar);
      } catch (InvalidVehicleException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      try {
        // Try to exit with invalid ticket
        parkingService.exitVehicle("INVALID-TICKET", PaymentMethod.CASH);
      } catch (InvalidTicketException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      try {
        // Try to calculate fee for exited vehicle
        parkingService.calculateParkingFee(ticket1.getTicketId());
      } catch (InvalidTicketException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      System.out.println("\n=== Demo completed successfully! ===");
      
    } catch (ParkingException | InterruptedException e) {
      System.err.println("Error during demo: " + e.getMessage());
      e.printStackTrace();
    }
  }
  
  /**
   * Creates a sample parking lot with multiple floors and space types.
   */
  private static List<ParkingSpace> createParkingSpaces() {
    List<ParkingSpace> spaces = new ArrayList<>();
    
    // Floor 0 (Ground floor) - 10 spaces
    for (int i = 1; i <= 3; i++) {
      spaces.add(new ParkingSpace("F0-MC-" + i, SpaceType.MOTORCYCLE, 0));
    }
    for (int i = 1; i <= 4; i++) {
      spaces.add(new ParkingSpace("F0-C-" + i, SpaceType.COMPACT, 0));
    }
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F0-L-" + i, SpaceType.LARGE, 0));
    }
    spaces.add(new ParkingSpace("F0-D-1", SpaceType.DISABLED, 0));
    
    // Floor 1 - 10 spaces
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F1-MC-" + i, SpaceType.MOTORCYCLE, 1));
    }
    for (int i = 1; i <= 5; i++) {
      spaces.add(new ParkingSpace("F1-C-" + i, SpaceType.COMPACT, 1));
    }
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F1-L-" + i, SpaceType.LARGE, 1));
    }
    spaces.add(new ParkingSpace("F1-D-1", SpaceType.DISABLED, 1));
    
    // Floor 2 - 10 spaces
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F2-MC-" + i, SpaceType.MOTORCYCLE, 2));
    }
    for (int i = 1; i <= 4; i++) {
      spaces.add(new ParkingSpace("F2-C-" + i, SpaceType.COMPACT, 2));
    }
    for (int i = 1; i <= 3; i++) {
      spaces.add(new ParkingSpace("F2-L-" + i, SpaceType.LARGE, 2));
    }
    spaces.add(new ParkingSpace("F2-D-1", SpaceType.DISABLED, 2));
    
    return spaces;
  }
  
  /**
   * Displays occupancy report in a readable format.
   */
  private static void displayOccupancyReport(OccupancyReport report) {
    System.out.println("   Timestamp: " + report.getTimestamp());
    System.out.println("   Total Spaces: " + report.getTotalSpaces());
    System.out.println("   Occupied: " + report.getOccupiedSpaces());
    System.out.println("   Available: " + report.getAvailableSpaces());
    System.out.println("   Occupancy Rate: " + String.format("%.1f%%", report.getOccupancyRate() * 100));
    System.out.println("   By Space Type:");
    
    for (SpaceType type : SpaceType.values()) {
      int available = report.getAvailableSpaces(type);
      int occupied = report.getOccupiedSpaces(type);
      System.out.println("     " + type + ": " + available + " available, " + occupied + " occupied");
    }
  }
}
