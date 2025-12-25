#!/bin/bash

# Create directories for all remaining problems
problems=(
    "autocomplete:Easy"
    "taskmanagement:Easy"
    "atm:Medium"
    "pubsub:Medium"
    "simplesearch:Medium"
    "paymentgateway:Medium"
    "library:Medium"
    "trafficcontrol:Medium"
    "socialnetwork:Medium"
    "learningplatform:Medium"
    "minesweeper:Medium"
    "amazon:Hard"
    "linkedin:Hard"
    "cricinfo:Hard"
    "coffeemachine:Hard"
    "restaurant:Hard"
    "stockexchange:Hard"
    "auction:Hard"
    "filesystem:Hard"
    "versioncontrol:Hard"
    "fooddelivery:Hard"
    "ridehailing:Hard"
    "taskscheduler:Hard"
)

for problem_info in "${problems[@]}"; do
    IFS=':' read -r problem difficulty <<< "$problem_info"
    
    # Create directories
    mkdir -p "src/main/java/com/you/lld/problems/$problem"
    mkdir -p "docs/problems/$problem"
    
    echo "✓ Created directories for $problem ($difficulty)"
done

echo ""
echo "✅ All directories created!"
echo "Total problems to implement: ${#problems[@]}"
