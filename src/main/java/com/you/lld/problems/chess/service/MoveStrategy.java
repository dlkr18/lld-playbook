package com.you.lld.problems.chess.service;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;

/** Strategy — piece-specific movement rules. */
public interface MoveStrategy {
    boolean canMove(Board board, Position from, Position to);
}
