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
}