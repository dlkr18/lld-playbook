package com.you.lld.problems.bookmyshow.model;

import java.util.ArrayList;
import java.util.List;

public class Theater {
    private final String id;
    private final String name;
    private final String address;
    private final City city;
    private List<Screen> screens;

    public Theater(String id, String name, String address, City city) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.screens = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public City getCity() { return city; }
    public List<Screen> getScreens() { return screens; }
    
    public void setScreens(List<Screen> screens) {
        this.screens = screens;
    }

    @Override
    public String toString() {
        return "Theater{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", city=" + city +
                ", screens=" + screens.size() +
                '}';
    }
}

