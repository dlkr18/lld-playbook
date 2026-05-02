#!/usr/bin/env python3
"""Find empty classes in all diagrams."""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

problems_with_empty_classes = []

for problem_dir in sorted(PROBLEMS_DIR.iterdir()):
    if not problem_dir.is_dir():
        continue
    
    mmd_path = problem_dir / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        continue
    
    content = mmd_path.read_text(encoding='utf-8')
    
    # Find empty classes: "class ClassName {\n    }" or "class ClassName\n    <<" with no content
    empty_pattern = r'class (\w+) \{\s*\}'
    empty_matches = re.findall(empty_pattern, content)
    
    # Find classes with only stereotype and no content
    empty_with_stereotype = []
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.strip().startswith('class ') and '{' in line:
            class_name = re.search(r'class (\w+)', line).group(1)
            # Check if next line is just closing brace or stereotype
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line == '}':
                    empty_with_stereotype.append(class_name)
                elif '<<' in next_line and i + 2 < len(lines) and lines[i + 2].strip() == '':
                    # Stereotype with no methods/fields
                    empty_with_stereotype.append(class_name)
    
    if empty_matches or empty_with_stereotype:
        problems_with_empty_classes.append({
            'problem': problem_dir.name,
            'empty': list(set(empty_matches + empty_with_stereotype))
        })

if problems_with_empty_classes:
    print("⚠️  PROBLEMS WITH EMPTY CLASSES:")
    print("="*70)
    for p in problems_with_empty_classes:
        print(f"\n{p['problem']}:")
        for cls in p['empty']:
            print(f"  • {cls}")
    print()
    print(f"Total: {len(problems_with_empty_classes)} problems have empty classes")
else:
    print("✅ No empty classes found in any diagrams!")
