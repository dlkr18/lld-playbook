#!/usr/bin/env python3
import os
import glob

def generate_code_md(problem_dir, src_dir):
    """Generate comprehensive CODE.md with all Java files embedded"""
    
    md_content = []
    md_content.append(f"# {os.path.basename(problem_dir).title().replace('_', ' ')} - Complete Implementation\n")
    md_content.append("## 📂 Full Source Code\n")
    md_content.append("**Every single file is shown below - fully clickable and readable on the interface!**\n")
    md_content.append("---\n\n")
    
    # Find all Java files
    java_files = []
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.java'):
                java_files.append(os.path.join(root, file))
    
    java_files.sort()
    
    md_content.append(f"## 📊 Architecture Overview\n\n")
    md_content.append(f"**Total Files:** {len(java_files)} Java files\n\n")
    md_content.append("```\n")
    
    # Build directory tree
    for jfile in java_files:
        rel_path = os.path.relpath(jfile, src_dir)
        md_content.append(f"  {rel_path}\n")
    
    md_content.append("```\n\n")
    md_content.append("---\n\n")
    
    # Embed each Java file
    for idx, jfile in enumerate(java_files, 1):
        rel_path = os.path.relpath(jfile, src_dir)
        filename = os.path.basename(jfile)
        
        md_content.append(f"### {idx}. {rel_path}\n\n")
        md_content.append("```java\n")
        
        try:
            with open(jfile, 'r') as f:
                md_content.append(f.read())
        except Exception as e:
            md_content.append(f"// Error reading file: {e}\n")
        
        md_content.append("\n```\n\n")
        md_content.append("---\n\n")
    
    # Write CODE.md
    code_md_path = os.path.join(problem_dir, 'CODE.md')
    with open(code_md_path, 'w') as f:
        f.write(''.join(md_content))
    
    return len(java_files), code_md_path

# Generate for Social Network
src_dir = 'src/main/java/com/you/lld/problems/socialnetwork'
docs_dir = 'docs/problems/socialnetwork'

if os.path.exists(src_dir):
    count, path = generate_code_md(docs_dir, src_dir)
    print(f"✅ Generated CODE.md with {count} files")
    print(f"   Location: {path}")
    print(f"   Size: {os.path.getsize(path)} bytes")
else:
    print(f"❌ Source directory not found: {src_dir}")
