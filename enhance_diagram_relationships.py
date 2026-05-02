#!/usr/bin/env python3
"""
Enhance class diagrams with comprehensive relationships.
Analyzes fields more carefully and generates all appropriate arrows.
"""

import re
from pathlib import Path
from typing import List, Dict, Set, Tuple

PROBLEMS_DIR = Path("docs/problems")
SRC_DIR = Path("src/main/java/com/you/lld/problems")

def parse_java_classes(problem_name: str) -> Dict[str, List[Tuple[str, str]]]:
    """Parse Java files and extract class -> fields mapping."""
    java_dir = SRC_DIR / problem_name
    if not java_dir.exists():
        return {}
    
    classes = {}
    java_files = list(java_dir.rglob("*.java"))
    
    for java_file in java_files:
        content = java_file.read_text(encoding='utf-8', errors='ignore')
        
        # Extract class name
        class_match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
        if not class_match:
            continue
        
        class_name = class_match.group(4)
        
        # Extract fields
        fields = []
        field_pattern = r'(private|protected)\s+(?:final\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]'
        for match in re.finditer(field_pattern, content):
            field_type = match.group(2).strip()
            field_name = match.group(3).strip()
            fields.append((field_type, field_name))
        
        classes[class_name] = fields
    
    return classes

def extract_base_type(field_type: str) -> str:
    """Extract base class name from field type."""
    # Remove generics
    field_type = re.sub(r'List<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Set<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Map<\w+,\s*(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Optional<(\w+)>', r'\1', field_type)
    # Remove any remaining generics
    field_type = re.sub(r'<.*?>', '', field_type)
    return field_type.strip()

def is_collection(field_type: str) -> bool:
    """Check if field type is a collection."""
    return any(x in field_type for x in ['List<', 'Set<', 'Map<', '[]'])

def generate_relationships(classes: Dict[str, List[Tuple[str, str]]]) -> List[str]:
    """Generate comprehensive relationship statements."""
    class_names = set(classes.keys())
    relationships = []
    added_relationships = set()  # Track to avoid duplicates
    
    for source_class, fields in classes.items():
        for field_type, field_name in fields:
            base_type = extract_base_type(field_type)
            
            # Skip primitive types and common Java types
            if base_type in ['String', 'int', 'long', 'double', 'boolean', 'BigDecimal', 'LocalDateTime', 'Date', 'Instant']:
                continue
            
            # Only create relationship if target class exists in our diagram
            if base_type in class_names and base_type != source_class:
                # Determine relationship type
                if is_collection(field_type):
                    rel = f'    {source_class} "1" --> "*" {base_type}'
                else:
                    rel = f'    {source_class} --> {base_type}'
                
                # Add if not duplicate
                rel_key = f"{source_class}->{base_type}"
                if rel_key not in added_relationships:
                    relationships.append(rel)
                    added_relationships.add(rel_key)
    
    return relationships

def enhance_diagram(problem_name: str) -> bool:
    """Enhance a diagram with better relationships."""
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    
    if not mmd_path.exists():
        return False
    
    # Parse Java classes
    classes = parse_java_classes(problem_name)
    if not classes:
        return False
    
    # Read existing diagram
    content = mmd_path.read_text(encoding='utf-8')
    
    # Find where relationships start (after all class definitions)
    # Split by empty lines after class definitions
    lines = content.split('\n')
    
    # Find the last class definition
    last_class_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('class ') or '<<' in line:
            last_class_idx = i
    
    # Remove old relationships (everything after last class definition + 2 blank lines)
    class_definitions = '\n'.join(lines[:last_class_idx + 1])
    
    # Generate new comprehensive relationships
    relationships = generate_relationships(classes)
    
    # Build new diagram
    new_content = class_definitions + '\n\n' + '\n'.join(relationships) + '\n'
    
    mmd_path.write_text(new_content, encoding='utf-8')
    
    return True

# Process all problems
problems = []
for problem_dir in sorted(SRC_DIR.iterdir()):
    if problem_dir.is_dir():
        java_files = list(problem_dir.rglob("*.java"))
        if java_files:
            problems.append(problem_dir.name)

print("Enhancing all diagrams with comprehensive relationships...")
print()

success = 0
for problem in problems:
    classes = parse_java_classes(problem)
    if classes:
        rels = generate_relationships(classes)
        if enhance_diagram(problem):
            print(f"✅ {problem} ({len(rels)} relationships)")
            success += 1
        else:
            print(f"❌ {problem}")

print()
print(f"✅ Enhanced {success}/{len(problems)} diagrams")
