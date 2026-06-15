package com.you.lld.problems.restaurant;

import com.you.lld.problems.restaurant.service.RestaurantService;
import com.you.lld.problems.restaurant.service.impl.InMemoryRestaurantService;

/**
 * Facade for restaurant management.
 */
public final class Restaurant {

    private final RestaurantService service;

    public Restaurant() {
        this(new InMemoryRestaurantService());
    }

    public Restaurant(RestaurantService service) {
        this.service = service;
    }

    public RestaurantService service() {
        return service;
    }
}
