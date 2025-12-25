package com.you.lld.problems.taskscheduler;
import com.you.lld.problems.taskscheduler.api.*;
import com.you.lld.problems.taskscheduler.impl.*;
import com.you.lld.problems.taskscheduler.model.*;
public class Demo { public static void main(String[] args) { System.out.println("Task Scheduler Demo"); Service s = new InMemoryService(); } }