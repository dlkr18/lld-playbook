# Spotify Quick Start Guide

## Overview

This is a complete Low-Level Design implementation of a Music Streaming Service like Spotify, demonstrating:

- **Music Catalog**: Songs, albums, and artists
- **User Management**: User profiles with subscription tiers
- **Playlist Management**: Create, modify, and share playlists
- **Playback**: Song play tracking and statistics
- **Social Features**: Follow artists, like songs

## Project Structure

```
src/main/java/com/you/lld/problems/spotify/
├── model/
│   ├── SongId.java           # Type-safe song identifier
│   ├── AlbumId.java          # Type-safe album identifier
│   ├── ArtistId.java         # Type-safe artist identifier
│   ├── PlaylistId.java       # Type-safe playlist identifier
│   ├── UserId.java           # Type-safe user identifier
│   ├── Genre.java            # Music genres enum
│   ├── SubscriptionTier.java # FREE/PREMIUM enum
│   ├── PlaybackState.java    # PLAYING/PAUSED/STOPPED enum
│   ├── RepeatMode.java       # NONE/ONE/ALL enum
│   ├── Song.java             # Song entity with metadata
│   ├── Album.java            # Album with track list
│   ├── Artist.java           # Artist with albums
│   ├── Playlist.java         # User playlist (Aggregate Root)
│   └── User.java             # User entity (Aggregate Root)
└── SpotifyDemo.java          # Comprehensive demonstration
```

## Quick Start

### 1. Compile

```bash
cd /Users/likhith.r/lld-playbook
javac -d target/classes src/main/java/com/you/lld/problems/spotify/model/*.java \
                        src/main/java/com/you/lld/problems/spotify/*.java
```

### 2. Run Demo

```bash
java -cp target/classes com.you.lld.problems.spotify.SpotifyDemo
```

### 3. Expected Output

```
=== Music Streaming Service (Spotify) LLD Demonstration ===

--- Music Catalog ---
Artist: The Beatles
Album: Abbey Road by The Beatles (3 tracks)
Songs:
  - Come Together - The Beatles (4:19)
  - Something - The Beatles (3:03)
  - Here Comes The Sun - The Beatles (3:05)
Total album duration: 10:27

--- Artists and Albums ---
...

--- Playlist Management ---
Created playlist: My Favorites
Owner: john_music_lover
...

--- User Interactions ---
User: sarah_music
Subscription: FREE
Liked songs: 3
Following artists: 2
...

--- Playback and Statistics ---
Song: Viral Hit 2024 - New Artist (3:30)
After 10,000 total plays: 10,000
...

=== All Demonstrations Completed Successfully! ===
```

## Key Features Demonstrated

### 1. Music Catalog Management

```java
// Create artist
Artist beatles = new Artist(new ArtistId("artist-1"), "The Beatles");

// Create album
Album abbeyRoad = new Album(
    new AlbumId("album-1"), 
    "Abbey Road", 
    beatles.getId(), 
    "The Beatles"
);

// Create song
Song song = new Song(
    new SongId("song-1"),
    "Come Together",
    beatles.getId(),
    "The Beatles",
    abbeyRoad.getId(),
    259,  // duration in seconds
    Genre.ROCK
);

// Add to album
abbeyRoad.addTrack(song);
beatles.addAlbum(abbeyRoad);
```

### 2. Playlist Management

```java
// Create user
User user = new User(
    new UserId("user-1"),
    "john_music_lover",
    "john@example.com",
    SubscriptionTier.PREMIUM
);

// Create playlist
Playlist playlist = new Playlist(
    new PlaylistId("playlist-1"),
    "My Favorites",
    user.getId()
);

// Add songs
playlist.addSong(song1);
playlist.addSong(song2);
playlist.addSong(song3);

// Make public
playlist.setPublic(true);

// Add to user
user.addPlaylist(playlist);
```

### 3. User Interactions

```java
// Like songs
user.likeSong(songId);

// Follow artists
user.followArtist(artistId);
artist.follow();

// Check stats
System.out.println("Liked songs: " + user.getLikedSongs().size());
System.out.println("Following: " + user.getFollowedArtists().size());
```

### 4. Playback and Statistics

```java
// Play song (increments play count)
song.play();

// Check popularity
System.out.println("Play count: " + song.getPlayCount());

// Get duration
System.out.println("Duration: " + song.getDurationSeconds() + " seconds");
```

### 5. Album Operations

```java
// Get all tracks
List<Song> tracks = album.getTracks();

// Calculate total duration
int totalDuration = album.getTotalDuration();

// Display album info
System.out.println(album);  // "Abbey Road by The Beatles (3 tracks)"
```

## Core Design Patterns

### 1. Type-Safe Identifiers

Instead of using raw `String` IDs, we use strongly-typed wrappers:

```java
// ❌ Bad: Prone to errors
String userId = "user-1";
String songId = "song-1";
// Can accidentally swap these!

// ✅ Good: Type-safe
UserId userId = new UserId("user-1");
SongId songId = new SongId("song-1");
// Compile-time error if swapped!
```

### 2. Aggregate Roots

**Playlist** and **User** are aggregate roots that maintain consistency:

```java
public class Playlist {
    // Only Playlist can modify its songs
    private final List<Song> songs;
    
    public void addSong(Song song) {
        songs.add(song);
        this.updatedAt = LocalDateTime.now();  // Maintains consistency
    }
}
```

### 3. Immutable Collections

Return unmodifiable views to prevent external modification:

```java
public List<Song> getSongs() {
    return Collections.unmodifiableList(songs);
}
```

### 4. Encapsulation

Business logic is encapsulated within entities:

```java
public class Artist {
    private int followerCount;
    
    public void follow() {
        followerCount++;
    }
    
    public void unfollow() {
        if (followerCount > 0) followerCount--;
    }
}
```

## Invariants and Validations

### Song Invariants
- Title must not be empty
- Duration must be positive
- Artist and album are required

### Playlist Invariants
- Name must be 1-100 characters
- Owner cannot be null
- Updates automatically track timestamp

### Artist Invariants
- Name must be unique and non-empty
- Follower count cannot go negative

## Extensions for Real Systems

### 1. Service Layer
Create dedicated services:
- `MusicLibrary`: Catalog search and retrieval
- `PlaylistService`: Playlist CRUD operations
- `PlaybackService`: Playback session management

### 2. Playback Queue
Implement queue with:
- Shuffle support (Fisher-Yates algorithm)
- Repeat modes (NONE, ONE, ALL)
- Next/previous navigation

### 3. Search
Add indexing for fast search:
```java
Map<String, Set<SongId>> songTitleIndex;
Map<Genre, Set<SongId>> genreIndex;
```

### 4. Recommendations
- Collaborative filtering
- Content-based recommendations
- Listening history analysis

### 5. Persistence
- Database storage (PostgreSQL)
- Caching layer (Redis)
- CDN for audio files

### 6. Concurrency
- Thread-safe collections (`ConcurrentHashMap`)
- Optimistic locking for playlist updates
- Distributed locks for collaborative playlists

## Testing

### Unit Tests
Test individual entities:
```java
@Test
public void testSongPlayIncrementsCount() {
    Song song = createTestSong();
    assertEquals(0, song.getPlayCount());
    
    song.play();
    assertEquals(1, song.getPlayCount());
}
```

### Integration Tests
Test workflows:
```java
@Test
public void testCreatePlaylistAndAddSongs() {
    User user = createTestUser();
    Playlist playlist = new Playlist(...);
    
    playlist.addSong(song1);
    playlist.addSong(song2);
    
    assertEquals(2, playlist.getSongs().size());
}
```

## Common Use Cases

### Use Case 1: Play an Album
```java
// Get album
Album album = musicLibrary.getAlbum(albumId);

// Play all tracks
for (Song song : album.getTracks()) {
    playbackService.play(song);
}
```

### Use Case 2: Create "Liked Songs" Playlist
```java
User user = getUser(userId);
Playlist likedSongs = new Playlist(
    new PlaylistId("liked-" + userId.getValue()),
    "Liked Songs",
    userId
);

for (SongId songId : user.getLikedSongs()) {
    Song song = musicLibrary.getSong(songId);
    likedSongs.addSong(song);
}
```

### Use Case 3: Top Songs by Genre
```java
Genre targetGenre = Genre.ROCK;
List<Song> allSongs = musicLibrary.getAllSongs();

List<Song> topRockSongs = allSongs.stream()
    .filter(s -> s.getGenre() == targetGenre)
    .sorted((a, b) -> Long.compare(b.getPlayCount(), a.getPlayCount()))
    .limit(50)
    .collect(Collectors.toList());
```

## Performance Characteristics

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Create song/album/artist | O(1) | O(1) |
| Add song to playlist | O(1) | O(1) |
| Play song | O(1) | O(1) |
| Follow artist | O(1) | O(1) |
| Get album tracks | O(1) | O(n) tracks |
| Search songs (naive) | O(n) | O(1) |
| Search songs (indexed) | O(1) | O(n) index |

## References

- [Full Documentation](README.md)
- [Spotify Engineering Blog](https://engineering.atspotify.com/)
- [Designing Data-Intensive Applications](https://dataintensive.net/)

## Next Steps

1. ✅ Run the demo
2. ✅ Review the model classes
3. ⬜ Implement PlaybackService
4. ⬜ Add search functionality
5. ⬜ Implement recommendations
6. ⬜ Add persistence layer
7. ⬜ Write comprehensive tests

---

**Ready to explore?** Run the demo and see the music streaming service in action!



