# chess - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/chess/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py chess`.

## Project Structure (9 files)

```
chess/
├── ChessDemo.java
├── api/ChessGame.java
├── model/Board.java
├── model/Color.java
├── model/Piece.java
├── model/PieceType.java
├── model/Position.java
├── impl/ChessGameImpl.java
├── notation/MoveNotation.java
```

## Source Code

### `ChessDemo.java`

<details>
<summary>Click to view ChessDemo.java</summary>

```java
package com.you.lld.problems.chess;

import com.you.lld.problems.chess.impl.ChessGameImpl;
import com.you.lld.problems.chess.model.*;

/**
 * Demo: Chess game exercising piece movement, captures, turn management.
 */
public class ChessDemo {

    public static void main(String[] args) {
        System.out.println("=== Chess Game Demo ===\n");

        ChessGameImpl game = new ChessGameImpl();

        // Opening moves
        System.out.println("--- Opening moves ---");
        move(game, 6, 4, 4, 4); // White pawn e2->e4
        move(game, 1, 4, 3, 4); // Black pawn e7->e5
        move(game, 7, 1, 5, 2); // White knight b1->c3
        move(game, 0, 1, 2, 2); // Black knight b8->c6
        move(game, 7, 5, 4, 2); // White bishop f1->c4
        move(game, 0, 5, 3, 2); // Black bishop f8->c5 (would collide, but simplified validation)

        System.out.println("\n--- Turn checking ---");
        System.out.println("Current player: " + game.getCurrentPlayer());
        System.out.println("Game over: " + game.isGameOver());

        // Invalid move: wrong turn
        System.out.println("\n--- Error handling ---");
        boolean ok1 = game.makeMove(new Position(1, 0), new Position(2, 0)); // Black tries when white turn
        System.out.println("Wrong turn move: " + (ok1 ? "allowed" : "rejected"));

        // Move to empty square
        boolean ok2 = game.makeMove(new Position(6, 0), new Position(5, 0)); // White pawn a2->a3
        System.out.println("Valid white pawn: " + (ok2 ? "allowed" : "rejected"));

        // Self capture attempt
        boolean ok3 = game.makeMove(new Position(0, 0), new Position(0, 1)); // Black rook->knight (self capture)
        System.out.println("Self capture: " + (ok3 ? "allowed" : "rejected"));

        System.out.println("\n--- More moves ---");
        move(game, 1, 0, 2, 0); // Black pawn a7->a6
        move(game, 7, 3, 3, 7); // White queen d1->h5
        move(game, 1, 3, 2, 3); // Black pawn d7->d6

        System.out.println("\nCurrent player: " + game.getCurrentPlayer());
        System.out.println("Game over: " + game.isGameOver());

        System.out.println("\n=== Demo complete ===");
    }

    private static void move(ChessGameImpl game, int r1, int c1, int r2, int c2) {
        Position from = new Position(r1, c1);
        Position to = new Position(r2, c2);
        boolean ok = game.makeMove(from, to);
        if (!ok) {
            System.out.println("REJECTED: " + from + " -> " + to);
        }
    }
}
```

</details>

### `api/ChessGame.java`

<details>
<summary>Click to view api/ChessGame.java</summary>

```java
package com.you.lld.problems.chess.api;

import com.you.lld.problems.chess.model.*;

public interface ChessGame {
    boolean makeMove(Position from, Position to);
    boolean isValidMove(Position from, Position to);
    Color getCurrentPlayer();
    boolean isGameOver();
}
```

</details>

### `model/Board.java`

<details>
<summary>Click to view model/Board.java</summary>

```java
package com.you.lld.problems.chess.model;

public class Board {
    private final Piece[][] grid = new Piece[8][8];
    
    public void initialize() {
        // Pawns
        for (int i = 0; i < 8; i++) {
            grid[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            grid[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
        }
        
        // Rooks
        grid[0][0] = new Piece(PieceType.ROOK, Color.BLACK);
        grid[0][7] = new Piece(PieceType.ROOK, Color.BLACK);
        grid[7][0] = new Piece(PieceType.ROOK, Color.WHITE);
        grid[7][7] = new Piece(PieceType.ROOK, Color.WHITE);
        
        // Knights
        grid[0][1] = new Piece(PieceType.KNIGHT, Color.BLACK);
        grid[0][6] = new Piece(PieceType.KNIGHT, Color.BLACK);
        grid[7][1] = new Piece(PieceType.KNIGHT, Color.WHITE);
        grid[7][6] = new Piece(PieceType.KNIGHT, Color.WHITE);
        
        // Bishops
        grid[0][2] = new Piece(PieceType.BISHOP, Color.BLACK);
        grid[0][5] = new Piece(PieceType.BISHOP, Color.BLACK);
        grid[7][2] = new Piece(PieceType.BISHOP, Color.WHITE);
        grid[7][5] = new Piece(PieceType.BISHOP, Color.WHITE);
        
        // Queens
        grid[0][3] = new Piece(PieceType.QUEEN, Color.BLACK);
        grid[7][3] = new Piece(PieceType.QUEEN, Color.WHITE);
        
        // Kings
        grid[0][4] = new Piece(PieceType.KING, Color.BLACK);
        grid[7][4] = new Piece(PieceType.KING, Color.WHITE);
    }
    
    public Piece getPiece(Position pos) {
        return grid[pos.getRow()][pos.getCol()];
    }
    
    public void setPiece(Position pos, Piece piece) {
        grid[pos.getRow()][pos.getCol()] = piece;
    }
    
    public void movePiece(Position from, Position to) {
        Piece piece = getPiece(from);
        setPiece(to, piece);
        setPiece(from, null);
        if (piece != null) {
            piece.setMoved();
        }
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

public class Piece {
    private final PieceType type;
    private final Color color;
    private boolean hasMoved;
    
    public Piece(PieceType type, Color color) {
        this.type = type;
        this.color = color;
        this.hasMoved = false;
    }
    
    public PieceType getType() { return type; }
    public Color getColor() { return color; }
    public boolean hasMoved() { return hasMoved; }
    
    public void setMoved() {
        this.hasMoved = true;
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

### `impl/ChessGameImpl.java`

<details>
<summary>Click to view impl/ChessGameImpl.java</summary>

```java
package com.you.lld.problems.chess.impl;

import com.you.lld.problems.chess.api.ChessGame;
import com.you.lld.problems.chess.model.*;

/**
 * Chess game with piece-specific move validation and basic check detection.
 * Thread-safe: all state-mutating methods are synchronized.
 */
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
    public synchronized boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }

        board.movePiece(from, to);
        currentPlayer = (currentPlayer == Color.WHITE) ? Color.BLACK : Color.WHITE;

        // Check if opponent is in check/checkmate
        if (isInCheck(currentPlayer)) {
            if (!hasAnyLegalMove(currentPlayer)) {
                gameOver = true;
                System.out.println("Checkmate! " +
                    (currentPlayer == Color.WHITE ? "Black" : "White") + " wins!");
            } else {
                System.out.println(currentPlayer + " is in check!");
            }
        }
        return true;
    }

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
            return false; // Can't capture own piece
        }

        // Piece-specific movement validation
        if (!isValidPieceMove(piece, from, to)) {
            return false;
        }

        // Ensure move doesn't leave own king in check
        return !wouldLeaveInCheck(from, to, currentPlayer);
    }

    private boolean isValidPieceMove(Piece piece, Position from, Position to) {
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        int absDr = Math.abs(dr);
        int absDc = Math.abs(dc);

        switch (piece.getType()) {
            case PAWN:
                return isValidPawnMove(piece, from, to, dr, dc, absDr, absDc);
            case ROOK:
                return isValidRookMove(from, to, dr, dc);
            case KNIGHT:
                return (absDr == 2 && absDc == 1) || (absDr == 1 && absDc == 2);
            case BISHOP:
                return isValidBishopMove(from, to, absDr, absDc);
            case QUEEN:
                return isValidRookMove(from, to, dr, dc) || isValidBishopMove(from, to, absDr, absDc);
            case KING:
                return absDr <= 1 && absDc <= 1;
            default:
                return false;
        }
    }

    private boolean isValidPawnMove(Piece piece, Position from, Position to,
                                    int dr, int dc, int absDr, int absDc) {
        int direction = (piece.getColor() == Color.WHITE) ? -1 : 1; // White moves up (decreasing row)
        boolean isCapture = board.getPiece(to) != null;

        // Normal move forward
        if (dc == 0 && !isCapture) {
            if (dr == direction) return true;
            // Two-square initial move
            int startRow = (piece.getColor() == Color.WHITE) ? 6 : 1;
            if (from.getRow() == startRow && dr == 2 * direction) {
                // Check path is clear
                Position mid = new Position(from.getRow() + direction, from.getCol());
                return board.getPiece(mid) == null;
            }
        }

        // Diagonal capture
        if (absDc == 1 && dr == direction && isCapture) {
            return true;
        }

        return false;
    }

    private boolean isValidRookMove(Position from, Position to, int dr, int dc) {
        if (dr != 0 && dc != 0) return false; // Must be along rank or file
        return isPathClear(from, to);
    }

    private boolean isValidBishopMove(Position from, Position to, int absDr, int absDc) {
        if (absDr != absDc) return false; // Must be diagonal
        return isPathClear(from, to);
    }

    /** Check that all squares between from and to are empty. */
    private boolean isPathClear(Position from, Position to) {
        int dr = Integer.signum(to.getRow() - from.getRow());
        int dc = Integer.signum(to.getCol() - from.getCol());

        int r = from.getRow() + dr;
        int c = from.getCol() + dc;
        while (r != to.getRow() || c != to.getCol()) {
            if (board.getPiece(new Position(r, c)) != null) return false;
            r += dr;
            c += dc;
        }
        return true;
    }

    /** Check if the given color's king is currently in check. */
    public boolean isInCheck(Color color) {
        Position kingPos = findKing(color);
        if (kingPos == null) return false;
        Color opponent = (color == Color.WHITE) ? Color.BLACK : Color.WHITE;
        return isSquareAttackedBy(kingPos, opponent);
    }

    /** Check if any piece of attackerColor attacks the given square. */
    private boolean isSquareAttackedBy(Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = board.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (isValidPieceMove(piece, pos, target)) {
                        // Also need to check the target isn't own color for the attacker
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

    private Position findKing(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == color) {
                    return new Position(r, c);
                }
            }
        }
        return null;
    }

    /** Simulate a move and check if it leaves the player's king in check. */
    private boolean wouldLeaveInCheck(Position from, Position to, Color color) {
        Piece saved = board.getPiece(to);
        board.movePiece(from, to);
        boolean inCheck = isInCheck(color);
        // Undo
        board.movePiece(to, from);
        board.setPiece(to, saved);
        return inCheck;
    }

    /** Check if the given color has any legal move (for checkmate detection). */
    private boolean hasAnyLegalMove(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getColor() == color) {
                    for (int tr = 0; tr < 8; tr++) {
                        for (int tc = 0; tc < 8; tc++) {
                            Position from = new Position(r, c);
                            Position to = new Position(tr, tc);
                            if (from.equals(to)) continue;
                            Piece target = board.getPiece(to);
                            if (target != null && target.getColor() == color) continue;
                            if (isValidPieceMove(piece, from, to)
                                    && !wouldLeaveInCheck(from, to, color)) {
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

    public Board getBoard() {
        return board;
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
