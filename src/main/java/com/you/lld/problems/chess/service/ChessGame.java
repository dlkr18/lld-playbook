package com.you.lld.problems.chess.service;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Position;

public interface ChessGame {
    boolean makeMove(Position from, Position to);
    boolean isValidMove(Position from, Position to);
    Color getCurrentPlayer();
    boolean isGameOver();
    Board getBoard();
}
