package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.VoteType;

/**
 * Strategy for reputation changes — pluggable rules (Stack Overflow defaults).
 */
public interface ReputationPolicy {

    int reputationForVote(VoteType voteType);

    int reputationForAcceptedAnswer();
}
