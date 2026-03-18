package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.*;

import java.util.Arrays;
import java.util.List;

/**
 * Demo: configurable Snake and Ladder game.
 */
public class SnakeAndLadderDemo {

    public static void main(String[] args) {
        System.out.println("=== Snake and Ladder Demo ===\n");

        List<Snake> snakes = Arrays.asList(
            new Snake(99, 10),
            new Snake(65, 25),
            new Snake(45, 7),
            new Snake(52, 11),
            new Snake(88, 36)
        );

        List<Ladder> ladders = Arrays.asList(
            new Ladder(2, 38),
            new Ladder(7, 14),
            new Ladder(15, 31),
            new Ladder(28, 84),
            new Ladder(51, 67),
            new Ladder(71, 91)
        );

        List<Player> players = Arrays.asList(
            new Player("Alice"),
            new Player("Bob")
        );

        SnakeAndLadderGame game = new SnakeAndLadderGame(
            100, snakes, ladders, players, 6
        );

        System.out.println("Board: 100 cells, " + snakes.size() + " snakes, "
            + ladders.size() + " ladders, 2 players\n");

        // Play turn by turn, printing first 30 turns then skip to end
        int turn = 0;
        while (!game.isGameOver()) {
            String log = game.playTurn();
            turn++;
            if (turn <= 30) {
                System.out.println("Turn " + turn + ": " + log);
            }
        }

        if (turn > 30) {
            System.out.println("... (skipped " + (turn - 30) + " turns) ...");
        }

        System.out.println("\nResult: " + game.getWinner().getName() + " wins in " + turn + " turns!");
        System.out.println("Stats: " + game.getStats());

        System.out.println("\nFinal positions:");
        for (Player p : game.getPlayers()) {
            System.out.println("  " + p.getName() + " -> " + p.getPosition());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
