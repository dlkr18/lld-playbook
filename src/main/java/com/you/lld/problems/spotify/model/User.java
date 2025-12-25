package com.you.lld.problems.spotify.model;
import java.util.*;
public class User {
    private final UserId id;
    private final String username;
    private final String email;
    private SubscriptionTier tier;
    private final List<Playlist> playlists;
    private final Set<SongId> likedSongs;
    private final Set<ArtistId> followedArtists;
    
    public User(UserId id, String username, String email, SubscriptionTier tier) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.tier = tier;
        this.playlists = new ArrayList<>();
        this.likedSongs = new HashSet<>();
        this.followedArtists = new HashSet<>();
    }
    
    public void addPlaylist(Playlist playlist) {
        playlists.add(playlist);
    }
    
    public void likeSong(SongId songId) {
        likedSongs.add(songId);
    }
    
    public void followArtist(ArtistId artistId) {
        followedArtists.add(artistId);
    }
    
    public UserId getId() { return id; }
    public String getUsername() { return username; }
    public SubscriptionTier getTier() { return tier; }
    public List<Playlist> getPlaylists() { return Collections.unmodifiableList(playlists); }
    public Set<SongId> getLikedSongs() { return Collections.unmodifiableSet(likedSongs); }
    public Set<ArtistId> getFollowedArtists() { return Collections.unmodifiableSet(followedArtists); }
    
    @Override
    public String toString() {
        return username + " (" + tier + ", " + likedSongs.size() + " liked songs, " + 
               playlists.size() + " playlists)";
    }
}
