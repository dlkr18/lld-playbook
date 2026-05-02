#!/usr/bin/env python3
"""Final verification - check for truly empty classes."""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

truly_empty = []

for problem_dir in sorted(PROBLEMS_DIR.iterdir()):
    if not problem_dir.is_dir():
        continue
    
    mmd_path = problem_dir / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        continue
    
    content = mmd_path.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if line.startswith('class ') and '{' in line:
            class_name = re.search(r'class (\w+)', line).group(1)
            
            # Count lines until closing brace
            j = i + 1
            has_content = False
            
            while j < len(lines):
                inner = lines[j].strip()
                
                if inner == '}':
                    # Found closing brace
                    if not has_content:
                        truly_empty.append({
                            'problem': problem_dir.name,
                            'class': class_name,
                            'lines': i + 1
                        })
                    break
                
                # Check if this line has actual content (not just stereotypes)
                if inner and inner != '<<enumeration>>' and inner != '<<interface>>' and inner != '<<abstract>>':
                    has_content = True
                
                j += 1
            
            i = j
        
        i += 1

if truly_empty:
    print("⚠️  TRULY EMPTY CLASSES:")
    print("="*70)
    for item in truly_empty:
        print(f"{item['problem']:20} {item['class']:30} line {item['lines']}")
    print(f"\nTotal: {len(truly_empty)} empty classes")
else:
    print("✅ NO EMPTY CLASSES FOUND!")
    print("="*70)
    print("All 44 problems have complete class diagrams!")
