package com.you.lld.problems.chess.api;

import com.you.lld.problems.chess.model.*;

public interface ChessGame {
    boolean makeMove(Position from, Position to);
    boolean isValidMove(Position from, Position to);
    Color getCurrentPlayer();
    boolean isGameOver();
}
