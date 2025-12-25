package com.you.lld.problems.socialnetwork;
import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private Set<String> likes;
    private LocalDateTime timestamp;
    
    public Post(String postId, String authorId, String content) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.likes = new HashSet<>();
        this.timestamp = LocalDateTime.now();
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    public void like(String userId) { likes.add(userId); }
    public int getLikesCount() { return likes.size(); }
}
