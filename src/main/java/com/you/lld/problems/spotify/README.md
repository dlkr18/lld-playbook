# Spotify — LLD

Design music streaming: catalog, playlists, playback queue with shuffle/repeat.

## Package Structure

```
spotify/
  model/          Song, Album, Artist, Playlist, PlaybackQueue, PlaybackSession
  service/impl/   PlaybackService
  Spotify.java    Facade
  SpotifyDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `Spotify` | Thin wrapper over playback for interview demos. |
| **State** | `PlaybackState` (PLAYING/PAUSED) on session | Guard pause/resume/next operations. |
| **Strategy-like queue** | Shuffle/repeat modes on `PlaybackQueue` | Encapsulate next-track logic. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.spotify.SpotifyDemo"
```

## Key Talking Points

- **Per-user PlaybackSession** in ConcurrentHashMap — thread-safe multi-user.
- **Repeat ONE vs ALL** — index behavior differs at queue end.
- **Shuffle** reshuffles remaining queue without losing current track.
