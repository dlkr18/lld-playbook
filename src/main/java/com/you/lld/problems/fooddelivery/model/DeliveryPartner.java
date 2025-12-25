package com.you.lld.problems.fooddelivery.model;
public class DeliveryPartner {
    private final String partnerId;
    private String name;
    private String phone;
    private String vehicleNumber;
    private PartnerStatus status;
    private Address currentLocation;
    private String currentOrderId;
    
    public DeliveryPartner(String partnerId, String name, String phone) {
        this.partnerId = partnerId;
        this.name = name;
        this.phone = phone;
        this.status = PartnerStatus.AVAILABLE;
    }
    
    public String getPartnerId() { return partnerId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public PartnerStatus getStatus() { return status; }
    public void setStatus(PartnerStatus status) { this.status = status; }
    public Address getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(Address location) { this.currentLocation = location; }
    public String getCurrentOrderId() { return currentOrderId; }
    public void setCurrentOrderId(String orderId) { this.currentOrderId = orderId; }
    public boolean isAvailable() { return status == PartnerStatus.AVAILABLE; }
}
