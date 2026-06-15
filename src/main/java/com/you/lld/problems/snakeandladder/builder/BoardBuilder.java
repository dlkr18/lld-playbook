package com.you.lld.problems.snakeandladder.builder;

import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.Ladder;
import com.you.lld.problems.snakeandladder.model.Snake;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BoardBuilder {

    private int boardSize = 100;
    private final List<Snake> snakes = new ArrayList<>();
    private final List<Ladder> ladders = new ArrayList<>();

    public BoardBuilder size(int boardSize) {
        this.boardSize = boardSize;
        return this;
    }

    public BoardBuilder addSnake(int head, int tail) {
        snakes.add(new Snake(head, tail));
        return this;
    }

    public BoardBuilder addLadder(int bottom, int top) {
        ladders.add(new Ladder(bottom, top));
        return this;
    }

    public BoardBuilder standardLayout() {
        addSnake(99, 10).addSnake(65, 25).addSnake(45, 7).addSnake(52, 11).addSnake(88, 36);
        addLadder(2, 38).addLadder(7, 14).addLadder(15, 31).addLadder(28, 84);
        addLadder(51, 67).addLadder(71, 91);
        return this;
    }

    public Board build() {
        Map<Integer, Integer> snakeMap = new HashMap<>();
        for (Snake snake : snakes) {
            if (snake.getHead() > boardSize || snakeMap.containsKey(snake.getHead())) {
                throw new IllegalArgumentException("Invalid snake: " + snake);
            }
            snakeMap.put(snake.getHead(), snake.getTail());
        }
        Map<Integer, Integer> ladderMap = new HashMap<>();
        for (Ladder ladder : ladders) {
            if (ladder.getTop() > boardSize || ladderMap.containsKey(ladder.getBottom())) {
                throw new IllegalArgumentException("Invalid ladder: " + ladder);
            }
            ladderMap.put(ladder.getBottom(), ladder.getTop());
        }
        return new Board(boardSize, snakeMap, ladderMap);
    }
}
