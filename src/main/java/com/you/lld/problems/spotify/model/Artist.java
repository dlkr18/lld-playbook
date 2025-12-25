package com.you.lld.problems.spotify.model;
import java.util.*;
public class Artist {
    private final ArtistId id;
    private final String name;
    private final List<Album> albums;
    private int followerCount;
    
    public Artist(ArtistId id, String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Artist name cannot be empty");
        }
        this.id = id;
        this.name = name;
        this.albums = new ArrayList<>();
        this.followerCount = 0;
    }
    
    public void addAlbum(Album album) {
        albums.add(album);
    }
    
    public void follow() {
        followerCount++;
    }
    
    public void unfollow() {
        if (followerCount > 0) followerCount--;
    }
    
    public ArtistId getId() { return id; }
    public String getName() { return name; }
    public List<Album> getAlbums() { return Collections.unmodifiableList(albums); }
    public int getFollowerCount() { return followerCount; }
    
    @Override
    public String toString() {
        return name + " (" + followerCount + " followers, " + albums.size() + " albums)";
    }
}
