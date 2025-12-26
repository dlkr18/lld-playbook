package com.you.lld.problems.paymentgateway.model;
public
class BankAccount  {
    private String accountNumber, ifsc;
    public BankAccount(String acc, String i)  {
        accountNumber=acc;
        ifsc=i;
    }
    public String getAccountNumber()  {
        return accountNumber;
    }
}
