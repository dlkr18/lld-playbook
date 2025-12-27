# spotify - Complete Implementation

## 📁 Project Structure (18 files)

```
spotify/
├── PlaybackService.java
├── SpotifyDemo.java
├── model/Album.java
├── model/AlbumId.java
├── model/Artist.java
├── model/ArtistId.java
├── model/Genre.java
├── model/PlaybackQueue.java
├── model/PlaybackSession.java
├── model/PlaybackState.java
├── model/Playlist.java
├── model/PlaylistId.java
├── model/RepeatMode.java
├── model/Song.java
├── model/SongId.java
├── model/SubscriptionTier.java
├── model/User.java
├── model/UserId.java
```

## 📝 Source Code

### 📄 `PlaybackService.java`

```java
package com.you.lld.problems.spotify;

import com.you.lld.problems.spotify.model.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for managing playback sessions and queue operations.
 * 
 * <p>Features:
 * <ul>
 *   <li>Start playback of songs, albums, playlists</li>
 *   <li>Control playback: play, pause, resume, next, previous</li>
 *   <li>Queue management: add to queue, shuffle, repeat</li>
 *   <li>Multiple concurrent user sessions</li>
 * </ul>
 */
public class PlaybackService {
    private final Map<UserId, PlaybackSession> sessions;
    
    public PlaybackService() {
        this.sessions = new HashMap<>();
    }
    
    /**
     * Play a single song.
     */
    public PlaybackSession playSong(UserId userId, Song song) {
        PlaybackSession session = getOrCreateSession(userId);
        
        // Clear queue and add song
        session.getQueue().clear();
        session.getQueue().addSong(song);
        
        // Start playing
        session.play(song);
        
        return session;
    }
    
    /**
     * Play an entire album.
     */
    public PlaybackSession playAlbum(UserId userId, Album album) {
        PlaybackSession session = getOrCreateSession(userId);
        
        // Clear queue and add all tracks
        session.getQueue().clear();
        session.getQueue().addSongs(album.getTracks());
        
        // Start playing first track
        Song firstTrack = session.getQueue().getCurrentSong();
        if (firstTrack != null) {
            session.play(firstTrack);
        }
        
        return session;
    }
    
    /**
     * Play a playlist.
     */
    public PlaybackSession playPlaylist(UserId userId, Playlist playlist) {
        PlaybackSession session = getOrCreateSession(userId);
        
        // Clear queue and add all songs
        session.getQueue().clear();
        session.getQueue().addSongs(playlist.getSongs());
        
        // Start playing first song
        Song firstSong = session.getQueue().getCurrentSong();
        if (firstSong != null) {
            session.play(firstSong);
        }
        
        return session;
    }
    
    /**
     * Add a song to the end of the queue.
     */
    public void addToQueue(UserId userId, Song song) {
        PlaybackSession session = getOrCreateSession(userId);
        session.getQueue().addSong(song);
        
        // If nothing is playing, start playing this song
        if (session.getCurrentSong() == null) {
            session.play(song);
        }
    }
    
    /**
     * Pause current playback.
     */
    public void pause(UserId userId) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.pause();
        }
    }
    
    /**
     * Resume playback.
     */
    public void resume(UserId userId) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.resume();
        }
    }
    
    /**
     * Skip to next song.
     */
    public void next(UserId userId) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.next();
        }
    }
    
    /**
     * Go to previous song.
     */
    public void previous(UserId userId) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.previous();
        }
    }
    
    /**
     * Seek to a specific position in the current song.
     */
    public void seek(UserId userId, int positionSeconds) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.seek(positionSeconds);
        }
    }
    
    /**
     * Enable or disable shuffle mode.
     */
    public void setShuffle(UserId userId, boolean enabled) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.getQueue().setShuffle(enabled);
        }
    }
    
    /**
     * Set repeat mode.
     */
    public void setRepeat(UserId userId, RepeatMode mode) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.getQueue().setRepeatMode(mode);
        }
    }
    
    /**
     * Get the current playback session for a user.
     */
    public PlaybackSession getSession(UserId userId) {
        return sessions.get(userId);
    }
    
    /**
     * Stop playback and clear session.
     */
    public void stopPlayback(UserId userId) {
        PlaybackSession session = sessions.get(userId);
        if (session != null) {
            session.stop();
            session.getQueue().clear();
        }
    }
    
    private PlaybackSession getOrCreateSession(UserId userId) {
        return sessions.computeIfAbsent(userId, PlaybackSession::new);
    }
}



```

### 📄 `SpotifyDemo.java`

```java
package com.you.lld.problems.spotify;

import com.you.lld.problems.spotify.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Demonstration of Music Streaming Service (Spotify-like) Low-Level Design.
 * 
 * <p>Shows core features:
 * <ul>
 *   <li>Music catalog (songs, albums, artists)</li>
 *   <li>Playlist management</li>
 *   <li>User library and preferences</li>
 *   <li>Song playback and statistics</li>
 *   <li>Artist following</li>
 * </ul>
 */
public class SpotifyDemo {
    
    public static void main(String[] args) {
        System.out.println("=== Music Streaming Service (Spotify) LLD Demonstration ===\n");
        
        demoMusicCatalog();
        demoArtistsAndAlbums();
        demoPlaylistManagement();
        demoUserInteractions();
        demoPlaybackStats();
        demoPlaybackQueue();
        demoPlaybackControls();
        demoShuffleAndRepeat();
        
        System.out.println("\n=== All Demonstrations Completed Successfully! ===");
    }
    
    private static void demoMusicCatalog() {
        System.out.println("--- Music Catalog ---");
        
        // Create artist
        ArtistId beatlesId = new ArtistId("artist-1");
        Artist beatles = new Artist(beatlesId, "The Beatles");
        
        // Create album
        AlbumId abbeyRoadId = new AlbumId("album-1");
        Album abbeyRoad = new Album(abbeyRoadId, "Abbey Road", beatlesId, "The Beatles");
        
        // Create songs
        Song song1 = new Song(
            new SongId("song-1"),
            "Come Together",
            beatlesId,
            "The Beatles",
            abbeyRoadId,
            259,  // 4:19
            Genre.ROCK
        );
        
        Song song2 = new Song(
            new SongId("song-2"),
            "Something",
            beatlesId,
            "The Beatles",
            abbeyRoadId,
            183,  // 3:03
            Genre.ROCK
        );
        
        Song song3 = new Song(
            new SongId("song-3"),
            "Here Comes The Sun",
            beatlesId,
            "The Beatles",
            abbeyRoadId,
            185,  // 3:05
            Genre.ROCK
        );
        
        // Add tracks to album
        abbeyRoad.addTrack(song1);
        abbeyRoad.addTrack(song2);
        abbeyRoad.addTrack(song3);
        
        // Add album to artist
        beatles.addAlbum(abbeyRoad);
        
        System.out.println("Artist: " + beatles.getName());
        System.out.println("Album: " + abbeyRoad);
        System.out.println("Songs:");
        for (Song song : abbeyRoad.getTracks()) {
            System.out.println("  - " + song);
        }
        System.out.println("Total album duration: " + formatDuration(abbeyRoad.getTotalDuration()));
        System.out.println();
    }
    
    private static void demoArtistsAndAlbums() {
        System.out.println("--- Artists and Albums ---");
        
        // Create multiple artists
        Artist coldplay = new Artist(new ArtistId("artist-2"), "Coldplay");
        Artist queen = new Artist(new ArtistId("artist-3"), "Queen");
        
        // Create albums for Coldplay
        AlbumId parachutesId = new AlbumId("album-2");
        Album parachutes = new Album(parachutesId, "Parachutes", coldplay.getId(), "Coldplay");
        
        Song yellowSong = new Song(
            new SongId("song-4"),
            "Yellow",
            coldplay.getId(),
            "Coldplay",
            parachutesId,
            266,
            Genre.POP
        );
        parachutes.addTrack(yellowSong);
        coldplay.addAlbum(parachutes);
        
        // Create album for Queen
        AlbumId nightAtOperaId = new AlbumId("album-3");
        Album nightAtOpera = new Album(nightAtOperaId, "A Night at the Opera", queen.getId(), "Queen");
        
        Song bohemianRhapsody = new Song(
            new SongId("song-5"),
            "Bohemian Rhapsody",
            queen.getId(),
            "Queen",
            nightAtOperaId,
            355,  // 5:55
            Genre.ROCK
        );
        nightAtOpera.addTrack(bohemianRhapsody);
        queen.addAlbum(nightAtOpera);
        
        System.out.println("Artist: " + coldplay);
        System.out.println("  Album: " + parachutes);
        System.out.println();
        
        System.out.println("Artist: " + queen);
        System.out.println("  Album: " + nightAtOpera);
        System.out.println("  Featured track: " + bohemianRhapsody);
        System.out.println();
    }
    
    private static void demoPlaylistManagement() {
        System.out.println("--- Playlist Management ---");
        
        // Create user
        UserId userId = new UserId("user-1");
        User user = new User(userId, "john_music_lover", "john@example.com", SubscriptionTier.PREMIUM);
        
        // Create playlist
        PlaylistId playlistId = new PlaylistId("playlist-1");
        Playlist myPlaylist = new Playlist(playlistId, "My Favorites", userId);
        
        System.out.println("Created playlist: " + myPlaylist.getName());
        System.out.println("Owner: " + user.getUsername());
        System.out.println("Initial state: " + myPlaylist);
        
        // Add songs to playlist
        Song song1 = new Song(
            new SongId("song-6"),
            "Imagine",
            new ArtistId("artist-4"),
            "John Lennon",
            new AlbumId("album-4"),
            183,
            Genre.POP
        );
        
        Song song2 = new Song(
            new SongId("song-7"),
            "Hey Jude",
            new ArtistId("artist-1"),
            "The Beatles",
            new AlbumId("album-5"),
            431,  // 7:11
            Genre.ROCK
        );
        
        Song song3 = new Song(
            new SongId("song-8"),
            "Let It Be",
            new ArtistId("artist-1"),
            "The Beatles",
            new AlbumId("album-6"),
            243,  // 4:03
            Genre.ROCK
        );
        
        myPlaylist.addSong(song1);
        myPlaylist.addSong(song2);
        myPlaylist.addSong(song3);
        
        System.out.println("\nAfter adding songs: " + myPlaylist);
        System.out.println("Songs in playlist:");
        int index = 1;
        for (Song song : myPlaylist.getSongs()) {
            System.out.println("  " + index++ + ". " + song);
        }
        
        // Make playlist public
        myPlaylist.setPublic(true);
        System.out.println("\nPlaylist visibility: " + (myPlaylist.isPublic() ? "Public" : "Private"));
        
        // Add playlist to user
        user.addPlaylist(myPlaylist);
        System.out.println("User playlists: " + user.getPlaylists().size());
        System.out.println();
    }
    
    private static void demoUserInteractions() {
        System.out.println("--- User Interactions ---");
        
        // Create user
        User user = new User(
            new UserId("user-2"),
            "sarah_music",
            "sarah@example.com",
            SubscriptionTier.FREE
        );
        
        System.out.println("User: " + user.getUsername());
        System.out.println("Subscription: " + user.getTier());
        
        // Like songs
        SongId song1Id = new SongId("song-9");
        SongId song2Id = new SongId("song-10");
        SongId song3Id = new SongId("song-11");
        
        user.likeSong(song1Id);
        user.likeSong(song2Id);
        user.likeSong(song3Id);
        
        System.out.println("Liked songs: " + user.getLikedSongs().size());
        
        // Follow artists
        Artist taylorSwift = new Artist(new ArtistId("artist-5"), "Taylor Swift");
        Artist edSheeran = new Artist(new ArtistId("artist-6"), "Ed Sheeran");
        
        user.followArtist(taylorSwift.getId());
        user.followArtist(edSheeran.getId());
        
        taylorSwift.follow();
        edSheeran.follow();
        
        System.out.println("Following artists: " + user.getFollowedArtists().size());
        System.out.println();
        
        System.out.println("Artist: " + taylorSwift);
        System.out.println("Artist: " + edSheeran);
        System.out.println();
    }
    
    private static void demoPlaybackStats() {
        System.out.println("--- Playback and Statistics ---");
        
        // Create popular song
        Song viralHit = new Song(
            new SongId("song-12"),
            "Viral Hit 2024",
            new ArtistId("artist-7"),
            "New Artist",
            new AlbumId("album-7"),
            210,
            Genre.POP
        );
        
        System.out.println("Song: " + viralHit);
        System.out.println("Initial play count: " + viralHit.getPlayCount());
        
        // Simulate playback
        System.out.println("\nSimulating playback...");
        for (int i = 0; i < 1000; i++) {
            viralHit.play();
        }
        
        System.out.println("After 1000 plays: " + viralHit.getPlayCount());
        
        // More plays
        for (int i = 0; i < 9000; i++) {
            viralHit.play();
        }
        
        System.out.println("After 10,000 total plays: " + String.format("%,d", viralHit.getPlayCount()));
        
        // Create another song and compare
        Song newSong = new Song(
            new SongId("song-13"),
            "Another Song",
            new ArtistId("artist-8"),
            "Another Artist",
            new AlbumId("album-8"),
            180,
            Genre.INDIE
        );
        
        for (int i = 0; i < 5000; i++) {
            newSong.play();
        }
        
        System.out.println("\nPopularity comparison:");
        System.out.println("  " + viralHit.getTitle() + ": " + String.format("%,d", viralHit.getPlayCount()) + " plays");
        System.out.println("  " + newSong.getTitle() + ": " + String.format("%,d", newSong.getPlayCount()) + " plays");
        System.out.println();
    }
    
    private static void demoPlaybackQueue() {
        System.out.println("--- Playback Queue Management ---");
        
        PlaybackService playbackService = new PlaybackService();
        UserId userId = new UserId("user-3");
        
        // Create some songs
        Song song1 = new Song(
            new SongId("q-song-1"),
            "Shape of You",
            new ArtistId("artist-9"),
            "Ed Sheeran",
            new AlbumId("album-9"),
            234,
            Genre.POP
        );
        
        Song song2 = new Song(
            new SongId("q-song-2"),
            "Perfect",
            new ArtistId("artist-9"),
            "Ed Sheeran",
            new AlbumId("album-9"),
            263,
            Genre.POP
        );
        
        Song song3 = new Song(
            new SongId("q-song-3"),
            "Thinking Out Loud",
            new ArtistId("artist-9"),
            "Ed Sheeran",
            new AlbumId("album-10"),
            281,
            Genre.POP
        );
        
        Song song4 = new Song(
            new SongId("q-song-4"),
            "Photograph",
            new ArtistId("artist-9"),
            "Ed Sheeran",
            new AlbumId("album-10"),
            258,
            Genre.POP
        );
        
        // Start playing a song
        System.out.println("Playing: " + song1.getTitle());
        playbackService.playSong(userId, song1);
        
        PlaybackSession session = playbackService.getSession(userId);
        System.out.println("Current: " + session.getCurrentSong().getTitle());
        System.out.println("Queue size: " + session.getQueue().size());
        
        // Add songs to queue
        System.out.println("\nAdding songs to queue...");
        playbackService.addToQueue(userId, song2);
        playbackService.addToQueue(userId, song3);
        playbackService.addToQueue(userId, song4);
        
        System.out.println("Queue size: " + session.getQueue().size());
        System.out.println("Songs in queue:");
        int i = 1;
        for (Song song : session.getQueue().getQueue()) {
            String marker = (song == session.getCurrentSong()) ? " <- NOW PLAYING" : "";
            System.out.println("  " + i++ + ". " + song.getTitle() + marker);
        }
        System.out.println();
    }
    
    private static void demoPlaybackControls() {
        System.out.println("--- Playback Controls (Play, Pause, Next, Previous) ---");
        
        PlaybackService playbackService = new PlaybackService();
        UserId userId = new UserId("user-4");
        
        // Create an album
        AlbumId albumId = new AlbumId("album-11");
        Album album = new Album(albumId, "Thriller", new ArtistId("artist-10"), "Michael Jackson");
        
        Song song1 = new Song(new SongId("mj-1"), "Wanna Be Startin' Somethin'",
            new ArtistId("artist-10"), "Michael Jackson", albumId, 363, Genre.POP);
        Song song2 = new Song(new SongId("mj-2"), "Baby Be Mine",
            new ArtistId("artist-10"), "Michael Jackson", albumId, 260, Genre.POP);
        Song song3 = new Song(new SongId("mj-3"), "Thriller",
            new ArtistId("artist-10"), "Michael Jackson", albumId, 357, Genre.POP);
        Song song4 = new Song(new SongId("mj-4"), "Beat It",
            new ArtistId("artist-10"), "Michael Jackson", albumId, 258, Genre.ROCK);
        
        album.addTrack(song1);
        album.addTrack(song2);
        album.addTrack(song3);
        album.addTrack(song4);
        
        // Play album
        System.out.println("Playing album: " + album.getTitle());
        playbackService.playAlbum(userId, album);
        
        PlaybackSession session = playbackService.getSession(userId);
        System.out.println("Now playing: " + session.getCurrentSong().getTitle());
        System.out.println("State: " + session.getState());
        
        // Pause
        System.out.println("\nPausing...");
        playbackService.pause(userId);
        System.out.println("State: " + session.getState());
        
        // Resume
        System.out.println("\nResuming...");
        playbackService.resume(userId);
        System.out.println("State: " + session.getState());
        
        // Next track
        System.out.println("\nSkipping to next track...");
        playbackService.next(userId);
        System.out.println("Now playing: " + session.getCurrentSong().getTitle());
        
        // Next again
        System.out.println("\nSkipping to next track...");
        playbackService.next(userId);
        System.out.println("Now playing: " + session.getCurrentSong().getTitle());
        
        // Previous
        System.out.println("\nGoing to previous track...");
        playbackService.previous(userId);
        System.out.println("Now playing: " + session.getCurrentSong().getTitle());
        
        System.out.println();
    }
    
    private static void demoShuffleAndRepeat() {
        System.out.println("--- Shuffle and Repeat Modes ---");
        
        PlaybackService playbackService = new PlaybackService();
        UserId userId = new UserId("user-5");
        
        // Create a playlist
        Playlist playlist = new Playlist(
            new PlaylistId("playlist-demo"),
            "Top Hits",
            userId
        );
        
        // Add songs
        for (int i = 1; i <= 5; i++) {
            Song song = new Song(
                new SongId("hit-" + i),
                "Hit Song " + i,
                new ArtistId("artist-" + i),
                "Artist " + i,
                new AlbumId("album-" + i),
                180 + i * 10,
                Genre.POP
            );
            playlist.addSong(song);
        }
        
        // Play playlist
        System.out.println("Playing playlist: " + playlist.getName());
        playbackService.playPlaylist(userId, playlist);
        
        PlaybackSession session = playbackService.getSession(userId);
        System.out.println("Original order:");
        int i = 1;
        for (Song song : session.getQueue().getQueue()) {
            String marker = (song == session.getCurrentSong()) ? " <- CURRENT" : "";
            System.out.println("  " + i++ + ". " + song.getTitle() + marker);
        }
        
        // Enable shuffle
        System.out.println("\nEnabling shuffle...");
        playbackService.setShuffle(userId, true);
        System.out.println("Shuffle: " + session.getQueue().isShuffleEnabled());
        System.out.println("Shuffled order:");
        i = 1;
        for (Song song : session.getQueue().getQueue()) {
            String marker = (song == session.getCurrentSong()) ? " <- CURRENT" : "";
            System.out.println("  " + i++ + ". " + song.getTitle() + marker);
        }
        
        // Set repeat mode
        System.out.println("\nSetting repeat mode to ALL");
        playbackService.setRepeat(userId, RepeatMode.ALL);
        System.out.println("Repeat: " + session.getQueue().getRepeatMode());
        System.out.println("Has next: " + session.getQueue().hasNext());
        
        // Skip to end and show it loops
        System.out.println("\nSkipping to last song...");
        while (session.getQueue().hasNext() && session.getQueue().getCurrentIndex() < 4) {
            playbackService.next(userId);
        }
        System.out.println("Current: " + session.getCurrentSong().getTitle() + 
                          " (index " + session.getQueue().getCurrentIndex() + ")");
        
        System.out.println("\nSkipping next (should loop to start)...");
        playbackService.next(userId);
        System.out.println("Current: " + session.getCurrentSong().getTitle() + 
                          " (index " + session.getQueue().getCurrentIndex() + ")");
        
        // Set repeat ONE
        System.out.println("\nSetting repeat mode to ONE");
        playbackService.setRepeat(userId, RepeatMode.ONE);
        System.out.println("Repeat: " + session.getQueue().getRepeatMode());
        
        String beforeNext = session.getCurrentSong().getTitle();
        playbackService.next(userId);
        String afterNext = session.getCurrentSong().getTitle();
        System.out.println("Before next: " + beforeNext);
        System.out.println("After next: " + afterNext + " (same song, repeat ONE)");
        
        System.out.println();
    }
    
    private static String formatDuration(int seconds) {
        int minutes = seconds / 60;
        int secs = seconds % 60;
        return String.format("%d:%02d", minutes, secs);
    }
}

```

### 📄 `model/Album.java`

```java
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
```

### 📄 `model/AlbumId.java`

```java
package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class AlbumId {
    private final String value;
    public AlbumId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("AlbumId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlbumId that = (AlbumId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "AlbumId{" + value + '}'; }
}
```

### 📄 `model/Artist.java`

```java
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
```

### 📄 `model/ArtistId.java`

```java
package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class ArtistId {
    private final String value;
    public ArtistId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("ArtistId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtistId that = (ArtistId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "ArtistId{" + value + '}'; }
}
```

### 📄 `model/Genre.java`

```java
package com.you.lld.problems.spotify.model;
public enum Genre {
    POP, ROCK, JAZZ, CLASSICAL, HIP_HOP, ELECTRONIC, COUNTRY, R_AND_B, INDIE, METAL
}
```

### 📄 `model/PlaybackQueue.java`

```java
package com.you.lld.problems.spotify.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Manages the playback queue with support for shuffle and repeat modes.
 * 
 * <p>Features:
 * <ul>
 *   <li>Next/previous navigation</li>
 *   <li>Shuffle mode (Fisher-Yates algorithm)</li>
 *   <li>Repeat modes: NONE, ONE, ALL</li>
 *   <li>Add songs to queue</li>
 *   <li>Clear queue</li>
 * </ul>
 */
public class PlaybackQueue {
    private final List<Song> queue;
    private int currentIndex;
    private boolean shuffleEnabled;
    private RepeatMode repeatMode;
    private List<Song> originalOrder;
    private final Random random;
    
    public PlaybackQueue() {
        this.queue = new ArrayList<>();
        this.currentIndex = -1;
        this.shuffleEnabled = false;
        this.repeatMode = RepeatMode.NONE;
        this.originalOrder = new ArrayList<>();
        this.random = new Random();
    }
    
    /**
     * Add a song to the end of the queue.
     */
    public void addSong(Song song) {
        queue.add(song);
        if (currentIndex == -1) {
            currentIndex = 0;
        }
    }
    
    /**
     * Add multiple songs to the queue.
     */
    public void addSongs(List<Song> songs) {
        queue.addAll(songs);
        if (currentIndex == -1 && !queue.isEmpty()) {
            currentIndex = 0;
        }
    }
    
    /**
     * Get the current song in the queue.
     */
    public Song getCurrentSong() {
        if (currentIndex >= 0 && currentIndex < queue.size()) {
            return queue.get(currentIndex);
        }
        return null;
    }
    
    /**
     * Move to the next song in the queue.
     * Respects repeat mode settings.
     * 
     * @return the next song, or null if queue ends
     */
    public Song next() {
        if (queue.isEmpty()) {
            return null;
        }
        
        // If repeat ONE, stay on same song
        if (repeatMode == RepeatMode.ONE) {
            return getCurrentSong();
        }
        
        // Try to move to next song
        if (currentIndex < queue.size() - 1) {
            currentIndex++;
            return queue.get(currentIndex);
        }
        
        // At end of queue
        if (repeatMode == RepeatMode.ALL) {
            currentIndex = 0;
            return queue.get(0);
        }
        
        // Repeat NONE - end of queue
        return null;
    }
    
    /**
     * Move to the previous song in the queue.
     */
    public Song previous() {
        if (queue.isEmpty()) {
            return null;
        }
        
        if (currentIndex > 0) {
            currentIndex--;
            return queue.get(currentIndex);
        }
        
        // At start of queue, wrap to end if repeat ALL
        if (repeatMode == RepeatMode.ALL) {
            currentIndex = queue.size() - 1;
            return queue.get(currentIndex);
        }
        
        // Stay at first song
        return getCurrentSong();
    }
    
    /**
     * Enable or disable shuffle mode.
     * Uses Fisher-Yates algorithm for randomization.
     */
    public void setShuffle(boolean enabled) {
        if (enabled == shuffleEnabled) {
            return;
        }
        
        this.shuffleEnabled = enabled;
        
        if (enabled) {
            // Save original order
            originalOrder = new ArrayList<>(queue);
            
            // Get current song before shuffle
            Song currentSong = getCurrentSong();
            
            // Fisher-Yates shuffle
            for (int i = queue.size() - 1; i > 0; i--) {
                int j = random.nextInt(i + 1);
                Collections.swap(queue, i, j);
            }
            
            // Find and move current song to front
            if (currentSong != null) {
                int newIndex = queue.indexOf(currentSong);
                if (newIndex > 0) {
                    Collections.swap(queue, 0, newIndex);
                }
                currentIndex = 0;
            }
        } else {
            // Restore original order
            Song currentSong = getCurrentSong();
            queue.clear();
            queue.addAll(originalOrder);
            
            // Find current song in original order
            if (currentSong != null) {
                currentIndex = queue.indexOf(currentSong);
                if (currentIndex == -1) {
                    currentIndex = 0;
                }
            }
        }
    }
    
    /**
     * Set the repeat mode.
     */
    public void setRepeatMode(RepeatMode mode) {
        this.repeatMode = mode;
    }
    
    /**
     * Clear the entire queue.
     */
    public void clear() {
        queue.clear();
        originalOrder.clear();
        currentIndex = -1;
        shuffleEnabled = false;
        repeatMode = RepeatMode.NONE;
    }
    
    /**
     * Jump to a specific index in the queue.
     */
    public Song jumpTo(int index) {
        if (index >= 0 && index < queue.size()) {
            currentIndex = index;
            return queue.get(currentIndex);
        }
        return null;
    }
    
    /**
     * Check if there's a next song available.
     */
    public boolean hasNext() {
        if (queue.isEmpty()) {
            return false;
        }
        
        if (repeatMode == RepeatMode.ONE || repeatMode == RepeatMode.ALL) {
            return true;
        }
        
        return currentIndex < queue.size() - 1;
    }
    
    /**
     * Get all songs in the queue (unmodifiable).
     */
    public List<Song> getQueue() {
        return Collections.unmodifiableList(queue);
    }
    
    public int getCurrentIndex() {
        return currentIndex;
    }
    
    public int size() {
        return queue.size();
    }
    
    public boolean isEmpty() {
        return queue.isEmpty();
    }
    
    public boolean isShuffleEnabled() {
        return shuffleEnabled;
    }
    
    public RepeatMode getRepeatMode() {
        return repeatMode;
    }
    
    @Override
    public String toString() {
        return String.format("Queue[%d songs, index=%d, shuffle=%s, repeat=%s]",
            queue.size(), currentIndex, shuffleEnabled, repeatMode);
    }
}



```

### 📄 `model/PlaybackSession.java`

```java
package com.you.lld.problems.spotify.model;

/**
 * Represents a user's active playback session.
 * 
 * <p>Maintains:
 * <ul>
 *   <li>Current song being played</li>
 *   <li>Playback position in seconds</li>
 *   <li>Playback state (playing, paused, stopped)</li>
 *   <li>Playback queue</li>
 * </ul>
 */
public class PlaybackSession {
    private final UserId userId;
    private Song currentSong;
    private int currentPositionSeconds;
    private PlaybackState state;
    private final PlaybackQueue queue;
    
    public PlaybackSession(UserId userId) {
        this.userId = userId;
        this.currentSong = null;
        this.currentPositionSeconds = 0;
        this.state = PlaybackState.STOPPED;
        this.queue = new PlaybackQueue();
    }
    
    /**
     * Start playing a song.
     */
    public void play(Song song) {
        this.currentSong = song;
        this.currentPositionSeconds = 0;
        this.state = PlaybackState.PLAYING;
        song.play(); // Increment play count
    }
    
    /**
     * Pause the current playback.
     */
    public void pause() {
        if (state == PlaybackState.PLAYING) {
            this.state = PlaybackState.PAUSED;
        }
    }
    
    /**
     * Resume playback.
     */
    public void resume() {
        if (state == PlaybackState.PAUSED && currentSong != null) {
            this.state = PlaybackState.PLAYING;
        }
    }
    
    /**
     * Stop playback completely.
     */
    public void stop() {
        this.state = PlaybackState.STOPPED;
        this.currentPositionSeconds = 0;
    }
    
    /**
     * Seek to a specific position in the current song.
     */
    public void seek(int positionSeconds) {
        if (currentSong != null) {
            if (positionSeconds >= 0 && positionSeconds <= currentSong.getDurationSeconds()) {
                this.currentPositionSeconds = positionSeconds;
            }
        }
    }
    
    /**
     * Move to the next song in the queue.
     */
    public void next() {
        Song nextSong = queue.next();
        if (nextSong != null) {
            play(nextSong);
        } else {
            stop();
        }
    }
    
    /**
     * Move to the previous song in the queue.
     */
    public void previous() {
        Song prevSong = queue.previous();
        if (prevSong != null) {
            play(prevSong);
        }
    }
    
    /**
     * Check if the current song has finished playing.
     */
    public boolean hasFinished() {
        return currentSong != null && 
               currentPositionSeconds >= currentSong.getDurationSeconds();
    }
    
    /**
     * Simulate time passing (for demo purposes).
     */
    public void advanceTime(int seconds) {
        if (state == PlaybackState.PLAYING && currentSong != null) {
            currentPositionSeconds += seconds;
            
            // Auto-advance to next song if current finished
            if (currentPositionSeconds >= currentSong.getDurationSeconds()) {
                if (queue.hasNext()) {
                    next();
                } else {
                    stop();
                }
            }
        }
    }
    
    public UserId getUserId() {
        return userId;
    }
    
    public Song getCurrentSong() {
        return currentSong;
    }
    
    public int getCurrentPositionSeconds() {
        return currentPositionSeconds;
    }
    
    public PlaybackState getState() {
        return state;
    }
    
    public PlaybackQueue getQueue() {
        return queue;
    }
    
    public boolean isPlaying() {
        return state == PlaybackState.PLAYING;
    }
    
    public boolean isPaused() {
        return state == PlaybackState.PAUSED;
    }
    
    @Override
    public String toString() {
        if (currentSong == null) {
            return "PlaybackSession[No song playing]";
        }
        
        String position = formatTime(currentPositionSeconds);
        String duration = formatTime(currentSong.getDurationSeconds());
        
        return String.format("PlaybackSession[%s - %s/%s, state=%s, %s]",
            currentSong.getTitle(), position, duration, state, queue);
    }
    
    private String formatTime(int seconds) {
        int mins = seconds / 60;
        int secs = seconds % 60;
        return String.format("%d:%02d", mins, secs);
    }
}



```

### 📄 `model/PlaybackState.java`

```java
package com.you.lld.problems.spotify.model;
public enum PlaybackState {
    PLAYING, PAUSED, STOPPED
}
```

### 📄 `model/Playlist.java`

```java
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
```

### 📄 `model/PlaylistId.java`

```java
package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class PlaylistId {
    private final String value;
    public PlaylistId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("PlaylistId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlaylistId that = (PlaylistId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "PlaylistId{" + value + '}'; }
}
```

### 📄 `model/RepeatMode.java`

```java
package com.you.lld.problems.spotify.model;
public enum RepeatMode {
    NONE, ONE, ALL
}
```

### 📄 `model/Song.java`

```java
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
```

### 📄 `model/SongId.java`

```java
package com.you.lld.problems.spotify.model;

import java.util.Objects;

/**
 * Type-safe identifier for Song entity.
 */
public final class SongId {
    private final String value;
    
    public SongId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("SongId cannot be null or empty");
        }
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SongId songId = (SongId) o;
        return value.equals(songId.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "SongId{" + value + '}';
    }
}



```

### 📄 `model/SubscriptionTier.java`

```java
package com.you.lld.problems.spotify.model;
public enum SubscriptionTier {
    FREE, PREMIUM
}
```

### 📄 `model/User.java`

```java
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
```

### 📄 `model/UserId.java`

```java
package com.you.lld.problems.spotify.model;
import java.util.Objects;
public final class UserId {
    private final String value;
    public UserId(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("UserId cannot be null or empty");
        }
        this.value = value;
    }
    public String getValue() { return value; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId that = (UserId) o;
        return value.equals(that.value);
    }
    @Override
    public int hashCode() { return Objects.hash(value); }
    @Override
    public String toString() { return "UserId{" + value + '}'; }
}
```

