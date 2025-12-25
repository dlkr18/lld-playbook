# Day 17 Exercises: Chess & TicTacToe 📝

---

## 🎯 **Exercise 1: TicTacToe Core**

### **Task**
Implement a complete TicTacToe game with clean design:

### **Domain Models**
```java
public enum Player { X, O }
public enum GameState { IN_PROGRESS, X_WON, O_WON, DRAW }

public class Position {
    private final int row;
    private final int col;
    // 0-2 for both
}

public class Board {
    private final Player[][] grid; // 3x3
    
    public boolean isValidMove(Position pos);
    public void makeMove(Position pos, Player player);
    public Optional<Player> getWinner();
    public boolean isFull();
    public Board copy(); // For AI lookahead
}
```

### **Game Interface**
```java
public interface TicTacToeGame {
    void start();
    MoveResult makeMove(Position position);
    GameState getState();
    Player getCurrentPlayer();
    Board getBoard();
    List<Move> getMoveHistory();
    void reset();
}

public record MoveResult(
    boolean valid,
    String message,
    GameState newState,
    Optional<Player> winner
) {}
```

### **Win Detection**
Implement efficient win checking:
- Horizontal (3 rows)
- Vertical (3 columns)
- Diagonals (2)

---

## 🎯 **Exercise 2: TicTacToe AI**

### **Task**
Implement AI opponents with different strategies:

### **Strategy Interface**
```java
public interface GameStrategy {
    Position getNextMove(Board board, Player player);
}
```

### **Strategies to Implement**
1. **Random**: Pick any valid move
2. **Smart Random**: Prioritize center, then corners
3. **Blocking**: Block opponent's winning move
4. **Minimax**: Optimal play (unbeatable)

### **Minimax Algorithm**
```java
public class MinimaxStrategy implements GameStrategy {
    
    @Override
    public Position getNextMove(Board board, Player player) {
        int bestScore = Integer.MIN_VALUE;
        Position bestMove = null;
        
        for (Position pos : board.getEmptyPositions()) {
            Board copy = board.copy();
            copy.makeMove(pos, player);
            int score = minimax(copy, 0, false, player);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = pos;
            }
        }
        return bestMove;
    }
    
    private int minimax(Board board, int depth, boolean isMaximizing, Player player) {
        // Terminal conditions
        Optional<Player> winner = board.getWinner();
        if (winner.isPresent()) {
            return winner.get() == player ? 10 - depth : depth - 10;
        }
        if (board.isFull()) {
            return 0; // Draw
        }
        
        // Recursive case...
    }
}
```

---

## 🎯 **Exercise 3: Chess Piece Hierarchy**

### **Task**
Design chess pieces with proper inheritance:

### **Base Class**
```java
public abstract class Piece {
    protected final Color color;
    protected Position position;
    protected boolean hasMoved;
    
    public abstract List<Move> getValidMoves(Board board);
    public abstract PieceType getType();
    public abstract int getValue(); // For AI evaluation
    
    protected boolean isValidDestination(Position pos, Board board) {
        if (!board.isInBounds(pos)) return false;
        Piece target = board.getPieceAt(pos);
        return target == null || target.getColor() != this.color;
    }
}
```

### **Piece Implementations**
```java
public class Pawn extends Piece {
    @Override
    public List<Move> getValidMoves(Board board) {
        List<Move> moves = new ArrayList<>();
        
        int direction = color == Color.WHITE ? 1 : -1;
        
        // Forward move
        Position forward = position.offset(direction, 0);
        if (board.isEmpty(forward)) {
            moves.add(new Move(position, forward));
            
            // Double move from starting position
            if (!hasMoved) {
                Position doubleForward = position.offset(2 * direction, 0);
                if (board.isEmpty(doubleForward)) {
                    moves.add(new Move(position, doubleForward, MoveType.DOUBLE_PAWN));
                }
            }
        }
        
        // Captures (diagonal)
        for (int dc : new int[]{-1, 1}) {
            Position capture = position.offset(direction, dc);
            if (board.hasOpponentPiece(capture, color)) {
                moves.add(new Move(position, capture, MoveType.CAPTURE));
            }
        }
        
        // En passant
        // Promotion
        
        return moves;
    }
}

// Implement: Knight, Bishop, Rook, Queen, King
```

---

## 🎯 **Exercise 4: Chess Move Validation**

### **Task**
Implement comprehensive move validation:

### **Move Types**
```java
public enum MoveType {
    NORMAL,
    CAPTURE,
    CASTLE_KINGSIDE,
    CASTLE_QUEENSIDE,
    EN_PASSANT,
    PROMOTION,
    DOUBLE_PAWN
}

public class Move {
    private final Position from;
    private final Position to;
    private final MoveType type;
    private final PieceType promotionPiece; // For pawn promotion
}
```

### **Validation Rules**
1. **Basic**: Piece exists, destination valid
2. **Path Clear**: No pieces blocking (except Knight)
3. **Check Rules**: Move doesn't leave own king in check
4. **Castling**: King and rook haven't moved, no pieces between, not through check
5. **En Passant**: Only immediately after opponent's double pawn move

### **Interface**
```java
public interface MoveValidator {
    ValidationResult validate(Move move, GameState state);
}

public class ValidationResult {
    private final boolean valid;
    private final String errorMessage;
    private final MoveType resolvedType;
}
```

---

## 🎯 **Exercise 5: Chess Game State**

### **Task**
Manage complete chess game state:

### **State Components**
```java
public class ChessGameState {
    private Board board;
    private Color currentPlayer;
    private CastlingRights castlingRights;
    private Optional<Position> enPassantTarget;
    private int halfMoveClock;  // For 50-move rule
    private int fullMoveNumber;
    private GameStatus status;
    private List<Move> moveHistory;
    private List<String> positions;  // For threefold repetition
}

public enum GameStatus {
    IN_PROGRESS,
    CHECK,
    CHECKMATE,
    STALEMATE,
    DRAW_50_MOVE,
    DRAW_THREEFOLD,
    DRAW_INSUFFICIENT,
    DRAW_AGREEMENT,
    RESIGNED
}

public class CastlingRights {
    boolean whiteKingside;
    boolean whiteQueenside;
    boolean blackKingside;
    boolean blackQueenside;
}
```

### **State Transitions**
```java
public interface ChessGame {
    MoveResult makeMove(Move move);
    MoveResult makeMove(String algebraicNotation); // "e4", "Nf3", "O-O"
    
    List<Move> getLegalMoves();
    List<Move> getLegalMoves(Position position);
    
    boolean isInCheck();
    boolean isCheckmate();
    boolean isStalemate();
    
    void offerDraw();
    void acceptDraw();
    void resign();
    
    void undo();
    void redo();
    
    String toFEN();
    void loadFEN(String fen);
}
```

---

## 🎯 **Exercise 6: Chess Notation**

### **Task**
Implement algebraic notation parsing and generation:

### **Notation Types**
```java
// Standard Algebraic Notation (SAN)
"e4"      // Pawn to e4
"Nf3"     // Knight to f3
"Bxe5"    // Bishop captures on e5
"O-O"     // Kingside castle
"O-O-O"   // Queenside castle
"e8=Q"    // Pawn promotion to queen
"Nbd2"    // Knight from b-file to d2 (disambiguation)
"R1a3"    // Rook from rank 1 to a3 (disambiguation)
"Qh4+"    // Queen to h4, check
"Qf7#"    // Queen to f7, checkmate

// Long Algebraic Notation
"e2e4"    // From e2 to e4
"g1f3"    // Knight from g1 to f3
```

### **Interface**
```java
public interface NotationParser {
    Move parse(String notation, GameState state);
    String toNotation(Move move, GameState state);
}

public class AlgebraicNotationParser implements NotationParser {
    // Implementation
}
```

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Chess AI with Alpha-Beta**
```java
public class AlphaBetaStrategy implements ChessStrategy {
    private final int maxDepth;
    private final PositionEvaluator evaluator;
    
    public Move getBestMove(GameState state) {
        return alphaBeta(state, maxDepth, MIN, MAX, true).move();
    }
    
    private EvaluatedMove alphaBeta(
        GameState state, int depth, int alpha, int beta, boolean maximizing
    ) {
        if (depth == 0 || state.isTerminal()) {
            return new EvaluatedMove(null, evaluator.evaluate(state));
        }
        // Alpha-beta pruning logic...
    }
}
```

### **Challenge 2: Game Persistence**
```java
// Save/load games in PGN format
public interface GamePersistence {
    void save(ChessGame game, Path path);
    ChessGame load(Path path);
    
    // PGN example:
    // [Event "Casual Game"]
    // [Date "2024.01.15"]
    // [White "Alice"]
    // [Black "Bob"]
    // [Result "1-0"]
    // 1. e4 e5 2. Nf3 Nc6 3. Bb5 ...
}
```

### **Challenge 3: Move Time Control**
```java
public class TimeControl {
    private Duration initialTime;
    private Duration increment;
    private Map<Color, Duration> remainingTime;
    
    public void startClock(Color player);
    public void stopClock();
    public boolean isTimeUp(Color player);
}
```

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Piece Movement** - Correct move generation | 25 |
| **Game Rules** - Check, checkmate, special moves | 25 |
| **State Management** - Complete game state | 20 |
| **Notation** - Parse and generate correctly | 15 |
| **Code Quality** - Clean, testable design | 15 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week4/day17/EXERCISE_SOLUTIONS.md)
