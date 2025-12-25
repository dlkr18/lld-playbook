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
}