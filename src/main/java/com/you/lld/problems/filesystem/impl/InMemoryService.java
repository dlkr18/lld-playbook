package com.you.lld.problems.filesystem.impl;
import com.you.lld.problems.filesystem.api.*;
import com.you.lld.problems.filesystem.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }