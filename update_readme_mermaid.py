#!/usr/bin/env python3
"""
Update all READMEs with the regenerated Mermaid code.
"""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

def update_readme_mermaid(problem_name: str) -> bool:
    """Update README with new Mermaid code from .mmd file."""
    readme_path = PROBLEMS_DIR / problem_name / "README.md"
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    
    if not readme_path.exists() or not mmd_path.exists():
        return False
    
    # Read new Mermaid code
    new_mermaid = mmd_path.read_text(encoding='utf-8').strip()
    
    # Read README
    readme_content = readme_path.read_text(encoding='utf-8')
    
    # Pattern: Find <details> section with old mermaid code
    pattern = r'(<details>\s*<summary>View Mermaid Source</summary>\s*```mermaid\s+).*?(```\s*</details>)'
    
    replacement = r'\g<1>' + new_mermaid + r'\n\g<2>'
    
    new_content, count = re.subn(pattern, replacement, readme_content, flags=re.DOTALL)
    
    if count > 0:
        readme_path.write_text(new_content, encoding='utf-8')
        return True
    
    return False

# Get all problems with diagrams
problems = []
for problem_dir in sorted(PROBLEMS_DIR.iterdir()):
    if problem_dir.is_dir():
        mmd_file = problem_dir / "diagrams" / "class-diagram.mmd"
        if mmd_file.exists():
            problems.append(problem_dir.name)

print(f"Updating {len(problems)} READMEs with regenerated Mermaid code...")
print()

success = 0
for problem in problems:
    if update_readme_mermaid(problem):
        print(f"✅ {problem}")
        success += 1
    else:
        print(f"⏭️  {problem}")

print()
print(f"✅ Updated {success}/{len(problems)} READMEs")
