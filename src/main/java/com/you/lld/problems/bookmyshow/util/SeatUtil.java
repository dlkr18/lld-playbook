package com.you.lld.problems.bookmyshow.util;

import com.you.lld.problems.bookmyshow.model.Seat;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for seat operations.
 */
public class SeatUtil {
    
    /**
     * Generate seat layout for a screen.
     * Creates seats in format: A1, A2, ... J10
     */
    public static List<Seat> generateSeatLayout(
            int rows, 
            int seatsPerRow,
            double regularPrice,
            double premiumPrice,
            double vipPrice) {
        
        return java.util.stream.IntStream.range(0, rows)
            .boxed()
            .flatMap(row -> java.util.stream.IntStream.range(1, seatsPerRow + 1)
                .mapToObj(col -> {
                    char rowChar = (char) ('A' + row);
                    String seatNumber = rowChar + String.valueOf(col);
                    String seatId = "SEAT_" + seatNumber;
                    
                    // Determine seat type based on row
                    com.you.lld.problems.bookmyshow.model.SeatType type;
                    double price;
                    
                    if (row < 3) { // First 3 rows are VIP
                        type = com.you.lld.problems.bookmyshow.model.SeatType.VIP;
                        price = vipPrice;
                    } else if (row < 7) { // Next 4 rows are PREMIUM
                        type = com.you.lld.problems.bookmyshow.model.SeatType.PREMIUM;
                        price = premiumPrice;
                    } else { // Remaining rows are REGULAR
                        type = com.you.lld.problems.bookmyshow.model.SeatType.REGULAR;
                        price = regularPrice;
                    }
                    
                    return new Seat(seatId, seatNumber, type, price);
                })
            )
            .collect(Collectors.toList());
    }
    
    /**
     * Check if seats are in the same row.
     */
    public static boolean areInSameRow(List<Seat> seats) {
        if (seats.isEmpty()) return true;
        
        char firstRow = seats.get(0).getSeatNumber().charAt(0);
        return seats.stream()
            .allMatch(s -> s.getSeatNumber().charAt(0) == firstRow);
    }
    
    /**
     * Check if seats are consecutive.
     */
    public static boolean areConsecutive(List<Seat> seats) {
        if (seats.size() <= 1) return true;
        
        List<Integer> seatNumbers = seats.stream()
            .map(s -> Integer.parseInt(s.getSeatNumber().substring(1)))
            .sorted()
            .collect(Collectors.toList());
        
        for (int i = 1; i < seatNumbers.size(); i++) {
            if (seatNumbers.get(i) != seatNumbers.get(i-1) + 1) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Calculate total price for seats.
     */
    public static double calculateTotalPrice(List<Seat> seats) {
        return seats.stream()
            .mapToDouble(Seat::getPrice)
            .sum();
    }
    
    /**
     * Get seat numbers as comma-separated string.
     */
    public static String formatSeatNumbers(List<Seat> seats) {
        return seats.stream()
            .map(Seat::getSeatNumber)
            .collect(Collectors.joining(", "));
    }
}
