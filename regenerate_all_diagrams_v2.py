#!/usr/bin/env python3
"""
Comprehensive class diagram generator v2 - Fixed syntax issues.
"""

import re
import subprocess
from pathlib import Path
from typing import List, Dict, Set, Tuple

PROBLEMS_DIR = Path("docs/problems")
SRC_DIR = Path("src/main/java/com/you/lld/problems")

class JavaClass:
    def __init__(self, name: str, type_: str = "class"):
        self.name = name
        self.type = type_
        self.fields: List[Tuple[str, str]] = []
        self.methods: List[Tuple[str, str]] = []
        self.parent: str = None
        self.interfaces: List[str] = []
        
    def to_mermaid(self) -> str:
        """Convert to Mermaid class syntax - FIXED."""
        lines = []
        
        # Class declaration with opening brace
        lines.append(f'    class {self.name} {{')
        
        # Add stereotype for special types
        if self.type == "interface":
            lines.append(f'        <<interface>>')
        elif self.type == "enum":
            lines.append(f'        <<enumeration>>')
        elif self.type == "abstract":
            lines.append(f'        <<abstract>>')
        
        # Fields (limit to 8)
        if self.fields and self.type not in ["interface"]:
            for ftype, fname in self.fields[:8]:
                lines.append(f'        -{ftype}: {fname}')
        
        # Methods (limit to 8, skip common ones)
        method_count = 0
        for rtype, mname in self.methods:
            if mname not in ['toString', 'hashCode', 'equals', 'clone', 'compareTo']:
                lines.append(f'        +{mname}(): {rtype}')
                method_count += 1
                if method_count >= 8:
                    break
        
        # Closing brace
        lines.append('    }')
        
        return '\n'.join(lines)

def parse_java_file(file_path: Path) -> JavaClass:
    """Parse a Java file and extract class structure."""
    content = file_path.read_text(encoding='utf-8', errors='ignore')
    
    # Extract class name and type
    class_match = re.search(r'(public|private)?\s*(abstract)?\s*(class|interface|enum)\s+(\w+)', content)
    if not class_match:
        return None
    
    is_abstract = class_match.group(2) == 'abstract'
    class_type = class_match.group(3)
    class_name = class_match.group(4)
    
    if is_abstract:
        cls = JavaClass(class_name, "abstract")
    else:
        cls = JavaClass(class_name, class_type)
    
    # Extract extends/implements
    extends_match = re.search(r'extends\s+(\w+)', content)
    if extends_match:
        cls.parent = extends_match.group(1)
    
    implements_match = re.search(r'implements\s+([\w,\s]+)', content)
    if implements_match:
        interfaces = implements_match.group(1).split(',')
        cls.interfaces = [i.strip() for i in interfaces]
    
    # Extract fields
    field_pattern = r'(private|protected)\s+(?:final\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]'
    for match in re.finditer(field_pattern, content):
        field_type = match.group(2).strip()
        field_name = match.group(3).strip()
        # Clean up generic types
        field_type = re.sub(r'List<(\w+)>', r'List~\1~', field_type)
        field_type = re.sub(r'Map<(\w+),\s*(\w+)>', r'Map~\1, \2~', field_type)
        field_type = re.sub(r'Set<(\w+)>', r'Set~\1~', field_type)
        cls.fields.append((field_type, field_name))
    
    # Extract public methods
    method_pattern = r'public\s+(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*\([^)]*\)'
    for match in re.finditer(method_pattern, content):
        return_type = match.group(1).strip()
        method_name = match.group(2).strip()
        if method_name not in [class_name]:  # Skip constructors
            return_type = re.sub(r'List<(\w+)>', r'List~\1~', return_type)
            return_type = re.sub(r'Optional<(\w+)>', r'Optional~\1~', return_type)
            cls.methods.append((return_type, method_name))
    
    return cls

def generate_mermaid_diagram(problem_name: str) -> str:
    """Generate complete Mermaid diagram for a problem."""
    java_dir = SRC_DIR / problem_name
    
    if not java_dir.exists():
        return None
    
    java_files = list(java_dir.rglob("*.java"))
    if not java_files:
        return None
    
    # Parse all classes
    classes: List[JavaClass] = []
    class_names: Set[str] = set()
    
    for java_file in java_files:
        cls = parse_java_file(java_file)
        if cls:
            classes.append(cls)
            class_names.add(cls.name)
    
    if not classes:
        return None
    
    # Generate Mermaid
    lines = ['classDiagram']
    lines.append('')
    
    # Add classes (limit to 20 for readability)
    for cls in classes[:20]:
        lines.append(cls.to_mermaid())
        lines.append('')
    
    # Add relationships
    for cls in classes[:20]:
        # Inheritance
        if cls.parent and cls.parent in class_names:
            lines.append(f'    {cls.parent} <|-- {cls.name}')
        
        # Interface implementation
        for interface in cls.interfaces:
            if interface in class_names:
                lines.append(f'    {interface} <|.. {cls.name}')
        
        # Associations (from fields)
        for field_type, field_name in cls.fields:
            base_type = re.sub(r'List~(\w+)~', r'\1', field_type)
            base_type = re.sub(r'Map~\w+,\s*(\w+)~', r'\1', base_type)
            base_type = re.sub(r'Set~(\w+)~', r'\1', base_type)
            base_type = base_type.split('<')[0].strip()
            
            if base_type in class_names and base_type != cls.name:
                if 'List~' in field_type or 'Set~' in field_type:
                    lines.append(f'    {cls.name} "1" --> "*" {base_type}')
                else:
                    lines.append(f'    {cls.name} --> {base_type}')
    
    return '\n'.join(lines)

def regenerate_problem(problem_name: str) -> bool:
    """Regenerate diagram for one problem."""
    problem_dir = PROBLEMS_DIR / problem_name
    diagrams_dir = problem_dir / "diagrams"
    
    if not problem_dir.exists():
        return False
    
    # Generate Mermaid
    mermaid_code = generate_mermaid_diagram(problem_name)
    if not mermaid_code:
        return False
    
    # Create diagrams directory
    diagrams_dir.mkdir(exist_ok=True)
    
    # Save .mmd file
    mmd_path = diagrams_dir / "class-diagram.mmd"
    mmd_path.write_text(mermaid_code, encoding='utf-8')
    
    # Generate PNG
    png_path = diagrams_dir / "class-diagram.png"
    try:
        result = subprocess.run(
            ['mmdc', '-i', str(mmd_path), '-o', str(png_path), '-b', 'transparent', '-w', '2048'],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0
    except:
        return False

# Just regenerate the 10 problematic ones
problems = [
    "bookmyshow", "logging", "loggingframework", "minesweeper", 
    "notification", "parkinglot", "stackoverflow", "taskscheduler",
    "vendingmachine", "whatsapp"
]

print("Regenerating 10 problematic diagrams with fixed syntax...")
print()

success = 0
for problem in problems:
    if regenerate_problem(problem):
        print(f"✅ {problem}")
        success += 1
    else:
        print(f"❌ {problem}")

print()
print(f"✅ Fixed {success}/{len(problems)} diagrams")
