#!/usr/bin/env python3
"""
Add collapsible Mermaid source sections to all problem READMEs.
Format matches parkinglot: <details> with mermaid code, then PNG image.
"""

import re
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

def find_class_diagram_files(problem_dir):
    """Find class diagram .mmd and .png files."""
    diagrams_dir = problem_dir / "diagrams"
    if not diagrams_dir.exists():
        return None, None
    
    # Look for class diagram files
    mmd_candidates = [
        diagrams_dir / "class-diagram.mmd",
        diagrams_dir / "class.mmd"
    ]
    png_candidates = [
        diagrams_dir / "class-diagram.png",
        diagrams_dir / "class.png"
    ]
    
    mmd_file = None
    for candidate in mmd_candidates:
        if candidate.exists():
            mmd_file = candidate
            break
    
    png_file = None
    for candidate in png_candidates:
        if candidate.exists():
            png_file = candidate
            break
    
    return mmd_file, png_file

def get_png_filename_from_readme(readme_content):
    """Extract PNG filename from existing README reference."""
    # Match ![...](diagrams/xxx.png)
    match = re.search(r'!\[.*?\]\(diagrams/(class(?:-diagram)?\.png)\)', readme_content)
    if match:
        return match.group(1)
    return "class-diagram.png"  # default

def add_collapsible_section(readme_path, mmd_file, png_filename):
    """Add collapsible Mermaid section to README."""
    content = readme_path.read_text(encoding='utf-8')
    
    # Read mermaid content
    mermaid_code = mmd_file.read_text(encoding='utf-8').strip()
    
    # Get PNG filename from existing reference
    png_ref = get_png_filename_from_readme(content)
    
    # Pattern: ## Class Diagram or ### Class Diagram followed by PNG reference
    # We want to insert <details> section between heading and PNG
    
    # Pattern 1: Heading followed immediately by PNG (most common)
    pattern1 = r'(###? Class Diagram)\s*\n\s*(!\[.*?\]\(diagrams/' + re.escape(png_ref) + r'\))'
    
    # Pattern 2: Heading with some whitespace, then PNG
    pattern2 = r'(###? Class Diagram)\s*\n+(!\[.*?\]\(diagrams/' + re.escape(png_ref) + r'\))'
    
    replacement = r'''\1

<details>
<summary>View Mermaid Source</summary>

```mermaid
''' + mermaid_code + r'''
```

</details>

\2'''
    
    # Try to replace
    new_content, count = re.subn(pattern1, replacement, content, count=1)
    if count == 0:
        new_content, count = re.subn(pattern2, replacement, content, count=1)
    
    if count > 0:
        readme_path.write_text(new_content, encoding='utf-8')
        return True
    
    return False

def process_all_problems():
    """Process all 44 problems."""
    print("Adding collapsible Mermaid sections to all problems...")
    print()
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    problems = sorted([d for d in PROBLEMS_DIR.iterdir() if d.is_dir()])
    
    for problem_dir in problems:
        problem_name = problem_dir.name
        readme_path = problem_dir / "README.md"
        
        if not readme_path.exists():
            print(f"⏭️  {problem_name} - No README")
            skip_count += 1
            continue
        
        # Find diagram files
        mmd_file, png_file = find_class_diagram_files(problem_dir)
        
        if not mmd_file:
            print(f"⏭️  {problem_name} - No .mmd file")
            skip_count += 1
            continue
        
        if not png_file:
            print(f"⚠️  {problem_name} - Has .mmd but no PNG")
            skip_count += 1
            continue
        
        # Get PNG filename for reference
        png_filename = png_file.name
        
        # Add collapsible section
        if add_collapsible_section(readme_path, mmd_file, png_filename):
            print(f"✅ {problem_name}")
            success_count += 1
        else:
            print(f"❌ {problem_name} - Could not find/replace pattern")
            error_count += 1
    
    print()
    print("="*60)
    print(f"✅ Success: {success_count}")
    print(f"⏭️  Skipped: {skip_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📊 Total: {success_count + skip_count + error_count}")
    print("="*60)

if __name__ == "__main__":
    process_all_problems()
