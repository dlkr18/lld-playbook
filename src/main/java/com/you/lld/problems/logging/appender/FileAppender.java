package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.formatter.LogFormatter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Writes formatted events to a file.
 *
 * doAppend() is synchronized so concurrent log calls don't interleave bytes.
 * Close must be called on shutdown to flush the buffer and release the fd.
 */
public class FileAppender extends AbstractAppender {

    private final String filePath;
    private final BufferedWriter writer;

    public FileAppender(String filePath) throws IOException {
        this(filePath, null);
    }

    public FileAppender(String filePath, LogFormatter formatter) throws IOException {
        super("file:" + filePath, formatter);
        this.filePath = filePath;
        this.writer = new BufferedWriter(new FileWriter(filePath, true));
    }

    @Override
    protected synchronized void doAppend(String formatted) {
        try {
            writer.write(formatted);
            writer.newLine();
            writer.flush();
        } catch (IOException e) {
            System.err.println("[FileAppender] Failed to write to " + filePath + ": " + e.getMessage());
        }
    }

    @Override
    public synchronized void close() {
        try {
            writer.close();
        } catch (IOException e) {
            System.err.println("[FileAppender] Failed to close " + filePath + ": " + e.getMessage());
        }
    }
}
