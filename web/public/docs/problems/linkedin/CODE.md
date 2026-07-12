# linkedin - Complete Implementation

## 📁 Project Structure (21 files)

```
linkedin/
├── LinkedInDemo.java
├── api/LinkedInService.java
├── exceptions/JobNotFoundException.java
├── exceptions/PostNotFoundException.java
├── exceptions/RequestNotFoundException.java
├── exceptions/UserNotFoundException.java
├── impl/InMemoryLinkedInService.java
├── model/Comment.java
├── model/ConnectionRequest.java
├── model/Education.java
├── model/Experience.java
├── model/Job.java
├── model/JobStatus.java
├── model/JobType.java
├── model/Post.java
├── model/PostType.java
├── model/PostVisibility.java
├── model/RequestStatus.java
├── model/Skill.java
├── model/User.java
├── model/UserStatus.java
```

## 📝 Source Code

### 📄 `LinkedInDemo.java`

<details>
<summary>📄 Click to view LinkedInDemo.java</summary>

```java
package com.you.lld.problems.linkedin;
import com.you.lld.problems.linkedin.api.*;
import com.you.lld.problems.linkedin.impl.*;
import com.you.lld.problems.linkedin.model.*;
import java.util.*;

public class LinkedInDemo {
    public static void main(String[] args) {
        System.out.println("=== LinkedIn Professional Network Demo ===\n");
        
        LinkedInService linkedin = new InMemoryLinkedInService();
        
        // Register users
        User alice = linkedin.registerUser("Alice Johnson", "alice@example.com");
        alice.setHeadline("Software Engineer at Google");
        linkedin.updateProfile(alice.getUserId(), alice);
        
        User bob = linkedin.registerUser("Bob Smith", "bob@example.com");
        bob.setHeadline("Product Manager at Microsoft");
        linkedin.updateProfile(bob.getUserId(), bob);
        
        System.out.println("✅ Registered 2 users");
        System.out.println("   - " + alice.getName() + ": " + alice.getHeadline());
        System.out.println("   - " + bob.getName() + ": " + bob.getHeadline());
        
        // Add experience
        Experience aliceExp = new Experience("Senior Software Engineer", "Google");
        aliceExp.setLocation("Mountain View, CA");
        alice.addExperience(aliceExp);
        System.out.println("\n✅ Added experience for Alice");
        
        // Add skills
        alice.addSkill(new Skill("Java"));
        alice.addSkill(new Skill("System Design"));
        System.out.println("✅ Added skills for Alice");
        
        // Send connection request
        ConnectionRequest request = linkedin.sendConnectionRequest(
            alice.getUserId(), bob.getUserId(), "Let's connect!");
        System.out.println("\n📨 Alice sent connection request to Bob");
        
        // Accept connection
        linkedin.acceptConnection(request.getRequestId());
        System.out.println("✅ Bob accepted connection");
        
        // Create post
        Post post = linkedin.createPost(alice.getUserId(), 
            "Excited to share my new role at Google!", 
            PostType.STATUS_UPDATE, 
            PostVisibility.PUBLIC);
        System.out.println("\n📝 Alice created a post");
        
        // Like and comment
        linkedin.likePost(bob.getUserId(), post.getPostId());
        linkedin.commentOnPost(bob.getUserId(), post.getPostId(), "Congratulations!");
        System.out.println("✅ Bob liked and commented on Alice's post");
        
        // Post job
        Job job = linkedin.postJob("COMP001", "Senior Software Engineer", 
            "Looking for talented engineers");
        job.setLocation("Remote");
        job.setType(JobType.FULL_TIME);
        job.addRequiredSkill("Java");
        System.out.println("\n💼 Posted job: " + job.getTitle());
        
        // Search jobs
        List<Job> jobs = linkedin.searchJobs("engineer", null);
        System.out.println("🔍 Found " + jobs.size() + " job(s)");
        
        // Get feed
        List<Post> feed = linkedin.getFeed(bob.getUserId(), 10);
        System.out.println("\n📰 Bob's feed has " + feed.size() + " post(s)");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}```

</details>

### 📄 `api/LinkedInService.java`

<details>
<summary>📄 Click to view api/LinkedInService.java</summary>

```java
package com.you.lld.problems.linkedin.api;
import com.you.lld.problems.linkedin.model.*;
import java.util.List;

public interface LinkedInService {
    // User Management
    User registerUser(String name, String email);
    User getUser(String userId);
    void updateProfile(String userId, User updatedUser);
    
    // Connections
    ConnectionRequest sendConnectionRequest(String senderId, String receiverId, String message);
    void acceptConnection(String requestId);
    void rejectConnection(String requestId);
    List<User> getConnections(String userId);
    List<ConnectionRequest> getPendingRequests(String userId);
    
    // Follow
    void follow(String followerId, String followingId);
    void unfollow(String followerId, String followingId);
    List<User> getFollowers(String userId);
    List<User> getFollowing(String userId);
    
    // Posts
    Post createPost(String authorId, String content, PostType type, PostVisibility visibility);
    Post getPost(String postId);
    void likePost(String userId, String postId);
    void unlikePost(String userId, String postId);
    Comment commentOnPost(String userId, String postId, String text);
    Post sharePost(String userId, String postId);
    List<Post> getUserPosts(String userId);
    List<Post> getFeed(String userId, int limit);
    
    // Jobs
    Job postJob(String companyId, String title, String description);
    Job getJob(String jobId);
    List<Job> searchJobs(String query, String location);
    void closeJob(String jobId);
    
    // Skills & Endorsements
    void addSkill(String userId, Skill skill);
    void endorseSkill(String userId, String skillName, String endorserId);
    
    // Search
    List<User> searchUsers(String query);
}```

</details>

### 📄 `exceptions/JobNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/JobNotFoundException.java</summary>

```java
package com.you.lld.problems.linkedin.exceptions;
public class JobNotFoundException extends RuntimeException { public JobNotFoundException(String msg) { super(msg); } }```

</details>

### 📄 `exceptions/PostNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/PostNotFoundException.java</summary>

```java
package com.you.lld.problems.linkedin.exceptions;
public class PostNotFoundException extends RuntimeException { public PostNotFoundException(String msg) { super(msg); } }```

</details>

### 📄 `exceptions/RequestNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/RequestNotFoundException.java</summary>

```java
package com.you.lld.problems.linkedin.exceptions;
public class RequestNotFoundException extends RuntimeException { public RequestNotFoundException(String msg) { super(msg); } }```

</details>

### 📄 `exceptions/UserNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/UserNotFoundException.java</summary>

```java
package com.you.lld.problems.linkedin.exceptions;
public class UserNotFoundException extends RuntimeException { public UserNotFoundException(String msg) { super(msg); } }```

</details>

### 📄 `impl/InMemoryLinkedInService.java`

<details>
<summary>📄 Click to view impl/InMemoryLinkedInService.java</summary>

```java
package com.you.lld.problems.linkedin.impl;
import com.you.lld.problems.linkedin.api.*;
import com.you.lld.problems.linkedin.model.*;
import com.you.lld.problems.linkedin.exceptions.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryLinkedInService implements LinkedInService {
    private final Map<String, User> users;
    private final Map<String, Post> posts;
    private final Map<String, Job> jobs;
    private final Map<String, ConnectionRequest> connectionRequests;
    
    public InMemoryLinkedInService() {
        this.users = new HashMap<>();
        this.posts = new HashMap<>();
        this.jobs = new HashMap<>();
        this.connectionRequests = new HashMap<>();
    }
    
    @Override
    public User registerUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name, email);
        users.put(userId, user);
        return user;
    }
    
    @Override
    public User getUser(String userId) {
        User user = users.get(userId);
        if (user == null) throw new UserNotFoundException("User not found: " + userId);
        return user;
    }
    
    @Override
    public void updateProfile(String userId, User updatedUser) {
        if (!users.containsKey(userId)) throw new UserNotFoundException("User not found");
        users.put(userId, updatedUser);
    }
    
    @Override
    public ConnectionRequest sendConnectionRequest(String senderId, String receiverId, String message) {
        getUser(senderId);
        getUser(receiverId);
        String requestId = UUID.randomUUID().toString();
        ConnectionRequest request = new ConnectionRequest(requestId, senderId, receiverId);
        request.setMessage(message);
        connectionRequests.put(requestId, request);
        return request;
    }
    
    @Override
    public void acceptConnection(String requestId) {
        ConnectionRequest request = connectionRequests.get(requestId);
        if (request == null) throw new RequestNotFoundException("Request not found");
        request.accept();
        User sender = getUser(request.getSenderId());
        User receiver = getUser(request.getReceiverId());
        sender.addConnection(receiver.getUserId());
        receiver.addConnection(sender.getUserId());
    }
    
    @Override
    public void rejectConnection(String requestId) {
        ConnectionRequest request = connectionRequests.get(requestId);
        if (request != null) request.reject();
    }
    
    @Override
    public List<User> getConnections(String userId) {
        User user = getUser(userId);
        return user.getConnectionIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ConnectionRequest> getPendingRequests(String userId) {
        return connectionRequests.values().stream()
            .filter(r -> r.getReceiverId().equals(userId))
            .filter(r -> r.getStatus() == RequestStatus.PENDING)
            .collect(Collectors.toList());
    }
    
    @Override
    public void follow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.follow(followingId);
        following.addFollower(followerId);
    }
    
    @Override
    public void unfollow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.unfollow(followingId);
    }
    
    @Override
    public List<User> getFollowers(String userId) {
        User user = getUser(userId);
        return user.getFollowerIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<User> getFollowing(String userId) {
        User user = getUser(userId);
        return user.getFollowingIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public Post createPost(String authorId, String content, PostType type, PostVisibility visibility) {
        getUser(authorId);
        String postId = UUID.randomUUID().toString();
        Post post = new Post(postId, authorId, content, type);
        post.setVisibility(visibility);
        posts.put(postId, post);
        return post;
    }
    
    @Override
    public Post getPost(String postId) {
        Post post = posts.get(postId);
        if (post == null) throw new PostNotFoundException("Post not found: " + postId);
        return post;
    }
    
    @Override
    public void likePost(String userId, String postId) {
        getUser(userId);
        Post post = getPost(postId);
        post.like(userId);
    }
    
    @Override
    public void unlikePost(String userId, String postId) {
        Post post = getPost(postId);
        post.unlike(userId);
    }
    
    @Override
    public Comment commentOnPost(String userId, String postId, String text) {
        getUser(userId);
        Post post = getPost(postId);
        String commentId = UUID.randomUUID().toString();
        Comment comment = new Comment(commentId, postId, userId, text);
        post.addComment(comment);
        return comment;
    }
    
    @Override
    public Post sharePost(String userId, String postId) {
        getUser(userId);
        Post originalPost = getPost(postId);
        originalPost.incrementShares();
        return createPost(userId, "Shared: " + originalPost.getContent(), PostType.STATUS_UPDATE, PostVisibility.PUBLIC);
    }
    
    @Override
    public List<Post> getUserPosts(String userId) {
        return posts.values().stream()
            .filter(p -> p.getAuthorId().equals(userId))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Post> getFeed(String userId, int limit) {
        User user = getUser(userId);
        return posts.values().stream()
            .filter(p -> user.getConnectionIds().contains(p.getAuthorId()) || 
                        user.getFollowingIds().contains(p.getAuthorId()) ||
                        p.getVisibility() == PostVisibility.PUBLIC)
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    @Override
    public Job postJob(String companyId, String title, String description) {
        String jobId = UUID.randomUUID().toString();
        Job job = new Job(jobId, companyId, title);
        job.setDescription(description);
        jobs.put(jobId, job);
        return job;
    }
    
    @Override
    public Job getJob(String jobId) {
        Job job = jobs.get(jobId);
        if (job == null) throw new JobNotFoundException("Job not found: " + jobId);
        return job;
    }
    
    @Override
    public List<Job> searchJobs(String query, String location) {
        return jobs.values().stream()
            .filter(j -> j.getStatus() == JobStatus.ACTIVE)
            .filter(j -> query == null || j.getTitle().toLowerCase().contains(query.toLowerCase()))
            .filter(j -> location == null || j.getLocation().toLowerCase().contains(location.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void closeJob(String jobId) {
        Job job = getJob(jobId);
        job.setStatus(JobStatus.CLOSED);
    }
    
    @Override
    public void addSkill(String userId, Skill skill) {
        User user = getUser(userId);
        user.addSkill(skill);
    }
    
    @Override
    public void endorseSkill(String userId, String skillName, String endorserId) {
        User user = getUser(userId);
        getUser(endorserId);
        user.getSkills().stream()
            .filter(s -> s.getName().equals(skillName))
            .findFirst()
            .ifPresent(Skill::endorse);
    }
    
    @Override
    public List<User> searchUsers(String query) {
        return users.values().stream()
            .filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) ||
                        (u.getHeadline() != null && u.getHeadline().toLowerCase().contains(query.toLowerCase())))
            .collect(Collectors.toList());
    }
}```

</details>

### 📄 `model/Comment.java`

<details>
<summary>📄 Click to view model/Comment.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;

public class Comment {
    private final String commentId;
    private final String postId;
    private final String userId;
    private String text;
    private LocalDateTime createdAt;
    
    public Comment(String commentId, String postId, String userId, String text) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getCommentId() { return commentId; }
    public String getPostId() { return postId; }
    public String getUserId() { return userId; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}```

</details>

### 📄 `model/ConnectionRequest.java`

<details>
<summary>📄 Click to view model/ConnectionRequest.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;

public class ConnectionRequest {
    private final String requestId;
    private final String senderId;
    private final String receiverId;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    
    public ConnectionRequest(String requestId, String senderId, String receiverId) {
        this.requestId = requestId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = RequestStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getRequestId() { return requestId; }
    public String getSenderId() { return senderId; }
    public String getReceiverId() { return receiverId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public RequestStatus getStatus() { return status; }
    public void accept() { this.status = RequestStatus.ACCEPTED; }
    public void reject() { this.status = RequestStatus.REJECTED; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}```

</details>

### 📄 `model/Education.java`

<details>
<summary>📄 Click to view model/Education.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDate;

public class Education {
    private String school;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String grade;
    
    public Education(String school, String degree) {
        this.school = school;
        this.degree = degree;
    }
    
    public String getSchool() { return school; }
    public String getDegree() { return degree; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String field) { this.fieldOfStudy = field; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate date) { this.startDate = date; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate date) { this.endDate = date; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}```

</details>

### 📄 `model/Experience.java`

<details>
<summary>📄 Click to view model/Experience.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDate;

public class Experience {
    private String title;
    private String company;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private boolean current;
    
    public Experience(String title, String company) {
        this.title = title;
        this.company = company;
        this.current = false;
    }
    
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate date) { this.startDate = date; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate date) { this.endDate = date; }
    public String getDescription() { return description; }
    public void setDescription(String desc) { this.description = desc; }
    public boolean isCurrent() { return current; }
    public void setCurrent(boolean current) { this.current = current; }
}```

</details>

### 📄 `model/Job.java`

<details>
<summary>📄 Click to view model/Job.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;
import java.util.*;

public class Job {
    private final String jobId;
    private final String companyId;
    private String title;
    private String description;
    private String location;
    private JobType type;
    private String salaryRange;
    private List<String> requiredSkills;
    private JobStatus status;
    private LocalDateTime postedAt;
    
    public Job(String jobId, String companyId, String title) {
        this.jobId = jobId;
        this.companyId = companyId;
        this.title = title;
        this.requiredSkills = new ArrayList<>();
        this.status = JobStatus.ACTIVE;
        this.postedAt = LocalDateTime.now();
    }
    
    public String getJobId() { return jobId; }
    public String getCompanyId() { return companyId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public void setDescription(String desc) { this.description = desc; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public JobType getType() { return type; }
    public void setType(JobType type) { this.type = type; }
    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String range) { this.salaryRange = range; }
    public List<String> getRequiredSkills() { return new ArrayList<>(requiredSkills); }
    public void addRequiredSkill(String skill) { requiredSkills.add(skill); }
    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
    public LocalDateTime getPostedAt() { return postedAt; }
}```

</details>

### 📄 `model/JobStatus.java`

<details>
<summary>📄 Click to view model/JobStatus.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum JobStatus { ACTIVE, CLOSED, ON_HOLD }```

</details>

### 📄 `model/JobType.java`

<details>
<summary>📄 Click to view model/JobType.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum JobType { FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE }```

</details>

### 📄 `model/Post.java`

<details>
<summary>📄 Click to view model/Post.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private PostType type;
    private List<String> mediaUrls;
    private Set<String> likeUserIds;
    private List<Comment> comments;
    private int shares;
    private PostVisibility visibility;
    private LocalDateTime createdAt;
    
    public Post(String postId, String authorId, String content, PostType type) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.type = type;
        this.mediaUrls = new ArrayList<>();
        this.likeUserIds = new HashSet<>();
        this.comments = new ArrayList<>();
        this.shares = 0;
        this.visibility = PostVisibility.PUBLIC;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    public PostType getType() { return type; }
    public List<String> getMediaUrls() { return new ArrayList<>(mediaUrls); }
    public void addMedia(String url) { mediaUrls.add(url); }
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    public List<Comment> getComments() { return new ArrayList<>(comments); }
    public void addComment(Comment comment) { comments.add(comment); }
    public int getShares() { return shares; }
    public void incrementShares() { shares++; }
    public PostVisibility getVisibility() { return visibility; }
    public void setVisibility(PostVisibility visibility) { this.visibility = visibility; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}```

</details>

### 📄 `model/PostType.java`

<details>
<summary>📄 Click to view model/PostType.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum PostType { ARTICLE, STATUS_UPDATE, JOB_POSTING, POLL, VIDEO }```

</details>

### 📄 `model/PostVisibility.java`

<details>
<summary>📄 Click to view model/PostVisibility.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum PostVisibility { PUBLIC, CONNECTIONS_ONLY, PRIVATE }```

</details>

### 📄 `model/RequestStatus.java`

<details>
<summary>📄 Click to view model/RequestStatus.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum RequestStatus { PENDING, ACCEPTED, REJECTED }```

</details>

### 📄 `model/Skill.java`

<details>
<summary>📄 Click to view model/Skill.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public class Skill {
    private final String name;
    private int endorsements;
    
    public Skill(String name) {
        this.name = name;
        this.endorsements = 0;
    }
    
    public String getName() { return name; }
    public int getEndorsements() { return endorsements; }
    public void endorse() { endorsements++; }
}```

</details>

### 📄 `model/User.java`

<details>
<summary>📄 Click to view model/User.java</summary>

```java
package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;
import java.util.*;

public class User {
    private final String userId;
    private String name;
    private String email;
    private String headline;
    private String profilePicture;
    private List<Experience> experiences;
    private List<Education> educations;
    private List<Skill> skills;
    private Set<String> connectionIds;
    private Set<String> followerIds;
    private Set<String> followingIds;
    private UserStatus status;
    private LocalDateTime createdAt;
    
    public User(String userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.experiences = new ArrayList<>();
        this.educations = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.connectionIds = new HashSet<>();
        this.followerIds = new HashSet<>();
        this.followingIds = new HashSet<>();
        this.status = UserStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String url) { this.profilePicture = url; }
    public List<Experience> getExperiences() { return new ArrayList<>(experiences); }
    public void addExperience(Experience exp) { experiences.add(exp); }
    public List<Education> getEducations() { return new ArrayList<>(educations); }
    public void addEducation(Education edu) { educations.add(edu); }
    public List<Skill> getSkills() { return new ArrayList<>(skills); }
    public void addSkill(Skill skill) { skills.add(skill); }
    public Set<String> getConnectionIds() { return new HashSet<>(connectionIds); }
    public void addConnection(String userId) { connectionIds.add(userId); }
    public void removeConnection(String userId) { connectionIds.remove(userId); }
    public Set<String> getFollowerIds() { return new HashSet<>(followerIds); }
    public void addFollower(String userId) { followerIds.add(userId); }
    public Set<String> getFollowingIds() { return new HashSet<>(followingIds); }
    public void follow(String userId) { followingIds.add(userId); }
    public void unfollow(String userId) { followingIds.remove(userId); }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}```

</details>

### 📄 `model/UserStatus.java`

<details>
<summary>📄 Click to view model/UserStatus.java</summary>

```java
package com.you.lld.problems.linkedin.model;
public enum UserStatus { ACTIVE, INACTIVE, SUSPENDED }```

</details>

