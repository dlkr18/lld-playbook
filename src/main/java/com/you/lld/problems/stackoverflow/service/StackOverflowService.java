package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.*;

import java.util.List;
import java.util.Set;

public interface StackOverflowService {

    User registerUser(String username, String email, String passwordHash);

    User getUser(long userId);

    User getUserByUsername(String username);

    void suspendUser(long userId);

    Question askQuestion(long authorId, String title, String body, Set<Tag> tags);

    Question getQuestion(long questionId);

    void editQuestion(long questionId, long editorId, String newTitle, String newBody);

    void closeQuestion(long questionId, long closerId);

    Answer postAnswer(long questionId, long authorId, String body);

    void acceptAnswer(long questionId, long answerId, long acceptorId);

    void voteQuestion(long questionId, long voterId, VoteType voteType);

    void voteAnswer(long answerId, long voterId, VoteType voteType);

    List<Question> searchQuestions(String keyword);

    List<Question> getQuestionsByTag(String tagName);

    List<Answer> getAnswers(long questionId);

    void addReputationListener(ReputationListener listener);
}
