package com.you.lld.problems.querydsl.model;

/** One sort key: field + direction. A query may chain several (multi-key sort). */
public final class SortSpec {

    public enum Direction { ASC, DESC }

    private final String field;
    private final Direction direction;

    public SortSpec(String field, Direction direction) {
        if (field == null || field.trim().isEmpty()) {
            throw new InvalidQueryException("sort field is required");
        }
        this.field = field;
        this.direction = (direction == null) ? Direction.ASC : direction;
    }

    public String field() { return field; }
    public Direction direction() { return direction; }
}
