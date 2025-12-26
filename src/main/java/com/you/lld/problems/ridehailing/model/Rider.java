package com.you.lld.problems.ridehailing.model;

public class Rider {
    private String riderId;
    private String name;
    private String phone;
    
    public Rider(String id, String name, String phone) {
        this.riderId = id;
        this.name = name;
        this.phone = phone;
    }
    
    public String getRiderId() {
        return riderId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
}
