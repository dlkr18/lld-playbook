# chess - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/chess/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py chess`.

## Project Structure (19 files)

```
chess/
├── ChessDemo.java
├── Chess.java
├── model/Board.java
├── model/Color.java
├── model/Piece.java
├── model/PieceType.java
├── model/Position.java
├── service/AbstractChessGame.java
├── service/ChessGame.java
├── service/MoveStrategy.java
├── service/impl/BishopMoveStrategy.java
├── service/impl/ChessGameImpl.java
├── service/impl/KingMoveStrategy.java
├── service/impl/KnightMoveStrategy.java
├── service/impl/MoveStrategyFactory.java
├── service/impl/PawnMoveStrategy.java
├── service/impl/QueenMoveStrategy.java
├── service/impl/RookMoveStrategy.java
├── notation/MoveNotation.java
```

## Source Code

### `ChessDemo.java`

<details>
<summary>Click to view ChessDemo.java</summary>

```java
package com.you.lld.problems.chess;

import com.you.lld.problems.chess.model.Position;

/**
 * Demo: Strategy per piece, immutable board, template game flow.
 */
public class ChessDemo {

    public static void main(String[] args) {
        System.out.println("=== Chess Game Demo ===\n");

        Chess chess = new Chess();

        System.out.println("--- Scenario 1: Opening moves ---");
        move(chess, 6, 4, 4, 4);
        move(chess, 1, 4, 3, 4);
        move(chess, 7, 1, 5, 2);
        move(chess, 0, 1, 2, 2);

        System.out.println("\n--- Scenario 2: Turn enforcement ---");
        System.out.println("Current player: " + chess.currentPlayer());
        boolean wrongTurn = chess.move(new Position(1, 0), new Position(2, 0));
        System.out.println("Black moves on white turn: " + (wrongTurn ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 3: Valid pawn advance ---");
        boolean pawnOk = chess.move(new Position(6, 0), new Position(5, 0));
        System.out.println("White pawn a2->a3: " + (pawnOk ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 4: Self-capture blocked ---");
        boolean selfCapture = chess.move(new Position(0, 0), new Position(0, 1));
        System.out.println("Rook captures own knight: " + (selfCapture ? "allowed" : "rejected"));

        System.out.println("\n--- Scenario 5: Development + queen out ---");
        move(chess, 1, 0, 2, 0);
        move(chess, 7, 3, 3, 7);
        move(chess, 1, 3, 2, 3);

        System.out.println("Current player: " + chess.currentPlayer());
        System.out.println("Game over: " + chess.isGameOver());
        System.out.println("\n=== Demo complete ===");
    }

    private static void move(Chess chess, int r1, int c1, int r2, int c2) {
        Position from = new Position(r1, c1);
        Position to = new Position(r2, c2);
        if (!chess.move(from, to)) {
            System.out.println("REJECTED: " + from + " -> " + to);
        }
    }
}
```

</details>

### `Chess.java`

<details>
<summary>Click to view Chess.java</summary>

```java
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
```

</details>

### `model/Board.java`

<details>
<summary>Click to view model/Board.java</summary>

```java
package com.you.lld.problems.chess.model;

/**
 * Immutable 8x8 board. Every move returns a new {@link Board} instance.
 */
public final class Board {
    private final Piece[][] grid;

    public Board() {
        this.grid = new Piece[8][8];
    }

    private Board(Piece[][] grid) {
        this.grid = new Piece[8][8];
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                this.grid[r][c] = grid[r][c];
            }
        }
    }

    public static Board initial() {
        Board board = new Board();
        for (int i = 0; i < 8; i++) {
            board.grid[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            board.grid[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
        }
        board.grid[0][0] = new Piece(PieceType.ROOK, Color.BLACK);
        board.grid[0][7] = new Piece(PieceType.ROOK, Color.BLACK);
        board.grid[7][0] = new Piece(PieceType.ROOK, Color.WHITE);
        board.grid[7][7] = new Piece(PieceType.ROOK, Color.WHITE);
        board.grid[0][1] = new Piece(PieceType.KNIGHT, Color.BLACK);
        board.grid[0][6] = new Piece(PieceType.KNIGHT, Color.BLACK);
        board.grid[7][1] = new Piece(PieceType.KNIGHT, Color.WHITE);
        board.grid[7][6] = new Piece(PieceType.KNIGHT, Color.WHITE);
        board.grid[0][2] = new Piece(PieceType.BISHOP, Color.BLACK);
        board.grid[0][5] = new Piece(PieceType.BISHOP, Color.BLACK);
        board.grid[7][2] = new Piece(PieceType.BISHOP, Color.WHITE);
        board.grid[7][5] = new Piece(PieceType.BISHOP, Color.WHITE);
        board.grid[0][3] = new Piece(PieceType.QUEEN, Color.BLACK);
        board.grid[7][3] = new Piece(PieceType.QUEEN, Color.WHITE);
        board.grid[0][4] = new Piece(PieceType.KING, Color.BLACK);
        board.grid[7][4] = new Piece(PieceType.KING, Color.WHITE);
        return board;
    }

    public Piece getPiece(Position pos) {
        return grid[pos.getRow()][pos.getCol()];
    }

    public Board withMove(Position from, Position to) {
        Piece piece = getPiece(from);
        if (piece == null) {
            throw new IllegalArgumentException("No piece at " + from);
        }
        Piece[][] next = copyGrid();
        next[to.getRow()][to.getCol()] = piece.withMoved();
        next[from.getRow()][from.getCol()] = null;
        return new Board(next);
    }

    public boolean isPathClear(Position from, Position to) {
        int dr = Integer.signum(to.getRow() - from.getRow());
        int dc = Integer.signum(to.getCol() - from.getCol());
        int r = from.getRow() + dr;
        int c = from.getCol() + dc;
        while (r != to.getRow() || c != to.getCol()) {
            if (getPiece(new Position(r, c)) != null) {
                return false;
            }
            r += dr;
            c += dc;
        }
        return true;
    }

    public Position findKing(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = grid[r][c];
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == color) {
                    return new Position(r, c);
                }
            }
        }
        return null;
    }

    private Piece[][] copyGrid() {
        Piece[][] copy = new Piece[8][8];
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                copy[r][c] = grid[r][c];
            }
        }
        return copy;
    }
}
```

</details>

### `model/Color.java`

<details>
<summary>Click to view model/Color.java</summary>

```java
package com.you.lld.problems.chess.model;

public enum Color {
    WHITE, BLACK
}
```

</details>

### `model/Piece.java`

<details>
<summary>Click to view model/Piece.java</summary>

```java
package com.you.lld.problems.chess.model;

/** Immutable chess piece. */
public final class Piece {
    private final PieceType type;
    private final Color color;
    private final boolean hasMoved;

    public Piece(PieceType type, Color color) {
        this(type, color, false);
    }

    private Piece(PieceType type, Color color, boolean hasMoved) {
        this.type = type;
        this.color = color;
        this.hasMoved = hasMoved;
    }

    public PieceType getType() {
        return type;
    }

    public Color getColor() {
        return color;
    }

    public boolean hasMoved() {
        return hasMoved;
    }

    public Piece withMoved() {
        if (hasMoved) {
            return this;
        }
        return new Piece(type, color, true);
    }

    @Override
    public String toString() {
        return color + "_" + type;
    }
}
```

</details>

### `model/PieceType.java`

<details>
<summary>Click to view model/PieceType.java</summary>

```java
package com.you.lld.problems.chess.model;

public enum PieceType {
    KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN
}
```

</details>

### `model/Position.java`

<details>
<summary>Click to view model/Position.java</summary>

```java
package com.you.lld.problems.chess.model;

public class Position {
    private final int row;
    private final int col;
    
    public Position(int row, int col) {
        this.row = row;
        this.col = col;
    }
    
    public int getRow() { return row; }
    public int getCol() { return col; }
    
    public boolean isValid() {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Position p = (Position) o;
        return row == p.row && col == p.col;
    }

    @Override
    public int hashCode() {
        return 31 * row + col;
    }

    @Override
    public String toString() {
        char file = (char) ('a' + col);
        int rank = 8 - row;
        return "" + file + rank;
    }
}
```

</details>

### `service/AbstractChessGame.java`

<details>
<summary>Click to view service/AbstractChessGame.java</summary>

```java
package com.you.lld.problems.chess.service;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Piece;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.impl.MoveStrategyFactory;

/**
 * Template Method — fixed game flow; subclasses may hook post-move evaluation.
 */
public abstract class AbstractChessGame implements ChessGame {
    protected Board board;
    protected Color currentPlayer;
    protected boolean gameOver;

    protected AbstractChessGame() {
        this.board = Board.initial();
        this.currentPlayer = Color.WHITE;
        this.gameOver = false;
    }

    @Override
    public final synchronized boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }
        board = board.withMove(from, to);
        currentPlayer = currentPlayer == Color.WHITE ? Color.BLACK : Color.WHITE;
        evaluateAfterMove();
        return true;
    }

    protected void evaluateAfterMove() {
        if (isInCheck(currentPlayer)) {
            if (!hasAnyLegalMove(currentPlayer)) {
                gameOver = true;
                onCheckmate(currentPlayer);
            } else {
                onCheck(currentPlayer);
            }
        }
    }

    protected abstract void onCheck(Color playerInCheck);

    protected abstract void onCheckmate(Color playerInCheck);

    @Override
    public boolean isValidMove(Position from, Position to) {
        if (!from.isValid() || !to.isValid() || from.equals(to)) {
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
        if (!MoveStrategyFactory.forType(piece.getType()).canMove(board, from, to)) {
            return false;
        }
        return !wouldLeaveInCheck(from, to, currentPlayer);
    }

    public boolean isInCheck(Color color) {
        Position kingPos = board.findKing(color);
        if (kingPos == null) {
            return false;
        }
        Color opponent = color == Color.WHITE ? Color.BLACK : Color.WHITE;
        return isSquareAttackedBy(kingPos, opponent);
    }

    private boolean isSquareAttackedBy(Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = board.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (MoveStrategyFactory.forType(piece.getType()).canMove(board, pos, target)) {
                        Piece targetPiece = board.getPiece(target);
                        if (targetPiece == null || targetPiece.getColor() != attackerColor) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private boolean wouldLeaveInCheck(Position from, Position to, Color color) {
        Board next = board.withMove(from, to);
        Position kingPos = next.findKing(color);
        if (kingPos == null) {
            return true;
        }
        Color opponent = color == Color.WHITE ? Color.BLACK : Color.WHITE;
        return isSquareAttackedOnBoard(next, kingPos, opponent);
    }

    private boolean isSquareAttackedOnBoard(Board snapshot, Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = snapshot.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (MoveStrategyFactory.forType(piece.getType()).canMove(snapshot, pos, target)) {
                        Piece targetPiece = snapshot.getPiece(target);
                        if (targetPiece == null || targetPiece.getColor() != attackerColor) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private boolean hasAnyLegalMove(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getColor() == color) {
                    for (int tr = 0; tr < 8; tr++) {
                        for (int tc = 0; tc < 8; tc++) {
                            Position from = new Position(r, c);
                            Position to = new Position(tr, tc);
                            Color saved = currentPlayer;
                            currentPlayer = color;
                            boolean legal = isValidMove(from, to);
                            currentPlayer = saved;
                            if (legal) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    @Override
    public Color getCurrentPlayer() {
        return currentPlayer;
    }

    @Override
    public boolean isGameOver() {
        return gameOver;
    }

    @Override
    public Board getBoard() {
        return board;
    }
}
```

</details>

### `service/ChessGame.java`

<details>
<summary>Click to view service/ChessGame.java</summary>

```java
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
```

</details>

### `service/MoveStrategy.java`

<details>
<summary>Click to view service/MoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;

/** Strategy — piece-specific movement rules. */
public interface MoveStrategy {
    boolean canMove(Board board, Position from, Position to);
}
```

</details>

### `service/impl/BishopMoveStrategy.java`

<details>
<summary>Click to view service/impl/BishopMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class BishopMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int absDr = Math.abs(to.getRow() - from.getRow());
        int absDc = Math.abs(to.getCol() - from.getCol());
        if (absDr != absDc) {
            return false;
        }
        return board.isPathClear(from, to);
    }
}
```

</details>

### `service/impl/ChessGameImpl.java`

<details>
<summary>Click to view service/impl/ChessGameImpl.java</summary>

```java
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
```

</details>

### `service/impl/KingMoveStrategy.java`

<details>
<summary>Click to view service/impl/KingMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class KingMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int absDr = Math.abs(to.getRow() - from.getRow());
        int absDc = Math.abs(to.getCol() - from.getCol());
        return absDr <= 1 && absDc <= 1;
    }
}
```

</details>

### `service/impl/KnightMoveStrategy.java`

<details>
<summary>Click to view service/impl/KnightMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class KnightMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int absDr = Math.abs(to.getRow() - from.getRow());
        int absDc = Math.abs(to.getCol() - from.getCol());
        return (absDr == 2 && absDc == 1) || (absDr == 1 && absDc == 2);
    }
}
```

</details>

### `service/impl/MoveStrategyFactory.java`

<details>
<summary>Click to view service/impl/MoveStrategyFactory.java</summary>

```java
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
```

</details>

### `service/impl/PawnMoveStrategy.java`

<details>
<summary>Click to view service/impl/PawnMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Piece;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class PawnMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        Piece piece = board.getPiece(from);
        if (piece == null) {
            return false;
        }
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        int absDr = Math.abs(dr);
        int absDc = Math.abs(dc);
        int direction = piece.getColor() == Color.WHITE ? -1 : 1;
        boolean isCapture = board.getPiece(to) != null;

        if (dc == 0 && !isCapture) {
            if (dr == direction) {
                return true;
            }
            int startRow = piece.getColor() == Color.WHITE ? 6 : 1;
            if (from.getRow() == startRow && dr == 2 * direction) {
                Position mid = new Position(from.getRow() + direction, from.getCol());
                return board.getPiece(mid) == null;
            }
        }
        return absDc == 1 && dr == direction && isCapture;
    }
}
```

</details>

### `service/impl/QueenMoveStrategy.java`

<details>
<summary>Click to view service/impl/QueenMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class QueenMoveStrategy implements MoveStrategy {
    private final RookMoveStrategy rook = new RookMoveStrategy();
    private final BishopMoveStrategy bishop = new BishopMoveStrategy();

    @Override
    public boolean canMove(Board board, Position from, Position to) {
        return rook.canMove(board, from, to) || bishop.canMove(board, from, to);
    }
}
```

</details>

### `service/impl/RookMoveStrategy.java`

<details>
<summary>Click to view service/impl/RookMoveStrategy.java</summary>

```java
package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class RookMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        if (dr != 0 && dc != 0) {
            return false;
        }
        return board.isPathClear(from, to);
    }
}
```

</details>

### `notation/MoveNotation.java`

<details>
<summary>Click to view notation/MoveNotation.java</summary>

```java
package com.you.lld.problems.chess.notation;

import com.you.lld.problems.chess.model.*;

public class MoveNotation {
    public static String toAlgebraic(Position from, Position to) {
        return positionToString(from) + positionToString(to);
    }
    
    private static String positionToString(Position pos) {
        char file = (char) ('a' + pos.getCol());
        int rank = 8 - pos.getRow();
        return "" + file + rank;
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.chess.ChessDemo"
```
