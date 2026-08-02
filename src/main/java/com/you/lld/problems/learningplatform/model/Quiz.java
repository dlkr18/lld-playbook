package com.you.lld.problems.learningplatform.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A graded assessment: ordered questions, each with its own answer key.
 *
 * <p>This was previously a stub holding only an id, with nothing referencing it —
 * which is why {@code submitAssessment} could do no better than return a random
 * score. Grading needs an answer key, so the key has to live somewhere.
 */
public final class Quiz {

    public static final int DEFAULT_PASS_PERCENT = 60;

    private final String quizId;
    private final String courseId;
    private final List<Question> questions;
    private final int passPercent;

    public Quiz(String quizId, String courseId, List<Question> questions) {
        this(quizId, courseId, questions, DEFAULT_PASS_PERCENT);
    }

    public Quiz(String quizId, String courseId, List<Question> questions, int passPercent) {
        if (quizId == null || quizId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quiz id required");
        }
        if (questions == null || questions.isEmpty()) {
            throw new IllegalArgumentException("A quiz needs at least one question");
        }
        if (passPercent < 0 || passPercent > 100) {
            throw new IllegalArgumentException("passPercent must be 0-100, got " + passPercent);
        }
        this.quizId = quizId;
        this.courseId = courseId;
        this.questions = Collections.unmodifiableList(new ArrayList<Question>(questions));
        this.passPercent = passPercent;
    }

    /**
     * Grades a submission, answers positionally matched to questions.
     *
     * <p>A short submission is graded on what was answered rather than rejected —
     * an unanswered question is simply wrong. A submission with <em>more</em> answers
     * than questions is a client bug and is rejected, because silently ignoring the
     * extras would hide it.
     */
    public AssessmentResult grade(String studentId, List<String> answers) {
        List<String> given = answers == null ? Collections.<String>emptyList() : answers;
        if (given.size() > questions.size()) {
            throw new IllegalArgumentException("Submitted " + given.size()
                    + " answers for a quiz with " + questions.size() + " questions");
        }
        int correct = 0;
        for (int i = 0; i < questions.size(); i++) {
            String answer = i < given.size() ? given.get(i) : null;
            if (questions.get(i).isCorrect(answer)) {
                correct++;
            }
        }
        int score = (int) Math.round((correct * 100.0) / questions.size());
        return new AssessmentResult(studentId, quizId, score, score >= passPercent);
    }

    public String getQuizId() {
        return quizId;
    }

    public String getCourseId() {
        return courseId;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public int getPassPercent() {
        return passPercent;
    }

    public int getQuestionCount() {
        return questions.size();
    }
}
