#!/bin/bash

echo "🔍 CHECKING ALL 44 LLD PROBLEMS"
echo "================================="
echo ""

# List all 44 problems
problems=(
    "amazon"
    "atm"
    "auction"
    "autocomplete"
    "bloomfilter"
    "bookmyshow"
    "chess"
    "coffeemachine"
    "cricinfo"
    "elevator"
    "featureflags"
    "filesystem"
    "fooddelivery"
    "inventory"
    "kvstore"
    "learningplatform"
    "library"
    "linkedin"
    "logging"
    "loggingframework"
    "lrucache"
    "minesweeper"
    "notification"
    "parkinglot"
    "paymentgateway"
    "pubsub"
    "ratelimiter"
    "restaurant"
    "ridehailing"
    "search"
    "simplesearch"
    "snakeandladder"
    "socialnetwork"
    "splitwise"
    "stockexchange"
    "taskmanagement"
    "taskscheduler"
    "tictactoe"
    "trafficcontrol"
    "urlshortener"
    "vendingmachine"
)

# Note: We're missing 3 problems from the list above. Let me add them:
# Looking at the project structure, we have 44 total. Let me list what's in docs/problems/

echo "Checking all problems in docs/problems/..."
echo ""

total=0
comprehensive=0
issues=0

for dir in docs/problems/*/; do
    problem=$(basename "$dir")
    readme="$dir/README.md"
    
    if [ -f "$readme" ]; then
        lines=$(wc -l < "$readme")
        total=$((total + 1))
        
        # Check if comprehensive (600+ lines)
        if [ $lines -ge 600 ]; then
            status="✅ COMPREHENSIVE"
            comprehensive=$((comprehensive + 1))
        elif [ $lines -ge 400 ]; then
            status="⚠️  FUNCTIONAL"
        else
            status="❌ SHORT"
            issues=$((issues + 1))
        fi
        
        printf "%-25s %4d lines  %s\n" "$problem" "$lines" "$status"
    fi
done

echo ""
echo "========================================="
echo "Summary:"
echo "  Total Problems: $total"
echo "  Comprehensive (600+): $comprehensive"
echo "  Functional (400-599): $((total - comprehensive - issues))"
echo "  Short (<400): $issues"
echo "========================================="
