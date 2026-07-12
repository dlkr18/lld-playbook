export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  hasImplementation: boolean;
  hasDiagrams: boolean;
  topics: string[];
}

export const problems: Problem[] = [
  // Easy Problems
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    difficulty: "Easy",
    category: "Game",
    description: "Classic two-player game with win detection and turn management",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["State Management", "Game Logic", "Win Detection"]
  },
  {
    id: "snakeandladder",
    title: "Snake & Ladder",
    difficulty: "Easy",
    category: "Game",
    description: "Board game with random dice rolls and snake/ladder mechanics",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Random Events", "Game Board", "Player Movement"]
  },
  {
    id: "lrucache",
    title: "LRU Cache",
    difficulty: "Easy",
    category: "Data Structure",
    description: "Least Recently Used cache with O(1) operations",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["HashMap", "Doubly Linked List", "Cache Eviction"]
  },
  {
    id: "bloomfilter",
    title: "Bloom Filter",
    difficulty: "Easy",
    category: "Data Structure",
    description: "Probabilistic data structure for membership testing",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Hash Functions", "Bit Array", "Probabilistic"]
  },
  {
    id: "parkinglot",
    title: "Parking Lot",
    difficulty: "Easy",
    category: "System",
    description: "Multi-floor parking with different vehicle types and payment processing",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Strategy Pattern", "Payment Processing", "Space Allocation"]
  },
  {
    id: "autocomplete",
    title: "Autocomplete",
    difficulty: "Easy",
    category: "Search",
    description: "Prefix-based search suggestions with Trie data structure",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Trie", "Prefix Search", "Ranking"]
  },
  {
    id: "taskmanagement",
    title: "Task Management",
    difficulty: "Easy",
    category: "Productivity",
    description: "Create, assign, and track tasks with status updates",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["CRUD", "State Management", "Task Assignment"]
  },
  {
    id: "notification",
    title: "Notification System",
    difficulty: "Easy",
    category: "Communication",
    description: "Multi-channel notification delivery with preferences",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Observer Pattern", "Multi-Channel", "Preferences"]
  },

  // Medium Problems
  {
    id: "stackoverflow",
    title: "Stack Overflow",
    difficulty: "Medium",
    category: "Q&A Platform",
    description: "Question-answer platform with voting, tags, and reputation",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Voting System", "Tags", "Reputation", "Search"]
  },
  {
    id: "atm",
    title: "ATM System",
    difficulty: "Medium",
    category: "Banking",
    description: "Cash dispensing with account management and transaction processing",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["State Machine", "Transaction", "Cash Management"]
  },
  {
    id: "loggingframework",
    title: "Logging Framework",
    difficulty: "Medium",
    category: "Infrastructure",
    description: "Extensible logging with multiple appenders and log levels",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Chain of Responsibility", "Appenders", "Log Levels"]
  },
  {
    id: "pubsub",
    title: "Pub/Sub System",
    difficulty: "Medium",
    category: "Messaging",
    description: "Publish-subscribe messaging with topics and subscribers",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Observer Pattern", "Message Queue", "Topics"]
  },
  {
    id: "elevator",
    title: "Elevator System",
    difficulty: "Medium",
    category: "System",
    description: "Multi-elevator scheduling with optimal request handling",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Scheduling Algorithm", "State Machine", "Optimization"]
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    difficulty: "Medium",
    category: "Messaging",
    description: "Real-time messaging with groups, media, and status",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Real-time Messaging", "Groups", "Media Handling"]
  },
  {
    id: "splitwise",
    title: "Splitwise",
    difficulty: "Medium",
    category: "Finance",
    description: "Expense splitting with debt simplification algorithm",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Graph Algorithm", "Debt Settlement", "Expense Split"]
  },
  {
    id: "urlshortener",
    title: "URL Shortener",
    difficulty: "Medium",
    category: "Web Service",
    description: "Shorten URLs with analytics and custom aliases",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Hash Function", "Analytics", "Short URL Generation"]
  },
  {
    id: "ratelimiter",
    title: "Rate Limiter",
    difficulty: "Medium",
    category: "Infrastructure",
    description: "Request throttling with multiple algorithms",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Token Bucket", "Sliding Window", "Throttling"]
  },
  {
    id: "inventory",
    title: "Inventory Management",
    difficulty: "Medium",
    category: "E-commerce",
    description: "Stock tracking with reservations and replenishment",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Concurrency", "Reservations", "Stock Management"]
  },
  {
    id: "vendingmachine",
    title: "Vending Machine",
    difficulty: "Medium",
    category: "System",
    description: "Product dispensing with payment and change management",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["State Pattern", "Payment", "Inventory"]
  },
  {
    id: "library",
    title: "Library System",
    difficulty: "Medium",
    category: "Management",
    description: "Book lending with fines and reservations",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Lending", "Fines", "Reservations", "Catalog"]
  },

  // Hard Problems
  {
    id: "bookmyshow",
    title: "BookMyShow",
    difficulty: "Hard",
    category: "Ticketing",
    description: "Movie ticket booking with seat selection and payments",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Seat Locking", "Concurrency", "Payment", "Theater Management"]
  },
  {
    id: "amazon",
    title: "Amazon E-commerce",
    difficulty: "Hard",
    category: "E-commerce",
    description: "Full e-commerce platform with cart, orders, and inventory",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Shopping Cart", "Order Management", "Inventory", "Payment"]
  },
  {
    id: "spotify",
    title: "Spotify",
    difficulty: "Hard",
    category: "Streaming",
    description: "Music streaming with playlists, recommendations, and subscriptions",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Streaming", "Playlists", "Recommendations", "Subscriptions"]
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    difficulty: "Hard",
    category: "Social Network",
    description: "Professional network with connections, posts, and messaging",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Social Graph", "Feed Algorithm", "Messaging", "Jobs"]
  },
  {
    id: "fooddelivery",
    title: "Food Delivery",
    difficulty: "Hard",
    category: "Delivery",
    description: "End-to-end food ordering with delivery tracking",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Order Management", "Delivery Routing", "Real-time Tracking"]
  },
  {
    id: "ridehailing",
    title: "Ride Hailing (Uber)",
    difficulty: "Hard",
    category: "Transportation",
    description: "Ride booking with driver matching and dynamic pricing",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Geo-location", "Matching Algorithm", "Surge Pricing", "Trip Management"]
  },
  {
    id: "taskscheduler",
    title: "Task Scheduler",
    difficulty: "Hard",
    category: "System",
    description: "Cron-like task scheduling with priorities and dependencies",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Priority Queue", "Scheduling", "Dependencies", "Concurrency"]
  },
  {
    id: "stockexchange",
    title: "Stock Exchange",
    difficulty: "Hard",
    category: "Finance",
    description: "Order matching engine with market and limit orders",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Order Matching", "Price-Time Priority", "Market Data"]
  },
  {
    id: "chess",
    title: "Chess Game",
    difficulty: "Hard",
    category: "Game",
    description: "Complete chess game with move validation and checkmate detection",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Game Logic", "Move Validation", "Check Detection", "State Management"]
  },
  {
    id: "kvstore",
    title: "Key-Value Store",
    difficulty: "Hard",
    category: "Database",
    description: "Distributed key-value store with replication and consistency",
    hasImplementation: true,
    hasDiagrams: true,
    topics: ["Distributed Systems", "Replication", "Consistency", "Partitioning"]
  },
];

export function getProblemsByDifficulty(difficulty: Difficulty): Problem[] {
  return problems.filter(p => p.difficulty === difficulty);
}

export function getProblemById(id: string): Problem | undefined {
  return problems.find(p => p.id === id);
}

export function searchProblems(query: string): Problem[] {
  const lowerQuery = query.toLowerCase();
  return problems.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.topics.some(t => t.toLowerCase().includes(lowerQuery))
  );
}
