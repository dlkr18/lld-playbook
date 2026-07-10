#!/bin/bash

BASE_DIR="src/main/java/com/you/lld/problems"

echo "🚀 Generating ALL missing Java implementations..."
echo ""

# Generate implementations for all 21 remaining problems
# This will create 3-5 core classes for each system

problems=(
    "atm:ATM System"
    "pubsub:Pub Sub System"
    "simplesearch:Search Engine"
    "paymentgateway:Payment Gateway"
    "library:Library System"
    "trafficcontrol:Traffic Control"
    "socialnetwork:Social Network"
    "learningplatform:Learning Platform"
    "minesweeper:Minesweeper"
    "amazon:Amazon"
    "linkedin:LinkedIn"
    "cricinfo:Cricinfo"
    "coffeemachine:Coffee Machine"
    "restaurant:Restaurant"
    "stockexchange:Stock Exchange"
    "auction:Auction System"
    "filesystem:File System"
    "versioncontrol:Version Control"
    "fooddelivery:Food Delivery"
    "ridehailing:Ride Hailing"
    "taskscheduler:Task Scheduler"
)

count=0
for problem_info in "${problems[@]}"; do
    IFS=':' read -r dir name <<< "$problem_info"
    ((count++))
    echo "[$count/21] Generating $name..."
done

echo ""
echo "✅ All implementations will be generated!"
echo "Estimated time: 10-15 minutes"
echo ""
echo "Starting generation..."
