package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.GameResult;
import com.you.lld.problems.snakeandladder.model.GameStats;
import com.you.lld.problems.snakeandladder.model.Player;
import com.you.lld.problems.snakeandladder.observer.GameEvent;
import com.you.lld.problems.snakeandladder.observer.GameEventListener;
import com.you.lld.problems.snakeandladder.observer.GameEventType;
import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SnakeAndLadderGame {

    private final Board board;
    private final List<Player> players;
    private final DiceStrategy dice;
    private final GameStats stats;
    private final List<GameEventListener> listeners;

    private int currentPlayerIndex;
    private boolean gameOver;
    private Player winner;

    public SnakeAndLadderGame(Board board, List<Player> players, DiceStrategy dice) {
        this(board, players, dice, new CopyOnWriteArrayList<GameEventListener>());
    }

    public SnakeAndLadderGame(Board board, List<Player> players, DiceStrategy dice,
                              List<GameEventListener> listeners) {
        if (players == null || players.size() < 2) {
            throw new IllegalArgumentException("Need at least 2 players");
        }
        this.board = board;
        this.players = new ArrayList<>(players);
        this.dice = dice;
        this.stats = new GameStats();
        this.listeners = listeners;
        this.currentPlayerIndex = 0;
    }

    public void addListener(GameEventListener listener) {
        listeners.add(listener);
    }

    public synchronized String playTurn() {
        if (gameOver) {
            return "Game over. Winner: " + winner.getName();
        }

        Player player = players.get(currentPlayerIndex);
        int roll = dice.roll();
        stats.recordRoll();

        int oldPos = player.getPosition();
        int target = oldPos + roll;
        StringBuilder log = new StringBuilder();
        log.append(player.getName()).append(" rolled ").append(roll);

        if (target > board.getSize()) {
            log.append(" -> stays at ").append(oldPos).append(" (overshoot)");
            fire(new GameEvent(GameEventType.OVERSHOOT, player, log.toString()));
            advanceTurn();
            return log.toString();
        }

        player.setPosition(target);
        log.append(" -> ").append(oldPos).append(" to ").append(target);

        int resolved = resolveWithEvents(player, target, log);
        player.setPosition(resolved);

        if (resolved == board.getSize()) {
            gameOver = true;
            winner = player;
            log.append(" *** WINS ***");
            fire(new GameEvent(GameEventType.GAME_WON, player, log.toString()));
            return log.toString();
        }

        fire(new GameEvent(GameEventType.TURN_PLAYED, player, log.toString()));
        advanceTurn();
        return log.toString();
    }

    public GameResult playUntilWin() {
        int moves = 0;
        while (!gameOver) {
            playTurn();
            moves++;
            if (moves > 10_000) {
                throw new IllegalStateException("Game exceeded move limit");
            }
        }
        return new GameResult(winner, moves);
    }

    private int resolveWithEvents(Player player, int position, StringBuilder log) {
        int hops = 20;
        while (hops-- > 0) {
            if (board.isSnakeHead(position)) {
                int dest = board.snakeDestination(position);
                log.append(" [SNAKE ").append(position).append("->").append(dest).append("]");
                stats.recordSnakeHit();
                fire(new GameEvent(GameEventType.SNAKE_HIT, player, player.getName() + " hit snake at " + position));
                position = dest;
            } else if (board.isLadderBottom(position)) {
                int dest = board.ladderDestination(position);
                log.append(" [LADDER ").append(position).append("->").append(dest).append("]");
                stats.recordLadderHit();
                fire(new GameEvent(GameEventType.LADDER_HIT, player, player.getName() + " climbed ladder at " + position));
                position = dest;
            } else {
                break;
            }
        }
        return position;
    }

    private void fire(GameEvent event) {
        for (GameEventListener listener : listeners) {
            listener.onEvent(event);
        }
    }

    private void advanceTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public Player getWinner() {
        return winner;
    }

    public Player getCurrentPlayer() {
        return players.get(currentPlayerIndex);
    }

    public List<Player> getPlayers() {
        return Collections.unmodifiableList(players);
    }

    public GameStats getStats() {
        return stats;
    }
}
