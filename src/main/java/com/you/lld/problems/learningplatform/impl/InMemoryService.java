package com.you.lld.problems.learningplatform.impl;
import com.you.lld.problems.learningplatform.api.*;
import com.you.lld.problems.learningplatform.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }