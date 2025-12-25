package com.you.lld.problems.spotify.model;
import java.time.LocalDateTime;
import java.util.*;
public class Playlist {
    private final PlaylistId id;
    private String name;
    private final UserId ownerId;
    private final List<Song> songs;
    private boolean isPublic;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Playlist(PlaylistId id, String name, UserId ownerId) {
        if (name == null || name.trim().isEmpty() || name.length() > 100) {
            throw new IllegalArgumentException("Playlist name must be 1-100 characters");
        }
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.songs = new ArrayList<>();
        this.isPublic = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = createdAt;
    }
    
    public void addSong(Song song) {
        songs.add(song);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void removeSong(int index) {
        if (index >= 0 && index < songs.size()) {
            songs.remove(index);
            this.updatedAt = LocalDateTime.now();
        }
    }
    
    public void rename(String newName) {
        if (newName != null && !newName.trim().isEmpty() && newName.length() <= 100) {
            this.name = newName;
            this.updatedAt = LocalDateTime.now();
        }
    }
    
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
        this.updatedAt = LocalDateTime.now();
    }
    
    public int getTotalDuration() {
        return songs.stream().mapToInt(Song::getDurationSeconds).sum();
    }
    
    public PlaylistId getId() { return id; }
    public String getName() { return name; }
    public UserId getOwnerId() { return ownerId; }
    public List<Song> getSongs() { return Collections.unmodifiableList(songs); }
    public boolean isPublic() { return isPublic; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public String toString() {
        int minutes = getTotalDuration() / 60;
        return name + " (" + songs.size() + " songs, " + minutes + " min, " + 
               (isPublic ? "Public" : "Private") + ")";
    }
}
