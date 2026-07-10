#!/usr/bin/env python3
import os
from collections import defaultdict

def generate_code_md_with_tree(problem_name, src_dir, docs_dir):
    """Generate CODE.md with directory tree view and organized sections"""
    
    # Collect all Java files organized by directory
    file_tree = defaultdict(list)
    all_files = []
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.java'):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, src_dir)
                rel_dir = os.path.dirname(rel_path) if os.path.dirname(rel_path) else 'root'
                file_tree[rel_dir].append((rel_path, full_path))
                all_files.append((rel_path, full_path))
    
    # Sort
    for key in file_tree:
        file_tree[key].sort()
    all_files.sort()
    
    md_content = []
    
    # Header
    md_content.append(f"# {problem_name.title()} - Complete Implementation\n\n")
    md_content.append("## 📂 Directory Structure\n\n")
    md_content.append(f"**Total: {len(all_files)} Java files**\n\n")
    
    # Create visual directory tree
    md_content.append("```\n")
    md_content.append(f"{problem_name}/\n")
    
    dirs_shown = set()
    for rel_path, _ in all_files:
        parts = rel_path.split('/')
        
        # Show directories
        for i in range(len(parts) - 1):
            dir_path = '/'.join(parts[:i+1])
            if dir_path not in dirs_shown:
                indent = "  " * (i + 1)
                md_content.append(f"{indent}📂 {parts[i]}/\n")
                dirs_shown.add(dir_path)
        
        # Show file
        indent = "  " * len(parts)
        filename = parts[-1]
        md_content.append(f"{indent}📄 {filename}\n")
    
    md_content.append("```\n\n")
    md_content.append("---\n\n")
    
    # Navigation quick links
    md_content.append("## 🔗 Quick Navigation\n\n")
    sorted_dirs = sorted(file_tree.keys())
    for dir_name in sorted_dirs:
        display_name = dir_name.replace('root', '📦 Root Files')
        display_name = display_name.replace('/', ' / ')
        anchor = dir_name.replace('/', '-').replace('root', 'root-files')
        md_content.append(f"- [{display_name}](#{anchor})\n")
    md_content.append("\n---\n\n")
    
    # Organize code by directory
    for dir_name in sorted_dirs:
        display_name = dir_name.replace('root', '📦 Root Files')
        display_name = display_name.replace('/', ' / ')
        anchor_id = dir_name.replace('/', '-').replace('root', 'root-files')
        
        md_content.append(f"## 📁 {display_name} {{#{anchor_id}}}\n\n")
        md_content.append(f"**Files in this directory: {len(file_tree[dir_name])}**\n\n")
        
        for idx, (rel_path, full_path) in enumerate(file_tree[dir_name], 1):
            filename = os.path.basename(rel_path)
            
            md_content.append(f"### {filename}\n\n")
            md_content.append(f"<details>\n")
            md_content.append(f"<summary>📄 Click to view {filename}</summary>\n\n")
            md_content.append("```java\n")
            
            try:
                with open(full_path, 'r') as f:
                    md_content.append(f.read())
            except Exception as e:
                md_content.append(f"// Error reading file: {e}\n")
            
            md_content.append("\n```\n")
            md_content.append("</details>\n\n")
            md_content.append("---\n\n")
    
    # Write CODE.md
    os.makedirs(docs_dir, exist_ok=True)
    code_md_path = os.path.join(docs_dir, 'CODE.md')
    with open(code_md_path, 'w') as f:
        f.write(''.join(md_content))
    
    return len(all_files), code_md_path

# Generate for Social Network
print("🔄 Regenerating Social Network CODE.md with directory tree view...")
count, path = generate_code_md_with_tree(
    'Social Network',
    'src/main/java/com/you/lld/problems/socialnetwork',
    'docs/problems/socialnetwork'
)
print(f"✅ Social Network: {count} files, {os.path.getsize(path):,} bytes")

# Generate for Amazon
print("🔄 Regenerating Amazon CODE.md with directory tree view...")
count, path = generate_code_md_with_tree(
    'Amazon',
    'src/main/java/com/you/lld/problems/amazon',
    'docs/problems/amazon'
)
print(f"✅ Amazon: {count} files, {os.path.getsize(path):,} bytes")

print("\n✅ Both CODE.md files regenerated with directory tree view!")
