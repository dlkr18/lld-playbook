#!/usr/bin/env python3
"""
Extract Mermaid code from READMEs, generate PNG diagrams, and update READMEs.
For problems: spotify, stackoverflow, url-shortener, whatsapp
"""

import re
import os
import subprocess
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")
problems = ["spotify", "stackoverflow", "url-shortener", "whatsapp"]

def extract_first_mermaid_block(content):
    """Extract the first (main class diagram) mermaid block."""
    pattern = r'```mermaid\s+(classDiagram.*?)```'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def remove_all_mermaid_blocks(content):
    """Remove all mermaid code blocks from content."""
    pattern = r'```mermaid\s+.*?```\s*'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content

def add_class_diagram_section(content, problem):
    """Add or update Class Diagram section with PNG reference."""
    # Check if there's already a "## Class Diagram" or "### Class Diagram" section
    if re.search(r'^###? Class Diagram', content, re.MULTILINE):
        # Replace the section
        pattern = r'(###? Class Diagram)\s+```mermaid.*?```'
        replacement = r'\1\n\n![Class Diagram](diagrams/class-diagram.png)'
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    else:
        # Add after "## Diagrams" section if it exists
        if '## Diagrams' in content:
            pattern = r'(## Diagrams\s+)'
            replacement = r'\1\n### Class Diagram\n\n![Class Diagram](diagrams/class-diagram.png)\n\n'
            content = re.sub(pattern, replacement, content)
        else:
            # Add before first ## after overview
            lines = content.split('\n')
            insert_idx = -1
            for i, line in enumerate(lines):
                if line.startswith('## ') and 'overview' not in line.lower() and i > 10:
                    insert_idx = i
                    break
            if insert_idx > 0:
                lines.insert(insert_idx, '')
                lines.insert(insert_idx, '![Class Diagram](diagrams/class-diagram.png)')
                lines.insert(insert_idx, '')
                lines.insert(insert_idx, '## Class Diagram')
                lines.insert(insert_idx, '')
                content = '\n'.join(lines)
    
    return content

def process_problem(problem):
    """Process one problem: extract mermaid, generate PNG, update README."""
    print(f"\n{'='*60}")
    print(f"Processing: {problem}")
    print('='*60)
    
    problem_dir = PROBLEMS_DIR / problem
    readme_path = problem_dir / "README.md"
    diagrams_dir = problem_dir / "diagrams"
    
    # Read README
    content = readme_path.read_text(encoding='utf-8')
    
    # Extract first mermaid block (class diagram)
    mermaid_code = extract_first_mermaid_block(content)
    if not mermaid_code:
        print(f"❌ No mermaid code found in {problem}")
        return False
    
    print(f"✅ Extracted mermaid code ({len(mermaid_code)} chars)")
    
    # Create diagrams directory
    diagrams_dir.mkdir(exist_ok=True)
    print(f"✅ Created diagrams folder")
    
    # Save .mmd file
    mmd_path = diagrams_dir / "class-diagram.mmd"
    mmd_path.write_text(mermaid_code, encoding='utf-8')
    print(f"✅ Saved {mmd_path}")
    
    # Generate PNG using mmdc
    png_path = diagrams_dir / "class-diagram.png"
    try:
        result = subprocess.run(
            ['mmdc', '-i', str(mmd_path), '-o', str(png_path), '-b', 'transparent'],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            print(f"✅ Generated {png_path}")
        else:
            print(f"⚠️  mmdc returned {result.returncode}: {result.stderr[:200]}")
            # Continue anyway - file might still be created
    except Exception as e:
        print(f"⚠️  Error running mmdc: {e}")
    
    # Update README: remove all mermaid blocks
    new_content = remove_all_mermaid_blocks(content)
    
    # Add PNG reference
    new_content = add_class_diagram_section(new_content, problem)
    
    # Write back
    readme_path.write_text(new_content, encoding='utf-8')
    print(f"✅ Updated README (removed mermaid blocks, added PNG reference)")
    
    return True

def main():
    print("Generating PNG diagrams for 4 problems...")
    print("Problems: spotify, stackoverflow, url-shortener, whatsapp")
    
    success_count = 0
    for problem in problems:
        if process_problem(problem):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Processed {success_count}/{len(problems)} problems")
    print('='*60)

if __name__ == "__main__":
    main()
