#!/usr/bin/env python3
"""
AGGRESSIVE relationship generator for all problems.
Detects every possible relationship including methods, return types, parameters.
"""

import re
from pathlib import Path
from typing import List, Dict, Set, Tuple

SRC_DIR = Path("src/main/java/com/you/lld/problems")
PROBLEMS_DIR = Path("docs/problems")

def parse_comprehensive_relationships(problem_name: str) -> Tuple[Set[str], List[str]]:
    """Extract ALL possible relationships from Java code."""
    java_dir = SRC_DIR / problem_name
    if not java_dir.exists():
        return set(), []
    
    java_files = list(java_dir.rglob("*.java"))
    if not java_files:
        return set(), []
    
    # Collect all class names
    all_classes = set()
    class_to_fields = {}
    class_to_methods = {}
    
    for java_file in java_files:
        content = java_file.read_text(encoding='utf-8', errors='ignore')
        
        # Extract class name
        class_match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
        if not class_match:
            continue
        
        class_name = class_match.group(4)
        all_classes.add(class_name)
        
        # Extract fields
        fields = []
        for match in re.finditer(r'(private|protected|public)\s+(?:final\s+)?(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]', content):
            field_type = match.group(2).strip()
            field_name = match.group(3).strip()
            fields.append((field_type, field_name))
        
        class_to_fields[class_name] = fields
        
        # Extract method return types and parameters
        methods = []
        for match in re.finditer(r'(public|private|protected)\s+(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*\(([^)]*)\)', content):
            return_type = match.group(2).strip()
            method_name = match.group(3).strip()
            params = match.group(4).strip()
            methods.append((return_type, method_name, params))
        
        class_to_methods[class_name] = methods
    
    # Generate relationships
    relationships = []
    added = set()
    
    def add_rel(source, target, multiplicity=None):
        if source == target or source not in all_classes or target not in all_classes:
            return
        key = f"{source}->{target}"
        if key in added:
            return
        added.add(key)
        if multiplicity:
            relationships.append(f'    {source} "{multiplicity[0]}" --> "{multiplicity[1]}" {target}')
        else:
            relationships.append(f'    {source} --> {target}')
    
    # Process each class
    for class_name in all_classes:
        # From fields
        for field_type, field_name in class_to_fields.get(class_name, []):
            # Direct references
            base_type = extract_base_type(field_type)
            if base_type in all_classes:
                if is_collection(field_type):
                    add_rel(class_name, base_type, ("1", "*"))
                else:
                    add_rel(class_name, base_type)
            
            # ID-based references
            if field_type in ['String', 'Long', 'long', 'Integer', 'int'] and ('Id' in field_name or 'id' in field_name.lower()):
                target = infer_from_id(field_name, all_classes)
                if target:
                    add_rel(class_name, target)
        
        # From method return types
        for return_type, method_name, params in class_to_methods.get(class_name, []):
            base_type = extract_base_type(return_type)
            if base_type in all_classes and base_type != class_name:
                if is_collection(return_type):
                    add_rel(class_name, base_type, ("1", "*"))
                else:
                    add_rel(class_name, base_type)
            
            # From method parameters
            if params:
                for param in params.split(','):
                    param = param.strip()
                    if not param:
                        continue
                    parts = param.split()
                    if len(parts) >= 2:
                        param_type = parts[0]
                        base_type = extract_base_type(param_type)
                        if base_type in all_classes:
                            add_rel(class_name, base_type)
    
    return all_classes, relationships

def extract_base_type(field_type: str) -> str:
    """Extract base class name."""
    field_type = re.sub(r'List<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Set<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Map<\w+,\s*(\w+)>', r'\1', field_type)
    field_type = re.sub(r'Optional<(\w+)>', r'\1', field_type)
    field_type = re.sub(r'<.*?>', '', field_type)
    return field_type.strip()

def is_collection(field_type: str) -> bool:
    return any(x in field_type for x in ['List<', 'Set<', 'Map<', '[]'])

def infer_from_id(id_name: str, all_classes: Set[str]) -> str:
    name = id_name
    for suffix in ['Id', '_id', 'ID']:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
            break
    if name:
        inferred = name[0].upper() + name[1:]
        if inferred in all_classes:
            return inferred
    return None

def regenerate_diagram(problem_name: str) -> Tuple[int, int]:
    """Regenerate diagram with comprehensive relationships."""
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        return 0, 0
    
    # Get comprehensive relationships
    all_classes, relationships = parse_comprehensive_relationships(problem_name)
    if not relationships:
        return 0, 0
    
    # Read existing diagram
    content = mmd_path.read_text(encoding='utf-8')
    old_rel_count = content.count('-->')
    
    # Find last class definition
    lines = content.split('\n')
    last_class_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('class ') or '<<' in line:
            last_class_idx = i
    
    # Rebuild diagram
    class_definitions = '\n'.join(lines[:last_class_idx + 1])
    new_content = class_definitions + '\n\n' + '\n'.join(relationships) + '\n'
    
    mmd_path.write_text(new_content, encoding='utf-8')
    
    return old_rel_count, len(relationships)

# Target the 20 low-ratio problems
all_problems = [
    "ratelimiter", "urlshortener", "bloomfilter", "tictactoe", "snakeandladder",
    "filesystem", "url-shortener", "lru-cache", "minesweeper", "versioncontrol",
    "logging", "autocomplete", "kvstore", "lrucache", "pubsub",
    "loggingframework", "paymentgateway", "simplesearch", "stockexchange", "restaurant"
]

print("="*70)
print(" AGGRESSIVE RELATIONSHIP GENERATION FOR 20 PROBLEMS")
print("="*70)
print()

total_before = 0
total_after = 0

for problem in low_ratio_problems:
    old, new = regenerate_diagram(problem)
    if new > 0:
        improvement = new - old
        if improvement > 0:
            print(f"✅ {problem:<20} {old:3} → {new:3} (+{improvement})")
        else:
            print(f"✅ {problem:<20} {new} relationships")
        total_before += old
        total_after += new
    else:
        print(f"⏭️  {problem:<20} No Java files or couldn't parse")

print()
print("="*70)
print(f"Total: {total_before} → {total_after} (+{total_after - total_before})")
print("="*70)

# Get ALL problems from source directory
all_problems = []
for problem_dir in sorted(SRC_DIR.iterdir()):
    if problem_dir.is_dir() and not problem_dir.name.startswith('.'):
        all_problems.append(problem_dir.name)

print("="*70)
print(f" RUNNING ON ALL {len(all_problems)} PROBLEMS")
print("="*70)
print()

total_before = 0
total_after = 0
improved_count = 0

for problem in all_problems:
    old, new = regenerate_diagram(problem)
    if new > 0:
        improvement = new - old
        if improvement > 0:
            print(f"✅ {problem:<22} {old:3} → {new:3} (+{improvement})")
            improved_count += 1
        else:
            print(f"   {problem:<22} {new:3} relationships (no change)")
        total_before += old
        total_after += new

print()
print("="*70)
print(f"Problems improved: {improved_count}")
print(f"Total relationships: {total_before} → {total_after} (+{total_after - total_before})")
print("="*70)
