package com.you.lld.problems.bookmyshow.api;

import com.you.lld.problems.bookmyshow.model.*;
import java.util.List;

public interface BookingService {
    
    // Movie & Show Management
    List<Movie> searchMovies(String title, City city, Language language);
    List<Show> getShowsForMovie(String movieId, City city);
    Show getShow(String showId);
    
    // Seat Management
    List<Seat> getAvailableSeats(String showId);
    boolean lockSeats(String showId, List<String> seatIds, String userId);
    void unlockSeats(String showId, List<String> seatIds, String userId);
    
    // Booking Management
    Booking createBooking(String userId, String showId, List<String> seatIds);
    boolean confirmBooking(String bookingId, Payment payment);
    boolean cancelBooking(String bookingId);
    Booking getBooking(String bookingId);
    List<Booking> getUserBookings(String userId);
    
    // Theater Management
    List<Theater> getTheaters(City city);
    Theater getTheater(String theaterId);
}


