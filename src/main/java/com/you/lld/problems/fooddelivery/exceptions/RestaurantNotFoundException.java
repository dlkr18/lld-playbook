package com.you.lld.problems.fooddelivery.exceptions;
public class RestaurantNotFoundException extends RuntimeException {
    public RestaurantNotFoundException(String message) { super(message); }
}
