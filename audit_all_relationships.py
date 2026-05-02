#!/usr/bin/env python3
"""
Audit all problems to check relationship completeness.
"""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

def count_classes_and_relationships(mmd_path):
    """Count classes and relationships in a Mermaid file."""
    if not mmd_path.exists():
        return 0, 0
    
    content = mmd_path.read_text(encoding='utf-8')
    
    # Count classes
    class_count = len(re.findall(r'^    class \w+', content, re.MULTILINE))
    
    # Count relationships (arrows)
    rel_count = len(re.findall(r'-->', content))
    
    return class_count, rel_count

problems = []
for problem_dir in sorted(PROBLEMS_DIR.iterdir()):
    if problem_dir.is_dir():
        mmd_path = problem_dir / "diagrams" / "class-diagram.mmd"
        if mmd_path.exists():
            classes, rels = count_classes_and_relationships(mmd_path)
            ratio = rels / classes if classes > 0 else 0
            problems.append({
                'name': problem_dir.name,
                'classes': classes,
                'relationships': rels,
                'ratio': ratio
            })

# Sort by ratio (lowest first - these need attention)
problems.sort(key=lambda x: x['ratio'])

print("Problems with LOW relationship ratio (need attention):")
print("=" * 70)
print(f"{'Problem':<25} {'Classes':<10} {'Arrows':<10} {'Ratio':<10} {'Status'}")
print("-" * 70)

low_ratio_problems = []
for p in problems:
    if p['ratio'] < 0.4:  # Less than 0.4 arrows per class
        status = "⚠️  LOW" if p['ratio'] < 0.3 else "⚠️  MEDIUM"
        print(f"{p['name']:<25} {p['classes']:<10} {p['relationships']:<10} {p['ratio']:.2f}       {status}")
        low_ratio_problems.append(p['name'])

print()
print("Problems with GOOD relationship ratio:")
print("=" * 70)
print(f"{'Problem':<25} {'Classes':<10} {'Arrows':<10} {'Ratio':<10} {'Status'}")
print("-" * 70)

for p in problems:
    if p['ratio'] >= 0.4:
        status = "✅ GOOD" if p['ratio'] >= 0.5 else "✅ OK"
        print(f"{p['name']:<25} {p['classes']:<10} {p['relationships']:<10} {p['ratio']:.2f}       {status}")

print()
print("=" * 70)
print(f"Total problems: {len(problems)}")
print(f"Low ratio (< 0.4): {len(low_ratio_problems)}")
print(f"Good ratio (>= 0.4): {len(problems) - len(low_ratio_problems)}")
print()
print("Low ratio problems that need more relationships:")
for p in low_ratio_problems:
    print(f"  - {p}")
print("=" * 70)
