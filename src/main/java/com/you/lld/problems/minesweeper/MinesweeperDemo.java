package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.Difficulty;
import com.you.lld.problems.minesweeper.model.GameStatus;

public class MinesweeperDemo {

    public static void main(String[] args) {
        System.out.println("=== Minesweeper Demo ===\n");
        demoBfsCascade();
        demoFlagBlocksReveal();
        demoHitMine();
        demoWin();
        demoDifficultyPreset();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoBfsCascade() {
        System.out.println("--- 1. BFS cascade on zero region ---");
        Minesweeper game = new Minesweeper(5, 5, 3);
        game.reveal(0, 0);
        System.out.println("  status=" + game.getStatus());
        game.getBoard().print();
    }

    private static void demoFlagBlocksReveal() {
        System.out.println("\n--- 2. Flag blocks reveal ---");
        Minesweeper game = new Minesweeper(4, 4, 2);
        game.reveal(0, 0);
        game.toggleFlag(0, 1);
        System.out.println("  flagged (0,1): " + game.getBoard().getCell(0, 1).isFlagged());
        game.reveal(0, 1);
        System.out.println("  still hidden: " + !game.getBoard().getCell(0, 1).isRevealed());
    }

    private static void demoHitMine() {
        System.out.println("\n--- 3. Hit mine -> LOST ---");
        Minesweeper game = new Minesweeper(3, 3, 1);
        game.reveal(0, 0);
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                if (game.getBoard().getCell(r, c).isMine()
                        && !game.getBoard().getCell(r, c).isRevealed()) {
                    game.reveal(r, c);
                    System.out.println("  status=" + game.getStatus());
                    return;
                }
            }
        }
    }

    private static void demoWin() {
        System.out.println("\n--- 4. Win when all safe cells revealed ---");
        Minesweeper game = new Minesweeper(2, 2, 1);
        for (int r = 0; r < 2; r++) {
            for (int c = 0; c < 2; c++) {
                if (!game.getBoard().getCell(r, c).isMine()) {
                    game.reveal(r, c);
                }
            }
        }
        // first reveal places mines; re-scan safely
        Minesweeper g2 = new Minesweeper(2, 2, 1);
        g2.reveal(0, 0);
        for (int r = 0; r < 2; r++) {
            for (int c = 0; c < 2; c++) {
                if (!g2.getBoard().getCell(r, c).isMine() && !g2.getBoard().getCell(r, c).isRevealed()) {
                    g2.reveal(r, c);
                }
            }
        }
        System.out.println("  status=" + g2.getStatus());
    }

    private static void demoDifficultyPreset() {
        System.out.println("\n--- 5. Difficulty preset ---");
        Minesweeper game = new Minesweeper(Difficulty.BEGINNER);
        System.out.println("  board=" + game.getBoard().getRows() + "x" + game.getBoard().getCols()
                + ", mines=" + game.getBoard().getMineCount());
        game.reveal(4, 4);
        System.out.println("  status after first click=" + game.getStatus());
    }
}
