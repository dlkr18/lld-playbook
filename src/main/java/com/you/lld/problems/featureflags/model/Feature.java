package com.you.lld.problems.featureflags.model;

import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * A flag's configuration.
 *
 * <p><b>Thread-safety:</b> flags are written rarely (an operator toggling them) and
 * read constantly (every request), so the mutable scalars are {@code volatile} and
 * the rule list is a {@link CopyOnWriteArrayList} — the one case COW is exactly
 * right. A plain {@code ArrayList} here meant a rule added during a request could
 * be seen half-published, or throw {@code ConcurrentModificationException} mid-
 * evaluation.
 */
public class Feature {
    private final String id;
    private final String name;
    private volatile boolean enabled;
    private volatile int rolloutPercentage;
    private final List<TargetingRule> targetingRules;

    public Feature(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
        this.rolloutPercentage = 100;
        this.targetingRules = new CopyOnWriteArrayList<TargetingRule>();
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    /**
     * Rejects an out-of-range percentage <b>here</b>, at configuration time.
     *
     * <p>Validation used to live only in {@code PercentageRolloutStrategy}'s
     * constructor, which is built per evaluation — so {@code setRolloutPercentage(150)}
     * was accepted silently and then threw on every subsequent flag check, turning a
     * typo into a hot-path outage.
     */
    public void setRolloutPercentage(int percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Rollout percentage must be 0-100, got " + percentage);
        }
        this.rolloutPercentage = percentage;
    }

    public void addTargetingRule(TargetingRule rule) {
        targetingRules.add(rule);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getRolloutPercentage() {
        return rolloutPercentage;
    }

    public List<TargetingRule> getTargetingRules() {
        return Collections.unmodifiableList(targetingRules);
    }

    @Override
    public String toString() {
        return name + " (enabled=" + enabled + ", rollout=" + rolloutPercentage + "%)";
    }
}
