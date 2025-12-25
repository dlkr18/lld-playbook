package com.you.lld.problems.spotify.model;
import java.util.*;
public class Album {
    private final AlbumId id;
    private final String title;
    private final ArtistId artistId;
    private final String artistName;
    private final List<Song> tracks;
    
    public Album(AlbumId id, String title, ArtistId artistId, String artistName) {
        this.id = id;
        this.title = title;
        this.artistId = artistId;
        this.artistName = artistName;
        this.tracks = new ArrayList<>();
    }
    
    public void addTrack(Song song) {
        tracks.add(song);
    }
    
    public AlbumId getId() { return id; }
    public String getTitle() { return title; }
    public List<Song> getTracks() { return Collections.unmodifiableList(tracks); }
    public int getTotalDuration() {
        return tracks.stream().mapToInt(Song::getDurationSeconds).sum();
    }
    
    @Override
    public String toString() {
        return title + " by " + artistName + " (" + tracks.size() + " tracks)";
    }
}
