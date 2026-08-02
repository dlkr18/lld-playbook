package com.you.lld.problems.cricinfo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A limited-overs match: two innings, each an append-only sequence of balls.
 *
 * <p>Scores are <b>derived from the innings</b>, not stored. The previous version
 * kept {@code team1Score} / {@code team2Score} as bare ints with a
 * {@code setScore(team, runs)} setter, which meant the "score" was whatever the
 * last caller happened to pass and had no relationship to the balls bowled.
 *
 * <p>Mutating methods are {@code synchronized}: live scoring arrives from a feed
 * while readers render the scorecard.
 */
public class Match {

    public static final int DEFAULT_OVERS = 20;

    private final String id;
    private final Team team1;
    private final Team team2;
    private final String venue;
    private final LocalDateTime startTime;
    private final int oversPerInnings;
    private final List<Innings> innings = new ArrayList<Innings>();

    private MatchStatus status;
    private Team winner;

    public Match(String id, Team team1, Team team2, String venue, LocalDateTime startTime) {
        this(id, team1, team2, venue, startTime, DEFAULT_OVERS);
    }

    public Match(String id, Team team1, Team team2, String venue,
                 LocalDateTime startTime, int oversPerInnings) {
        if (team1 == null || team2 == null) {
            throw new IllegalArgumentException("Both teams required");
        }
        if (team1.equals(team2)) {
            throw new IllegalArgumentException("A team cannot play itself");
        }
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.venue = venue;
        this.startTime = startTime;
        this.oversPerInnings = oversPerInnings;
        this.status = MatchStatus.SCHEDULED;
    }

    public synchronized void start() {
        this.status = MatchStatus.IN_PROGRESS;
    }

    /** Opens an innings with {@code battingTeam} at the crease. */
    public synchronized Innings startInnings(Team battingTeam) {
        requireParticipant(battingTeam, "bat");
        if (status != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Match is not in progress: " + status);
        }
        if (innings.size() >= 2) {
            throw new IllegalStateException("Both innings have already been played");
        }
        if (!innings.isEmpty() && !currentInnings().isComplete()) {
            throw new IllegalStateException("Current innings is not complete: " + currentInnings());
        }
        Innings next = new Innings(battingTeam, other(battingTeam), oversPerInnings);
        innings.add(next);
        return next;
    }

    public synchronized void recordBall(Ball ball) {
        if (status != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Match is not in progress: " + status);
        }
        if (innings.isEmpty()) {
            throw new IllegalStateException("No innings has been started");
        }
        currentInnings().record(ball);
    }

    public synchronized Innings currentInnings() {
        if (innings.isEmpty()) {
            throw new IllegalStateException("No innings has been started");
        }
        return innings.get(innings.size() - 1);
    }

    /**
     * Ends the match.
     *
     * <p>{@code winner} must be one of the two participants. Previously any team
     * could be passed, and the loser was computed as
     * {@code winner == team1 ? team2 : team1} — so a third team could "win" while
     * team1 was recorded as having lost a match it did not lose.
     */
    public synchronized void end(Team winner) {
        requireParticipant(winner, "win");
        this.status = MatchStatus.COMPLETED;
        this.winner = winner;
        winner.recordWin();
        other(winner).recordLoss();
    }

    /** Ends with no winner — rain, bad light, abandonment. */
    public synchronized void endWithoutResult() {
        this.status = MatchStatus.COMPLETED;
        this.winner = null;
    }

    private void requireParticipant(Team team, String action) {
        if (team == null || (!team.equals(team1) && !team.equals(team2))) {
            throw new IllegalArgumentException(
                    (team == null ? "null" : team.getName()) + " is not playing in this match, so cannot "
                            + action + " it (" + team1.getName() + " v " + team2.getName() + ")");
        }
    }

    private Team other(Team team) {
        return team.equals(team1) ? team2 : team1;
    }

    public synchronized int scoreOf(Team team) {
        requireParticipant(team, "score in");
        int total = 0;
        for (Innings i : innings) {
            if (i.getBattingTeam().equals(team)) {
                total += i.getRuns();
            }
        }
        return total;
    }

    public String getId() {
        return id;
    }

    public Team getTeam1() {
        return team1;
    }

    public Team getTeam2() {
        return team2;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public int getOversPerInnings() {
        return oversPerInnings;
    }

    public synchronized MatchStatus getStatus() {
        return status;
    }

    public synchronized Team getWinner() {
        return winner;
    }

    public synchronized int getTeam1Score() {
        return scoreOf(team1);
    }

    public synchronized int getTeam2Score() {
        return scoreOf(team2);
    }

    public synchronized List<Innings> getInnings() {
        return Collections.unmodifiableList(new ArrayList<Innings>(innings));
    }

    @Override
    public synchronized String toString() {
        return team1.getName() + " vs " + team2.getName() + " at " + venue + " - " + status;
    }
}
