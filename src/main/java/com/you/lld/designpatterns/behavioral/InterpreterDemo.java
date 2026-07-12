package com.you.lld.designpatterns.behavioral;

import java.util.HashMap;
import java.util.Map;

/**
 * Interpreter — define a grammar for a small language and an interpreter that evaluates
 * sentences in it. Each rule of the grammar becomes a class.
 * Use cases: regex, SQL where-clauses, rule engines, feature flag predicates, expression evaluators.
 *
 * Tiny boolean expression language:
 *   expr := var | NOT expr | expr AND expr | expr OR expr
 */
public class InterpreterDemo {

    interface Expression {
        boolean evaluate(Map<String, Boolean> ctx);
    }

    static class Var implements Expression {
        private final String name;
        Var(String n) { name = n; }
        public boolean evaluate(Map<String, Boolean> ctx) {
            Boolean v = ctx.get(name);
            return v != null && v;
        }
    }
    static class Not implements Expression {
        private final Expression e;
        Not(Expression e) { this.e = e; }
        public boolean evaluate(Map<String, Boolean> ctx) { return !e.evaluate(ctx); }
    }
    static class And implements Expression {
        private final Expression a, b;
        And(Expression a, Expression b) { this.a = a; this.b = b; }
        public boolean evaluate(Map<String, Boolean> ctx) { return a.evaluate(ctx) && b.evaluate(ctx); }
    }
    static class Or implements Expression {
        private final Expression a, b;
        Or(Expression a, Expression b) { this.a = a; this.b = b; }
        public boolean evaluate(Map<String, Boolean> ctx) { return a.evaluate(ctx) || b.evaluate(ctx); }
    }

    public static void main(String[] args) {
        // (isPremium AND NOT isBanned) OR isAdmin
        Expression rule = new Or(
                new And(new Var("isPremium"), new Not(new Var("isBanned"))),
                new Var("isAdmin"));

        Map<String, Boolean> ctx = new HashMap<String, Boolean>();
        ctx.put("isPremium", true);
        ctx.put("isBanned", false);
        ctx.put("isAdmin", false);
        System.out.println("premium-clean: " + rule.evaluate(ctx));

        ctx.put("isBanned", true);
        System.out.println("premium-banned: " + rule.evaluate(ctx));

        ctx.put("isAdmin", true);
        System.out.println("premium-banned-admin: " + rule.evaluate(ctx));
    }
}
