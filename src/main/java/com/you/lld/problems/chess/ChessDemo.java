package com.you.lld.problems.chess;

import com.you.lld.problems.chess.model.Position;

/**
 * Demo: Strategy per piece, immutable board, template game flow.
 */
public class ChessDemo {

    public static void main(String[] args) {
        System.out.println("=== Chess Game Demo ===\n");

        Chess chess = new Chess();

        System.out.println("--- Scenario 1: Opening moves ---");
        move(chess, 6, 4, 4, 4);
        move(chess, 1, 4, 3, 4);
        move(chess, 7, 1, 5, 2);
        move(chess, 0, 1, 2, 2);

        System.out.println("\n--- Scenario 2: Turn enforcement ---");
        System.out.println("Current player: " + chess.currentPlayer());
        boolean wrongTurn = chess.move(new Position(1, 0), new Position(2, 0));
        System.out.println("Black moves on white turn: " + (wrongTurn ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 3: Valid pawn advance ---");
        boolean pawnOk = chess.move(new Position(6, 0), new Position(5, 0));
        System.out.println("White pawn a2->a3: " + (pawnOk ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 4: Self-capture blocked ---");
        boolean selfCapture = chess.move(new Position(0, 0), new Position(0, 1));
        System.out.println("Rook captures own knight: " + (selfCapture ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 5: Development + queen out ---");
        move(chess, 1, 0, 2, 0);
        move(chess, 7, 3, 3, 7);
        move(chess, 1, 3, 2, 3);

        System.out.println("Current player: " + chess.currentPlayer());
        System.out.println("Game over: " + chess.isGameOver());
        System.out.println("\n=== Demo complete ===");
    }

    private static void move(Chess chess, int r1, int c1, int r2, int c2) {
        Position from = new Position(r1, c1);
        Position to = new Position(r2, c2);
        if (!chess.move(from, to)) {
            System.out.println("REJECTED: " + from + " -> " + to);
        }
    }
}
