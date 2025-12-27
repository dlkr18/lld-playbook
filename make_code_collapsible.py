#!/usr/bin/env python3
"""
Add collapsible <details> tags to CODE.md files for better UX
"""
import os
import re
from pathlib import Path

def make_code_collapsible(code_md_path):
    """Wrap each code block in collapsible details tags"""
    with open(code_md_path, 'r') as f:
        content = f.read()
    
    # Pattern: ### 📄 `filename` followed by ```language ... ```
    # Replace with collapsible version
    pattern = r'(### 📄 `([^`]+)`)\n\n(```[\s\S]*?```)'
    
    def replacer(match):
        header = match.group(1)  # ### 📄 `filename`
        filename = match.group(2)  # just the filename
        code_block = match.group(3)  # ```java ... ```
        
        return f'''{header}

<details>
<summary>📄 Click to view {filename}</summary>

{code_block}

</details>'''
    
    new_content = re.sub(pattern, replacer, content)
    
    with open(code_md_path, 'w') as f:
        f.write(new_content)
    
    return True

def main():
    docs_problems = Path('docs/problems')
    
    updated = []
    for problem_dir in sorted(docs_problems.iterdir()):
        if not problem_dir.is_dir():
            continue
        
        code_md = problem_dir / 'CODE.md'
        if code_md.exists():
            make_code_collapsible(code_md)
            updated.append(problem_dir.name)
            print(f"✅ {problem_dir.name}")
    
    print(f"\n✅ Updated {len(updated)} CODE.md files with collapsible sections")
    return updated

if __name__ == '__main__':
    main()


