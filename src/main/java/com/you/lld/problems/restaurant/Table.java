package com.you.lld.problems.restaurant;
public class Table {
    public enum TableStatus { AVAILABLE, OCCUPIED, RESERVED }
    
    private final String tableId;
    private final int capacity;
    private TableStatus status;
    
    public Table(String tableId, int capacity) {
        this.tableId = tableId;
        this.capacity = capacity;
        this.status = TableStatus.AVAILABLE;
    }
    
    public String getTableId() { return tableId; }
    public int getCapacity() { return capacity; }
    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }
}
