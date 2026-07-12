package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.User;

/**
 * Observer — notified when a user's reputation changes (badges, notifications).
 */
public interface ReputationListener {

    void onReputationChanged(User user, int delta, int newTotal);
}
