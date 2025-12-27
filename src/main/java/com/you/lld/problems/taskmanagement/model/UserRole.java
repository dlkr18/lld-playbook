package com.you.lld.problems.taskmanagement.model;

/**
 * Roles that can be assigned to users in the task management system.
 */
public enum UserRole {
    ADMIN,      // Full system access, user management
    MANAGER,    // Team management, task assignment
    MEMBER,     // Regular user, can create and work on tasks
    VIEWER      // Read-only access
}


