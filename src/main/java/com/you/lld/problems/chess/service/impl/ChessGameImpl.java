package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.service.AbstractChessGame;

public class ChessGameImpl extends AbstractChessGame {
    @Override
    protected void onCheck(Color playerInCheck) {
        System.out.println(playerInCheck + " is in check!");
    }

    @Override
    protected void onCheckmate(Color playerInCheck) {
        String winner = playerInCheck == Color.WHITE ? "Black" : "White";
        System.out.println("Checkmate! " + winner + " wins!");
    }
}
