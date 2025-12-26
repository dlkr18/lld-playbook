package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.model.LogEntry;
import java.util.List;

public interface LogAggregator {
    void ingestLog(String service, String level, String message);
    List<LogEntry> search(String service, String level);
    List<LogEntry> getRecentLogs(int count);
}
