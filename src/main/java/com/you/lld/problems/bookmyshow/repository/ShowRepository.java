package com.you.lld.problems.bookmyshow.repository;

import com.you.lld.problems.bookmyshow.model.Show;
import com.you.lld.problems.bookmyshow.model.City;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Show persistence.
 */
public interface ShowRepository {
    
    Show save(Show show);
    
    Optional<Show> findById(String showId);
    
    List<Show> findByMovieId(String movieId);
    
    List<Show> findByScreenId(String screenId);
    
    /**
     * Find shows for a movie in a specific city within date range.
     */
    List<Show> findByMovieAndCityAndDateRange(
        String movieId, 
        City city, 
        LocalDateTime start, 
        LocalDateTime end
    );
    
    /**
     * Find upcoming shows (starting after current time).
     */
    List<Show> findUpcomingShows(LocalDateTime after);
    
    /**
     * Find shows starting within time window.
     */
    List<Show> findShowsStartingBetween(LocalDateTime start, LocalDateTime end);
    
    void delete(String showId);
    
    /**
     * Get occupancy percentage for a show.
     */
    double getOccupancyPercentage(String showId);
}
