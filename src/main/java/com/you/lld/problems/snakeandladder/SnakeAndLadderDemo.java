package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.builder.BoardBuilder;
import com.you.lld.problems.snakeandladder.observer.LoggingGameEventListener;
import com.you.lld.problems.snakeandladder.service.impl.FixedDiceStrategy;
import com.you.lld.problems.snakeandladder.service.impl.RandomDiceStrategy;

public class SnakeAndLadderDemo {

    public static void main(String[] args) {
        System.out.println("=== Snake and Ladder Demo ===\n");

        System.out.println("--- Scenario 1: Standard board (random dice) ---");
        SnakeAndLadder game1 = SnakeAndLadder.builder()
            .standardBoard()
            .players("Alice", "Bob")
            .dice(new RandomDiceStrategy(6))
            .build();
        int turn = 0;
        while (!game1.isGameOver() && turn < 25) {
            System.out.println("Turn " + (++turn) + ": " + game1.playTurn());
        }
        if (game1.isGameOver()) {
            System.out.println("Winner: " + game1.getWinner().getName());
        } else {
            System.out.println("(stopped after 25 turns for demo brevity)");
        }

        System.out.println("\n--- Scenario 2: Fixed dice — ladder climb ---");
        SnakeAndLadder game2 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(20)
                .addLadder(2, 10)
                .addSnake(15, 5)
                .build())
            .players("Carol", "Dave")
            .dice(new FixedDiceStrategy(2, 3, 4, 5))
            .build();
        for (int i = 0; i < 4; i++) {
            System.out.println(game2.playTurn());
        }

        System.out.println("\n--- Scenario 3: Overshoot rule ---");
        SnakeAndLadder game3 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(10).build())
            .players("Eve", "Frank")
            .dice(new FixedDiceStrategy(9, 3))
            .build();
        System.out.println(game3.playTurn());
        System.out.println(game3.playTurn());

        System.out.println("\n--- Scenario 4: Observer events ---");
        SnakeAndLadder game4 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(15)
                .addSnake(12, 3)
                .addLadder(5, 11)
                .build())
            .players("Grace", "Henry")
            .dice(new FixedDiceStrategy(5, 1))
            .listener(new LoggingGameEventListener())
            .build();
        game4.playTurn();
        game4.playTurn();

        System.out.println("\n--- Scenario 5: Win on exact landing ---");
        SnakeAndLadder game5 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(6).build())
            .players("Ivy", "Jack")
            .dice(new FixedDiceStrategy(6))
            .build();
        System.out.println(game5.playTurn());
        System.out.println("Game over: " + game5.isGameOver());

        System.out.println("\n=== Demo complete ===");
    }
}
