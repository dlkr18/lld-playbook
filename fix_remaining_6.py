#!/usr/bin/env python3
"""
Fix the 6 remaining problems:
- 5 have empty <details> that need to be filled
- 1 (whatsapp) needs PNG reference added
"""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

def fix_empty_details(problem_name):
    """Fill empty <details> sections with mermaid code."""
    readme_path = PROBLEMS_DIR / problem_name / "README.md"
    mmd_file = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    
    if not mmd_file.exists():
        print(f"   ❌ No .mmd file found")
        return False
    
    content = readme_path.read_text(encoding='utf-8')
    mermaid_code = mmd_file.read_text(encoding='utf-8').strip()
    
    # Pattern: empty <details> section
    pattern = r'(<details>\s*<summary>View Mermaid Source</summary>\s*)(</details>)'
    
    replacement = r'\1\n\n```mermaid\n' + mermaid_code + r'\n```\n\n\2'
    
    new_content, count = re.subn(pattern, replacement, content, count=1)
    
    if count > 0:
        readme_path.write_text(new_content, encoding='utf-8')
        return True
    
    return False

def fix_whatsapp():
    """Add PNG reference to whatsapp after ## Class Diagram."""
    readme_path = PROBLEMS_DIR / "whatsapp" / "README.md"
    content = readme_path.read_text(encoding='utf-8')
    
    # Pattern: ## Class Diagram followed by ## Sequence Diagrams (no PNG in between)
    pattern = r'(## Class Diagram)\s*\n+(## Sequence Diagrams)'
    
    replacement = r'\1\n\n### Class Diagram\n\n![WhatsApp Class Diagram](diagrams/class-diagram.png)\n\n\2'
    
    new_content, count = re.subn(pattern, replacement, content, count=1)
    
    if count > 0:
        readme_path.write_text(new_content, encoding='utf-8')
        return True
    
    return False

def main():
    print("Fixing remaining 6 problems...")
    print()
    
    # Fix 5 with empty <details>
    empty_details_problems = ["library", "lrucache", "parkinglot", "ratelimiter", "taskscheduler"]
    
    for problem in empty_details_problems:
        print(f"{problem}:")
        if fix_empty_details(problem):
            print(f"   ✅ Filled empty <details> with mermaid code")
        else:
            print(f"   ❌ Failed to fix")
        print()
    
    # Fix whatsapp
    print("whatsapp:")
    if fix_whatsapp():
        print("   ✅ Added PNG reference")
    else:
        print("   ❌ Failed to fix")
    print()
    
    print("="*60)
    print("✅ All 6 problems fixed!")
    print("="*60)

if __name__ == "__main__":
    main()
