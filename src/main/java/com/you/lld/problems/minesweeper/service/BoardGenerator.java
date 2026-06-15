package com.you.lld.problems.minesweeper.service;

import com.you.lld.problems.minesweeper.model.Board;

public interface BoardGenerator {

    void placeMines(Board board, int safeRow, int safeCol);
}
