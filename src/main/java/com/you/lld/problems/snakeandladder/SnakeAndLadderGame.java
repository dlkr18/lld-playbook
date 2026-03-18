package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.*;
import com.you.lld.problems.snakeandladder.stats.GameStats;

import java.util.*;

/**
 * Core game engine for Snake and Ladder.
 *
 * Hard problems handled:
 *  - Configurable board (size, snakes, ladders)
 *  - Exact landing on last cell to win (overshoot = stay)
 *  - Snake/ladder chain detection (land on ladder top which is a snake head)
 *  - Turn rotation, game-over detection
 *  - Stats tracking (rolls, snake/ladder hits per player)
 */
public class SnakeAndLadderGame {

    private final int boardSize;
    private final Map<Integer, Integer> snakeMap;   // head -> tail
    private final Map<Integer, Integer> ladderMap;  // bottom -> top
    private final List<Player> players;
    private final Dice dice;
    private final GameStats stats;

    private int currentPlayerIndex;
    private boolean gameOver;
    private Player winner;

    public SnakeAndLadderGame(int boardSize, List<Snake> snakes, List<Ladder> ladders,
                              List<Player> players, int diceSides) {
        if (players == null || players.size() < 2) {
            throw new IllegalArgumentException("Need at least 2 players");
        }
        this.boardSize = boardSize;
        this.players = new ArrayList<>(players);
        this.dice = new Dice(diceSides);
        this.stats = new GameStats();
        this.currentPlayerIndex = 0;
        this.gameOver = false;

        // Build lookup maps
        this.snakeMap = new HashMap<>();
        for (Snake s : snakes) {
            if (snakeMap.containsKey(s.getHead()) || s.getHead() > boardSize) {
                throw new IllegalArgumentException("Invalid snake: " + s);
            }
            snakeMap.put(s.getHead(), s.getTail());
        }
        this.ladderMap = new HashMap<>();
        for (Ladder l : ladders) {
            if (ladderMap.containsKey(l.getBottom()) || l.getTop() > boardSize) {
                throw new IllegalArgumentException("Invalid ladder: " + l);
            }
            ladderMap.put(l.getBottom(), l.getTop());
        }
    }

    /** Play one turn for the current player. Returns description of what happened. Thread-safe. */
    public synchronized String playTurn() {
        if (gameOver) {
            return "Game is already over. Winner: " + winner.getName();
        }

        Player player = players.get(currentPlayerIndex);
        int roll = dice.roll();
        stats.recordRoll(roll);

        int oldPos = player.getPosition();
        int newPos = oldPos + roll;

        StringBuilder log = new StringBuilder();
        log.append(player.getName()).append(" rolled ").append(roll);

        // Overshoot: must land exactly on boardSize
        if (newPos > boardSize) {
            log.append(" -> stays at ").append(oldPos).append(" (overshoot)");
            advanceTurn();
            return log.toString();
        }

        player.setPosition(newPos);
        log.append(" -> moves ").append(oldPos).append("->").append(newPos);

        // Resolve snakes and ladders (chain: land on ladder that leads to snake, etc.)
        newPos = resolvePosition(newPos, log);
        player.setPosition(newPos);

        // Win check
        if (newPos == boardSize) {
            gameOver = true;
            winner = player;
            log.append(" *** ").append(player.getName()).append(" WINS! ***");
            return log.toString();
        }

        advanceTurn();
        return log.toString();
    }

    /** Play the entire game until someone wins. Returns GameResult. */
    public GameResult playFull() {
        int moves = 0;
        while (!gameOver) {
            playTurn();
            moves++;
            if (moves > 10_000) {
                throw new RuntimeException("Game exceeded 10000 moves, likely infinite loop");
            }
        }
        return new GameResult(winner, moves);
    }

    // --- Getters ---

    public boolean isGameOver()         { return gameOver; }
    public Player getWinner()           { return winner; }
    public Player getCurrentPlayer()    { return players.get(currentPlayerIndex); }
    public List<Player> getPlayers()    { return Collections.unmodifiableList(players); }
    public GameStats getStats()         { return stats; }

    // --- Internals ---

    private int resolvePosition(int pos, StringBuilder log) {
        // Keep resolving until no more snakes or ladders
        int maxChain = 20; // safety
        while (maxChain-- > 0) {
            if (snakeMap.containsKey(pos)) {
                int dest = snakeMap.get(pos);
                log.append(" [SNAKE ").append(pos).append("->").append(dest).append("]");
                stats.recordSnakeHit();
                pos = dest;
            } else if (ladderMap.containsKey(pos)) {
                int dest = ladderMap.get(pos);
                log.append(" [LADDER ").append(pos).append("->").append(dest).append("]");
                stats.recordLadderHit();
                pos = dest;
            } else {
                break;
            }
        }
        return pos;
    }

    private void advanceTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    }
}
