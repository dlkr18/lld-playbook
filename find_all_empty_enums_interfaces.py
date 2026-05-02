#!/usr/bin/env python3
"""Find ALL empty enums and interfaces across all problems."""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

issues = []

for problem_dir in sorted(PROBLEMS_DIR.iterdir()):
    if not problem_dir.is_dir():
        continue
    
    mmd_path = problem_dir / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        continue
    
    content = mmd_path.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    problem_issues = []
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Check for pattern: "class ClassName\n    <<enumeration>> ClassName" or similar
        if line.startswith('class ') and i + 1 < len(lines):
            class_name = re.search(r'class (\w+)', line)
            if class_name:
                class_name = class_name.group(1)
                next_line = lines[i + 1].strip()
                
                # Pattern 1: "class X\n    <<enumeration>> X" or "<<interface>> X"
                if (next_line == f'<<enumeration>> {class_name}' or 
                    next_line == f'<<interface>> {class_name}'):
                    problem_issues.append(f"{class_name} (line {i+1})")
        
        i += 1
    
    if problem_issues:
        issues.append({
            'problem': problem_dir.name,
            'classes': problem_issues
        })

if issues:
    print("⚠️  PROBLEMS WITH EMPTY ENUMS/INTERFACES:")
    print("="*70)
    total = 0
    for item in issues:
        print(f"\n{item['problem']}:")
        for cls in item['classes']:
            print(f"  • {cls}")
            total += 1
    print(f"\nTotal: {total} empty enums/interfaces across {len(issues)} problems")
else:
    print("✅ No empty enums/interfaces found!")
