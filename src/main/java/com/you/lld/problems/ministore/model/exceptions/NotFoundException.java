package com.you.lld.problems.ministore.model.exceptions;

/**
 * Raised when a store/product is absent FOR THE REQUESTING TENANT. A store asking for
 * another store's product gets exactly this — the isolation guarantee is "you cannot
 * even observe another tenant's data", so cross-tenant access is indistinguishable
 * from "does not exist".
 */
public class NotFoundException extends StoreException {
    public NotFoundException(String message) { super(message); }
}
