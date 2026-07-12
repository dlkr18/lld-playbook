package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.impl.MatchCountRankingStrategy;
import com.you.lld.problems.simplesearch.service.impl.TfIdfRankingStrategy;
import java.util.List;

public class SimpleSearchDemo {

    public static void main(String[] args) {
        System.out.println("=== Simple Search Demo ===\n");
        SimpleSearch engine = new SimpleSearch();
        demoIndexAndTfIdf(engine);
        demoTitleMatch(engine);
        demoPagination(engine);
        demoUpdate(engine);
        demoRankingStrategySwap(engine);
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoIndexAndTfIdf(SimpleSearch engine) {
        System.out.println("--- 1. Index documents and TF-IDF search ---");
        engine.index(new Document("d1", "Java Design Patterns", "explores strategy observer and factory patterns in Java"));
        engine.index(new Document("d2", "Spring Boot Tutorial", "build REST APIs with Spring Boot and Java"));
        engine.index(new Document("d3", "Python Data Science", "pandas numpy machine learning basics"));
        printResults(engine.search("java patterns"));
    }

    private static void demoTitleMatch(SimpleSearch engine) {
        System.out.println("\n--- 2. Title-only term match ---");
        printResults(engine.search("spring"));
    }

    private static void demoPagination(SimpleSearch engine) {
        System.out.println("\n--- 3. Pagination ---");
        printResults(engine.search("java", 0, 1));
        printResults(engine.search("java", 1, 1));
    }

    private static void demoUpdate(SimpleSearch engine) {
        System.out.println("\n--- 4. Update re-indexes document ---");
        engine.update(new Document("d3", "Python for LLD", "low level design interview prep with Python examples"));
        printResults(engine.search("lld interview"));
    }

    private static void demoRankingStrategySwap(SimpleSearch engine) {
        System.out.println("\n--- 5. Ranking strategy swap ---");
        System.out.println("  TF-IDF:");
        printResults(engine.search("java spring"));
        engine.setRankingStrategy(new MatchCountRankingStrategy());
        System.out.println("  Match-count:");
        printResults(engine.search("java spring"));
        engine.setRankingStrategy(new TfIdfRankingStrategy());
    }

    private static void printResults(List<SearchResult> results) {
        if (results.isEmpty()) {
            System.out.println("  (no results)");
            return;
        }
        for (SearchResult r : results) {
            System.out.println("  " + r);
        }
    }
}
