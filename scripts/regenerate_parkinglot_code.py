#!/usr/bin/env python3
"""
Regenerate parkinglot CODE.md with implementation files included
"""

import os
from pathlib import Path

def generate_code_md():
    src_dir = Path("src/main/java/com/you/lld/problems/parkinglot")
    docs_dir = Path("docs/problems/parkinglot")
    
    # Collect all Java files
    java_files = sorted(src_dir.rglob("*.java"))
    
    print(f"Found {len(java_files)} Java files")
    
    # Build directory structure
    structure = []
    structure.append("parkinglot/")
    
    for java_file in java_files:
        rel_path = java_file.relative_to(src_dir)
        structure.append(f"├── {rel_path}")
    
    # Build CODE.md content
    content = []
    content.append("# parkinglot - Complete Implementation")
    content.append("")
    content.append(f"## 📁 Project Structure ({len(java_files)} files)")
    content.append("")
    content.append("```")
    content.extend(structure)
    content.append("```")
    content.append("")
    content.append("## 📝 Source Code")
    content.append("")
    
    # Add each file
    for java_file in java_files:
        rel_path = java_file.relative_to(src_dir)
        
        content.append(f"### 📄 `{rel_path}`")
        content.append("")
        content.append(f"<details>")
        content.append(f"<summary>📄 Click to view {rel_path}</summary>")
        content.append("")
        content.append("```java")
        
        with open(java_file, 'r', encoding='utf-8') as f:
            content.append(f.read())
        
        content.append("```")
        content.append("")
        content.append("</details>")
        content.append("")
    
    # Write CODE.md
    code_md_path = docs_dir / "CODE.md"
    code_md_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(code_md_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(content))
    
    print(f"✅ Generated {code_md_path} with {len(java_files)} files")

if __name__ == "__main__":
    generate_code_md()
