# tictactoe - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/tictactoe/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py tictactoe`.

## Project Structure (14 files)

```
tictactoe/
├── TicTacToeDemo.java
├── TicTacToe.java
├── model/Board.java
├── model/GamePhase.java
├── model/Move.java
├── model/MoveResult.java
├── model/Player.java
├── model/Position.java
├── service/WinChecker.java
├── command/MoveHistory.java
├── state/FinishedState.java
├── state/GameState.java
├── state/InProgressState.java
├── state/NotStartedState.java
```

## Source Code

### `TicTacToeDemo.java`

<details>
<summary>Click to view TicTacToeDemo.java</summary>

```java
package com.you.lld.problems.tictactoe;

import com.you.lld.problems.tictactoe.model.MoveResult;

public class TicTacToeDemo {

    public static void main(String[] args) {
        System.out.println("=== Tic Tac Toe Demo ===\n");

        System.out.println("--- Scenario 1: X wins (top row) ---");
        TicTacToe g1 = new TicTacToe();
        g1.start();
        play(g1, "a1");
        play(g1, "b1");
        play(g1, "a2");
        play(g1, "b2");
        play(g1, "a3");
        System.out.println("Phase: " + g1.getPhase() + "\n");

        System.out.println("--- Scenario 2: Draw ---");
        TicTacToe g2 = new TicTacToe();
        g2.start();
        play(g2, "a1");
        play(g2, "a2");
        play(g2, "a3");
        play(g2, "b2");
        play(g2, "b1");
        play(g2, "c1");
        play(g2, "b3");
        play(g2, "c3");
        play(g2, "c2");
        System.out.println("Phase: " + g2.getPhase() + "\n");

        System.out.println("--- Scenario 3: Command undo ---");
        TicTacToe g3 = new TicTacToe();
        g3.start();
        play(g3, "b2");
        play(g3, "a1");
        System.out.println("Moves: " + g3.getMoveCount());
        g3.undo();
        System.out.println("After undo: " + g3.getMoveCount() + " moves, current=" + g3.getCurrentPlayer());

        System.out.println("\n--- Scenario 4: Invalid move ---");
        TicTacToe g4 = new TicTacToe();
        g4.start();
        play(g4, "b2");
        play(g4, "b2");

        System.out.println("\n--- Scenario 5: Move on finished game ---");
        TicTacToe g5 = new TicTacToe();
        g5.start();
        play(g5, "a1");
        play(g5, "b1");
        play(g5, "a2");
        play(g5, "b2");
        play(g5, "a3");
        play(g5, "c1");

        System.out.println("\n=== Demo complete ===");
    }

    private static void play(TicTacToe game, String notation) {
        MoveResult result = game.makeMove(notation);
        System.out.println("  " + notation + " -> " + result.getMessage());
    }
}
```

</details>

### `TicTacToe.java`

<details>
<summary>Click to view TicTacToe.java</summary>

```java
package com.you.lld.problems.tictactoe;

import com.you.lld.problems.tictactoe.command.MoveHistory;
import com.you.lld.problems.tictactoe.model.Board;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.Move;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;
import com.you.lld.problems.tictactoe.service.WinChecker;
import com.you.lld.problems.tictactoe.state.GameState;
import com.you.lld.problems.tictactoe.state.NotStartedState;

import java.util.Collections;
import java.util.List;

public class TicTacToe {

    private Board board;
    private Player currentPlayer;
    private GamePhase phase;
    private GameState state;
    private final WinChecker winChecker;
    private final MoveHistory moveHistory;

    public TicTacToe() {
        this.board = new Board();
        this.currentPlayer = Player.X;
        this.phase = GamePhase.NOT_STARTED;
        this.state = new NotStartedState();
        this.winChecker = new WinChecker();
        this.moveHistory = new MoveHistory();
    }

    public void start() {
        state.start(this);
    }

    public MoveResult makeMove(Position position) {
        return state.makeMove(this, position);
    }

    public MoveResult makeMove(String notation) {
        try {
            return makeMove(Position.fromNotation(notation));
        } catch (IllegalArgumentException e) {
            return MoveResult.error("Invalid notation: " + notation);
        }
    }

    public boolean undo() {
        return moveHistory.undo(this);
    }

    public List<Position> getLegalMoves() {
        if (phase != GamePhase.IN_PROGRESS) {
            return Collections.emptyList();
        }
        return board.emptyPositions();
    }

    public void reset() {
        resetBoard();
        phase = GamePhase.NOT_STARTED;
        state = new NotStartedState();
    }

    // Hooks for state objects in subpackages

    public void resetBoard() {
        board = new Board();
        currentPlayer = Player.X;
        winChecker.reset();
        moveHistory.clear();
    }

    public void recordMove(Move move) {
        moveHistory.push(move);
    }

    public void switchPlayer() {
        currentPlayer = currentPlayer.opponent();
    }

    public void setPhase(GamePhase phase) {
        this.phase = phase;
    }

    public void setState(GameState state) {
        this.state = state;
    }

    public void setCurrentPlayer(Player player) {
        this.currentPlayer = player;
    }

    public Board getBoard() {
        return board;
    }

    public Player getCurrentPlayer() {
        return currentPlayer;
    }

    public GamePhase getPhase() {
        return phase;
    }

    public WinChecker getWinChecker() {
        return winChecker;
    }

    public int getMoveCount() {
        return moveHistory.size();
    }

    public boolean isGameOver() {
        return phase == GamePhase.X_WON || phase == GamePhase.O_WON || phase == GamePhase.DRAW;
    }
}
```

</details>

### `model/Board.java`

<details>
<summary>Click to view model/Board.java</summary>

```java
package com.you.lld.problems.tictactoe.model;

import java.util.ArrayList;
import java.util.List;

public class Board {

    public static final int SIZE = 3;
    public static final int WIN_LENGTH = 3;

    private final Player[][] grid;

    public Board() {
        this.grid = new Player[SIZE][SIZE];
    }

    public boolean isValidMove(Position pos) {
        return inBounds(pos) && grid[pos.getRow()][pos.getCol()] == null;
    }

    public void place(Position pos, Player player) {
        if (!isValidMove(pos)) {
            throw new IllegalStateException("Invalid move: " + pos);
        }
        grid[pos.getRow()][pos.getCol()] = player;
    }

    public void clear(Position pos) {
        if (inBounds(pos)) {
            grid[pos.getRow()][pos.getCol()] = null;
        }
    }

    public Player get(Position pos) {
        return inBounds(pos) ? grid[pos.getRow()][pos.getCol()] : null;
    }

    public boolean isFull() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (grid[r][c] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    public List<Position> emptyPositions() {
        List<Position> empty = new ArrayList<>();
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (grid[r][c] == null) {
                    empty.add(new Position(r, c));
                }
            }
        }
        return empty;
    }

    private boolean inBounds(Position pos) {
        return pos.getRow() >= 0 && pos.getRow() < SIZE
            && pos.getCol() >= 0 && pos.getCol() < SIZE;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("-------------\n");
        for (int r = 0; r < SIZE; r++) {
            sb.append("| ");
            for (int c = 0; c < SIZE; c++) {
                Player p = grid[r][c];
                sb.append(p == null ? " " : p.getSymbol()).append(" | ");
            }
            sb.append("\n-------------\n");
        }
        return sb.toString();
    }
}
```

</details>

### `model/GamePhase.java`

<details>
<summary>Click to view model/GamePhase.java</summary>

```java
package com.you.lld.problems.tictactoe.model;

public enum GamePhase {
    NOT_STARTED,
    IN_PROGRESS,
    X_WON,
    O_WON,
    DRAW
}
```

</details>

### `model/Move.java`

<details>
<summary>Click to view model/Move.java</summary>

```java
package com.you.lld.problems.tictactoe.model;

public final class Move {

    private final Player player;
    private final Position position;

    public Move(Player player, Position position) {
        this.player = player;
        this.position = position;
    }

    public Player getPlayer() {
        return player;
    }

    public Position getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return player + " at " + position;
    }
}
```

</details>

### `model/MoveResult.java`

<details>
<summary>Click to view model/MoveResult.java</summary>

```java
package com.you.lld.problems.tictactoe.model;

public final class MoveResult {

    private final boolean valid;
    private final String message;
    private final GamePhase phase;
    private final Player nextPlayer;
    private final Player winner;

    private MoveResult(boolean valid, String message, GamePhase phase, Player nextPlayer, Player winner) {
        this.valid = valid;
        this.message = message;
        this.phase = phase;
        this.nextPlayer = nextPlayer;
        this.winner = winner;
    }

    public static MoveResult success(Player nextPlayer) {
        return new MoveResult(true, "Move successful", GamePhase.IN_PROGRESS, nextPlayer, null);
    }

    public static MoveResult gameOver(GamePhase phase, Player winner) {
        String msg = winner != null ? winner + " wins!" : "Draw!";
        return new MoveResult(true, msg, phase, null, winner);
    }

    public static MoveResult error(String message) {
        return new MoveResult(false, message, null, null, null);
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }

    public GamePhase getPhase() {
        return phase;
    }

    public Player getNextPlayer() {
        return nextPlayer;
    }

    public Player getWinner() {
        return winner;
    }

    public boolean isGameOver() {
        return phase == GamePhase.X_WON || phase == GamePhase.O_WON || phase == GamePhase.DRAW;
    }
}
```

</details>

### `model/Player.java`

<details>
<summary>Click to view model/Player.java</summary>

```java
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
```

</details>

### `model/Position.java`

<details>
<summary>Click to view model/Position.java</summary>

```java
package com.you.lld.problems.tictactoe.model;

public final class Position {

    private final int row;
    private final int col;

    public Position(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    public static Position fromNotation(String notation) {
        if (notation == null || notation.length() != 2) {
            throw new IllegalArgumentException("Invalid notation: " + notation);
        }
        int col = Character.toLowerCase(notation.charAt(0)) - 'a';
        int row = notation.charAt(1) - '1';
        if (col < 0 || col >= Board.SIZE || row < 0 || row >= Board.SIZE) {
            throw new IllegalArgumentException("Position out of bounds: " + notation);
        }
        return new Position(row, col);
    }

    public String toNotation() {
        return "" + (char) ('a' + col) + (char) ('1' + row);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Position)) {
            return false;
        }
        Position other = (Position) obj;
        return row == other.row && col == other.col;
    }

    @Override
    public int hashCode() {
        return 31 * row + col;
    }

    @Override
    public String toString() {
        return toNotation();
    }
}
```

</details>

### `service/WinChecker.java`

<details>
<summary>Click to view service/WinChecker.java</summary>

```java
package com.you.lld.problems.tictactoe.service;

import com.you.lld.problems.tictactoe.model.Board;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;

import java.util.Optional;

/**
 * O(1) win detection — increment row/col/diagonal counters per move instead of scanning the board.
 */
public class WinChecker {

    private final int[] rowX = new int[Board.SIZE];
    private final int[] rowO = new int[Board.SIZE];
    private final int[] colX = new int[Board.SIZE];
    private final int[] colO = new int[Board.SIZE];
    private int diagX;
    private int diagO;
    private int antiDiagX;
    private int antiDiagO;
    private int movesPlayed;

    public Optional<Player> registerMove(Position pos, Player player) {
        movesPlayed++;
        int r = pos.getRow();
        int c = pos.getCol();

        if (player == Player.X) {
            if (++rowX[r] == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (++colX[c] == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (r == c && ++diagX == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (r + c == Board.SIZE - 1 && ++antiDiagX == Board.WIN_LENGTH) return Optional.of(Player.X);
        } else {
            if (++rowO[r] == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (++colO[c] == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (r == c && ++diagO == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (r + c == Board.SIZE - 1 && ++antiDiagO == Board.WIN_LENGTH) return Optional.of(Player.O);
        }
        return Optional.empty();
    }

    public void unregisterMove(Position pos, Player player) {
        movesPlayed--;
        int r = pos.getRow();
        int c = pos.getCol();
        if (player == Player.X) {
            rowX[r]--;
            colX[c]--;
            if (r == c) diagX--;
            if (r + c == Board.SIZE - 1) antiDiagX--;
        } else {
            rowO[r]--;
            colO[c]--;
            if (r == c) diagO--;
            if (r + c == Board.SIZE - 1) antiDiagO--;
        }
    }

    public int getMovesPlayed() {
        return movesPlayed;
    }

    public void reset() {
        for (int i = 0; i < Board.SIZE; i++) {
            rowX[i] = 0;
            rowO[i] = 0;
            colX[i] = 0;
            colO[i] = 0;
        }
        diagX = diagO = antiDiagX = antiDiagO = 0;
        movesPlayed = 0;
    }
}
```

</details>

### `command/MoveHistory.java`

<details>
<summary>Click to view command/MoveHistory.java</summary>

```java
package com.you.lld.problems.tictactoe.command;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.Move;

import java.util.ArrayDeque;
import java.util.Deque;

/** Command pattern — stack of moves for O(1) undo. */
public class MoveHistory {

    private final Deque<Move> stack = new ArrayDeque<>();

    public void push(Move move) {
        stack.push(move);
    }

    public boolean undo(TicTacToe game) {
        if (stack.isEmpty()) {
            return false;
        }
        Move last = stack.pop();
        game.getBoard().clear(last.getPosition());
        game.getWinChecker().unregisterMove(last.getPosition(), last.getPlayer());
        game.setCurrentPlayer(last.getPlayer());
        if (game.getPhase() != com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS) {
            game.setPhase(com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS);
            game.setState(new com.you.lld.problems.tictactoe.state.InProgressState());
        }
        return true;
    }

    public void clear() {
        stack.clear();
    }

    public int size() {
        return stack.size();
    }
}
```

</details>

### `state/FinishedState.java`

<details>
<summary>Click to view state/FinishedState.java</summary>

```java
package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Position;

public class FinishedState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, Position position) {
        return MoveResult.error("Game is over. Phase: " + game.getPhase());
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
        game.setPhase(com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS);
        game.setState(new InProgressState());
    }
}
```

</details>

### `state/GameState.java`

<details>
<summary>Click to view state/GameState.java</summary>

```java
package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Position;

public interface GameState {

    MoveResult makeMove(TicTacToe game, Position position);

    void start(TicTacToe game);
}
```

</details>

### `state/InProgressState.java`

<details>
<summary>Click to view state/InProgressState.java</summary>

```java
package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.Move;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;

import java.util.Optional;

public class InProgressState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, Position position) {
        if (!game.getBoard().isValidMove(position)) {
            return MoveResult.error("Invalid move: " + position);
        }

        Player current = game.getCurrentPlayer();
        game.getBoard().place(position, current);
        game.recordMove(new Move(current, position));

        Optional<Player> winner = game.getWinChecker().registerMove(position, current);
        if (winner.isPresent()) {
            GamePhase phase = winner.get() == Player.X ? GamePhase.X_WON : GamePhase.O_WON;
            game.setPhase(phase);
            game.setState(new FinishedState());
            return MoveResult.gameOver(phase, winner.get());
        }
        if (game.getBoard().isFull()) {
            game.setPhase(GamePhase.DRAW);
            game.setState(new FinishedState());
            return MoveResult.gameOver(GamePhase.DRAW, null);
        }
        game.switchPlayer();
        return MoveResult.success(game.getCurrentPlayer());
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
    }
}
```

</details>

### `state/NotStartedState.java`

<details>
<summary>Click to view state/NotStartedState.java</summary>

```java
package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.MoveResult;

public class NotStartedState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, com.you.lld.problems.tictactoe.model.Position position) {
        return MoveResult.error("Game not started. Call start() first.");
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
        game.setPhase(GamePhase.IN_PROGRESS);
        game.setState(new InProgressState());
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.tictactoe.TicTacToeDemo"
```
