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
}