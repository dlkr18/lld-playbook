#!/bin/bash

echo "🔍 COMPREHENSIVE AUDIT OF ALL 44 PROBLEMS"
echo "=========================================="
echo ""

# All 44 problems
problems=(
  amazon atm auction autocomplete bloomfilter bookmyshow chess coffeemachine
  cricinfo elevator featureflags filesystem fooddelivery inventory kvstore
  learningplatform library linkedin logging loggingframework lrucache
  minesweeper notification parkinglot paymentgateway pubsub ratelimiter
  restaurant ridehailing search simplesearch snakeandladder socialnetwork
  splitwise spotify stackoverflow stockexchange taskmanagement taskscheduler
  tictactoe trafficcontrol urlshortener vendingmachine versioncontrol whatsapp
)

completed=()
generic=()

for problem in "${problems[@]}"; do
  readme="docs/problems/$problem/README.md"
  
  if [ -f "$readme" ]; then
    # Check for generic template indicators
    if grep -q "{problem_name}" "$readme" 2>/dev/null || \
       grep -q "Source code implementation in progress" "$readme" 2>/dev/null || \
       grep -q "class Service {" "$readme" 2>/dev/null; then
      generic+=("$problem")
    else
      # Check if it has problem-specific content (not just template)
      if grep -q -E "(Movie|Show|Seat|Card|Account|Product|Order|User|Auction|Trie|Hash|Elevator|Floor|Feature|Flag|File|Directory|Food|Restaurant|Key|Value|Course|Book|Profile|Post|Logger|Cache|Mine|Email|Parking|Payment|Topic|Message|Token|Bucket|Table|Menu|Ride|Driver|Index|Document|Snake|Ladder|Feed|Comment|Expense|Group|Track|Song|Question|Answer|Stock|Trade|Task|Priority|Board|Cell|Traffic|Signal|URL|Shortened|Beverage|Coffee|Commit|Branch|Chat|Conversation)" "$readme" 2>/dev/null; then
        completed+=("$problem")
      else
        generic+=("$problem")
      fi
    fi
  else
    generic+=("$problem")
  fi
done

echo "✅ COMPLETED (Problem-Specific Content): ${#completed[@]}/44"
echo "----------------------------------------"
for p in "${completed[@]}"; do
  lines=$(wc -l < "docs/problems/$p/README.md" 2>/dev/null || echo "0")
  echo "  ✓ $p ($lines lines)"
done | sort

echo ""
echo "🚧 NEEDS WORK (Generic/Template): ${#generic[@]}/44"
echo "----------------------------------------"
for p in "${generic[@]}"; do
  if [ -f "docs/problems/$p/README.md" ]; then
    lines=$(wc -l < "docs/problems/$p/README.md")
    echo "  ⚠️  $p ($lines lines) - has generic content"
  else
    echo "  ❌ $p - README missing"
  fi
done | sort

echo ""
echo "📊 SUMMARY"
echo "=========="
echo "✅ Complete: ${#completed[@]}"
echo "🚧 To Do: ${#generic[@]}"
echo "📝 Total: 44"
echo ""
