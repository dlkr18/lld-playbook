package com.you.lld.problems.bookmyshow.model;

import java.time.Duration;
import java.util.List;

public class Movie {
    private final String id;
    private final String title;
    private final String description;
    private final Duration duration;
    private final Language language;
    private final Genre genre;
    private final List<String> cast;
    private final double rating;

    public Movie(String id, String title, String description, Duration duration, 
                 Language language, Genre genre, List<String> cast, double rating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.language = language;
        this.genre = genre;
        this.cast = cast;
        this.rating = rating;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Duration getDuration() { return duration; }
    public Language getLanguage() { return language; }
    public Genre getGenre() { return genre; }
    public List<String> getCast() { return cast; }
    public double getRating() { return rating; }

    @Override
    public String toString() {
        return "Movie{id='" + id + "', title='" + title + "', language=" + language + ", rating=" + rating + '}';
    }
}
