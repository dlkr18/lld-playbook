package com.you.lld.examples.week2.day6.factory;

import java.util.HashMap;
import java.util.Map;

/**
 * Payment details container that holds payment-specific information.
 * Different payment methods require different details.
 */
public class PaymentDetails {
    private final Map<String, String> details;
    
    public PaymentDetails() {
        this.details = new HashMap<>();
    }
    
    public PaymentDetails(Map<String, String> details) {
        this.details = new HashMap<>(details);
    }
    
    public void addDetail(String key, String value) {
        details.put(key, value);
    }
    
    public String getDetail(String key) {
        return details.get(key);
    }
    
    public boolean hasDetail(String key) {
        return details.containsKey(key) && details.get(key) != null;
    }
    
    public Map<String, String> getAllDetails() {
        return new HashMap<>(details);
    }
    
    // Convenience methods for common payment details
    
    // Credit/Debit Card details
    public void setCardNumber(String cardNumber) {
        addDetail("cardNumber", cardNumber);
    }
    
    public String getCardNumber() {
        return getDetail("cardNumber");
    }
    
    public void setExpiryDate(String expiryDate) {
        addDetail("expiryDate", expiryDate);
    }
    
    public String getExpiryDate() {
        return getDetail("expiryDate");
    }
    
    public void setCvv(String cvv) {
        addDetail("cvv", cvv);
    }
    
    public String getCvv() {
        return getDetail("cvv");
    }
    
    public void setCardHolderName(String cardHolderName) {
        addDetail("cardHolderName", cardHolderName);
    }
    
    public String getCardHolderName() {
        return getDetail("cardHolderName");
    }
    
    // PayPal details
    public void setPayPalEmail(String email) {
        addDetail("paypalEmail", email);
    }
    
    public String getPayPalEmail() {
        return getDetail("paypalEmail");
    }
    
    // Bank transfer details
    public void setAccountNumber(String accountNumber) {
        addDetail("accountNumber", accountNumber);
    }
    
    public String getAccountNumber() {
        return getDetail("accountNumber");
    }
    
    public void setRoutingNumber(String routingNumber) {
        addDetail("routingNumber", routingNumber);
    }
    
    public String getRoutingNumber() {
        return getDetail("routingNumber");
    }
    
    // Cryptocurrency details
    public void setWalletAddress(String walletAddress) {
        addDetail("walletAddress", walletAddress);
    }
    
    public String getWalletAddress() {
        return getDetail("walletAddress");
    }
    
    public void setCryptocurrencyType(String cryptoType) {
        addDetail("cryptoType", cryptoType);
    }
    
    public String getCryptocurrencyType() {
        return getDetail("cryptoType");
    }
    
    @Override
    public String toString() {
        // Don't expose sensitive details in toString
        Map<String, String> safeDetails = new HashMap<>();
        for (Map.Entry<String, String> entry : details.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            // Mask sensitive information
            if (key.equals("cardNumber") && value != null && value.length() > 4) {
                safeDetails.put(key, "**** **** **** " + value.substring(value.length() - 4));
            } else if (key.equals("cvv")) {
                safeDetails.put(key, "***");
            } else {
                safeDetails.put(key, value);
            }
        }
        
        return "PaymentDetails{" + "details=" + safeDetails + '}';
    }
}
