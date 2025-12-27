package com.you.lld.problems.amazon.model;

import java.util.*;

public class Category {
    private final String id;
    private String name;
    private String description;
    private String parentCategoryId;
    private List<String> subcategoryIds;
    
    public Category(String id, String name) {
        this.id = id;
        this.name = name;
        this.subcategoryIds = new ArrayList<>();
    }
    
    public void addSubcategory(String subcategoryId) {
        if (!subcategoryIds.contains(subcategoryId)) {
            subcategoryIds.add(subcategoryId);
        }
    }
    
    public void removeSubcategory(String subcategoryId) {
        subcategoryIds.remove(subcategoryId);
    }
    
    public boolean isRootCategory() {
        return parentCategoryId == null;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getParentCategoryId() { return parentCategoryId; }
    public List<String> getSubcategoryIds() { return new ArrayList<>(subcategoryIds); }
    
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setParentCategoryId(String parentCategoryId) { this.parentCategoryId = parentCategoryId; }
    
    @Override
    public String toString() {
        return "Category{id='" + id + "', name='" + name + "', subcategories=" + subcategoryIds.size() + "}";
    }
}


