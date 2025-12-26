package com.you.lld.problems.restaurant.model;
import java.time.*;
public
class Reservation  {
    private String reservationId, customerId, tableId;
    private LocalDateTime dateTime;
    private int partySize;
    public Reservation(String id, String cid, String tid, LocalDateTime dt, int size)  {
        reservationId=id;
        customerId=cid;
        tableId=tid;
        dateTime=dt;
        partySize=size;
    }
    public String getReservationId()  {
        return reservationId;
    }
    public String getTableId()  {
        return tableId;
    }
}
