package com.you.lld.problems.spotify;

import com.you.lld.problems.spotify.model.Album;
import com.you.lld.problems.spotify.model.PlaybackSession;
import com.you.lld.problems.spotify.model.Playlist;
import com.you.lld.problems.spotify.model.RepeatMode;
import com.you.lld.problems.spotify.model.Song;
import com.you.lld.problems.spotify.model.UserId;
import com.you.lld.problems.spotify.service.impl.PlaybackService;

/** Facade for music streaming — catalog entities + playback queue (Strategy-like queue). */
public class Spotify {
    private final PlaybackService playback;

    public Spotify() {
        this.playback = new PlaybackService();
    }

    public Spotify(PlaybackService playback) {
        this.playback = playback;
    }

    public PlaybackSession playSong(UserId userId, Song song) {
        return playback.playSong(userId, song);
    }

    public PlaybackSession playAlbum(UserId userId, Album album) {
        return playback.playAlbum(userId, album);
    }

    public PlaybackSession playPlaylist(UserId userId, Playlist playlist) {
        return playback.playPlaylist(userId, playlist);
    }

    public void pause(UserId userId) {
        playback.pause(userId);
    }

    public void resume(UserId userId) {
        playback.resume(userId);
    }

    public void next(UserId userId) {
        playback.next(userId);
    }

    public void previous(UserId userId) {
        playback.previous(userId);
    }

    public void setShuffle(UserId userId, boolean enabled) {
        playback.setShuffle(userId, enabled);
    }

    public void setRepeat(UserId userId, RepeatMode mode) {
        playback.setRepeat(userId, mode);
    }

    public PlaybackSession getSession(UserId userId) {
        return playback.getSession(userId);
    }
}
