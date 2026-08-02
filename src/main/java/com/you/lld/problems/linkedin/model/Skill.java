package com.you.lld.problems.linkedin.model;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A profile skill and who has endorsed it.
 *
 * <p>Endorsements are a <b>set of endorser ids</b>, not a counter. A bare
 * {@code endorsements++} lets one person endorse the same skill repeatedly — and
 * lets the owner endorse themselves — which makes the number worthless as a
 * signal. The set makes "one endorsement per person" true by construction.
 */
public class Skill {
    private final String name;
    private final Set<String> endorserIds = ConcurrentHashMap.newKeySet();

    public Skill(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public int getEndorsements() {
        return endorserIds.size();
    }

    public Set<String> getEndorserIds() {
        return Collections.unmodifiableSet(endorserIds);
    }

    public boolean isEndorsedBy(String endorserId) {
        return endorserIds.contains(endorserId);
    }

    /** @return true if this was a new endorsement, false if already endorsed. */
    public boolean endorse(String endorserId) {
        return endorserIds.add(endorserId);
    }

    public boolean withdrawEndorsement(String endorserId) {
        return endorserIds.remove(endorserId);
    }
}
