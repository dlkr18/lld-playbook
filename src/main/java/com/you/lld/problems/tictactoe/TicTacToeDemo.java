package com.you.lld.problems.tictactoe;

/**
 * Demo: TicTacToe with moves, undo, win/draw detection.
 */
public class TicTacToeDemo {

    public static void main(String[] args) {
        System.out.println("=== Tic Tac Toe Demo ===\n");

        // Game 1: X wins
        System.out.println("--- Game 1: X wins with top row ---");
        TicTacToeGame g1 = new TicTacToeGame();
        g1.start();
        play(g1, "a1"); // X top-left
        play(g1, "b1"); // O mid-left
        play(g1, "a2"); // X top-center
        play(g1, "b2"); // O mid-center
        play(g1, "a3"); // X top-right -> wins
        System.out.println("State: " + g1.getState() + "\n");

        // Game 2: Draw
        System.out.println("--- Game 2: Draw ---");
        TicTacToeGame g2 = new TicTacToeGame();
        g2.start();
        play(g2, "a1"); // X
        play(g2, "a2"); // O
        play(g2, "a3"); // X
        play(g2, "b2"); // O
        play(g2, "b1"); // X
        play(g2, "c1"); // O
        play(g2, "b3"); // X
        play(g2, "c3"); // O
        play(g2, "c2"); // X
        System.out.println("State: " + g2.getState() + "\n");

        // Game 3: Undo
        System.out.println("--- Game 3: Undo feature ---");
        TicTacToeGame g3 = new TicTacToeGame();
        g3.start();
        play(g3, "b2"); // X center
        play(g3, "a1"); // O top-left
        System.out.println("Moves so far: " + g3.getMoveHistory().size());
        g3.undo();
        System.out.println("After undo: " + g3.getMoveHistory().size() + " moves");
        System.out.println("Current player: " + g3.getCurrentPlayer());

        // Game 4: Invalid move
        System.out.println("\n--- Game 4: Error handling ---");
        TicTacToeGame g4 = new TicTacToeGame();
        g4.start();
        play(g4, "b2"); // X center
        play(g4, "b2"); // O tries same cell -> error

        System.out.println("\n=== Demo complete ===");
    }

    private static void play(TicTacToeGame game, String notation) {
        MoveResult result = game.makeMove(notation);
        System.out.println("  " + notation + " -> " + result.getMessage());
    }
}
