package com.you.lld.problems.spotify.model;
import java.time.LocalDate;
public class Song {
    private final SongId id;
    private final String title;
    private final ArtistId artistId;
    private final String artistName;
    private final AlbumId albumId;
    private final int durationSeconds;
    private final Genre genre;
    private long playCount;
    
    public Song(SongId id, String title, ArtistId artistId, String artistName, 
                AlbumId albumId, int durationSeconds, Genre genre) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (durationSeconds <= 0) {
            throw new IllegalArgumentException("Duration must be positive");
        }
        this.id = id;
        this.title = title;
        this.artistId = artistId;
        this.artistName = artistName;
        this.albumId = albumId;
        this.durationSeconds = durationSeconds;
        this.genre = genre;
        this.playCount = 0;
    }
    
    public void play() {
        this.playCount++;
    }
    
    public SongId getId() { return id; }
    public String getTitle() { return title; }
    public ArtistId getArtistId() { return artistId; }
    public String getArtistName() { return artistName; }
    public AlbumId getAlbumId() { return albumId; }
    public int getDurationSeconds() { return durationSeconds; }
    public Genre getGenre() { return genre; }
    public long getPlayCount() { return playCount; }
    
    @Override
    public String toString() {
        return title + " - " + artistName + " (" + formatDuration() + ")";
    }
    
    private String formatDuration() {
        int minutes = durationSeconds / 60;
        int seconds = durationSeconds % 60;
        return String.format("%d:%02d", minutes, seconds);
    }
}
