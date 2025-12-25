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



