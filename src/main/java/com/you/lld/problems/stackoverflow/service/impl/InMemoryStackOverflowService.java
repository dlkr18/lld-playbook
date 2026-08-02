package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.exception.*;
import com.you.lld.problems.stackoverflow.model.*;
import com.you.lld.problems.stackoverflow.service.ReputationListener;
import com.you.lld.problems.stackoverflow.service.ReputationPolicy;
import com.you.lld.problems.stackoverflow.service.SearchStrategy;
import com.you.lld.problems.stackoverflow.service.StackOverflowService;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Thread-safe in-memory Stack Overflow service.
 *
 * <p>Concurrency model: registries are {@link ConcurrentHashMap}s; vote
 * idempotency is per {@code (voter, target)} via {@code votes.compute}; and the
 * shared counters ({@code voteCount}, {@code viewCount}, {@code reputation}) are
 * atomics, because distinct voters hitting one post never share a lock.
 */
public class InMemoryStackOverflowService implements StackOverflowService {

    private final Map<Long, User> users = new ConcurrentHashMap<Long, User>();
    private final Map<Long, Question> questions = new ConcurrentHashMap<Long, Question>();
    private final Map<Long, Answer> answers = new ConcurrentHashMap<Long, Answer>();
    private final Map<String, Long> usernameIndex = new ConcurrentHashMap<String, Long>();
    private final Map<String, Set<Long>> tagIndex = new ConcurrentHashMap<String, Set<Long>>();
    private final Map<String, VoteType> votes = new ConcurrentHashMap<String, VoteType>();
    private final Map<Long, Set<Long>> answersByQuestion = new ConcurrentHashMap<Long, Set<Long>>();

    /** Reputation needed to close someone else's question (Stack Overflow: 3000). */
    private static final int CLOSE_QUESTION_REPUTATION = 3000;

    private final AtomicLong userIdGen = new AtomicLong(0);
    private final AtomicLong questionIdGen = new AtomicLong(0);
    private final AtomicLong answerIdGen = new AtomicLong(0);

    private final ReputationPolicy reputationPolicy;
    private final SearchStrategy searchStrategy;
    private final List<ReputationListener> reputationListeners = new CopyOnWriteArrayList<ReputationListener>();

    public InMemoryStackOverflowService() {
        this(new StackOverflowReputationPolicy(), new VoteScoreSearchStrategy());
    }

    public InMemoryStackOverflowService(ReputationPolicy reputationPolicy, SearchStrategy searchStrategy) {
        this.reputationPolicy = reputationPolicy;
        this.searchStrategy = searchStrategy;
    }

    @Override
    public void addReputationListener(ReputationListener listener) {
        if (listener != null) {
            reputationListeners.add(listener);
        }
    }

    @Override
    public User registerUser(String username, String email, String passwordHash) {
        String key = username.toLowerCase();
        long id = userIdGen.incrementAndGet();
        // containsKey-then-put is check-then-act: concurrent signups with the same
        // name both pass the check. Claim the name atomically instead, and only
        // publish the user once we own it.
        if (usernameIndex.putIfAbsent(key, id) != null) {
            throw new IllegalArgumentException("Username already taken: " + username);
        }
        User user = new User(new UserId(id), username, email, passwordHash);
        users.put(id, user);
        return user;
    }

    @Override
    public User getUser(long userId) {
        User user = users.get(userId);
        if (user == null) {
            throw new UserNotFoundException(userId);
        }
        return user;
    }

    @Override
    public User getUserByUsername(String username) {
        Long id = usernameIndex.get(username.toLowerCase());
        if (id == null) {
            throw new IllegalArgumentException("Username not found: " + username);
        }
        return getUser(id);
    }

    @Override
    public void suspendUser(long userId) {
        getUser(userId).suspend();
    }

    @Override
    public Question askQuestion(long authorId, String title, String body, Set<Tag> tags) {
        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot ask questions");
        }
        long qId = questionIdGen.incrementAndGet();
        Question question = new Question(new QuestionId(qId), title, body, author.getId(), tags);
        questions.put(qId, question);
        for (Tag tag : tags) {
            tagIndex.computeIfAbsent(tag.getName(), k -> ConcurrentHashMap.newKeySet()).add(qId);
        }
        return question;
    }

    @Override
    public Question getQuestion(long questionId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        q.incrementViews();
        return q;
    }

    @Override
    public void editQuestion(long questionId, long editorId, String newTitle, String newBody) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() != editorId) {
            throw new IllegalStateException("Only the author can edit this question");
        }
        q.edit(newTitle, newBody);
    }

    @Override
    public void closeQuestion(long questionId, long closerId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        // closerId was accepted and then ignored — any user could close any
        // question. Authors close their own; everyone else needs the moderation
        // privilege, which is what reputation buys on the real site.
        if (q.getAuthorId().getValue() != closerId
                && !getUser(closerId).hasReputation(CLOSE_QUESTION_REPUTATION)) {
            throw new IllegalStateException(
                    "Closing another user's question requires " + CLOSE_QUESTION_REPUTATION + " reputation");
        }
        q.close();
    }

    @Override
    public Answer postAnswer(long questionId, long authorId, String body) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (!q.isOpen()) {
            throw new IllegalStateException("Cannot answer a closed question");
        }
        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot post answers");
        }
        long aId = answerIdGen.incrementAndGet();
        Answer answer = new Answer(new AnswerId(aId), q.getId(), body, author.getId());
        answers.put(aId, answer);
        answersByQuestion.computeIfAbsent(questionId, k -> ConcurrentHashMap.newKeySet()).add(aId);
        return answer;
    }

    @Override
    public void acceptAnswer(long questionId, long answerId, long acceptorId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() != acceptorId) {
            throw new IllegalStateException("Only question author can accept answers");
        }
        Answer a = answers.get(answerId);
        if (a == null) {
            throw new AnswerNotFoundException(answerId);
        }
        if (a.getQuestionId().getValue() != questionId) {
            throw new IllegalArgumentException("Answer does not belong to this question");
        }

        synchronized (q) {
            q.getAcceptedAnswerId().ifPresent(prevId -> {
                Answer prev = answers.get(prevId.getValue());
                if (prev != null) {
                    prev.unmarkAsAccepted();
                    applyReputation(prev.getAuthorId().getValue(), -reputationPolicy.reputationForAcceptedAnswer());
                }
            });
            q.acceptAnswer(a.getId());
            a.markAsAccepted();
            applyReputation(a.getAuthorId().getValue(), reputationPolicy.reputationForAcceptedAnswer());
        }
    }

    @Override
    public void voteQuestion(long questionId, long voterId, VoteType voteType) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() == voterId) {
            throw new SelfVoteException();
        }
        castVote(voterId, "Q", questionId, voteType, q.getAuthorId().getValue(),
                new VoteTarget() {
                    public void apply(int delta) {
                        q.applyVote(delta);
                    }
                });
    }

    @Override
    public void voteAnswer(long answerId, long voterId, VoteType voteType) {
        Answer a = answers.get(answerId);
        if (a == null) {
            throw new AnswerNotFoundException(answerId);
        }
        if (a.getAuthorId().getValue() == voterId) {
            throw new SelfVoteException();
        }
        castVote(voterId, "A", answerId, voteType, a.getAuthorId().getValue(),
                new VoteTarget() {
                    public void apply(int delta) {
                        a.applyVote(delta);
                    }
                });
    }

    private interface VoteTarget {
        void apply(int delta);
    }

    private void castVote(long voterId, String targetType, long targetId, VoteType voteType,
                          long authorId, VoteTarget target) {
        String voteKey = voterId + ":" + targetType + ":" + targetId;
        // Was: synchronized (voteKey.intern()). Never lock on an interned string —
        // the pool is JVM-wide, so unrelated code holding the same literal shares
        // your monitor, and user-derived keys pin entries in it. ConcurrentHashMap
        // .compute already gives per-key atomicity, which is exactly what "one
        // voter, one target" needs.
        int[] reputationDelta = new int[1];
        votes.compute(voteKey, (key, existing) -> {
            if (existing == voteType) {
                throw new DuplicateVoteException();
            }
            if (existing != null) {
                target.apply(-existing.getValue());
                reputationDelta[0] -= reputationPolicy.reputationForVote(existing);
            }
            target.apply(voteType.getValue());
            reputationDelta[0] += reputationPolicy.reputationForVote(voteType);
            return voteType;
        });
        // Listeners run OUTSIDE the map's bin lock — a slow listener must not stall
        // every other vote that hashes to the same bin.
        applyReputation(authorId, reputationDelta[0]);
    }

    private void applyReputation(long userId, int delta) {
        if (delta == 0) {
            return;
        }
        User author = users.get(userId);
        if (author == null) {
            return;
        }
        author.addReputation(delta);
        for (ReputationListener listener : reputationListeners) {
            listener.onReputationChanged(author, delta, author.getReputation());
        }
    }

    @Override
    public List<Question> searchQuestions(String keyword) {
        return searchStrategy.searchByKeyword(questions.values(), keyword);
    }

    @Override
    public List<Question> getQuestionsByTag(String tagName) {
        Set<Long> ids = tagIndex.get(tagName.toLowerCase());
        if (ids == null) {
            return Collections.emptyList();
        }
        List<Question> list = ids.stream()
                .map(questions::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return searchStrategy.sortByVotes(list);
    }

    @Override
    public List<Answer> getAnswers(long questionId) {
        Set<Long> ids = answersByQuestion.get(questionId);
        if (ids == null) {
            return Collections.emptyList();
        }
        return ids.stream()
                .map(answers::get)
                .filter(Objects::nonNull)
                .sorted(new Comparator<Answer>() {
                    @Override
                    public int compare(Answer a, Answer b) {
                        if (a.isAccepted() && !b.isAccepted()) {
                            return -1;
                        }
                        if (!a.isAccepted() && b.isAccepted()) {
                            return 1;
                        }
                        return Integer.compare(b.getVoteCount(), a.getVoteCount());
                    }
                })
                .collect(Collectors.toList());
    }
}
