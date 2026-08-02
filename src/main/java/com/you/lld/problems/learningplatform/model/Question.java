package com.you.lld.problems.learningplatform.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * One multiple-choice question and its answer key.
 *
 * <p>The key lives on the question rather than in a parallel structure, so a quiz
 * cannot be constructed with answers that don't line up with its questions.
 */
public final class Question {

    private final String id;
    private final String text;
    private final List<String> options;
    private final String correctAnswer;

    public Question(String id, String text, List<String> options, String correctAnswer) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Question id required");
        }
        if (options == null || options.size() < 2) {
            throw new IllegalArgumentException("A question needs at least two options");
        }
        if (correctAnswer == null || !options.contains(correctAnswer)) {
            throw new IllegalArgumentException(
                    "Correct answer must be one of the options, got: " + correctAnswer);
        }
        this.id = id;
        this.text = text;
        this.options = Collections.unmodifiableList(new ArrayList<String>(options));
        this.correctAnswer = correctAnswer;
    }

    public boolean isCorrect(String answer) {
        return correctAnswer.equals(answer);
    }

    public String getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public List<String> getOptions() {
        return options;
    }

    /** Package-visible on purpose: the key should not leak to a student-facing caller. */
    String getCorrectAnswer() {
        return correctAnswer;
    }

    @Override
    public String toString() {
        return id + ": " + text;
    }
}
