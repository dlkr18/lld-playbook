package com.you.lld.problems.chess.impl;

import com.you.lld.problems.chess.api.ChessGame;
import com.you.lld.problems.chess.model.*;

public class ChessGameImpl implements ChessGame {
    private final Board board;
    private Color currentPlayer;
    private boolean gameOver;
    
    public ChessGameImpl() {
        this.board = new Board();
        this.board.initialize();
        this.currentPlayer = Color.WHITE;
        this.gameOver = false;
    }
    
    @Override
    public boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }
        
        board.movePiece(from, to);
        currentPlayer = (currentPlayer == Color.WHITE) ? Color.BLACK : Color.WHITE;
        System.out.println("Move: " + from + " -> " + to);
        return true;
    }
    
    @Override
    public boolean isValidMove(Position from, Position to) {
        if (!from.isValid() || !to.isValid()) {
            return false;
        }
        
        Piece piece = board.getPiece(from);
        if (piece == null || piece.getColor() != currentPlayer) {
            return false;
        }
        
        Piece target = board.getPiece(to);
        if (target != null && target.getColor() == currentPlayer) {
            return false;
        }
        
        // Simplified validation (real chess would need move validation per piece type)
        return true;
    }
    
    @Override
    public Color getCurrentPlayer() {
        return currentPlayer;
    }
    
    @Override
    public boolean isGameOver() {
        return gameOver;
    }
}
