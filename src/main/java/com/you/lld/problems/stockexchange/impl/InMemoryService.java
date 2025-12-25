package com.you.lld.problems.stockexchange.impl;
import com.you.lld.problems.stockexchange.api.*;
import com.you.lld.problems.stockexchange.model.*;
import java.util.*;
public class InMemoryService implements Service { private Map<String,Object> data = new HashMap<>(); }