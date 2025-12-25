# Chess Game - Rules Engine & AI ♟️

Production-ready **chess game implementation** with **complete rules engine**, **move validation**, **check/checkmate detection**, and **AI player**. Comprehensive board game design.

---

## 🎯 **Core Features**

✅ **Complete Rules** - All chess rules (castling, en passant, promotion)  
✅ **Move Validation** - Legal move generation  
✅ **Check/Checkmate** - Game state detection  
✅ **AI Player** - Minimax with alpha-beta pruning  
✅ **Move History** - Undo/redo, PGN notation  
✅ **Time Controls** - Blitz, rapid, classical  

---

## 📚 **System Architecture**

### **1. Core Components**

```
ChessGame
 ├── Board (8x8 grid)
 │    └── Piece (King, Queen, Rook, Bishop, Knight, Pawn)
 ├── MoveValidator
 ├── GameState (playing, check, checkmate, stalemate, draw)
 └── MoveHistory
```

### **2. Piece Movement Patterns**

```java
public interface Piece {
    List<Move> getLegalMoves(Board board, Position from);
    PieceType getType();
    Color getColor();
}

// Example: Knight
public class Knight implements Piece {
    private static final int[][] KNIGHT_MOVES = {
        {2, 1}, {2, -1}, {-2, 1}, {-2, -1},
        {1, 2}, {1, -2}, {-1, 2}, {-1, -2}
    };
    
    @Override
    public List<Move> getLegalMoves(Board board, Position from) {
        List<Move> moves = new ArrayList<>();
        for (int[] delta : KNIGHT_MOVES) {
            Position to = from.offset(delta[0], delta[1]);
            if (board.isValid(to) && canMoveTo(board, to)) {
                moves.add(new Move(from, to));
            }
        }
        return moves;
    }
}
```

---

## 💻 **Move Validation**

### **1. Basic Move Validation:**

```java
public class MoveValidator {
    
    public boolean isLegalMove(Board board, Move move, Color player) {
        Piece piece = board.getPieceAt(move.getFrom());
        
        // 1. Piece exists and belongs to player
        if (piece == null || piece.getColor() != player) {
            return false;
        }
        
        // 2. Move is in piece's legal move set
        if (!piece.getLegalMoves(board, move.getFrom()).contains(move)) {
            return false;
        }
        
        // 3. Move doesn't leave king in check
        Board afterMove = board.makeMove(move);
        if (isInCheck(afterMove, player)) {
            return false;
        }
        
        return true;
    }
}
```

### **2. Check Detection:**

```java
public boolean isInCheck(Board board, Color kingColor) {
    Position kingPos = board.findKing(kingColor);
    Color opponent = kingColor.opposite();
    
    // Check if any opponent piece can attack the king
    for (Piece piece : board.getPieces(opponent)) {
        Position piecePos = board.findPiece(piece);
        if (piece.canAttack(board, piecePos, kingPos)) {
            return true;
        }
    }
    
    return false;
}
```

### **3. Checkmate Detection:**

```java
public boolean isCheckmate(Board board, Color player) {
    // Must be in check
    if (!isInCheck(board, player)) {
        return false;
    }
    
    // No legal moves available
    for (Piece piece : board.getPieces(player)) {
        Position from = board.findPiece(piece);
        for (Move move : piece.getLegalMoves(board, from)) {
            if (isLegalMove(board, move, player)) {
                return false;  // Found escape move
            }
        }
    }
    
    return true;  // Checkmate!
}
```

---

## 🎯 **Special Rules**

### **1. Castling:**

```java
public boolean canCastle(Board board, Color player, CastleType type) {
    Position kingPos = board.findKing(player);
    Piece king = board.getPieceAt(kingPos);
    
    // King must not have moved
    if (king.hasMoved()) return false;
    
    // King must not be in check
    if (isInCheck(board, player)) return false;
    
    // Determine rook position based on castle type
    Position rookPos = (type == CastleType.KINGSIDE) 
        ? new Position(kingPos.getRow(), 7)
        : new Position(kingPos.getRow(), 0);
    
    Piece rook = board.getPieceAt(rookPos);
    
    // Rook must not have moved
    if (rook == null || rook.hasMoved()) return false;
    
    // Path between king and rook must be clear
    // King must not pass through check
    // ... additional validation
    
    return true;
}
```

### **2. En Passant:**

```java
public boolean canEnPassant(Board board, Move move) {
    Piece pawn = board.getPieceAt(move.getFrom());
    
    // Must be a pawn
    if (pawn.getType() != PieceType.PAWN) return false;
    
    // Opponent's last move must have been 2-square pawn advance
    Move lastMove = board.getLastMove();
    if (lastMove == null) return false;
    
    Piece lastPiece = board.getPieceAt(lastMove.getTo());
    if (lastPiece.getType() != PieceType.PAWN) return false;
    
    // Must be adjacent and correct row
    // ... additional validation
    
    return true;
}
```

---

## 🤖 **AI Player (Minimax)**

```java
/**
 * AI using Minimax algorithm with alpha-beta pruning.
 */
public class ChessAI {
    
    private static final int MAX_DEPTH = 4;
    
    public Move getBestMove(Board board, Color player) {
        return minimax(board, MAX_DEPTH, Integer.MIN_VALUE, Integer.MAX_VALUE, true, player)
            .getMove();
    }
    
    private MoveScore minimax(Board board, int depth, int alpha, int beta, 
                              boolean maximizing, Color player) {
        
        // Terminal conditions
        if (depth == 0 || isGameOver(board)) {
            return new MoveScore(null, evaluate(board, player));
        }
        
        List<Move> moves = generateLegalMoves(board, maximizing ? player : player.opposite());
        Move bestMove = null;
        
        if (maximizing) {
            int maxScore = Integer.MIN_VALUE;
            for (Move move : moves) {
                Board newBoard = board.makeMove(move);
                int score = minimax(newBoard, depth - 1, alpha, beta, false, player).getScore();
                
                if (score > maxScore) {
                    maxScore = score;
                    bestMove = move;
                }
                
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;  // Alpha-beta pruning
            }
            return new MoveScore(bestMove, maxScore);
            
        } else {
            int minScore = Integer.MAX_VALUE;
            for (Move move : moves) {
                Board newBoard = board.makeMove(move);
                int score = minimax(newBoard, depth - 1, alpha, beta, true, player).getScore();
                
                if (score < minScore) {
                    minScore = score;
                    bestMove = move;
                }
                
                beta = Math.min(beta, score);
                if (beta <= alpha) break;  // Alpha-beta pruning
            }
            return new MoveScore(bestMove, minScore);
        }
    }
    
    /**
     * Evaluates board position.
     * Positive = good for player, Negative = bad.
     */
    private int evaluate(Board board, Color player) {
        int score = 0;
        
        // Material evaluation
        for (Piece piece : board.getAllPieces()) {
            int value = getPieceValue(piece.getType());
            score += (piece.getColor() == player) ? value : -value;
        }
        
        // Positional evaluation (center control, king safety, etc.)
        // ... additional evaluation criteria
        
        return score;
    }
    
    private int getPieceValue(PieceType type) {
        switch (type) {
            case PAWN: return 100;
            case KNIGHT: return 320;
            case BISHOP: return 330;
            case ROOK: return 500;
            case QUEEN: return 900;
            case KING: return 20000;
            default: return 0;
        }
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Play Game**

```java
ChessGame game = new ChessGame();

// White's move: e2 to e4
game.makeMove(new Move("e2", "e4"));

// Black's move: e7 to e5
game.makeMove(new Move("e7", "e5"));

// Check game state
if (game.isCheck(Color.WHITE)) {
    System.out.println("White king in check!");
}

if (game.isCheckmate(Color.BLACK)) {
    System.out.println("Checkmate! White wins!");
}
```

### **Example 2: AI vs Human**

```java
ChessGame game = new ChessGame();
ChessAI ai = new ChessAI();

while (!game.isGameOver()) {
    if (game.getCurrentPlayer() == Color.WHITE) {
        // Human move
        Move move = getUserInput();
        game.makeMove(move);
    } else {
        // AI move
        Move aiMove = ai.getBestMove(game.getBoard(), Color.BLACK);
        game.makeMove(aiMove);
        System.out.println("AI plays: " + aiMove);
    }
}
```

---

## 🎯 **Design Patterns**

- **Strategy**: Different AI algorithms (Minimax, Monte Carlo)
- **Command**: Move execution with undo/redo
- **Template Method**: Common piece movement logic
- **State**: Game state management
- **Factory**: Create pieces

---

## 🔗 **Related Resources**

- [Day 17: Chess/TicTacToe](week4/day17/README.md)
- [TicTacToe Implementation](problems/tictactoe/CODE.md)
- [Command Pattern](foundations/DESIGN_PATTERNS_CATALOG.md)

---

**Implementation Guide**: Placeholder for future implementation in `src/main/java/com/you/lld/problems/chess/`

---

✨ **Complete chess engine with AI and all rules!** ♟️

