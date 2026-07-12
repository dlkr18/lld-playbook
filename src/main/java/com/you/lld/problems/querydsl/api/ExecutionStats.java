package com.you.lld.problems.querydsl.api;

/** Observability envelope: what the execution cost. */
public final class ExecutionStats {

    private final long rowsScanned;
    private final long elapsedMicros;

    public ExecutionStats(long rowsScanned, long elapsedMicros) {
        this.rowsScanned = rowsScanned;
        this.elapsedMicros = elapsedMicros;
    }

    public long rowsScanned() { return rowsScanned; }
    public long elapsedMicros() { return elapsedMicros; }
}
