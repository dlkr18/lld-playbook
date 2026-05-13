package com.you.lld.designpatterns.behavioral;

/**
 * Template Method — base class fixes the skeleton of an algorithm; subclasses override
 * specific steps (the "hooks"). Inversion of control: don't call us, we call you.
 * Use cases: data pipeline (extract/transform/load), test frameworks (setUp/tearDown),
 * servlet lifecycle, beverage prep.
 */
public class TemplateMethodDemo {

    static abstract class DataPipeline {
        /** template method — final so subclasses can't reorder the algorithm */
        public final void run() {
            connect();
            Object raw = extract();
            Object clean = transform(raw);
            load(clean);
            disconnect();
        }
        protected void connect()    { System.out.println("connecting..."); }
        protected void disconnect() { System.out.println("disconnecting"); }
        protected abstract Object extract();
        protected abstract Object transform(Object raw);
        protected abstract void load(Object data);
    }

    static class CsvToPostgres extends DataPipeline {
        protected Object extract()   { System.out.println("read users.csv"); return "raw,csv,bytes"; }
        protected Object transform(Object r) { System.out.println("parse csv -> rows"); return "parsed-rows"; }
        protected void load(Object d) { System.out.println("INSERT INTO users ... " + d); }
    }

    static class JsonApiToS3 extends DataPipeline {
        protected Object extract()   { System.out.println("GET /api/events"); return "[json]"; }
        protected Object transform(Object r) { System.out.println("normalize events"); return "events.parquet"; }
        protected void load(Object d) { System.out.println("upload " + d + " to s3"); }
    }

    public static void main(String[] args) {
        new CsvToPostgres().run();
        System.out.println("---");
        new JsonApiToS3().run();
    }
}
