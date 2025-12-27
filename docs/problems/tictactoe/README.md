# Tic Tac Toe Game

## Overview
Classic Tic Tac Toe game implementation supporting 2-player mode, AI opponent, win detection, move validation, and game state management. Implements Minimax algorithm for unbeatable AI and various board sizes beyond traditional 3×3.

**Difficulty:** Easy  
**Domain:** Game Development, AI  
**Interview Frequency:** High (Entry-level interviews, algorithm practice)

## Requirements

### Functional Requirements
1. **Game Setup**
   - 3×3 grid (traditional)
   - Support custom board sizes (N×N)
   - 2-player mode (X and O)
   - AI opponent

2. **Gameplay**
   - Place marks (X or O)
   - Turn-based play
   - Move validation
   - Win detection
   - Draw detection

3. **Win Conditions**
   - Three in a row (horizontal)
   - Three in a column (vertical)
   - Three in a diagonal
   - N in a row for N×N boards

4. **AI Opponent**
   - Minimax algorithm
   - Alpha-beta pruning
   - Difficulty levels (Easy, Medium, Hard)

### Non-Functional Requirements
1. **Performance**
   - Move validation: < 10ms
   - AI move: < 1 second (3×3)
   - Support up to 10×10 boards

2. **Usability**
   - Clear board display
   - Undo last move
   - Game history

## Core Data Model

### 1. Board
```java
public class Board {
    private int size;
    private Cell[][] grid;
    private int movesCount;
    
    public Board(int size) {
        this.size = size;
        this.grid = new Cell[size][size];
        this.movesCount = 0;
        initializeBoard();
    }
    
    private void initializeBoard() {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                grid[i][j] = new Cell(i, j);
            }
        }
    }
    
    public boolean placeMark(int row, int col, CellState mark) {
        if (!isValidMove(row, col)) {
            return false;
        }
        
        grid[row][col].setState(mark);
        movesCount++;
        return true;
    }
    
    public boolean isValidMove(int row, int col) {
        return row >= 0 && row < size && 
               col >= 0 && col < size &&
               grid[row][col].isEmpty();
    }
    
    public boolean isFull() {
        return movesCount == size * size;
    }
    
    public List<Move> getAvailableMoves() {
        List<Move> moves = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (grid[i][j].isEmpty()) {
                    moves.add(new Move(i, j));
                }
            }
        }
        return moves;
    }
}
```

### 2. Cell
```java
public class Cell {
    private int row;
    private int col;
    private CellState state;
    
    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
        this.state = CellState.EMPTY;
    }
    
    public boolean isEmpty() {
        return state == CellState.EMPTY;
    }
    
    public String getDisplay() {
        switch (state) {
            case X: return "X";
            case O: return "O";
            case EMPTY: return " ";
            default: return " ";
        }
    }
}

enum CellState {
    EMPTY,
    X,
    O
}
```

### 3. Game
```java
public class Game {
    private Board board;
    private Player player1;
    private Player player2;
    private Player currentPlayer;
    private GameStatus status;
    private List<Move> moveHistory;
    
    public Game(Player player1, Player player2, int boardSize) {
        this.board = new Board(boardSize);
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.status = GameStatus.IN_PROGRESS;
        this.moveHistory = new ArrayList<>();
    }
    
    public boolean makeMove(int row, int col) {
        if (status != GameStatus.IN_PROGRESS) {
            return false;
        }
        
        if (!board.placeMark(row, col, currentPlayer.getMark())) {
            return false;
        }
        
        moveHistory.add(new Move(row, col, currentPlayer.getMark()));
        
        // Check win
        if (checkWin(row, col)) {
            status = GameStatus.WON;
            return true;
        }
        
        // Check draw
        if (board.isFull()) {
            status = GameStatus.DRAW;
            return true;
        }
        
        // Switch player
        switchPlayer();
        return true;
    }
    
    private boolean checkWin(int lastRow, int lastCol) {
        CellState mark = currentPlayer.getMark();
        
        // Check row
        if (checkLine(lastRow, 0, 0, 1, mark)) return true;
        
        // Check column
        if (checkLine(0, lastCol, 1, 0, mark)) return true;
        
        // Check diagonal (top-left to bottom-right)
        if (lastRow == lastCol && checkLine(0, 0, 1, 1, mark)) return true;
        
        // Check anti-diagonal (top-right to bottom-left)
        if (lastRow + lastCol == board.getSize() - 1 && 
            checkLine(0, board.getSize() - 1, 1, -1, mark)) return true;
        
        return false;
    }
    
    private boolean checkLine(int startRow, int startCol, 
                             int rowDelta, int colDelta, CellState mark) {
        for (int i = 0; i < board.getSize(); i++) {
            int row = startRow + i * rowDelta;
            int col = startCol + i * colDelta;
            
            if (board.getCell(row, col).getState() != mark) {
                return false;
            }
        }
        return true;
    }
    
    private void switchPlayer() {
        currentPlayer = (currentPlayer == player1) ? player2 : player1;
    }
}

enum GameStatus {
    IN_PROGRESS,
    WON,
    DRAW
}
```

## Key Algorithms

### 1. Minimax Algorithm (AI)
```java
public class MinimaxAI {
    private CellState aiMark;
    private CellState humanMark;
    
    public Move findBestMove(Board board, CellState mark) {
        this.aiMark = mark;
        this.humanMark = (mark == CellState.X) ? CellState.O : CellState.X;
        
        int bestScore = Integer.MIN_VALUE;
        Move bestMove = null;
        
        for (Move move : board.getAvailableMoves()) {
            // Make move
            board.placeMark(move.getRow(), move.getCol(), aiMark);
            
            // Evaluate
            int score = minimax(board, 0, false);
            
            // Undo move
            board.undoMove(move.getRow(), move.getCol());
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    private int minimax(Board board, int depth, boolean isMaximizing) {
        // Check terminal state
        GameResult result = evaluateBoard(board);
        
        if (result == GameResult.AI_WIN) {
            return 10 - depth; // Prefer faster wins
        } else if (result == GameResult.HUMAN_WIN) {
            return depth - 10; // Prefer slower losses
        } else if (result == GameResult.DRAW || board.isFull()) {
            return 0;
        }
        
        if (isMaximizing) {
            int maxScore = Integer.MIN_VALUE;
            
            for (Move move : board.getAvailableMoves()) {
                board.placeMark(move.getRow(), move.getCol(), aiMark);
                int score = minimax(board, depth + 1, false);
                board.undoMove(move.getRow(), move.getCol());
                
                maxScore = Math.max(maxScore, score);
            }
            
            return maxScore;
        } else {
            int minScore = Integer.MAX_VALUE;
            
            for (Move move : board.getAvailableMoves()) {
                board.placeMark(move.getRow(), move.getCol(), humanMark);
                int score = minimax(board, depth + 1, true);
                board.undoMove(move.getRow(), move.getCol());
                
                minScore = Math.min(minScore, score);
            }
            
            return minScore;
        }
    }
}
```

**Time Complexity:** O(b^d) where b = branching factor (~9), d = depth (~9)  
**Optimization:** Alpha-beta pruning reduces to ~O(b^(d/2))

### 2. Alpha-Beta Pruning
```java
private int minimaxAlphaBeta(Board board, int depth, int alpha, int beta, boolean isMaximizing) {
    GameResult result = evaluateBoard(board);
    
    if (result != GameResult.ONGOING || board.isFull()) {
        return getScore(result, depth);
    }
    
    if (isMaximizing) {
        int maxScore = Integer.MIN_VALUE;
        
        for (Move move : board.getAvailableMoves()) {
            board.placeMark(move.getRow(), move.getCol(), aiMark);
            int score = minimaxAlphaBeta(board, depth + 1, alpha, beta, false);
            board.undoMove(move.getRow(), move.getCol());
            
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }
        
        return maxScore;
    } else {
        int minScore = Integer.MAX_VALUE;
        
        for (Move move : board.getAvailableMoves()) {
            board.placeMark(move.getRow(), move.getCol(), humanMark);
            int score = minimaxAlphaBeta(board, depth + 1, alpha, beta, true);
            board.undoMove(move.getRow(), move.getCol());
            
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }
        
        return minScore;
    }
}
```

## Design Patterns

### 1. Strategy Pattern (AI Difficulty)
```java
interface AIStrategy {
    Move findBestMove(Board board, CellState mark);
}

class EasyAI implements AIStrategy {
    public Move findBestMove(Board board, CellState mark) {
        // Random move
        List<Move> moves = board.getAvailableMoves();
        return moves.get(new Random().nextInt(moves.size()));
    }
}

class HardAI implements AIStrategy {
    public Move findBestMove(Board board, CellState mark) {
        // Minimax with alpha-beta pruning
        return new MinimaxAI().findBestMove(board, mark);
    }
}
```

### 2. Command Pattern (Undo/Redo)
```java
interface Command {
    void execute();
    void undo();
}

class PlaceMark implements Command {
    private Board board;
    private int row, col;
    private CellState mark;
    
    public void execute() {
        board.placeMark(row, col, mark);
    }
    
    public void undo() {
        board.undoMove(row, col);
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/tictactoe/CODE)**

**Total Lines of Code:** ~500 lines

## Usage Example

```java
// Create players
Player human = new Player("Alice", CellState.X, PlayerType.HUMAN);
Player ai = new Player("AI", CellState.O, PlayerType.AI);

// Create game
Game game = new Game(human, ai, 3);

// Human move
game.makeMove(1, 1); // Center

// AI move
Move aiMove = ai.getStrategy().findBestMove(game.getBoard(), CellState.O);
game.makeMove(aiMove.getRow(), aiMove.getCol());

// Check status
if (game.getStatus() == GameStatus.WON) {
    System.out.println(game.getCurrentPlayer().getName() + " wins!");
}
```

## Common Interview Questions

### Coding Questions

1. **Check win condition**
   ```java
   boolean checkWin(Board board, int row, int col, CellState mark) {
       // Check row, column, diagonals
       return checkRow(row, mark) || 
              checkCol(col, mark) ||
              checkDiagonal(mark);
   }
   ```

2. **Implement Minimax**
   ```java
   int minimax(Board board, boolean isMax) {
       if (isWin()) return isMax ? -10 : 10;
       if (isFull()) return 0;
       
       int best = isMax ? Integer.MIN_VALUE : Integer.MAX_VALUE;
       for (Move move : getAvailableMoves()) {
           makeMove(move);
           int score = minimax(board, !isMax);
           undoMove(move);
           best = isMax ? Math.max(best, score) : Math.min(best, score);
       }
       return best;
   }
   ```

### Algorithm Questions
1. **Time complexity of Minimax?** → O(9!) worst case, ~O(9^5) average with pruning
2. **How to optimize AI?** → Alpha-beta pruning, transposition tables
3. **Prove AI is unbeatable?** → Game theory - Tic Tac Toe is a solved game

## Key Takeaways

### What Interviewers Look For
1. ✅ **Win detection** algorithm
2. ✅ **Minimax** implementation
3. ✅ **Game state** management
4. ✅ **Move validation**

### Common Mistakes
1. ❌ Inefficient win checking
2. ❌ Not handling edge cases
3. ❌ Poor Minimax implementation
4. ❌ No alpha-beta pruning

---

*Classic Tic Tac Toe with unbeatable AI using Minimax algorithm. Essential for entry-level interviews.*

## Source Code

📄 **[View Complete Source Code](/problems/tictactoe/CODE)**

---

## Advanced Algorithms

### 1. Alpha-Beta Pruning

Optimize Minimax by pruning unnecessary branches:

```java
public class AlphaBetaPruning {
    public int minimax(Board board, int depth, int alpha, int beta, boolean isMax) {
        int score = evaluate(board);
        
        // Terminal conditions
        if (score == 10) return score - depth;  // X wins
        if (score == -10) return score + depth; // O wins
        if (!board.hasMovesLeft()) return 0;    // Draw
        
        if (isMax) {
            int best = Integer.MIN_VALUE;
            for (Move move : board.getAvailableMoves()) {
                board.makeMove(move, Mark.X);
                best = Math.max(best, minimax(board, depth + 1, alpha, beta, false));
                board.undoMove(move);
                
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;  // β cutoff
            }
            return best;
        } else {
            int best = Integer.MAX_VALUE;
            for (Move move : board.getAvailableMoves()) {
                board.makeMove(move, Mark.O);
                best = Math.min(best, minimax(board, depth + 1, alpha, beta, true));
                board.undoMove(move);
                
                beta = Math.min(beta, best);
                if (beta <= alpha) break;  // α cutoff
            }
            return best;
        }
    }
}
```

**Optimization**: Reduces nodes evaluated from ~9! to ~5040 (for 3x3)

### 2. Transposition Table (Zobrist Hashing)

Cache evaluated positions to avoid recomputation:

```java
public class TranspositionTable {
    private Map<Long, Integer> cache = new HashMap<>();
    private long[][] zobristTable;
    
    public TranspositionTable() {
        // Initialize random numbers for each cell and mark
        zobristTable = new long[9][2];  // 9 cells, 2 marks (X, O)
        Random random = new Random(42);
        for (int i = 0; i < 9; i++) {
            zobristTable[i][0] = random.nextLong();
            zobristTable[i][1] = random.nextLong();
        }
    }
    
    public long computeHash(Board board) {
        long hash = 0L;
        for (int i = 0; i < 9; i++) {
            if (board.cells[i] == Mark.X) {
                hash ^= zobristTable[i][0];
            } else if (board.cells[i] == Mark.O) {
                hash ^= zobristTable[i][1];
            }
        }
        return hash;
    }
    
    public int minimaxWithCache(Board board, int depth, boolean isMax) {
        long hash = computeHash(board);
        if (cache.containsKey(hash)) {
            return cache.get(hash);
        }
        
        int score = minimax(board, depth, isMax);
        cache.put(hash, score);
        return score;
    }
}
```

**Speedup**: ~10x faster for repeated position evaluation

### 3. Opening Book Strategy

Pre-computed optimal first moves:

```java
public class OpeningBook {
    private static final Map<Integer, Integer> BEST_FIRST_MOVES = Map.of(
        4, 4,  // If center (4) is empty, take it
        0, 0,  // If corner (0) is empty, take it
        2, 2,  // Top-right corner
        6, 6,  // Bottom-left corner
        8, 8   // Bottom-right corner
    );
    
    public Move getOpeningMove(Board board) {
        if (board.moveCount == 0) {
            return new Move(1, 1);  // Always start in center
        }
        
        if (board.moveCount == 1) {
            if (board.get(1, 1) == Mark.EMPTY) {
                return new Move(1, 1);  // Take center if available
            } else {
                return new Move(0, 0);  // Take corner if center taken
            }
        }
        
        // For move 2+, use Minimax
        return null;
    }
}
```

---

## Game Variations

### 1. N×N Tic Tac Toe (Generalized)

```java
public class NxNTicTacToe {
    private int size;
    private int winLength;
    
    public NxNTicTacToe(int n, int k) {
        this.size = n;          // Board size (n×n)
        this.winLength = k;     // Win condition (k in a row)
    }
    
    public boolean checkWin(int row, int col, Mark mark) {
        // Check all 4 directions
        return checkDirection(row, col, 1, 0, mark) ||   // Horizontal
               checkDirection(row, col, 0, 1, mark) ||   // Vertical
               checkDirection(row, col, 1, 1, mark) ||   // Diagonal \
               checkDirection(row, col, 1, -1, mark);    // Diagonal /
    }
    
    private boolean checkDirection(int row, int col, int dr, int dc, Mark mark) {
        int count = 1;
        
        // Count forward
        for (int i = 1; i < winLength; i++) {
            int r = row + i * dr;
            int c = col + i * dc;
            if (r < 0 || r >= size || c < 0 || c >= size) break;
            if (board[r][c] != mark) break;
            count++;
        }
        
        // Count backward
        for (int i = 1; i < winLength; i++) {
            int r = row - i * dr;
            int c = col - i * dc;
            if (r < 0 || r >= size || c < 0 || c >= size) break;
            if (board[r][c] != mark) break;
            count++;
        }
        
        return count >= winLength;
    }
}
```

**Variations**:
- 4×4 board, 3 in a row
- 5×5 board, 4 in a row (Connect-4 style)
- 10×10 board, 5 in a row (Gomoku)

### 2. Ultimate Tic Tac Toe

Play 9 mini-boards in a 3×3 meta-board:

```java
public class UltimateTicTacToe {
    private Board[][] metaBoard = new Board[3][3];  // 9 mini-boards
    private Board gameBoard = new Board();           // Track meta-wins
    private int nextBoardRow, nextBoardCol;
    
    public boolean makeMove(int globalRow, int globalCol, Mark mark) {
        int boardRow = globalRow / 3;
        int boardCol = globalCol / 3;
        int cellRow = globalRow % 3;
        int cellCol = globalCol % 3;
        
        // Check if move is valid (must play in correct mini-board)
        if (nextBoardRow != -1 && 
            (boardRow != nextBoardRow || boardCol != nextBoardCol)) {
            return false;
        }
        
        // Make move in mini-board
        Board miniBoard = metaBoard[boardRow][boardCol];
        if (!miniBoard.makeMove(cellRow, cellCol, mark)) {
            return false;
        }
        
        // Check if mini-board is won
        if (miniBoard.checkWin(cellRow, cellCol, mark)) {
            gameBoard.set(boardRow, boardCol, mark);
        }
        
        // Set next mini-board
        nextBoardRow = cellRow;
        nextBoardCol = cellCol;
        
        return true;
    }
}
```

---

## Network Play Implementation

### Server-Client Architecture

```java
// Server
public class TicTacToeServer {
    private ServerSocket serverSocket;
    private Map<String, GameSession> activeSessions = new ConcurrentHashMap<>();
    
    public void start(int port) throws IOException {
        serverSocket = new ServerSocket(port);
        while (true) {
            Socket client = serverSocket.accept();
            new ClientHandler(client).start();
        }
    }
    
    private class ClientHandler extends Thread {
        private Socket socket;
        private PrintWriter out;
        private BufferedReader in;
        
        public void run() {
            try {
                out = new PrintWriter(socket.getOutputStream(), true);
                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                
                // Wait for matchmaking
                GameSession session = matchmaking.findOpponent();
                session.addPlayer(this);
                
                // Game loop
                while (!session.isGameOver()) {
                    String move = in.readLine();
                    session.processMove(move);
                    broadcastState(session);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

// Client
public class TicTacToeClient {
    private Socket socket;
    
    public void connect(String host, int port) throws IOException {
        socket = new Socket(host, port);
        new ServerListener().start();
    }
    
    public void sendMove(int row, int col) throws IOException {
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println(row + "," + col);
    }
    
    private class ServerListener extends Thread {
        public void run() {
            try {
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream())
                );
                String message;
                while ((message = in.readLine()) != null) {
                    processServerMessage(message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

---

## Tournament System

### Elo Rating System

```java
public class EloRating {
    private static final int K_FACTOR = 32;
    
    public void updateRatings(Player winner, Player loser) {
        double expectedWin = 1.0 / (1.0 + Math.pow(10, 
            (loser.rating - winner.rating) / 400.0));
        double expectedLose = 1.0 / (1.0 + Math.pow(10, 
            (winner.rating - loser.rating) / 400.0));
        
        winner.rating += K_FACTOR * (1.0 - expectedWin);
        loser.rating += K_FACTOR * (0.0 - expectedLose);
    }
    
    public void updateDraw(Player p1, Player p2) {
        double expected1 = 1.0 / (1.0 + Math.pow(10, (p2.rating - p1.rating) / 400.0));
        double expected2 = 1.0 / (1.0 + Math.pow(10, (p1.rating - p2.rating) / 400.0));
        
        p1.rating += K_FACTOR * (0.5 - expected1);
        p2.rating += K_FACTOR * (0.5 - expected2);
    }
}
```

---

## Interview Deep Dive

### Common Interview Questions

**Q1: How do you detect if a move creates a winning condition in O(1) time?**

**Answer**: Maintain counters for each row, column, and diagonal.

```java
public class FastWinDetection {
    private int[] rowCounts = new int[3];
    private int[] colCounts = new int[3];
    private int diagCount = 0;
    private int antiDiagCount = 0;
    
    public boolean makeMove(int row, int col, Mark mark) {
        int value = (mark == Mark.X) ? 1 : -1;
        
        rowCounts[row] += value;
        colCounts[col] += value;
        if (row == col) diagCount += value;
        if (row + col == 2) antiDiagCount += value;
        
        return Math.abs(rowCounts[row]) == 3 ||
               Math.abs(colCounts[col]) == 3 ||
               Math.abs(diagCount) == 3 ||
               Math.abs(antiDiagCount) == 3;
    }
}
```

**Q2: Can you prove that perfect play always results in a draw?**

**Answer**: Game tree analysis shows:
- Total possible games: 255,168
- X wins: 131,184
- O wins: 77,904
- Draws: 46,080

With perfect play (Minimax), the game always results in a draw because:
1. The first player (X) can force at least a draw
2. The second player (O) can prevent X from winning
3. Neither can force a win against optimal defense

---

## Related Problems
- ♟️ **[Chess](/problems/chess/README)** - More complex board game
- 🎲 **Connect Four** - Similar win detection
- 🐍 **[Snake and Ladder](/problems/snakeandladder/README)** - Turn-based game
- 🎮 **Game AI** - Minimax, alpha-beta pruning

---

*Essential game programming problem for understanding Minimax, game state management, and AI algorithms.*
