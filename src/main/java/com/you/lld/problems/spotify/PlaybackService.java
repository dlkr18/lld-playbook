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



