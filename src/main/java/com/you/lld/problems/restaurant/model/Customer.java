package com.you.lld.problems.restaurant.model;
public
class Customer  {
    private String customerId, name, phone;
    public Customer(String id, String n, String p)  {
        customerId=id;
        name=n;
        phone=p;
    }
    public String getCustomerId()  {
        return customerId;
    }
    public String getName()  {
        return name;
    }
}
