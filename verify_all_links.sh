#!/bin/bash

echo "🔍 VERIFICATION REPORT - ALL 44 PROBLEMS"
echo "========================================"
echo ""

problems=(
  amazon atm auction autocomplete bloomfilter bookmyshow chess coffeemachine
  cricinfo elevator featureflags filesystem fooddelivery inventory kvstore
  learningplatform library linkedin logging loggingframework lrucache
  minesweeper notification parkinglot paymentgateway pubsub ratelimiter
  restaurant ridehailing search simplesearch snakeandladder socialnetwork
  splitwise spotify stackoverflow stockexchange taskmanagement taskscheduler
  tictactoe trafficcontrol urlshortener vendingmachine versioncontrol whatsapp
)

for problem in "${problems[@]}"; do
  readme="docs/problems/$problem/README.md"
  code="docs/problems/$problem/CODE.md"
  diagram="docs/problems/$problem/diagrams/class-diagram.png"
  
  status="✅"
  issues=""
  
  # Check README exists and has content
  if [ ! -f "$readme" ]; then
    status="❌"
    issues+="README missing; "
  elif [ $(wc -l < "$readme") -lt 200 ]; then
    status="⚠️ "
    issues+="README too short ($(wc -l < "$readme") lines); "
  fi
  
  # Check CODE.md exists
  if [ ! -f "$code" ]; then
    status="❌"
    issues+="CODE.md missing; "
  fi
  
  # Check diagram exists
  if [ ! -f "$diagram" ]; then
    status="⚠️ "
    issues+="PNG diagram missing; "
  fi
  
  # Check if README has proper sections
  if [ -f "$readme" ]; then
    if ! grep -q "## Requirements" "$readme"; then
      status="⚠️ "
      issues+="Missing Requirements section; "
    fi
    if ! grep -q "## Implementation Guide" "$readme"; then
      status="⚠️ "
      issues+="Missing Implementation Guide; "
    fi
  fi
  
  if [ "$status" == "✅" ]; then
    echo "$status $problem - All good"
  else
    echo "$status $problem - $issues"
  fi
done

echo ""
echo "✅ = Complete  ⚠️  = Needs attention  ❌ = Critical issue"
