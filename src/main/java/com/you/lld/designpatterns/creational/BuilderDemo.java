package com.you.lld.designpatterns.creational;

/**
 * Builder — constructs complex immutable objects step by step. Solves the telescoping
 * constructor problem and lets fields be set in any order with required-field validation.
 * Use cases: HTTP request, SQL query, complex domain entity (Pizza, Resume).
 */
public class BuilderDemo {

    public static final class HttpRequest {
        private final String url;
        private final String method;
        private final String body;
        private final int timeoutMs;
        private final boolean followRedirects;

        private HttpRequest(Builder b) {
            this.url = b.url;
            this.method = b.method;
            this.body = b.body;
            this.timeoutMs = b.timeoutMs;
            this.followRedirects = b.followRedirects;
        }

        @Override public String toString() {
            return method + " " + url + " (timeout=" + timeoutMs + "ms, redirects=" + followRedirects + ", body=" + body + ")";
        }

        public static Builder builder(String url) { return new Builder(url); }

        public static final class Builder {
            private final String url;
            private String method = "GET";
            private String body = "";
            private int timeoutMs = 5_000;
            private boolean followRedirects = true;

            private Builder(String url) {
                if (url == null || url.trim().isEmpty()) throw new IllegalArgumentException("url required");
                this.url = url;
            }
            public Builder method(String m) { this.method = m; return this; }
            public Builder body(String b) { this.body = b; return this; }
            public Builder timeoutMs(int t) { this.timeoutMs = t; return this; }
            public Builder followRedirects(boolean f) { this.followRedirects = f; return this; }
            public HttpRequest build() { return new HttpRequest(this); }
        }
    }

    public static void main(String[] args) {
        HttpRequest r = HttpRequest.builder("https://api.x.com/users")
                .method("POST")
                .body("{\"name\":\"alice\"}")
                .timeoutMs(3000)
                .build();
        System.out.println(r);
    }
}
