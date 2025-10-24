package com.you.lld.examples.week2.day6.builder;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive tests for the SQL Query Builder pattern implementation.
 * Demonstrates testing complex builder patterns with validation.
 */
@DisplayName("SQL Query Builder Pattern Tests")
class SqlQueryBuilderTest {

    @Nested
    @DisplayName("SELECT Query Tests")
    class SelectQueryTests {

        @Test
        @DisplayName("Should build simple SELECT query")
        void shouldBuildSimpleSelectQuery() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("id", "name", "email")
                    .from("users")
                    .build();

            assertEquals("SELECT id, name, email FROM users", query.getSql());
            assertTrue(query.getParameters().isEmpty());
        }

        @Test
        @DisplayName("Should build SELECT * query when no columns specified")
        void shouldBuildSelectAllQueryWhenNoColumnsSpecified() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns()
                    .from("users")
                    .build();

            assertEquals("SELECT * FROM users", query.getSql());
        }

        @Test
        @DisplayName("Should build SELECT query with WHERE clause")
        void shouldBuildSelectQueryWithWhereClause() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("name", "email")
                    .from("users")
                    .where("age > ?")
                    .withParameter(18)
                    .build();

            assertEquals("SELECT name, email FROM users WHERE age > ?", query.getSql());
            assertEquals(Arrays.asList(18), query.getParameters());
        }

        @Test
        @DisplayName("Should build complex SELECT query with JOINs")
        void shouldBuildComplexSelectQueryWithJoins() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("u.name", "p.title", "c.name as category")
                    .from("users u")
                    .innerJoin("posts p", "u.id = p.user_id")
                    .leftJoin("categories c", "p.category_id = c.id")
                    .where("u.active = ?")
                    .and("p.published_at > ?")
                    .withParameters(true, "2024-01-01")
                    .orderBy("p.published_at", SqlQueryBuilder.SortOrder.DESC)
                    .limit(10)
                    .build();

            String expectedSql = "SELECT u.name, p.title, c.name as category " +
                               "FROM users u " +
                               "INNER JOIN posts p ON u.id = p.user_id " +
                               "LEFT JOIN categories c ON p.category_id = c.id " +
                               "WHERE u.active = ? " +
                               "AND p.published_at > ? " +
                               "ORDER BY p.published_at DESC " +
                               "LIMIT 10";

            assertEquals(expectedSql, query.getSql());
            assertEquals(Arrays.asList(true, "2024-01-01"), query.getParameters());
        }

        @Test
        @DisplayName("Should build SELECT query with GROUP BY and HAVING")
        void shouldBuildSelectQueryWithGroupByAndHaving() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("category", "COUNT(*) as post_count")
                    .from("posts")
                    .groupBy("category")
                    .having("COUNT(*) > ?")
                    .withParameter(5)
                    .orderBy("post_count", SqlQueryBuilder.SortOrder.DESC)
                    .build();

            String expectedSql = "SELECT category, COUNT(*) as post_count " +
                               "FROM posts " +
                               "GROUP BY category " +
                               "HAVING COUNT(*) > ? " +
                               "ORDER BY post_count DESC";

            assertEquals(expectedSql, query.getSql());
            assertEquals(Arrays.asList(5), query.getParameters());
        }

        @Test
        @DisplayName("Should build SELECT query with multiple WHERE conditions")
        void shouldBuildSelectQueryWithMultipleWhereConditions() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("*")
                    .from("products")
                    .where("price > ?")
                    .and("category = ?")
                    .or("featured = ?")
                    .withParameters(100.0, "Electronics", true)
                    .build();

            String expectedSql = "SELECT * FROM products " +
                               "WHERE price > ? " +
                               "AND category = ? " +
                               "OR featured = ?";

            assertEquals(expectedSql, query.getSql());
            assertEquals(Arrays.asList(100.0, "Electronics", true), query.getParameters());
        }
    }

    @Nested
    @DisplayName("INSERT Query Tests")
    class InsertQueryTests {

        @Test
        @DisplayName("Should build simple INSERT query")
        void shouldBuildSimpleInsertQuery() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.insert()
                    .into("users")
                    .values("name", "email", "age")
                    .withParameters("John Doe", "john@example.com", 30)
                    .build();

            assertEquals("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", query.getSql());
            assertEquals(Arrays.asList("John Doe", "john@example.com", 30), query.getParameters());
        }

        @Test
        @DisplayName("Should build INSERT query with single column")
        void shouldBuildInsertQueryWithSingleColumn() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.insert()
                    .into("categories")
                    .values("name")
                    .withParameter("Technology")
                    .build();

            assertEquals("INSERT INTO categories (name) VALUES (?)", query.getSql());
            assertEquals(Arrays.asList("Technology"), query.getParameters());
        }
    }

    @Nested
    @DisplayName("UPDATE Query Tests")
    class UpdateQueryTests {

        @Test
        @DisplayName("Should build simple UPDATE query")
        void shouldBuildSimpleUpdateQuery() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.update()
                    .table("users")
                    .set("name")
                    .set("email")
                    .where("id = ?")
                    .withParameters("Jane Doe", "jane@example.com", 1)
                    .build();

            assertEquals("UPDATE users SET name = ? , email = ? WHERE id = ?", query.getSql());
            assertEquals(Arrays.asList("Jane Doe", "jane@example.com", 1), query.getParameters());
        }

        @Test
        @DisplayName("Should build UPDATE query with single field")
        void shouldBuildUpdateQueryWithSingleField() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.update()
                    .table("products")
                    .set("price")
                    .where("id = ?")
                    .withParameters(99.99, 123)
                    .build();

            assertEquals("UPDATE products SET price = ? WHERE id = ?", query.getSql());
            assertEquals(Arrays.asList(99.99, 123), query.getParameters());
        }
    }

    @Nested
    @DisplayName("DELETE Query Tests")
    class DeleteQueryTests {

        @Test
        @DisplayName("Should build simple DELETE query")
        void shouldBuildSimpleDeleteQuery() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.delete()
                    .from("users")
                    .where("active = ?")
                    .withParameter(false)
                    .build();

            assertEquals("DELETE FROM users WHERE active = ?", query.getSql());
            assertEquals(Arrays.asList(false), query.getParameters());
        }

        @Test
        @DisplayName("Should build DELETE query with multiple conditions")
        void shouldBuildDeleteQueryWithMultipleConditions() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.delete()
                    .from("logs")
                    .where("created_at < ?")
                    .and("level = ?")
                    .withParameters("2024-01-01", "DEBUG")
                    .build();

            assertEquals("DELETE FROM logs WHERE created_at < ? AND level = ?", query.getSql());
            assertEquals(Arrays.asList("2024-01-01", "DEBUG"), query.getParameters());
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("Should reject columns() on non-SELECT queries")
        void shouldRejectColumnsOnNonSelectQueries() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    SqlQueryBuilder.insert()
                            .columns("name", "email")
                            .build()
            );

            assertTrue(exception.getMessage().contains("columns() can only be used with SELECT queries"));
        }

        @Test
        @DisplayName("Should reject from() on UPDATE queries")
        void shouldRejectFromOnUpdateQueries() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    SqlQueryBuilder.update()
                            .from("users")
                            .build()
            );

            assertTrue(exception.getMessage().contains("from() can only be used with SELECT or DELETE queries"));
        }

        @Test
        @DisplayName("Should reject JOIN on non-SELECT queries")
        void shouldRejectJoinOnNonSelectQueries() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    SqlQueryBuilder.insert()
                            .into("users")
                            .innerJoin("posts", "users.id = posts.user_id")
                            .build()
            );

            assertTrue(exception.getMessage().contains("JOIN can only be used with SELECT queries"));
        }

        @Test
        @DisplayName("Should reject ORDER BY on non-SELECT queries")
        void shouldRejectOrderByOnNonSelectQueries() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    SqlQueryBuilder.update()
                            .table("users")
                            .set("name")
                            .orderBy("name", SqlQueryBuilder.SortOrder.ASC)
                            .build()
            );

            assertTrue(exception.getMessage().contains("ORDER BY can only be used with SELECT queries"));
        }

        @Test
        @DisplayName("Should reject empty query")
        void shouldRejectEmptyQuery() {
            IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                    SqlQueryBuilder.select().build()
            );

            assertTrue(exception.getMessage().contains("Query cannot be empty"));
        }
    }

    @Nested
    @DisplayName("Parameter Handling Tests")
    class ParameterHandlingTests {

        @Test
        @DisplayName("Should handle multiple parameter additions")
        void shouldHandleMultipleParameterAdditions() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("*")
                    .from("users")
                    .where("age > ?")
                    .withParameter(18)
                    .and("city = ?")
                    .withParameter("New York")
                    .and("active = ?")
                    .withParameter(true)
                    .build();

            assertEquals(Arrays.asList(18, "New York", true), query.getParameters());
        }

        @Test
        @DisplayName("Should handle batch parameter addition")
        void shouldHandleBatchParameterAddition() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("*")
                    .from("products")
                    .where("price BETWEEN ? AND ?")
                    .and("category IN (?, ?, ?)")
                    .withParameters(10.0, 100.0, "Electronics", "Books", "Clothing")
                    .build();

            assertEquals(Arrays.asList(10.0, 100.0, "Electronics", "Books", "Clothing"), 
                        query.getParameters());
        }

        @Test
        @DisplayName("Should handle queries without parameters")
        void shouldHandleQueriesWithoutParameters() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("COUNT(*)")
                    .from("users")
                    .build();

            assertTrue(query.getParameters().isEmpty());
        }
    }

    @Nested
    @DisplayName("PreparedQuery Tests")
    class PreparedQueryTests {

        @Test
        @DisplayName("Should create immutable PreparedQuery")
        void shouldCreateImmutablePreparedQuery() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("*")
                    .from("users")
                    .where("age > ?")
                    .withParameter(18)
                    .build();

            // Try to modify the parameters list
            query.getParameters().add("new param");
            
            // Original should be unchanged
            assertEquals(1, query.getParameters().size());
            assertEquals(18, query.getParameters().get(0));
        }

        @Test
        @DisplayName("Should have proper toString representation")
        void shouldHaveProperToStringRepresentation() {
            SqlQueryBuilder.PreparedQuery query = SqlQueryBuilder.select()
                    .columns("name")
                    .from("users")
                    .where("id = ?")
                    .withParameter(1)
                    .build();

            String toString = query.toString();
            assertTrue(toString.contains("PreparedQuery"));
            assertTrue(toString.contains("SELECT name FROM users WHERE id = ?"));
            assertTrue(toString.contains("[1]"));
        }
    }

    @Nested
    @DisplayName("Method Chaining Tests")
    class MethodChainingTests {

        @Test
        @DisplayName("Should support fluent method chaining")
        void shouldSupportFluentMethodChaining() {
            // This test verifies that all methods return the builder instance
            // allowing for fluent chaining
            assertDoesNotThrow(() -> {
                SqlQueryBuilder.select()
                        .columns("u.name", "p.title")
                        .from("users u")
                        .innerJoin("posts p", "u.id = p.user_id")
                        .where("u.active = ?")
                        .and("p.published = ?")
                        .withParameter(true)
                        .withParameter(true)
                        .orderBy("p.created_at", SqlQueryBuilder.SortOrder.DESC)
                        .limit(10)
                        .build();
            });
        }

        @Test
        @DisplayName("Should maintain builder state across method calls")
        void shouldMaintainBuilderStateAcrossMethodCalls() {
            SqlQueryBuilder builder = SqlQueryBuilder.select()
                    .columns("name")
                    .from("users");

            // Add conditions in separate calls
            builder.where("active = ?").withParameter(true);
            builder.and("age > ?").withParameter(18);
            builder.orderBy("name", SqlQueryBuilder.SortOrder.ASC);

            SqlQueryBuilder.PreparedQuery query = builder.build();

            assertEquals("SELECT name FROM users WHERE active = ? AND age > ? ORDER BY name ASC", 
                        query.getSql());
            assertEquals(Arrays.asList(true, 18), query.getParameters());
        }
    }
}
