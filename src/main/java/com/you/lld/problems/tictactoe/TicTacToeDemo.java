package com.you.lld.problems.tictactoe;

import com.you.lld.problems.tictactoe.model.MoveResult;

public class TicTacToeDemo {

    public static void main(String[] args) {
        System.out.println("=== Tic Tac Toe Demo ===\n");

        System.out.println("--- Scenario 1: X wins (top row) ---");
        TicTacToe g1 = new TicTacToe();
        g1.start();
        play(g1, "a1");
        play(g1, "b1");
        play(g1, "a2");
        play(g1, "b2");
        play(g1, "a3");
        System.out.println("Phase: " + g1.getPhase() + "\n");

        System.out.println("--- Scenario 2: Draw ---");
        TicTacToe g2 = new TicTacToe();
        g2.start();
        play(g2, "a1");
        play(g2, "a2");
        play(g2, "a3");
        play(g2, "b2");
        play(g2, "b1");
        play(g2, "c1");
        play(g2, "b3");
        play(g2, "c3");
        play(g2, "c2");
        System.out.println("Phase: " + g2.getPhase() + "\n");

        System.out.println("--- Scenario 3: Command undo ---");
        TicTacToe g3 = new TicTacToe();
        g3.start();
        play(g3, "b2");
        play(g3, "a1");
        System.out.println("Moves: " + g3.getMoveCount());
        g3.undo();
        System.out.println("After undo: " + g3.getMoveCount() + " moves, current=" + g3.getCurrentPlayer());

        System.out.println("\n--- Scenario 4: Invalid move ---");
        TicTacToe g4 = new TicTacToe();
        g4.start();
        play(g4, "b2");
        play(g4, "b2");

        System.out.println("\n--- Scenario 5: Move on finished game ---");
        TicTacToe g5 = new TicTacToe();
        g5.start();
        play(g5, "a1");
        play(g5, "b1");
        play(g5, "a2");
        play(g5, "b2");
        play(g5, "a3");
        play(g5, "c1");

        System.out.println("\n=== Demo complete ===");
    }

    private static void play(TicTacToe game, String notation) {
        MoveResult result = game.makeMove(notation);
        System.out.println("  " + notation + " -> " + result.getMessage());
    }
}
