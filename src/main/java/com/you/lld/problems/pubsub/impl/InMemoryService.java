package com.you.lld.problems.pubsub.impl;
import com.you.lld.problems.pubsub.api.*;
import com.you.lld.problems.pubsub.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }