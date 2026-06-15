package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.PieceType;
import com.you.lld.problems.chess.service.MoveStrategy;

import java.util.EnumMap;
import java.util.Map;

public final class MoveStrategyFactory {
    private static final Map<PieceType, MoveStrategy> STRATEGIES = new EnumMap<PieceType, MoveStrategy>(PieceType.class);

    static {
        STRATEGIES.put(PieceType.PAWN, new PawnMoveStrategy());
        STRATEGIES.put(PieceType.ROOK, new RookMoveStrategy());
        STRATEGIES.put(PieceType.KNIGHT, new KnightMoveStrategy());
        STRATEGIES.put(PieceType.BISHOP, new BishopMoveStrategy());
        STRATEGIES.put(PieceType.QUEEN, new QueenMoveStrategy());
        STRATEGIES.put(PieceType.KING, new KingMoveStrategy());
    }

    private MoveStrategyFactory() {
    }

    public static MoveStrategy forType(PieceType type) {
        MoveStrategy strategy = STRATEGIES.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("No strategy for " + type);
        }
        return strategy;
    }
}
