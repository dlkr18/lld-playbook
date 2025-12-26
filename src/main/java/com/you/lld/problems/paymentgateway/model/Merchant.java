package com.you.lld.problems.paymentgateway.model;
public
class Merchant  {
    private String merchantId, name, email;
    public Merchant(String id, String n, String e)  {
        merchantId=id;
        name=n;
        email=e;
    }
    public String getMerchantId()  {
        return merchantId;
    }
}
