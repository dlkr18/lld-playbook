import os
import re
import sys

def reformat_java_file(filepath):
    """Reformat a single-line Java file into properly formatted code."""
    with open(filepath, 'r') as f:
        content = f.read().strip()
    
    # If it's already multi-line and formatted, skip it
    if '\n' in content and len(content.split('\n')) > 5:
        return False
    
    # Remove all newlines to work with a clean single line
    content = content.replace('\n', ' ')
    
    # Basic Java formatting rules
    replacements = [
        (r'\bpackage\s+', '\npackage '),
        (r'\bimport\s+', '\nimport '),
        (r'\bpublic\s+class\s+', '\n\npublic class '),
        (r'\bpublic\s+interface\s+', '\n\npublic interface '),
        (r'\bpublic\s+enum\s+', '\n\npublic enum '),
        (r'\bclass\s+', '\nclass '),
        (r'\binterface\s+', '\ninterface '),
        (r'\benum\s+', '\nenum '),
        (r'\{', ' {\n'),
        (r'\}', '\n}\n'),
        (r'\;', ';\n'),
        (r'\bprivate\s+', '\n    private '),
        (r'\bprotected\s+', '\n    protected '),
        (r'\bpublic\s+(?!class|interface|enum)', '\n    public '),
        (r'\bstatic\s+', 'static '),
        (r'\bfinal\s+', 'final '),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    # Clean up excessive newlines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    # Basic indentation (simple version)
    lines = content.split('\n')
    formatted_lines = []
    indent_level = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Decrease indent for closing braces
        if line.startswith('}'):
            indent_level = max(0, indent_level - 1)
        
        # Add the line with proper indentation
        formatted_lines.append('    ' * indent_level + line)
        
        # Increase indent for opening braces
        if line.endswith('{'):
            indent_level += 1
    
    # Write back
    with open(filepath, 'w') as f:
        f.write('\n'.join(formatted_lines) + '\n')
    
    return True

# Find and reformat files
reformatted = []
for root, dirs, files in os.walk('src/main/java'):
    for file in files:
        if file.endswith('.java'):
            filepath = os.path.join(root, file)
            # Check if file is likely single-line
            with open(filepath, 'r') as f:
                lines = f.readlines()
                if len(lines) <= 3:
                    chars = sum(len(line) for line in lines)
                    if chars > 200:
                        if reformat_java_file(filepath):
                            reformatted.append(filepath)
                            print(f"✅ Reformatted: {filepath}")

print(f"\n📊 Total files reformatted: {len(reformatted)}")
