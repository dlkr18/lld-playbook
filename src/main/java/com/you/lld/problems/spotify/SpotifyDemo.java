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

