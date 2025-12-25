# Day 17: Chess & TicTacToe — Game Engine 🎮

**Focus**: Design game engines with rules validation, pluggable AI, and replay persistence.

---

## 🎯 **Learning Objectives**

By the end of Day 17, you will:
- **Design** a flexible game engine architecture
- **Implement** rules validation systems
- **Create** pluggable AI strategies
- **Build** game state persistence for replay

---

## 📚 **Chess Design**

### **Core Models**

```java
public class ChessGame {
    private final GameId id;
    private final Board board;
    private final Player whitePlayer;
    private final Player blackPlayer;
    private Color currentTurn;
    private GameStatus status;
    private final List<Move> moveHistory;
    private final GameClock clock;
    
    public enum GameStatus {
        IN_PROGRESS, CHECK, CHECKMATE, STALEMATE, DRAW, RESIGNED, TIMEOUT
    }
}

public class Board {
    private final Piece[][] squares;
    private static final int SIZE = 8;
    
    public Board() {
        this.squares = new Piece[SIZE][SIZE];
        initializeBoard();
    }
    
    public Piece getPiece(Position position) {
        return squares[position.getRow()][position.getCol()];
    }
    
    public void setPiece(Position position, Piece piece) {
        squares[position.getRow()][position.getCol()] = piece;
    }
    
    public Board copy() {
        Board copy = new Board();
        for (int i = 0; i < SIZE; i++) {
            for (int j = 0; j < SIZE; j++) {
                if (squares[i][j] != null) {
                    copy.squares[i][j] = squares[i][j].copy();
                }
            }
        }
        return copy;
    }
}

public abstract class Piece {
    protected final Color color;
    protected Position position;
    protected boolean hasMoved;
    
    public abstract List<Move> getValidMoves(Board board);
    public abstract PieceType getType();
    public abstract Piece copy();
}

public class Move {
    private final Position from;
    private final Position to;
    private final Piece movedPiece;
    private final Piece capturedPiece;
    private final MoveType type;
    private final String notation;
    
    public enum MoveType {
        NORMAL, CAPTURE, CASTLE_KINGSIDE, CASTLE_QUEENSIDE,
        EN_PASSANT, PROMOTION
    }
}
```

### **Piece Implementations**

```java
public class King extends Piece {
    
    @Override
    public List<Move> getValidMoves(Board board) {
        List<Move> moves = new ArrayList<>();
        
        // King can move one square in any direction
        int[][] directions = {
            {-1, -1}, {-1, 0}, {-1, 1},
            {0, -1},           {0, 1},
            {1, -1},  {1, 0},  {1, 1}
        };
        
        for (int[] dir : directions) {
            Position newPos = position.offset(dir[0], dir[1]);
            if (newPos.isValid() && canMoveTo(board, newPos)) {
                moves.add(new Move(position, newPos, this, board.getPiece(newPos)));
            }
        }
        
        // Castling
        if (!hasMoved && !isInCheck(board)) {
            // Kingside castling
            if (canCastle(board, true)) {
                moves.add(createCastleMove(true));
            }
            // Queenside castling
            if (canCastle(board, false)) {
                moves.add(createCastleMove(false));
            }
        }
        
        return moves;
    }
    
    private boolean canCastle(Board board, boolean kingside) {
        int row = color == Color.WHITE ? 0 : 7;
        int rookCol = kingside ? 7 : 0;
        
        Piece rook = board.getPiece(Position.of(row, rookCol));
        if (!(rook instanceof Rook) || rook.hasMoved()) {
            return false;
        }
        
        // Check squares between king and rook are empty
        int startCol = kingside ? 5 : 1;
        int endCol = kingside ? 6 : 3;
        for (int col = startCol; col <= endCol; col++) {
            if (board.getPiece(Position.of(row, col)) != null) {
                return false;
            }
        }
        
        // Check king doesn't pass through check
        for (int col = 4; col != rookCol; col += (kingside ? 1 : -1)) {
            if (isSquareAttacked(board, Position.of(row, col))) {
                return false;
            }
        }
        
        return true;
    }
}

public class Knight extends Piece {
    
    @Override
    public List<Move> getValidMoves(Board board) {
        List<Move> moves = new ArrayList<>();
        
        int[][] jumps = {
            {-2, -1}, {-2, 1}, {-1, -2}, {-1, 2},
            {1, -2}, {1, 2}, {2, -1}, {2, 1}
        };
        
        for (int[] jump : jumps) {
            Position newPos = position.offset(jump[0], jump[1]);
            if (newPos.isValid() && canMoveTo(board, newPos)) {
                moves.add(new Move(position, newPos, this, board.getPiece(newPos)));
            }
        }
        
        return moves;
    }
}
```

---

## 🎯 **Rules Engine**

```java
public interface RulesEngine {
    boolean isValidMove(Game game, Move move);
    List<Move> getLegalMoves(Game game, Position position);
    GameStatus evaluateGameStatus(Game game);
    boolean isCheck(Game game, Color color);
    boolean isCheckmate(Game game, Color color);
    boolean isStalemate(Game game, Color color);
}

public class ChessRulesEngine implements RulesEngine {
    
    @Override
    public boolean isValidMove(Game game, Move move) {
        Board board = game.getBoard();
        Piece piece = board.getPiece(move.getFrom());
        
        // Basic validations
        if (piece == null) return false;
        if (piece.getColor() != game.getCurrentTurn()) return false;
        
        // Check if move is in piece's valid moves
        List<Move> validMoves = piece.getValidMoves(board);
        if (!validMoves.contains(move)) return false;
        
        // Check if move leaves king in check
        Board testBoard = board.copy();
        applyMove(testBoard, move);
        if (isCheck(new Game(testBoard), piece.getColor())) {
            return false;
        }
        
        return true;
    }
    
    @Override
    public boolean isCheckmate(Game game, Color color) {
        if (!isCheck(game, color)) {
            return false;
        }
        
        // Check if any move can escape check
        return getAllLegalMoves(game, color).isEmpty();
    }
    
    @Override
    public boolean isStalemate(Game game, Color color) {
        if (isCheck(game, color)) {
            return false;
        }
        
        return getAllLegalMoves(game, color).isEmpty();
    }
    
    private List<Move> getAllLegalMoves(Game game, Color color) {
        List<Move> allMoves = new ArrayList<>();
        Board board = game.getBoard();
        
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                Piece piece = board.getPiece(Position.of(row, col));
                if (piece != null && piece.getColor() == color) {
                    allMoves.addAll(getLegalMoves(game, Position.of(row, col)));
                }
            }
        }
        
        return allMoves;
    }
}
```

---

## 🤖 **Pluggable AI**

```java
public interface ChessAI {
    Move selectMove(Game game);
    String getName();
}

public class RandomAI implements ChessAI {
    private final Random random = new Random();
    private final RulesEngine rulesEngine;
    
    @Override
    public Move selectMove(Game game) {
        List<Move> legalMoves = getAllLegalMoves(game);
        if (legalMoves.isEmpty()) {
            return null;
        }
        return legalMoves.get(random.nextInt(legalMoves.size()));
    }
    
    @Override
    public String getName() { return "Random AI"; }
}

public class MinimaxAI implements ChessAI {
    private final int maxDepth;
    private final BoardEvaluator evaluator;
    
    public MinimaxAI(int maxDepth) {
        this.maxDepth = maxDepth;
        this.evaluator = new StandardBoardEvaluator();
    }
    
    @Override
    public Move selectMove(Game game) {
        return minimax(game, maxDepth, Integer.MIN_VALUE, Integer.MAX_VALUE, true).move;
    }
    
    private MoveScore minimax(Game game, int depth, int alpha, int beta, boolean maximizing) {
        if (depth == 0 || game.isOver()) {
            return new MoveScore(null, evaluator.evaluate(game.getBoard(), game.getCurrentTurn()));
        }
        
        List<Move> moves = getAllLegalMoves(game);
        Move bestMove = null;
        
        if (maximizing) {
            int maxEval = Integer.MIN_VALUE;
            for (Move move : moves) {
                Game newGame = game.applyMove(move);
                int eval = minimax(newGame, depth - 1, alpha, beta, false).score;
                if (eval > maxEval) {
                    maxEval = eval;
                    bestMove = move;
                }
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            return new MoveScore(bestMove, maxEval);
        } else {
            int minEval = Integer.MAX_VALUE;
            for (Move move : moves) {
                Game newGame = game.applyMove(move);
                int eval = minimax(newGame, depth - 1, alpha, beta, true).score;
                if (eval < minEval) {
                    minEval = eval;
                    bestMove = move;
                }
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
            return new MoveScore(bestMove, minEval);
        }
    }
}

public interface BoardEvaluator {
    int evaluate(Board board, Color perspective);
}

public class StandardBoardEvaluator implements BoardEvaluator {
    private static final Map<PieceType, Integer> PIECE_VALUES = Map.of(
        PieceType.PAWN, 100,
        PieceType.KNIGHT, 320,
        PieceType.BISHOP, 330,
        PieceType.ROOK, 500,
        PieceType.QUEEN, 900,
        PieceType.KING, 20000
    );
    
    @Override
    public int evaluate(Board board, Color perspective) {
        int score = 0;
        
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                Piece piece = board.getPiece(Position.of(row, col));
                if (piece != null) {
                    int value = PIECE_VALUES.get(piece.getType());
                    score += (piece.getColor() == perspective) ? value : -value;
                }
            }
        }
        
        return score;
    }
}
```

---

## 💾 **Game Persistence (Replay)**

```java
public class GameRecorder {
    
    public String toPGN(Game game) {
        StringBuilder pgn = new StringBuilder();
        
        // Headers
        pgn.append("[Event \"Casual Game\"]\n");
        pgn.append("[Date \"").append(LocalDate.now()).append("\"]\n");
        pgn.append("[White \"").append(game.getWhitePlayer().getName()).append("\"]\n");
        pgn.append("[Black \"").append(game.getBlackPlayer().getName()).append("\"]\n");
        pgn.append("[Result \"").append(getResult(game)).append("\"]\n\n");
        
        // Moves
        List<Move> moves = game.getMoveHistory();
        for (int i = 0; i < moves.size(); i++) {
            if (i % 2 == 0) {
                pgn.append((i / 2 + 1)).append(". ");
            }
            pgn.append(moves.get(i).getNotation()).append(" ");
        }
        
        pgn.append(getResult(game));
        
        return pgn.toString();
    }
    
    public Game fromPGN(String pgn) {
        // Parse PGN and replay moves
        Game game = new Game();
        List<String> moveNotations = parseMoves(pgn);
        
        for (String notation : moveNotations) {
            Move move = parseMove(game, notation);
            game.makeMove(move);
        }
        
        return game;
    }
}
```

---

## 🎯 **TicTacToe (Simpler Example)**

```java
public class TicTacToe {
    private final char[][] board = new char[3][3];
    private char currentPlayer = 'X';
    private GameState state = GameState.IN_PROGRESS;
    
    public boolean makeMove(int row, int col) {
        if (state != GameState.IN_PROGRESS) return false;
        if (board[row][col] != '\0') return false;
        
        board[row][col] = currentPlayer;
        
        if (checkWin(currentPlayer)) {
            state = currentPlayer == 'X' ? GameState.X_WINS : GameState.O_WINS;
        } else if (isBoardFull()) {
            state = GameState.DRAW;
        } else {
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
        }
        
        return true;
    }
    
    private boolean checkWin(char player) {
        // Check rows, columns, diagonals
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == player && board[i][1] == player && board[i][2] == player) return true;
            if (board[0][i] == player && board[1][i] == player && board[2][i] == player) return true;
        }
        if (board[0][0] == player && board[1][1] == player && board[2][2] == player) return true;
        if (board[0][2] == player && board[1][1] == player && board[2][0] == player) return true;
        return false;
    }
}
```

---

**Next**: [Day 18 - Logging Library](week4/day18/README.md) →
