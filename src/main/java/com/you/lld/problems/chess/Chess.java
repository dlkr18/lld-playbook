package com.you.lld.problems.chess;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.ChessGame;
import com.you.lld.problems.chess.service.impl.ChessGameImpl;

/** Facade — interview entry point for the chess game. */
public final class Chess {
    private final ChessGame game;

    public Chess() {
        this(new ChessGameImpl());
    }

    public Chess(ChessGame game) {
        this.game = game;
    }

    public boolean move(Position from, Position to) {
        return game.makeMove(from, to);
    }

    public boolean isValidMove(Position from, Position to) {
        return game.isValidMove(from, to);
    }

    public Color currentPlayer() {
        return game.getCurrentPlayer();
    }

    public boolean isGameOver() {
        return game.isGameOver();
    }

    public Board board() {
        return game.getBoard();
    }
}
