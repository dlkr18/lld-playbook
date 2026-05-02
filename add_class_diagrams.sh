#!/bin/bash

problems=(
    "amazon"
    "atm"
    "auction"
    "autocomplete"
    "bloomfilter"
    "featureflags"
    "filesystem"
    "kvstore"
    "learningplatform"
    "linkedin"
    "minesweeper"
    "paymentgateway"
    "restaurant"
    "search"
    "simplesearch"
    "snakeandladder"
    "splitwise"
    "stockexchange"
    "taskmanagement"
    "tictactoe"
    "trafficcontrol"
)

for problem in "${problems[@]}"; do
    readme="docs/problems/$problem/README.md"
    
    if [ ! -f "$readme" ]; then
        echo "⚠️  $problem: README not found"
        continue
    fi
    
    # Find line number after "Non-Functional Requirements" or "Requirements" section
    # Look for the next ## heading after requirements
    line_num=$(grep -n "^## " "$readme" | grep -A 1 "Requirements" | tail -1 | cut -d: -f1)
    
    if [ -z "$line_num" ]; then
        echo "⚠️  $problem: Could not find insertion point"
        continue
    fi
    
    # Insert before that line
    insert_line=$((line_num - 1))
    
    # Add class diagram section
    sed -i '' "${insert_line} a\\
\\
## Class Diagram\\
\\
![${problem^} Class Diagram](diagrams/class-diagram.png)\\
" "$readme"
    
    echo "✅ $problem: Added class diagram at line $insert_line"
done

echo ""
echo "✅ All class diagrams added!"
