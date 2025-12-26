package com.you.lld.problems.ridehailing.model;
public
class Fare  {
    public static double calculate(double distance, VehicleType type)  {
        double base = 5.0;
        double perKm = type==VehicleType.BIKE ? 2.0 : type==VehicleType.SEDAN ? 3.0 : 4.0;
        return base + (distance * perKm);
    }
}
