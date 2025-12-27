#!/usr/bin/env python3
"""
Fix CODE links in all README files to use absolute paths
"""
import os
import re
from pathlib import Path

def fix_code_links(readme_path, problem_name):
    """Fix relative CODE links to absolute paths"""
    with open(readme_path, 'r') as f:
        content = f.read()
    
    # Replace (CODE) with (/problems/{problem}/CODE)
    content = re.sub(r'\(CODE\)', f'(/problems/{problem_name}/CODE)', content)
    
    # Replace (CODE#anchor) with (/problems/{problem}/CODE#anchor)
    content = re.sub(r'\(CODE#', f'(/problems/{problem_name}/CODE#', content)
    
    with open(readme_path, 'w') as f:
        f.write(content)
    
    return True

def main():
    docs_problems = Path('docs/problems')
    
    fixed = []
    for problem_dir in sorted(docs_problems.iterdir()):
        if not problem_dir.is_dir():
            continue
        
        readme = problem_dir / 'README.md'
        if readme.exists():
            fix_code_links(readme, problem_dir.name)
            fixed.append(problem_dir.name)
            print(f"✅ {problem_dir.name}")
    
    print(f"\n✅ Fixed CODE links in {len(fixed)} README files")
    return fixed

if __name__ == '__main__':
    main()
