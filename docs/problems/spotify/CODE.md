# Spotify - Music Streaming Platform 🎵

Production-ready **music streaming service** with **playlist management**, **recommendations**, **offline mode**, and **social features**. Complete media platform design.

---

## 🎯 **Core Features**

✅ **Music Library** - Songs, albums, artists, genres  
✅ **Playlists** - Create, edit, share, collaborate  
✅ **Playback** - Queue, shuffle, repeat, crossfade  
✅ **Search & Discovery** - Full-text search, recommendations  
✅ **Social** - Follow users, share tracks, collaborative playlists  
✅ **Offline Mode** - Download for offline playback  

---

## 💻 **Implementation Overview**

**Source Code Location**: `src/main/java/com/you/lld/problems/spotify/` (18 Java files)

View complete implementations in your IDE for:
- Song/Album/Artist entities
- Playlist management
- Playback queue and controls
- Search and recommendation engine
- User library and subscriptions

---

## 📚 **System Architecture**

### **1. Content Hierarchy**

```
Artist
 └── Album
      └── Track
           ├── Audio File (multiple qualities)
           ├── Metadata (title, duration, genre)
           └── Lyrics
```

### **2. Playlist Types**

```java
public enum PlaylistType {
    USER_CREATED,      // Personal playlists
    COLLABORATIVE,     // Shared with friends
    SYSTEM_GENERATED,  // Discover Weekly, Release Radar
    RADIO              // Generated from seed
}
```

### **3. Playback Queue**

```java
public class PlaybackQueue {
    private final Deque<Track> queue;
    private Track currentTrack;
    private boolean shuffle;
    private RepeatMode repeatMode;
    
    public void play(Track track) { ... }
    public void next() { ... }
    public void previous() { ... }
    public void shuffle() { ... }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Create & Play Playlist**

```java
SpotifyService spotify = new SpotifyService();

// Create playlist
Playlist workout = spotify.createPlaylist(
    userId,
    "Workout Mix",
    "High energy tracks",
    PlaylistVisibility.PUBLIC
);

// Add tracks
spotify.addToPlaylist(playlistId, Arrays.asList(track1, track2, track3));

// Start playback
spotify.play(playlistId, userId);
```

### **Example 2: Search & Discover**

```java
// Search for tracks
List<Track> tracks = spotify.searchTracks("Bohemian Rhapsody");

// Search by artist
List<Album> albums = spotify.searchByArtist("Queen");

// Get recommendations (collaborative filtering)
List<Track> recommended = spotify.getRecommendations(
    userId,
    Arrays.asList(track1, track2, track3)  // seed tracks
);
```

### **Example 3: Collaborative Playlist**

```java
// Create collaborative playlist
Playlist party = spotify.createPlaylist(
    userId,
    "Party Mix",
    null,
    PlaylistVisibility.COLLABORATIVE
);

// Add collaborators
spotify.addCollaborator(playlistId, friendUserId);

// Friends can now add tracks
spotify.addToPlaylist(playlistId, track, friendUserId);
```

---

## 🎯 **Design Patterns**

- **Decorator**: Add features to playback (shuffle, crossfade)
- **Observer**: Notify followers of new releases
- **Strategy**: Different recommendation algorithms
- **Command**: Playback controls (play, pause, skip)
- **State**: Playback state machine

---

## 🔗 **Related Resources**

- [Day 8: Observer Pattern](week2/day8/README.md)
- [Command Pattern](foundations/DESIGN_PATTERNS_CATALOG.md)

---

**View Full Implementation**: `src/main/java/com/you/lld/problems/spotify/`

---

✨ **Complete music streaming platform with social features!** 🎵

