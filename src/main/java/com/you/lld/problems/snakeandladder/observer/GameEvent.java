package com.you.lld.problems.snakeandladder.observer;

import com.you.lld.problems.snakeandladder.model.Player;

public final class GameEvent {

    private final GameEventType type;
    private final Player player;
    private final String message;

    public GameEvent(GameEventType type, Player player, String message) {
        this.type = type;
        this.player = player;
        this.message = message;
    }

    public GameEventType getType() {
        return type;
    }

    public Player getPlayer() {
        return player;
    }

    public String getMessage() {
        return message;
    }
}
