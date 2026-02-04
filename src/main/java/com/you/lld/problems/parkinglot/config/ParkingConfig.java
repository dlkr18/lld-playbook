package com.you.lld.problems.parkinglot.config;

import java.time.Duration;
import java.util.Currency;
import java.util.Properties;

/**
 * Configuration for parking lot system.
 */
public class ParkingConfig {
    
    // Parking Configuration
    public static final int TOTAL_FLOORS = 4;
    public static final int SPACES_PER_FLOOR = 100;
    public static final Duration GRACE_PERIOD = Duration.ofMinutes(15);
    public static final long MINIMUM_CHARGE_MINUTES = 60;
    
    // Pricing Configuration
    public static final Currency DEFAULT_CURRENCY = Currency.getInstance("USD");
    public static final double MOTORCYCLE_HOURLY_RATE = 10.0;
    public static final double CAR_HOURLY_RATE = 20.0;
    public static final double TRUCK_HOURLY_RATE = 30.0;
    public static final double BUS_HOURLY_RATE = 40.0;
    
    // Space Allocation
    public static final double MOTORCYCLE_PERCENTAGE = 0.20; // 20%
    public static final double CAR_PERCENTAGE = 0.60;        // 60%
    public static final double TRUCK_PERCENTAGE = 0.15;      // 15%
    public static final double BUS_PERCENTAGE = 0.05;        // 5%
    
    // Cache Configuration
    public static final int SPACE_CACHE_SIZE = 1000;
    public static final Duration CACHE_REFRESH_INTERVAL = Duration.ofSeconds(30);
    
    // Alert Configuration
    public static final Duration LONG_DURATION_THRESHOLD = Duration.ofHours(24);
    public static final Duration NEAR_CAPACITY_THRESHOLD_PCT = Duration.ofMinutes(90); // 90% full
    
    // Payment Configuration
    public static final int PAYMENT_TRANSACTION_FEE_BASIS_POINTS = 200; // 2%
    public static final boolean ENABLE_REFUNDS = true;
    
    // Thread Pool Configuration
    public static final int EVENT_PUBLISHER_POOL_SIZE = 4;
    public static final int ANALYTICS_POOL_SIZE = 2;
    
    // Feature Flags
    public static final boolean ENABLE_DYNAMIC_PRICING = false;
    public static final boolean ENABLE_RESERVATIONS = false;
    public static final boolean ENABLE_ANALYTICS = true;
    public static final boolean ENABLE_ALERTS = true;
    
    // Rate Limiting
    public static final int MAX_ENTRIES_PER_HOUR = 1000;
    public static final int MAX_EXITS_PER_HOUR = 1000;
    
    // Database Configuration (for production)
    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
    private int dbPoolSize = 20;
    
    // Redis Configuration
    private String redisHost;
    private int redisPort = 6379;
    
    /**
     * Load configuration from properties.
     */
    public static ParkingConfig fromProperties(Properties properties) {
        ParkingConfig config = new ParkingConfig();
        
        config.dbUrl = properties.getProperty("db.url");
        config.dbUsername = properties.getProperty("db.username");
        config.dbPassword = properties.getProperty("db.password");
        config.dbPoolSize = Integer.parseInt(
            properties.getProperty("db.pool.size", "20")
        );
        
        config.redisHost = properties.getProperty("redis.host", "localhost");
        config.redisPort = Integer.parseInt(
            properties.getProperty("redis.port", "6379")
        );
        
        return config;
    }
    
    /**
     * Get development configuration.
     */
    public static ParkingConfig development() {
        ParkingConfig config = new ParkingConfig();
        config.dbUrl = "jdbc:h2:mem:parkinglot";
        config.dbUsername = "sa";
        config.dbPassword = "";
        config.redisHost = "localhost";
        config.redisPort = 6379;
        return config;
    }
    
    /**
     * Get production configuration.
     */
    public static ParkingConfig production() {
        ParkingConfig config = new ParkingConfig();
        config.dbUrl = System.getenv("DB_URL");
        config.dbUsername = System.getenv("DB_USERNAME");
        config.dbPassword = System.getenv("DB_PASSWORD");
        config.redisHost = System.getenv("REDIS_HOST");
        config.redisPort = Integer.parseInt(
            System.getenv().getOrDefault("REDIS_PORT", "6379")
        );
        return config;
    }
    
    // Getters
    public String getDbUrl() { return dbUrl; }
    public String getDbUsername() { return dbUsername; }
    public String getDbPassword() { return dbPassword; }
    public int getDbPoolSize() { return dbPoolSize; }
    public String getRedisHost() { return redisHost; }
    public int getRedisPort() { return redisPort; }
}
