#!/bin/bash
for problem in docs/problems/*/diagrams/class-diagram.mmd; do
    dir=$(dirname "$problem")
    mmd="$dir/class-diagram.mmd"
    png="$dir/class-diagram.png"
    problem_name=$(basename $(dirname "$dir"))
    
    if [ -f "$mmd" ]; then
        mmdc -i "$mmd" -o "$png" -b transparent -w 2048 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ $problem_name"
        else
            echo "⚠️  $problem_name"
        fi
    fi
done
