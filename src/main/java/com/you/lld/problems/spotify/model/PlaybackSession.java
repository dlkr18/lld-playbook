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



