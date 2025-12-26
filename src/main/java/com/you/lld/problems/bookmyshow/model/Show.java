package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class Show {
    private final String id;
    private final String movieId;
    private final String screenId;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;

    public Show(String id, String movieId, String screenId, 
                LocalDateTime startTime, LocalDateTime endTime) {
        this.id = id;
        this.movieId = movieId;
        this.screenId = screenId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getId() { return id; }
    public String getMovieId() { return movieId; }
    public String getScreenId() { return screenId; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }

    @Override
    public String toString() {
        return "Show{id='" + id + "', movieId='" + movieId + "', startTime=" + startTime + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Show show = (Show) o;
        return id.equals(show.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
