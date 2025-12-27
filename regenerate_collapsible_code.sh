#!/bin/bash

PROBLEM=$1

echo "Regenerating $PROBLEM CODE.md with collapsible sections..."

# Get all Java files for this problem
FILES=$(find src/main/java/com/you/lld/problems/$PROBLEM -name "*.java" | sort)

# Start the CODE.md file
cat > docs/problems/$PROBLEM/CODE.md << 'EOF'
# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
EOF

# Generate directory structure
find src/main/java/com/you/lld/problems/$PROBLEM -name "*.java" | \
    sed "s|src/main/java/com/you/lld/problems/$PROBLEM/||" | \
    sort | \
    awk '{print "├── " $0}' >> docs/problems/$PROBLEM/CODE.md

echo '```' >> docs/problems/$PROBLEM/CODE.md
echo "" >> docs/problems/$PROBLEM/CODE.md

# Add each Java file with collapsible section
for file in $FILES; do
    filename=$(basename "$file")
    filepath=${file#src/main/java/com/you/lld/problems/$PROBLEM/}
    
    echo "<details>" >> docs/problems/$PROBLEM/CODE.md
    echo "<summary>📄 <strong>$filepath</strong> - Click to expand</summary>" >> docs/problems/$PROBLEM/CODE.md
    echo "" >> docs/problems/$PROBLEM/CODE.md
    echo '```java' >> docs/problems/$PROBLEM/CODE.md
    cat "$file" >> docs/problems/$PROBLEM/CODE.md
    echo '```' >> docs/problems/$PROBLEM/CODE.md
    echo "" >> docs/problems/$PROBLEM/CODE.md
    echo "</details>" >> docs/problems/$PROBLEM/CODE.md
    echo "" >> docs/problems/$PROBLEM/CODE.md
done

echo "✅ Done: docs/problems/$PROBLEM/CODE.md"
