export interface CurriculumDay {
  week: number;
  day: number;
  title: string;
  topics: string[];
  problems?: string[];
  resources: string[];
}

export const curriculum: CurriculumDay[] = [
  // Week 1 - Foundations
  {
    week: 1,
    day: 1,
    title: "LLD Process & Requirements",
    topics: [
      "Requirements → NFRs → Domain → Diagrams → APIs",
      "Problem decomposition",
      "Stakeholder analysis",
      "Functional vs Non-Functional Requirements"
    ],
    resources: ["/week1/day1/README"]
  },
  {
    week: 1,
    day: 2,
    title: "SOLID, GRASP & Design Principles",
    topics: [
      "Single Responsibility Principle",
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Interface Segregation",
      "Dependency Inversion",
      "Cohesion and Coupling"
    ],
    resources: ["/week1/day2/README", "/foundations/SOLID"]
  },
  {
    week: 1,
    day: 3,
    title: "UML Diagrams",
    topics: [
      "Class Diagrams",
      "Sequence Diagrams",
      "State Diagrams",
      "Activity Diagrams"
    ],
    problems: ["vendingmachine"],
    resources: ["/week1/day3/README"]
  },
  {
    week: 1,
    day: 4,
    title: "Value Objects & Domain Modeling",
    topics: [
      "Value vs Entity",
      "Immutability patterns",
      "Money, Time, ID types",
      "Domain-Driven Design basics"
    ],
    resources: ["/week1/day4/README"]
  },
  {
    week: 1,
    day: 5,
    title: "Error Handling & API Design",
    topics: [
      "Exception modeling",
      "Validation strategies",
      "Builder pattern",
      "API contracts"
    ],
    resources: ["/week1/day5/README"]
  },
  {
    week: 1,
    day: 6,
    title: "Weekend Project: Parking Lot",
    topics: [
      "End-to-end implementation",
      "Pricing policies",
      "Extensibility patterns",
      "Testing strategies"
    ],
    problems: ["parkinglot"],
    resources: ["/week1/weekend/README", "/problems/parkinglot/README"]
  },

  // Week 2 - Design Patterns
  {
    week: 2,
    day: 6,
    title: "Creational Patterns",
    topics: [
      "Builder Pattern",
      "Factory Method",
      "Abstract Factory",
      "Prototype",
      "Singleton"
    ],
    resources: ["/week2/day6/README", "/foundations/DESIGN_PATTERNS_CATALOG"]
  },
  {
    week: 2,
    day: 7,
    title: "Structural Patterns",
    topics: [
      "Adapter Pattern",
      "Decorator Pattern",
      "Composite Pattern",
      "Proxy Pattern",
      "Flyweight Pattern"
    ],
    resources: ["/week2/day7/README", "/foundations/DESIGN_PATTERNS_CATALOG"]
  },
  {
    week: 2,
    day: 8,
    title: "Behavioral Patterns",
    topics: [
      "Strategy Pattern",
      "State Pattern",
      "Template Method",
      "Chain of Responsibility",
      "Observer Pattern",
      "Command Pattern"
    ],
    resources: ["/week2/day8/README", "/foundations/DESIGN_PATTERNS_CATALOG"]
  },
  {
    week: 2,
    day: 9,
    title: "Repository & Data Patterns",
    topics: [
      "Repository Pattern",
      "Unit of Work",
      "Specification Pattern",
      "DTO Mapping"
    ],
    resources: ["/week2/day9/README"]
  },
  {
    week: 2,
    day: 10,
    title: "Caching Strategies",
    topics: [
      "LRU Cache",
      "LFU Cache",
      "TTL-based caching",
      "Cache consistency",
      "Stampede protection"
    ],
    problems: ["lrucache"],
    resources: ["/week2/day10/README"]
  },
  {
    week: 2,
    day: 11,
    title: "Weekend Project: Elevator System",
    topics: [
      "Scheduling algorithms (SCAN, SSTF)",
      "State machine design",
      "Request optimization",
      "Testing concurrent scenarios"
    ],
    problems: ["elevator"],
    resources: ["/week2/weekend/README", "/problems/elevator/README"]
  },

  // Week 3 - Services & Infrastructure
  {
    week: 3,
    day: 11,
    title: "Rate Limiter",
    topics: [
      "Token Bucket algorithm",
      "Leaky Bucket algorithm",
      "Sliding Window",
      "Fixed Window",
      "Distributed rate limiting"
    ],
    problems: ["ratelimiter"],
    resources: ["/week3/day11/README", "/problems/ratelimiter/README"]
  },
  {
    week: 3,
    day: 12,
    title: "Notification Service",
    topics: [
      "Multi-provider architecture",
      "Retry mechanisms",
      "Template management",
      "Audit logging"
    ],
    problems: ["notification"],
    resources: ["/week3/day12/README"]
  },
  {
    week: 3,
    day: 13,
    title: "Feature Flags & Configuration",
    topics: [
      "Feature toggle patterns",
      "Strategy rollout",
      "A/B testing",
      "Configuration API"
    ],
    problems: ["featureflags"],
    resources: ["/week3/day13/README"]
  },
  {
    week: 3,
    day: 14,
    title: "KV Store Implementation",
    topics: [
      "Write-Ahead Log (WAL)",
      "Snapshots",
      "Compaction",
      "In-memory indexing"
    ],
    problems: ["kvstore"],
    resources: ["/week3/day14/README"]
  },
  {
    week: 3,
    day: 15,
    title: "Search & Indexing",
    topics: [
      "Client-side vs Server-side search",
      "Inverted index",
      "Trie data structure",
      "E2E encryption implications"
    ],
    problems: ["simplesearch", "autocomplete"],
    resources: ["/week3/day15/README"]
  },
  {
    week: 3,
    day: 16,
    title: "Weekend Project: BookMyShow",
    topics: [
      "Seat locking mechanism",
      "Overbooking prevention",
      "Dynamic pricing",
      "Concurrency handling"
    ],
    problems: ["bookmyshow"],
    resources: ["/week3/weekend/README", "/problems/bookmyshow/README"]
  },

  // Week 4 - Advanced Systems
  {
    week: 4,
    day: 16,
    title: "Splitwise: Expense Splitting",
    topics: [
      "Graph algorithms",
      "Debt settlement",
      "Precision handling",
      "Concurrent updates"
    ],
    problems: ["splitwise"],
    resources: ["/week4/day16/README", "/problems/splitwise/README"]
  },
  {
    week: 4,
    day: 17,
    title: "Game Design: Chess/TicTacToe",
    topics: [
      "Rules engine",
      "Move validation",
      "AI integration",
      "Replay persistence"
    ],
    problems: ["chess", "tictactoe"],
    resources: ["/week4/day17/README"]
  },
  {
    week: 4,
    day: 18,
    title: "Logging & Metrics Library",
    topics: [
      "API design",
      "MDC (Mapped Diagnostic Context)",
      "Multiple sinks",
      "Backpressure handling"
    ],
    problems: ["loggingframework", "logging"],
    resources: ["/week4/day18/README"]
  },
  {
    week: 4,
    day: 19,
    title: "Review & Refactoring",
    topics: [
      "Code review practices",
      "Pattern application",
      "Performance optimization",
      "Technical debt management"
    ],
    resources: ["/week4/day19/README"]
  },
  {
    week: 4,
    day: 20,
    title: "Mock Interviews",
    topics: [
      "Whiteboard design",
      "Coding-focused designs",
      "Trade-off discussions",
      "Interview strategies"
    ],
    resources: ["/week4/day20/README"]
  },
  {
    week: 4,
    day: 21,
    title: "Weekend: Capstone Project",
    topics: [
      "Choose advanced system",
      "Complete implementation",
      "Write ADRs",
      "Polish diagrams"
    ],
    problems: ["amazon", "spotify", "linkedin", "fooddelivery", "ridehailing"],
    resources: ["/week4/weekend/README"]
  },
];

export interface DesignPattern {
  name: string;
  category: "Creational" | "Structural" | "Behavioral";
  description: string;
  useCase: string;
  examples: string[];
}

export const designPatterns: DesignPattern[] = [
  // Creational Patterns
  {
    name: "Singleton",
    category: "Creational",
    description: "Ensure a class has only one instance with global access",
    useCase: "Database connections, configuration managers, logging",
    examples: ["DatabaseConnectionPool", "ConfigManager", "Logger"]
  },
  {
    name: "Factory Method",
    category: "Creational",
    description: "Define interface for creating objects, let subclasses decide",
    useCase: "Document creation, notification providers, payment processors",
    examples: ["DocumentFactory", "NotificationFactory", "PaymentFactory"]
  },
  {
    name: "Abstract Factory",
    category: "Creational",
    description: "Create families of related objects without specifying concrete classes",
    useCase: "UI theme systems, database dialects, cross-platform apps",
    examples: ["UIFactory", "DatabaseFactory", "PlatformFactory"]
  },
  {
    name: "Builder",
    category: "Creational",
    description: "Construct complex objects step by step",
    useCase: "Complex object construction, HTTP requests, query builders",
    examples: ["StringBuilder", "HttpRequestBuilder", "QueryBuilder"]
  },
  {
    name: "Prototype",
    category: "Creational",
    description: "Clone existing objects without coupling to their classes",
    useCase: "Object caching, configuration templates, game entities",
    examples: ["GameCharacter.clone()", "ConfigTemplate", "DocumentCloner"]
  },

  // Structural Patterns
  {
    name: "Adapter",
    category: "Structural",
    description: "Make incompatible interfaces work together",
    useCase: "Legacy system integration, third-party library wrapping",
    examples: ["PaymentGatewayAdapter", "LegacySystemAdapter"]
  },
  {
    name: "Decorator",
    category: "Structural",
    description: "Add behavior to objects dynamically",
    useCase: "Stream processing, UI components, middleware",
    examples: ["BufferedInputStream", "LoggingDecorator", "CachingDecorator"]
  },
  {
    name: "Composite",
    category: "Structural",
    description: "Compose objects into tree structures",
    useCase: "File systems, UI hierarchies, organizational charts",
    examples: ["FileSystem", "UIComponent", "MenuStructure"]
  },
  {
    name: "Proxy",
    category: "Structural",
    description: "Provide placeholder or surrogate for another object",
    useCase: "Lazy loading, access control, caching, logging",
    examples: ["VirtualProxy", "ProtectionProxy", "RemoteProxy"]
  },
  {
    name: "Flyweight",
    category: "Structural",
    description: "Share common state between multiple objects efficiently",
    useCase: "Text editors, game sprites, icon caches",
    examples: ["CharacterCache", "IconPool", "StringIntern"]
  },
  {
    name: "Facade",
    category: "Structural",
    description: "Provide simplified interface to complex subsystem",
    useCase: "API simplification, library wrappers, system integration",
    examples: ["OrderFacade", "PaymentFacade", "NotificationFacade"]
  },
  {
    name: "Bridge",
    category: "Structural",
    description: "Separate abstraction from implementation",
    useCase: "Device drivers, database drivers, rendering engines",
    examples: ["DrawingAPI", "DatabaseDriver", "NotificationSender"]
  },

  // Behavioral Patterns
  {
    name: "Strategy",
    category: "Behavioral",
    description: "Define family of algorithms, make them interchangeable",
    useCase: "Pricing strategies, sorting algorithms, payment methods",
    examples: ["PricingStrategy", "SortStrategy", "CompressionStrategy"]
  },
  {
    name: "Observer",
    category: "Behavioral",
    description: "Define one-to-many dependency, notify all dependents",
    useCase: "Event systems, pub-sub, MVC, data binding",
    examples: ["EventEmitter", "PropertyChangeListener", "StockPriceObserver"]
  },
  {
    name: "Command",
    category: "Behavioral",
    description: "Encapsulate request as object",
    useCase: "Undo/redo, transaction systems, GUI actions",
    examples: ["TextCommand", "TransactionCommand", "ButtonCommand"]
  },
  {
    name: "State",
    category: "Behavioral",
    description: "Alter object behavior when internal state changes",
    useCase: "Order lifecycle, TCP connections, vending machines",
    examples: ["OrderState", "ConnectionState", "VendingMachineState"]
  },
  {
    name: "Template Method",
    category: "Behavioral",
    description: "Define skeleton of algorithm, let subclasses override steps",
    useCase: "Data processing pipelines, test frameworks, game loops",
    examples: ["DataProcessor", "TestCase", "GameTemplate"]
  },
  {
    name: "Chain of Responsibility",
    category: "Behavioral",
    description: "Pass request along chain of handlers",
    useCase: "Logging levels, authentication, middleware, error handling",
    examples: ["LoggerChain", "AuthenticationChain", "FilterChain"]
  },
  {
    name: "Iterator",
    category: "Behavioral",
    description: "Access elements sequentially without exposing structure",
    useCase: "Collections, tree traversal, pagination",
    examples: ["List.iterator()", "TreeIterator", "PageIterator"]
  },
  {
    name: "Mediator",
    category: "Behavioral",
    description: "Define object that encapsulates how objects interact",
    useCase: "Chat rooms, air traffic control, UI dialogs",
    examples: ["ChatMediator", "DialogMediator", "TrafficController"]
  },
  {
    name: "Memento",
    category: "Behavioral",
    description: "Capture and restore object state",
    useCase: "Undo functionality, checkpoints, version history",
    examples: ["EditorMemento", "GameSaveState", "HistoryManager"]
  },
  {
    name: "Visitor",
    category: "Behavioral",
    description: "Separate algorithm from object structure",
    useCase: "Compiler AST traversal, document processing, tax calculation",
    examples: ["TaxVisitor", "ExportVisitor", "ValidationVisitor"]
  },
  {
    name: "Interpreter",
    category: "Behavioral",
    description: "Define grammar and interpreter for language",
    useCase: "Expression evaluation, query languages, DSLs",
    examples: ["SQLInterpreter", "ExpressionEvaluator", "RegexMatcher"]
  },
];

export function getCurriculumByWeek(week: number): CurriculumDay[] {
  return curriculum.filter(d => d.week === week);
}

export function getPatternsByCategory(category: string): DesignPattern[] {
  return designPatterns.filter(p => p.category === category);
}
