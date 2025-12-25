package com.you.lld.problems.taskscheduler.impl;
import com.you.lld.problems.taskscheduler.api.*;
import com.you.lld.problems.taskscheduler.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }