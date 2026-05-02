#!/usr/bin/env python3
"""
Enhanced relationship generator that handles ID-based relationships.
Recognizes patterns like 'userId', 'productId' and creates arrows to User, Product.
"""

import re
from pathlib import Path
from typing import List, Dict, Set, Tuple

PROBLEMS_DIR = Path("docs/problems")
SRC_DIR = Path("src/main/java/com/you/lld/problems")

def parse_java_classes_with_ids(problem_name: str) -> Tuple[Dict[str, List[Tuple[str, str]]], Set[str]]:
    """Parse Java files and extract classes with their fields, including ID fields."""
    java_dir = SRC_DIR / problem_name
    if not java_dir.exists():
        return {}, set()
    
    classes = {}
    all_class_names = set()
    java_files = list(java_dir.rglob("*.java"))
    
    # First pass: collect all class names
    for java_file in java_files:
        content = java_file.read_text(encoding='utf-8', errors='ignore')
        class_match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
        if class_match:
            all_class_names.add(class_match.group(4))
    
    # Second pass: extract fields
    for java_file in java_files:
        content = java_file.read_text(encoding='utf-8', errors='ignore')
        
        class_match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
        if not class_match:
            continue
        
        class_name = class_match.group(4)
        
        # Extract ALL fields (including IDs)
        fields = []
        field_pattern = r'(private|protected)\s+(?:final\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]'
        for match in re.finditer(field_pattern, content):
            field_type = match.group(2).strip()
            field_name = match.group(3).strip()
            fields.append((field_type, field_name))
        
        classes[class_name] = fields
    
    return classes, all_class_names

def infer_class_from_id(id_field_name: str, all_class_names: Set[str]) -> str:
    """
    Infer target class from ID field name.
    Examples:
    - userId, user_id → User
    - productId → Product
    - customerId → Customer
    - orderId → Order
    """
    # Remove common suffixes
    name = id_field_name
    for suffix in ['Id', '_id', 'ID']:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
            break
    
    # Capitalize first letter
    inferred_class = name[0].upper() + name[1:] if name else None
    
    # Check if this class exists
    if inferred_class in all_class_names:
        return inferred_class
    
    return None

def extract_base_type(field_type: str) -> str:
    """Extract base class name from field type."""
    field_type = re.sub(r'List<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Set<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Map<\w+,\s*(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Optional<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'<.*?>', '', field_type)
    return field_type.strip()

def is_collection(field_type: str) -> bool:
    """Check if field type is a collection."""
    return any(x in field_type for x in ['List<', 'Set<', 'Map<', '[]'])

def generate_comprehensive_relationships(classes: Dict[str, List[Tuple[str, str]]], all_class_names: Set[str]) -> List[str]:
    """Generate comprehensive relationships including ID-based ones."""
    relationships = []
    added_relationships = set()
    
    for source_class, fields in classes.items():
        for field_type, field_name in fields:
            # Type 1: Direct object references (existing logic)
            base_type = extract_base_type(field_type)
            
            if base_type in all_class_names and base_type != source_class:
                # Skip primitives
                if base_type not in ['String', 'int', 'long', 'double', 'boolean', 'BigDecimal', 'LocalDateTime', 'Date', 'Instant']:
                    if is_collection(field_type):
                        rel = f'    {source_class} "1" --> "*" {base_type}'
                    else:
                        rel = f'    {source_class} --> {base_type}'
                    
                    rel_key = f"{source_class}->{base_type}"
                    if rel_key not in added_relationships:
                        relationships.append(rel)
                        added_relationships.add(rel_key)
            
            # Type 2: ID-based references (NEW!)
            if field_type in ['String', 'Long', 'long'] and ('Id' in field_name or 'id' in field_name.lower()):
                target_class = infer_class_from_id(field_name, all_class_names)
                if target_class and target_class != source_class:
                    rel = f'    {source_class} --> {target_class}'
                    rel_key = f"{source_class}->{target_class}"
                    if rel_key not in added_relationships:
                        relationships.append(rel)
                        added_relationships.add(rel_key)
    
    return relationships

def enhance_diagram_with_ids(problem_name: str) -> Tuple[int, int]:
    """Enhance diagram with ID-based relationships. Returns (old_count, new_count)."""
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    
    if not mmd_path.exists():
        return 0, 0
    
    # Parse Java classes
    classes, all_class_names = parse_java_classes_with_ids(problem_name)
    if not classes:
        return 0, 0
    
    # Read existing diagram
    content = mmd_path.read_text(encoding='utf-8')
    
    # Count old relationships
    old_count = content.count('-->')
    
    # Find last class definition
    lines = content.split('\n')
    last_class_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('class ') or '<<' in line:
            last_class_idx = i
    
    # Remove old relationships
    class_definitions = '\n'.join(lines[:last_class_idx + 1])
    
    # Generate new comprehensive relationships
    relationships = generate_comprehensive_relationships(classes, all_class_names)
    
    # Build new diagram
    new_content = class_definitions + '\n\n' + '\n'.join(relationships) + '\n'
    
    mmd_path.write_text(new_content, encoding='utf-8')
    
    return old_count, len(relationships)

# Process all problems
problems = []
for problem_dir in sorted(SRC_DIR.iterdir()):
    if problem_dir.is_dir():
        java_files = list(problem_dir.rglob("*.java"))
        if java_files:
            problems.append(problem_dir.name)

print("="*70)
print(" ADDING ID-BASED RELATIONSHIPS TO ALL DIAGRAMS")
print("="*70)
print()
print("This will detect patterns like:")
print("  • userId → User")
print("  • productId → Product")
print("  • orderId → Order")
print("  • customerId → Customer")
print()
print("="*70)
print()

total_old = 0
total_new = 0
success = 0

for problem in problems:
    old_count, new_count = enhance_diagram_with_ids(problem)
    if new_count > 0:
        improvement = new_count - old_count
        if improvement > 0:
            print(f"✅ {problem:20} {old_count:3} → {new_count:3} (+{improvement})")
        else:
            print(f"✅ {problem:20} {new_count} relationships")
        total_old += old_count
        total_new += new_count
        success += 1

print()
print("="*70)
print(f"✅ Enhanced {success}/{len(problems)} diagrams")
print(f"📊 Total relationships: {total_old} → {total_new} (+{total_new - total_old})")
print("="*70)
