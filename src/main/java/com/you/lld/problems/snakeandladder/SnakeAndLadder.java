package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.builder.BoardBuilder;
import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.Player;
import com.you.lld.problems.snakeandladder.observer.GameEventListener;
import com.you.lld.problems.snakeandladder.service.DiceStrategy;
import com.you.lld.problems.snakeandladder.service.impl.RandomDiceStrategy;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Facade — builds board + game from fluent API. */
public class SnakeAndLadder {

    private final SnakeAndLadderGame game;

    private SnakeAndLadder(SnakeAndLadderGame game) {
        this.game = game;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String playTurn() {
        return game.playTurn();
    }

    public boolean isGameOver() {
        return game.isGameOver();
    }

    public Player getWinner() {
        return game.getWinner();
    }

    public SnakeAndLadderGame unwrap() {
        return game;
    }

    public static final class Builder {
        private Board board;
        private List<Player> players = new ArrayList<>();
        private DiceStrategy dice = new RandomDiceStrategy(6);
        private final List<GameEventListener> listeners = new ArrayList<>();

        public Builder board(Board board) {
            this.board = board;
            return this;
        }

        public Builder standardBoard() {
            this.board = new BoardBuilder().standardLayout().build();
            return this;
        }

        public Builder players(String... names) {
            players.clear();
            for (String name : names) {
                players.add(new Player(name));
            }
            return this;
        }

        public Builder dice(DiceStrategy dice) {
            this.dice = dice;
            return this;
        }

        public Builder listener(GameEventListener listener) {
            listeners.add(listener);
            return this;
        }

        public SnakeAndLadder build() {
            if (board == null) {
                board = new BoardBuilder().standardLayout().build();
            }
            if (players.size() < 2) {
                players = Arrays.asList(new Player("Alice"), new Player("Bob"));
            }
            SnakeAndLadderGame g = new SnakeAndLadderGame(board, players, dice, listeners);
            return new SnakeAndLadder(g);
        }
    }
}
