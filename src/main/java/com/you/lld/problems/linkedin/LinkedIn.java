package com.you.lld.problems.linkedin;
import java.util.*;

public class LinkedIn {
    private final Map<String, Profile> profiles;
    private final Map<String, JobPosting> jobs;
    
    public LinkedIn() {
        this.profiles = new HashMap<>();
        this.jobs = new HashMap<>();
    }
    
    public void addProfile(Profile profile) {
        profiles.put(profile.getUserId(), profile);
    }
    
    public void connect(String userId1, String userId2) {
        Profile p1 = profiles.get(userId1);
        Profile p2 = profiles.get(userId2);
        if (p1 != null && p2 != null) {
            p1.addConnection(userId2);
            p2.addConnection(userId1);
        }
    }
    
    public void postJob(JobPosting job) {
        jobs.put(job.getJobId(), job);
    }
    
    public List<JobPosting> searchJobs(String keyword) {
        List<JobPosting> results = new ArrayList<>();
        for (JobPosting job : jobs.values()) {
            if (job.getTitle().toLowerCase().contains(keyword.toLowerCase())) {
                results.add(job);
            }
        }
        return results;
    }
}
