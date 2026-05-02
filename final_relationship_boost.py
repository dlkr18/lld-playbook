#!/usr/bin/env python3
"""
FINAL aggressive relationship generator - runs on ALL 44 problems.
"""

import re
from pathlib import Path
from typing import List, Dict, Set, Tuple

SRC_DIR = Path("src/main/java/com/you/lld/problems")
PROBLEMS_DIR = Path("docs/problems")

def extract_base_type(type_str: str) -> str:
    type_str = re.sub(r'List<(\w+)>', r'\1', type_str)
    type_str = re.sub(r'Set<(\w+)>', r'\1', type_str)
    type_str = re.sub(r'Map<\w+,\s*(\w+)>', r'\1', type_str)
    type_str = re.sub(r'Optional<(\w+)>', r'\1', type_str)
    type_str = re.sub(r'<.*?>', '', type_str)
    return type_str.strip()

def is_collection(type_str: str) -> bool:
    return any(x in type_str for x in ['List<', 'Set<', 'Map<', '[]'])

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

def parse_all_relationships(problem_name: str) -> List[str]:
    java_dir = SRC_DIR / problem_name
    if not java_dir.exists():
        return []
    
    java_files = list(java_dir.rglob("*.java"))
    if not java_files:
        return []
    
    all_classes = set()
    class_fields = {}
    class_methods = {}
    
    # First pass: collect classes
    for java_file in java_files:
        content = java_file.read_text(encoding='utf-8', errors='ignore')
        match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
        if match:
            class_name = match.group(4)
            all_classes.add(class_name)
            
            # Extract fields
            fields = []
            for m in re.finditer(r'(private|protected|public)\s+(?:final\s+)?(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]', content):
                fields.append((m.group(2).strip(), m.group(3).strip()))
            class_fields[class_name] = fields
            
            # Extract methods
            methods = []
            for m in re.finditer(r'(public|protected)\s+(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*\(([^)]*)\)', content):
                methods.append((m.group(2).strip(), m.group(4).strip()))
            class_methods[class_name] = methods
    
    # Second pass: generate relationships
    relationships = []
    added = set()
    
    def add_rel(src, tgt, mult=None):
        if src == tgt or src not in all_classes or tgt not in all_classes:
            return
        key = f"{src}->{tgt}"
        if key in added:
            return
        added.add(key)
        if mult:
            relationships.append(f'    {src} "{mult[0]}" --> "{mult[1]}" {tgt}')
        else:
            relationships.append(f'    {src} --> {tgt}')
    
    for cls in all_classes:
        # From fields
        for ftype, fname in class_fields.get(cls, []):
            base = extract_base_type(ftype)
            if base in all_classes:
                if is_collection(ftype):
                    add_rel(cls, base, ("1", "*"))
                else:
                    add_rel(cls, base)
            
            # ID-based
            if ftype in ['String', 'Long', 'long', 'Integer', 'int'] and ('Id' in fname or 'id' in fname.lower()):
                target = infer_from_id(fname, all_classes)
                if target:
                    add_rel(cls, target)
        
        # From methods
        for rtype, params in class_methods.get(cls, []):
            base = extract_base_type(rtype)
            if base in all_classes and base != cls:
                if is_collection(rtype):
                    add_rel(cls, base, ("1", "*"))
                else:
                    add_rel(cls, base)
            
            # From parameters
            if params:
                for param in params.split(','):
                    parts = param.strip().split()
                    if len(parts) >= 2:
                        base = extract_base_type(parts[0])
                        if base in all_classes:
                            add_rel(cls, base)
    
    return relationships

def boost_diagram(problem_name: str) -> Tuple[int, int]:
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        return 0, 0
    
    relationships = parse_all_relationships(problem_name)
    if not relationships:
        return 0, 0
    
    content = mmd_path.read_text(encoding='utf-8')
    old_count = content.count('-->')
    
    lines = content.split('\n')
    last_idx = 0
    for i, line in enumerate(lines):
        if line.strip().startswith('class ') or '<<' in line:
            last_idx = i
    
    new_content = '\n'.join(lines[:last_idx + 1]) + '\n\n' + '\n'.join(relationships) + '\n'
    mmd_path.write_text(new_content, encoding='utf-8')
    
    return old_count, len(relationships)

# Get all problems
problems = []
for p in sorted(SRC_DIR.iterdir()):
    if p.is_dir():
        problems.append(p.name)

print("="*70)
print(f" FINAL RELATIONSHIP BOOST - ALL {len(problems)} PROBLEMS")
print("="*70)
print()

total_old = 0
total_new = 0
improved = 0

for prob in problems:
    old, new = boost_diagram(prob)
    if new > 0:
        diff = new - old
        if diff > 0:
            print(f"✅ {prob:<22} {old:3} → {new:3} (+{diff})")
            improved += 1
        elif new >= 5:
            print(f"   {prob:<22} {new:3} (no change)")
        total_old += old
        total_new += new

print()
print("="*70)
print(f"Improved: {improved}/{len(problems)} problems")
print(f"Total: {total_old} → {total_new} (+{total_new - total_old})")
print("="*70)
