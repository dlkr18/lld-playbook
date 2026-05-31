package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.User;
import com.you.lld.problems.stackoverflow.service.ReputationListener;

/**
 * Logs reputation milestones — demonstrates Observer on reputation events.
 */
public class LoggingReputationListener implements ReputationListener {

    @Override
    public void onReputationChanged(User user, int delta, int newTotal) {
        System.out.println("  [rep] " + user.getUsername() + " " + formatDelta(delta)
                + " -> " + newTotal + badgeNote(newTotal));
    }

    private static String formatDelta(int delta) {
        return delta >= 0 ? ("+" + delta) : String.valueOf(delta);
    }

    private static String badgeNote(int total) {
        if (total >= 1000) {
            return " (gold-tier rep)";
        }
        if (total >= 100) {
            return " (silver-tier rep)";
        }
        if (total >= 10) {
            return " (bronze-tier rep)";
        }
        return "";
    }
}
