# chess - Complete Implementation

## 📁 Project Structure (8 files)

```
chess/
├── api/ChessGame.java
├── impl/ChessGameImpl.java
├── model/Board.java
├── model/Color.java
├── model/Piece.java
├── model/PieceType.java
├── model/Position.java
├── notation/MoveNotation.java
```

## 📝 Source Code

### 📄 `api/ChessGame.java`

<details>
<summary>📄 Click to view api/ChessGame.java</summary>

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

### 📄 `impl/ChessGameImpl.java`

<details>
<summary>📄 Click to view impl/ChessGameImpl.java</summary>

```java
package com.you.lld.problems.chess.impl;

import com.you.lld.problems.chess.api.ChessGame;
import com.you.lld.problems.chess.model.*;

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
    public boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }
        
        board.movePiece(from, to);
        currentPlayer = (currentPlayer == Color.WHITE) ? Color.BLACK : Color.WHITE;
        System.out.println("Move: " + from + " -> " + to);
        return true;
    }
    
    @Override
    public boolean isValidMove(Position from, Position to) {
        if (!from.isValid() || !to.isValid()) {
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
        
        // Simplified validation (real chess would need move validation per piece type)
        return true;
    }
    
    @Override
    public Color getCurrentPlayer() {
        return currentPlayer;
    }
    
    @Override
    public boolean isGameOver() {
        return gameOver;
    }
}
```

</details>

### 📄 `model/Board.java`

<details>
<summary>📄 Click to view model/Board.java</summary>

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

### 📄 `model/Color.java`

<details>
<summary>📄 Click to view model/Color.java</summary>

```java
package com.you.lld.problems.chess.model;

public enum Color {
    WHITE, BLACK
}
```

</details>

### 📄 `model/Piece.java`

<details>
<summary>📄 Click to view model/Piece.java</summary>

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

### 📄 `model/PieceType.java`

<details>
<summary>📄 Click to view model/PieceType.java</summary>

```java
package com.you.lld.problems.chess.model;

public enum PieceType {
    KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN
}
```

</details>

### 📄 `model/Position.java`

<details>
<summary>📄 Click to view model/Position.java</summary>

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
    public String toString() {
        return "(" + row + "," + col + ")";
    }
}
```

</details>

### 📄 `notation/MoveNotation.java`

<details>
<summary>📄 Click to view notation/MoveNotation.java</summary>

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

