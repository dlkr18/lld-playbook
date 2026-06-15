package com.you.lld.problems.tictactoe.model;

public enum Player {
    X('X'),
    O('O');

    private final char symbol;

    Player(char symbol) {
        this.symbol = symbol;
    }

    public char getSymbol() {
        return symbol;
    }

    public Player opponent() {
        return this == X ? O : X;
    }
}
