package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.Question;
import com.you.lld.problems.stackoverflow.service.SearchStrategy;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class VoteScoreSearchStrategy implements SearchStrategy {

    @Override
    public List<Question> searchByKeyword(Collection<Question> questions, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return sortByVotes(new ArrayList<Question>(questions));
        }
        String lower = keyword.toLowerCase().trim();
        List<Question> matched = new ArrayList<Question>();
        for (Question q : questions) {
            if (q.getTitle().toLowerCase().contains(lower)
                    || q.getBody().toLowerCase().contains(lower)) {
                matched.add(q);
            }
        }
        return sortByVotes(matched);
    }

    @Override
    public List<Question> sortByVotes(List<Question> questions) {
        return questions.stream()
                .sorted(Comparator.comparingInt(Question::getVoteCount).reversed())
                .collect(Collectors.toList());
    }
}
