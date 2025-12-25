package com.you.lld.problems.linkedin;
import java.time.LocalDateTime;

public class JobPosting {
    private final String jobId;
    private String title;
    private String company;
    private String description;
    private LocalDateTime postedDate;
    
    public JobPosting(String jobId, String title, String company) {
        this.jobId = jobId;
        this.title = title;
        this.company = company;
        this.postedDate = LocalDateTime.now();
    }
    
    public String getJobId() { return jobId; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
}
