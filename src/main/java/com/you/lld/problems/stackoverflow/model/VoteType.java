package com.you.lld.problems.stackoverflow.model;

/**
 * Type of vote that can be cast on content.
 */
public enum VoteType {
    /**
     * Positive vote indicating quality or usefulness.
     * Increases reputation by 10 points.
     */
    UPVOTE(+1, 10),
    
    /**
     * Negative vote indicating poor quality.
     * Decreases reputation by 2 points.
     */
    DOWNVOTE(-1, -2);
    
    private final int value;
    private final int reputationChange;
    
    VoteType(int value, int reputationChange) {
        this.value = value;
        this.reputationChange = reputationChange;
    }
    
    /**
     * Returns the numeric value of the vote (+1 or -1).
     */
    public int getValue() {
        return value;
    }
    
    /**
     * Returns the reputation change caused by this vote type.
     */
    public int getReputationChange() {
        return reputationChange;
    }
}

