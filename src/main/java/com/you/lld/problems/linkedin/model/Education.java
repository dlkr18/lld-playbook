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
}