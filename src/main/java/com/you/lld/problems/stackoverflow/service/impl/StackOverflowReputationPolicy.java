package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.VoteType;
import com.you.lld.problems.stackoverflow.service.ReputationPolicy;

public class StackOverflowReputationPolicy implements ReputationPolicy {

    @Override
    public int reputationForVote(VoteType voteType) {
        return voteType.getReputationChange();
    }

    @Override
    public int reputationForAcceptedAnswer() {
        return 15;
    }
}
