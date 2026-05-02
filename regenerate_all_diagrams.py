#!/usr/bin/env python3
"""
Comprehensive class diagram generator for all LLD problems.
Analyzes Java source code and generates complete Mermaid diagrams.
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
        self.type = type_  # class, interface, enum, abstract
        self.fields: List[Tuple[str, str]] = []  # (type, name)
        self.methods: List[Tuple[str, str]] = []  # (return_type, name)
        self.parent: str = None
        self.interfaces: List[str] = []
        
    def to_mermaid(self) -> str:
        """Convert to Mermaid class syntax."""
        lines = []
        
        # Class declaration
        if self.type == "interface":
            lines.append(f'    class {self.name}')
            lines.append(f'    <<interface>> {self.name}')
        elif self.type == "enum":
            lines.append(f'    class {self.name}')
            lines.append(f'    <<enumeration>> {self.name}')
        elif self.type == "abstract":
            lines.append(f'    class {self.name}')
            lines.append(f'    <<abstract>> {self.name}')
        else:
            lines.append(f'    class {self.name} {{')
        
        # Fields (limit to 10 most important)
        if self.fields and self.type not in ["interface"]:
            for i, (ftype, fname) in enumerate(self.fields[:10]):
                lines.append(f'        -{ftype} {fname}')
        
        # Methods (limit to 10 most important)
        if self.methods:
            for i, (rtype, mname) in enumerate(self.methods[:10]):
                if mname not in ['toString', 'hashCode', 'equals', 'clone']:
                    lines.append(f'        +{mname}() {rtype}')
        
        if self.type not in ["interface", "enum"]:
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
    
    # Extract fields (private/protected)
    field_pattern = r'(private|protected)\s+(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]'
    for match in re.finditer(field_pattern, content):
        field_type = match.group(2).strip()
        field_name = match.group(3).strip()
        # Clean up generic types for display
        field_type = re.sub(r'List<(\w+)>', r'List~\1~', field_type)
        field_type = re.sub(r'Map<(\w+),\s*(\w+)>', r'Map~\1,\2~', field_type)
        field_type = re.sub(r'Set<(\w+)>', r'Set~\1~', field_type)
        cls.fields.append((field_type, field_name))
    
    # Extract public methods
    method_pattern = r'public\s+(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*\([^)]*\)'
    for match in re.finditer(method_pattern, content):
        return_type = match.group(1).strip()
        method_name = match.group(2).strip()
        if method_name not in ['get' + class_name, class_name]:  # Skip constructors
            return_type = re.sub(r'List<(\w+)>', r'List~\1~', return_type)
            return_type = re.sub(r'Optional<(\w+)>', r'Optional~\1~', return_type)
            cls.methods.append((return_type, method_name))
    
    return cls

def generate_mermaid_diagram(problem_name: str) -> str:
    """Generate complete Mermaid diagram for a problem."""
    java_dir = SRC_DIR / problem_name
    
    if not java_dir.exists():
        return None
    
    # Find all Java files
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
    
    # Add all classes
    for cls in classes[:25]:  # Limit to 25 classes to avoid overwhelming diagrams
        lines.append(cls.to_mermaid())
        lines.append('')
    
    # Add relationships
    for cls in classes[:25]:
        # Inheritance
        if cls.parent and cls.parent in class_names:
            lines.append(f'    {cls.parent} <|-- {cls.name}')
        
        # Interface implementation
        for interface in cls.interfaces:
            if interface in class_names:
                lines.append(f'    {interface} <|.. {cls.name}')
        
        # Associations (from fields)
        for field_type, field_name in cls.fields:
            # Extract class name from type
            base_type = re.sub(r'List~(\w+)~', r'\1', field_type)
            base_type = re.sub(r'Map~\w+,(\w+)~', r'\1', base_type)
            base_type = re.sub(r'Set~(\w+)~', r'\1', base_type)
            base_type = re.sub(r'Optional~(\w+)~', r'\1', base_type)
            base_type = base_type.split('<')[0].strip()
            
            if base_type in class_names and base_type != cls.name:
                # Check if it's a collection
                if 'List~' in field_type or 'Set~' in field_type:
                    lines.append(f'    {cls.name} "1" --> "*" {base_type}')
                elif 'Map~' in field_type:
                    lines.append(f'    {cls.name} --> {base_type}')
                else:
                    lines.append(f'    {cls.name} --> {base_type}')
    
    return '\n'.join(lines)

def regenerate_problem_diagram(problem_name: str) -> bool:
    """Regenerate diagram for one problem."""
    print(f"\n{'='*60}")
    print(f"Processing: {problem_name}")
    print('='*60)
    
    problem_dir = PROBLEMS_DIR / problem_name
    diagrams_dir = problem_dir / "diagrams"
    
    if not problem_dir.exists():
        print(f"⏭️  Problem directory not found")
        return False
    
    # Generate Mermaid diagram
    mermaid_code = generate_mermaid_diagram(problem_name)
    
    if not mermaid_code:
        print(f"⏭️  No Java files found or couldn't parse")
        return False
    
    print(f"✅ Generated Mermaid diagram ({len(mermaid_code)} chars)")
    
    # Create diagrams directory
    diagrams_dir.mkdir(exist_ok=True)
    
    # Save .mmd file
    mmd_path = diagrams_dir / "class-diagram.mmd"
    mmd_path.write_text(mermaid_code, encoding='utf-8')
    print(f"✅ Saved {mmd_path}")
    
    # Generate PNG using mmdc
    png_path = diagrams_dir / "class-diagram.png"
    try:
        result = subprocess.run(
            ['mmdc', '-i', str(mmd_path), '-o', str(png_path), '-b', 'transparent', '-w', '2048'],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            print(f"✅ Generated PNG diagram")
        else:
            print(f"⚠️  PNG generation warning: {result.stderr[:100]}")
    except Exception as e:
        print(f"⚠️  PNG generation error: {str(e)[:100]}")
    
    return True

def main():
    print("="*70)
    print(" COMPREHENSIVE CLASS DIAGRAM REGENERATION")
    print("="*70)
    print()
    print("This will:")
    print("  1. Analyze all Java source files for each problem")
    print("  2. Generate complete Mermaid class diagrams")
    print("  3. Create PNG images from Mermaid")
    print("  4. Update existing diagram files")
    print()
    print("="*70)
    
    # Get all problem directories that have Java implementations
    problems_with_java = []
    for problem_dir in sorted(SRC_DIR.iterdir()):
        if problem_dir.is_dir():
            java_files = list(problem_dir.rglob("*.java"))
            if java_files:
                problems_with_java.append(problem_dir.name)
    
    print(f"\nFound {len(problems_with_java)} problems with Java implementations")
    print()
    
    success_count = 0
    skip_count = 0
    
    for i, problem_name in enumerate(problems_with_java, 1):
        print(f"\n[{i}/{len(problems_with_java)}] {problem_name}")
        if regenerate_problem_diagram(problem_name):
            success_count += 1
        else:
            skip_count += 1
    
    print()
    print("="*70)
    print(f"✅ Success: {success_count}")
    print(f"⏭️  Skipped: {skip_count}")
    print(f"📊 Total: {success_count + skip_count}")
    print("="*70)

if __name__ == "__main__":
    main()
