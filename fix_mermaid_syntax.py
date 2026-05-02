#!/usr/bin/env python3
"""Fix Mermaid syntax issues in generated diagrams."""

import re
import subprocess
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

def fix_mermaid_syntax(mmd_path: Path) -> bool:
    """Fix common Mermaid syntax issues."""
    content = mmd_path.read_text(encoding='utf-8')
    
    # Fix method syntax - ensure proper spacing
    # Pattern: +methodName() returnType -> +methodName(): returnType
    content = re.sub(r'\+(\w+)\(\)\s+(\w+)', r'+\1(): \2', content)
    
    # Fix field syntax - ensure proper spacing  
    # Pattern: -type name -> -type: name
    content = re.sub(r'-(\w+<?[\w,\s~]*>?)\s+(\w+)(?=\s|$)', r'-\1: \2', content)
    
    mmd_path.write_text(content, encoding='utf-8')
    return True

def regenerate_png(problem_name: str) -> bool:
    """Regenerate PNG for a problem."""
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    png_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.png"
    
    if not mmd_path.exists():
        return False
    
    # Fix syntax
    fix_mermaid_syntax(mmd_path)
    
    # Regenerate PNG
    try:
        result = subprocess.run(
            ['mmdc', '-i', str(mmd_path), '-o', str(png_path), '-b', 'transparent', '-w', '2048'],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0
    except Exception as e:
        return False

problems_with_errors = [
    "bookmyshow", "logging", "loggingframework", "minesweeper", 
    "notification", "parkinglot", "stackoverflow", "taskscheduler",
    "vendingmachine", "whatsapp"
]

print("Fixing Mermaid syntax and regenerating PNGs...")
print()

success = 0
for problem in problems_with_errors:
    if regenerate_png(problem):
        print(f"✅ {problem}")
        success += 1
    else:
        print(f"❌ {problem}")

print()
print(f"Fixed {success}/{len(problems_with_errors)} problems")
