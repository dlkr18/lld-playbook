package com.you.lld.problems.digitalwallet.model;

/**
 * Direction of a single {@link LedgerEntry} from the wallet holder's point of view.
 *
 * <p>CREDIT means money arrived in the account (+); DEBIT means money left it (−).
 * A valid double-entry transaction always pairs an equal DEBIT and CREDIT so the
 * signed sum of its entries is exactly zero.
 */
public enum EntryDirection {
    DEBIT(-1),
    CREDIT(+1);

    private final int sign;

    EntryDirection(int sign) {
        this.sign = sign;
    }

    /** +1 for CREDIT, −1 for DEBIT — used to compute the signed contribution to a balance. */
    public int sign() {
        return sign;
    }
}
