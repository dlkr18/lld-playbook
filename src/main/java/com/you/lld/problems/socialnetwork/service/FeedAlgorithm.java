package com.you.lld.problems.socialnetwork.service;

import com.you.lld.problems.socialnetwork.model.*;
import java.util.List;

public interface FeedAlgorithm {
    List<Post> generateFeed(User user, List<Post> allPosts, int limit);
}
