package com.you.lld.problems.tictactoe.model;

public final class Move {

    private final Player player;
    private final Position position;

    public Move(Player player, Position position) {
        this.player = player;
        this.position = position;
    }

    public Player getPlayer() {
        return player;
    }

    public Position getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return player + " at " + position;
    }
}
