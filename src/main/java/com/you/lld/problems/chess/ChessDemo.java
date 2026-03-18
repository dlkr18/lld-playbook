package com.you.lld.problems.chess;

import com.you.lld.problems.chess.impl.ChessGameImpl;
import com.you.lld.problems.chess.model.*;

/**
 * Demo: Chess game exercising piece movement, captures, turn management.
 */
public class ChessDemo {

    public static void main(String[] args) {
        System.out.println("=== Chess Game Demo ===\n");

        ChessGameImpl game = new ChessGameImpl();

        // Opening moves
        System.out.println("--- Opening moves ---");
        move(game, 6, 4, 4, 4); // White pawn e2->e4
        move(game, 1, 4, 3, 4); // Black pawn e7->e5
        move(game, 7, 1, 5, 2); // White knight b1->c3
        move(game, 0, 1, 2, 2); // Black knight b8->c6
        move(game, 7, 5, 4, 2); // White bishop f1->c4
        move(game, 0, 5, 3, 2); // Black bishop f8->c5 (would collide, but simplified validation)

        System.out.println("\n--- Turn checking ---");
        System.out.println("Current player: " + game.getCurrentPlayer());
        System.out.println("Game over: " + game.isGameOver());

        // Invalid move: wrong turn
        System.out.println("\n--- Error handling ---");
        boolean ok1 = game.makeMove(new Position(1, 0), new Position(2, 0)); // Black tries when white turn
        System.out.println("Wrong turn move: " + (ok1 ? "allowed" : "rejected"));

        // Move to empty square
        boolean ok2 = game.makeMove(new Position(6, 0), new Position(5, 0)); // White pawn a2->a3
        System.out.println("Valid white pawn: " + (ok2 ? "allowed" : "rejected"));

        // Self capture attempt
        boolean ok3 = game.makeMove(new Position(0, 0), new Position(0, 1)); // Black rook->knight (self capture)
        System.out.println("Self capture: " + (ok3 ? "allowed" : "rejected"));

        System.out.println("\n--- More moves ---");
        move(game, 1, 0, 2, 0); // Black pawn a7->a6
        move(game, 7, 3, 3, 7); // White queen d1->h5
        move(game, 1, 3, 2, 3); // Black pawn d7->d6

        System.out.println("\nCurrent player: " + game.getCurrentPlayer());
        System.out.println("Game over: " + game.isGameOver());

        System.out.println("\n=== Demo complete ===");
    }

    private static void move(ChessGameImpl game, int r1, int c1, int r2, int c2) {
        Position from = new Position(r1, c1);
        Position to = new Position(r2, c2);
        boolean ok = game.makeMove(from, to);
        if (!ok) {
            System.out.println("REJECTED: " + from + " -> " + to);
        }
    }
}
