package com.you.lld.problems.bookmyshow.config;

import java.time.Duration;
import java.util.Currency;
import java.util.Properties;

/**
 * Application configuration.
 * In production, use Spring @Configuration or properties files.
 */
public class ApplicationConfig {
    
    // Booking Configuration
    public static final int MAX_SEATS_PER_BOOKING = 10;
    public static final int MIN_SEATS_PER_BOOKING = 1;
    public static final Duration BOOKING_LOCK_TIMEOUT = Duration.ofMinutes(5);
    public static final Duration PENDING_BOOKING_EXPIRY = Duration.ofMinutes(15);
    
    // Cache Configuration
    public static final int MOVIE_CACHE_SIZE = 1000;
    public static final Duration MOVIE_CACHE_TTL = Duration.ofHours(6);
    public static final int SHOW_CACHE_SIZE = 5000;
    public static final Duration SHOW_CACHE_TTL = Duration.ofMinutes(5);
    
    // Pricing Configuration
    public static final Currency DEFAULT_CURRENCY = Currency.getInstance("INR");
    public static final double WEEKEND_MULTIPLIER = 1.3;
    public static final double EVENING_MULTIPLIER = 1.2;
    public static final double SURGE_MULTIPLIER = 1.5;
    public static final double SURGE_THRESHOLD = 0.7; // 70% occupancy
    
    // Notification Configuration
    public static final boolean EMAIL_ENABLED = true;
    public static final boolean SMS_ENABLED = true;
    public static final boolean PUSH_ENABLED = false;
    public static final int NOTIFICATION_RETRY_COUNT = 3;
    public static final Duration NOTIFICATION_RETRY_DELAY = Duration.ofSeconds(5);
    
    // Thread Pool Configuration
    public static final int LOCK_MANAGER_POOL_SIZE = 4;
    public static final int NOTIFICATION_POOL_SIZE = 8;
    public static final int EVENT_PUBLISHER_POOL_SIZE = 4;
    
    // Database Configuration (for production)
    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
    private int dbPoolSize = 20;
    
    // Redis Configuration (for distributed locks)
    private String redisHost;
    private int redisPort = 6379;
    private Duration redisTimeout = Duration.ofSeconds(3);
    
    // Feature Flags
    public static final boolean ENABLE_DYNAMIC_PRICING = true;
    public static final boolean ENABLE_PROMO_CODES = true;
    public static final boolean ENABLE_SEAT_ADJACENCY_CHECK = false;
    public static final boolean ENABLE_ANALYTICS = true;
    
    // Rate Limiting
    public static final int MAX_BOOKINGS_PER_USER_PER_HOUR = 10;
    public static final int MAX_SEAT_LOCKS_PER_USER_PER_MINUTE = 5;
    
    /**
     * Load configuration from properties file.
     */
    public static ApplicationConfig fromProperties(Properties properties) {
        ApplicationConfig config = new ApplicationConfig();
        
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
     * Get default development configuration.
     */
    public static ApplicationConfig development() {
        ApplicationConfig config = new ApplicationConfig();
        config.dbUrl = "jdbc:h2:mem:bookmyshow";
        config.dbUsername = "sa";
        config.dbPassword = "";
        config.redisHost = "localhost";
        config.redisPort = 6379;
        return config;
    }
    
    /**
     * Get production configuration.
     */
    public static ApplicationConfig production() {
        ApplicationConfig config = new ApplicationConfig();
        // Load from environment variables
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
    public Duration getRedisTimeout() { return redisTimeout; }
}
