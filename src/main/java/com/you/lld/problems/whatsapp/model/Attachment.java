package com.you.lld.problems.whatsapp.model;

import java.util.Objects;

/**
 * Value object representing a media attachment.
 * Immutable.
 */
public final class Attachment {
    private final String fileName;
    private final String fileType;
    private final long fileSize;
    private final String url;

    public Attachment(String fileName, String fileType, long fileSize, String url) {
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        if (fileSize <= 0) {
            throw new IllegalArgumentException("File size must be positive");
        }
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.url = url;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public String getUrl() {
        return url;
    }

    public String getFormattedSize() {
        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Attachment that = (Attachment) o;
        return fileSize == that.fileSize &&
               Objects.equals(fileName, that.fileName) &&
               Objects.equals(fileType, that.fileType) &&
               Objects.equals(url, that.url);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileName, fileType, fileSize, url);
    }

    @Override
    public String toString() {
        return "Attachment{" +
               "fileName='" + fileName + '\'' +
               ", fileType='" + fileType + '\'' +
               ", fileSize=" + getFormattedSize() +
               '}';
    }
}





