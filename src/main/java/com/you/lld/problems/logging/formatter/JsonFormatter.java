package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEvent;

import java.util.Map;

/**
 * JSON formatter with proper escaping for quotes, backslashes, and control chars.
 * No dependency on Jackson/Gson -- minimal hand-rolled emitter sufficient for LLD demo.
 */
public class JsonFormatter implements LogFormatter {

    @Override
    public String format(LogEvent event) {
        StringBuilder sb = new StringBuilder(128);
        sb.append('{');
        appendField(sb, "timestamp", event.getTimestamp().toString(), true);
        appendField(sb, "level", event.getLevel().name(), false);
        appendField(sb, "logger", event.getLoggerName(), false);
        appendField(sb, "thread", event.getThreadName(), false);
        appendField(sb, "message", event.getMessage(), false);

        if (!event.getContext().isEmpty()) {
            sb.append(",\"context\":{");
            boolean first = true;
            for (Map.Entry<String, String> e : event.getContext().entrySet()) {
                if (!first) sb.append(',');
                sb.append('"').append(escape(e.getKey())).append("\":\"")
                  .append(escape(e.getValue())).append('"');
                first = false;
            }
            sb.append('}');
        }

        if (event.getThrowable() != null) {
            appendField(sb, "exception", event.getThrowable().toString(), false);
        }

        sb.append('}');
        return sb.toString();
    }

    private static void appendField(StringBuilder sb, String key, String value, boolean first) {
        if (!first) sb.append(',');
        sb.append('"').append(key).append("\":\"").append(escape(value)).append('"');
    }

    private static String escape(String s) {
        if (s == null) return "";
        StringBuilder out = new StringBuilder(s.length() + 8);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"':  out.append("\\\""); break;
                case '\\': out.append("\\\\"); break;
                case '\n': out.append("\\n");  break;
                case '\r': out.append("\\r");  break;
                case '\t': out.append("\\t");  break;
                case '\b': out.append("\\b");  break;
                case '\f': out.append("\\f");  break;
                default:
                    if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
                    else          out.append(c);
            }
        }
        return out.toString();
    }
}
