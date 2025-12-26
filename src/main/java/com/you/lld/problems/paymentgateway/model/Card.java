package com.you.lld.problems.paymentgateway.model;
public
class Card  {
    private String cardNumber, cvv, expiryDate;
    public Card(String num, String c, String exp)  {
        cardNumber=num;
        cvv=c;
        expiryDate=exp;
    }
    public String getCardNumber()  {
        return cardNumber;
    }
    public boolean isValid()  {
        return cardNumber!=null && cvv!=null;
    }
}
