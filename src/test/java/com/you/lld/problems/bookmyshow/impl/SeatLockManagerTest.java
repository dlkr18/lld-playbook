package com.you.lld.problems.bookmyshow.impl;

import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SeatLockManagerTest {

    @Test
    void lateExpiryOfAnOldLockDoesNotRemoveANewerLock() {
        SeatLockManager mgr = new SeatLockManager();
        List<String> seat = Collections.singletonList("A1");
        try {
            assertTrue(mgr.lockSeats("SH1", seat, "alice"));
            SeatLockManager.LockInfo aliceLock = mgr.currentLock("SH1", "A1");
            mgr.unlockSeats("SH1", seat, "alice");
            assertTrue(mgr.lockSeats("SH1", seat, "bob"));

            // Alice's expiry timer was already running when her lock was released; it fires now.
            mgr.forceUnlock("SH1", "A1", aliceLock);

            assertTrue(mgr.isLockedByUser("SH1", "A1", "bob"));
        } finally {
            mgr.unlockSeats("SH1", seat, "bob"); // cancels the 5-minute timer so shutdown is quick
            mgr.shutdown();
        }
    }
}
