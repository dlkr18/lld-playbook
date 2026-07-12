package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.Optional;

/**
 * Value object representing message content.
 * Can contain text, attachment, or both.
 * Immutable.
 */
public final class MessageContent {
    private final String text;
    private final Attachment attachment;

    public MessageContent(String text) {
        this(text, null);
    }

    public MessageContent(Attachment attachment) {
        this(null, attachment);
    }

    public MessageContent(String text, Attachment attachment) {
        if ((text == null || text.trim().isEmpty()) && attachment == null) {
            throw new IllegalArgumentException("Message must have either text or attachment");
        }
        
        this.text = text;
        this.attachment = attachment;
    }

    public Optional<String> getText() {
        return Optional.ofNullable(text);
    }

    public Optional<Attachment> getAttachment() {
        return Optional.ofNullable(attachment);
    }

    public boolean hasText() {
        return text != null && !text.trim().isEmpty();
    }

    public boolean hasAttachment() {
        return attachment != null;
    }

    public MessageType inferType() {
        if (!hasAttachment()) {
            return MessageType.TEXT;
        }
        
        String fileType = attachment.getFileType();
        if (fileType == null) {
            return MessageType.DOCUMENT;
        }
        
        fileType = fileType.toLowerCase();
        if (fileType.startsWith("image/")) {
            return MessageType.IMAGE;
        } else if (fileType.startsWith("video/")) {
            return MessageType.VIDEO;
        } else if (fileType.startsWith("audio/")) {
            return MessageType.AUDIO;
        } else {
            return MessageType.DOCUMENT;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageContent that = (MessageContent) o;
        return Objects.equals(text, that.text) &&
               Objects.equals(attachment, that.attachment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(text, attachment);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("MessageContent{");
        if (hasText()) {
            sb.append("text='").append(text).append('\'');
        }
        if (hasAttachment()) {
            if (hasText()) {
                sb.append(", ");
            }
            sb.append("attachment=").append(attachment);
        }
        sb.append('}');
        return sb.toString();
    }
}






