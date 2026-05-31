package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.Question;

import java.util.Collection;
import java.util.List;

/**
 * Strategy for filtering and ranking questions in search/browse.
 */
public interface SearchStrategy {

    List<Question> searchByKeyword(Collection<Question> questions, String keyword);

    List<Question> sortByVotes(List<Question> questions);
}
