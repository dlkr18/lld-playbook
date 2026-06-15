package com.you.lld.problems.restaurant.service;

import com.you.lld.problems.restaurant.model.Table;

import java.util.Collection;

/**
 * Strategy for selecting a table given party size and availability.
 */
public interface TableAllocationStrategy {

    Table allocate(Collection<Table> tables, int partySize);
}
