package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.*;

public class MinesweeperDemo {
    public static void main(String[] args) {
        System.out.println("💣 Minesweeper Game Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        
        Board board = new Board(5, 5, 5);
        
        System.out.println("\nInitial board:");
        board.print();
        
        System.out.println("\nRevealing cell (0,0):");
        board.revealCell(0, 0);
        board.print();
        
        System.out.println("\nRevealing cell (2,2):");
        board.revealCell(2, 2);
        board.print();
        
        System.out.println("\nGame Status: " + board.getStatus());
        System.out.println("\n✅ Demo complete!");
    }
}
