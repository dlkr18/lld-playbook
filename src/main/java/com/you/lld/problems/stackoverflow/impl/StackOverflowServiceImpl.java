package com.you.lld.problems.stackoverflow.impl;

import com.you.lld.problems.stackoverflow.model.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Thread-safe in-memory Stack Overflow service.
 *
 * Features:
 *  - User registration with unique username/email
 *  - Question posting with tags, editing, closing
 *  - Answer posting, editing, acceptance
 *  - Voting with reputation tracking
 *  - Search by keyword and tag
 *  - Thread-safe with ConcurrentHashMap
 */
public class StackOverflowServiceImpl {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final Map<Long, Question> questions = new ConcurrentHashMap<>();
    private final Map<Long, Answer> answers = new ConcurrentHashMap<>();
    private final Map<String, Long> usernameIndex = new ConcurrentHashMap<>(); // username -> userId
    private final Map<String, Set<Long>> tagIndex = new ConcurrentHashMap<>(); // tag -> questionIds
    // Track who voted on what to prevent double voting
    private final Map<String, VoteType> votes = new ConcurrentHashMap<>(); // "userId:targetType:targetId" -> vote

    private final AtomicLong userIdGen = new AtomicLong(0);
    private final AtomicLong questionIdGen = new AtomicLong(0);
    private final AtomicLong answerIdGen = new AtomicLong(0);

    // ==================== User Operations ====================

    public User registerUser(String username, String email, String passwordHash) {
        // Check unique username
        if (usernameIndex.containsKey(username.toLowerCase())) {
            throw new IllegalArgumentException("Username already taken: " + username);
        }

        long id = userIdGen.incrementAndGet();
        User user = new User(new UserId(id), username, email, passwordHash);
        users.put(id, user);
        usernameIndex.put(username.toLowerCase(), id);
        return user;
    }

    public User getUser(long userId) {
        User user = users.get(userId);
        if (user == null) throw new IllegalArgumentException("User not found: " + userId);
        return user;
    }

    // ==================== Question Operations ====================

    public Question askQuestion(long authorId, String title, String body, Set<Tag> tags) {
        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot ask questions");
        }

        long qId = questionIdGen.incrementAndGet();
        Question question = new Question(new QuestionId(qId), title, body, author.getId(), tags);
        questions.put(qId, question);

        // Update tag index
        for (Tag tag : tags) {
            tagIndex.computeIfAbsent(tag.getName(), k -> ConcurrentHashMap.newKeySet()).add(qId);
        }

        return question;
    }

    public Question getQuestion(long questionId) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found: " + questionId);
        q.incrementViews();
        return q;
    }

    public void editQuestion(long questionId, long editorId, String newTitle, String newBody) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found");
        // Only author can edit (simplified; real SO allows high-rep users)
        if (q.getAuthorId().getValue() != editorId) {
            throw new IllegalStateException("Only the author can edit this question");
        }
        q.edit(newTitle, newBody);
    }

    public void closeQuestion(long questionId, long closerId) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found");
        q.close();
    }

    // ==================== Answer Operations ====================

    public Answer postAnswer(long questionId, long authorId, String body) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found");
        if (!q.isOpen()) {
            throw new IllegalStateException("Cannot answer a closed question");
        }

        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot post answers");
        }
        // Cannot answer own question (optional rule)
        if (q.getAuthorId().getValue() == authorId) {
            // Allow it -- SO allows self-answers
        }

        long aId = answerIdGen.incrementAndGet();
        Answer answer = new Answer(new AnswerId(aId), q.getId(), body, author.getId());
        answers.put(aId, answer);
        return answer;
    }

    public void acceptAnswer(long questionId, long answerId, long acceptorId) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found");
        if (q.getAuthorId().getValue() != acceptorId) {
            throw new IllegalStateException("Only question author can accept answers");
        }

        Answer a = answers.get(answerId);
        if (a == null) throw new IllegalArgumentException("Answer not found");
        if (a.getQuestionId().getValue() != questionId) {
            throw new IllegalArgumentException("Answer does not belong to this question");
        }

        // Unaccept previous if exists
        q.getAcceptedAnswerId().ifPresent(prevId -> {
            Answer prev = answers.get(prevId.getValue());
            if (prev != null) {
                prev.unmarkAsAccepted();
                // Remove reputation from previous answerer
                User prevAuthor = users.get(prev.getAuthorId().getValue());
                if (prevAuthor != null) prevAuthor.addReputation(-15);
            }
        });

        q.acceptAnswer(a.getId());
        a.markAsAccepted();

        // Award reputation to answerer
        User answerer = users.get(a.getAuthorId().getValue());
        if (answerer != null) answerer.addReputation(15);
    }

    // ==================== Voting ====================

    public void voteQuestion(long questionId, long voterId, VoteType voteType) {
        Question q = questions.get(questionId);
        if (q == null) throw new IllegalArgumentException("Question not found");
        if (q.getAuthorId().getValue() == voterId) {
            throw new IllegalStateException("Cannot vote on own question");
        }

        String voteKey = voterId + ":Q:" + questionId;
        VoteType existing = votes.get(voteKey);
        if (existing == voteType) {
            throw new IllegalStateException("Already voted");
        }

        // Remove previous vote if switching
        if (existing != null) {
            q.applyVote(-existing.getValue());
            User author = users.get(q.getAuthorId().getValue());
            if (author != null) author.addReputation(-existing.getReputationChange());
        }

        q.applyVote(voteType.getValue());
        votes.put(voteKey, voteType);

        // Update author reputation
        User author = users.get(q.getAuthorId().getValue());
        if (author != null) author.addReputation(voteType.getReputationChange());
    }

    public void voteAnswer(long answerId, long voterId, VoteType voteType) {
        Answer a = answers.get(answerId);
        if (a == null) throw new IllegalArgumentException("Answer not found");
        if (a.getAuthorId().getValue() == voterId) {
            throw new IllegalStateException("Cannot vote on own answer");
        }

        String voteKey = voterId + ":A:" + answerId;
        VoteType existing = votes.get(voteKey);
        if (existing == voteType) {
            throw new IllegalStateException("Already voted");
        }

        if (existing != null) {
            a.applyVote(-existing.getValue());
            User author = users.get(a.getAuthorId().getValue());
            if (author != null) author.addReputation(-existing.getReputationChange());
        }

        a.applyVote(voteType.getValue());
        votes.put(voteKey, voteType);

        User author = users.get(a.getAuthorId().getValue());
        if (author != null) author.addReputation(voteType.getReputationChange());
    }

    // ==================== Search ====================

    public List<Question> searchQuestions(String keyword) {
        String lower = keyword.toLowerCase();
        return questions.values().stream()
            .filter(q -> q.getTitle().toLowerCase().contains(lower)
                      || q.getBody().toLowerCase().contains(lower))
            .sorted(Comparator.comparingInt(Question::getVoteCount).reversed())
            .collect(Collectors.toList());
    }

    public List<Question> getQuestionsByTag(String tagName) {
        Set<Long> ids = tagIndex.get(tagName.toLowerCase());
        if (ids == null) return Collections.emptyList();
        return ids.stream()
            .map(questions::get)
            .filter(Objects::nonNull)
            .sorted(Comparator.comparingInt(Question::getVoteCount).reversed())
            .collect(Collectors.toList());
    }

    public List<Answer> getAnswers(long questionId) {
        return answers.values().stream()
            .filter(a -> a.getQuestionId().getValue() == questionId)
            .sorted((a, b) -> {
                // Accepted first, then by votes
                if (a.isAccepted() && !b.isAccepted()) return -1;
                if (!a.isAccepted() && b.isAccepted()) return 1;
                return Integer.compare(b.getVoteCount(), a.getVoteCount());
            })
            .collect(Collectors.toList());
    }
}
