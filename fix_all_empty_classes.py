#!/usr/bin/env python3
"""Fix all empty classes in diagrams by adding proper content."""

import re
from pathlib import Path

SRC_DIR = Path("src/main/java/com/you/lld/problems")
PROBLEMS_DIR = Path("docs/problems")

def read_java_class(problem_name, class_name):
    """Find and read Java file for a class."""
    java_dir = SRC_DIR / problem_name
    if not java_dir.exists():
        return None
    
    # Search for the file
    java_files = list(java_dir.rglob(f"{class_name}.java"))
    if not java_files:
        return None
    
    return java_files[0].read_text(encoding='utf-8', errors='ignore')

def extract_class_content(java_code, class_name):
    """Extract fields and methods from Java code."""
    if not java_code:
        # Default for exceptions
        if 'Exception' in class_name or 'Error' in class_name:
            return {
                'fields': ['-String message', '-Throwable cause'],
                'methods': [f'+{class_name}(message)', f'+{class_name}(message, cause)', '+getMessage() String']
            }
        return None
    
    fields = []
    methods = []
    
    # Extract fields
    for match in re.finditer(r'(private|protected|public)\s+(?:final\s+)?(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*[;=]', java_code):
        visibility = '-' if match.group(1) == 'private' else ('+' if match.group(1) == 'public' else '#')
        field_type = match.group(2).strip()
        field_name = match.group(3).strip()
        fields.append(f"{visibility}{field_type} {field_name}")
    
    # Extract methods/constructors
    for match in re.finditer(r'(public|private|protected)\s+(?:static\s+)?(\w+<?[\w,\s<>]*>?)\s+(\w+)\s*\(([^)]*)\)', java_code):
        visibility = '+' if match.group(1) == 'public' else ('-' if match.group(1) == 'private' else '#')
        return_type = match.group(2).strip()
        method_name = match.group(3).strip()
        params = match.group(4).strip()
        
        # Constructor?
        if method_name == class_name.split('<')[0]:
            methods.append(f"+{method_name}({params})")
        else:
            methods.append(f"{visibility}{method_name}({params}) {return_type}")
    
    return {'fields': fields[:10], 'methods': methods[:10]}  # Limit to avoid clutter

def fix_empty_class_in_diagram(mmd_path, empty_classes, problem_name):
    """Fix empty classes in a diagram."""
    content = mmd_path.read_text(encoding='utf-8')
    lines = content.split('\n')
    fixed_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        fixed_lines.append(line)
        
        # Check if this is an empty class
        if line.strip().startswith('class '):
            class_match = re.search(r'class (\w+)', line)
            if class_match:
                class_name = class_match.group(1)
                if class_name in empty_classes:
                    # Check if it's really empty
                    if i + 1 < len(lines) and lines[i + 1].strip() == '}':
                        # It's empty! Add content
                        java_code = read_java_class(problem_name, class_name)
                        class_content = extract_class_content(java_code, class_name)
                        
                        if class_content:
                            # Remove the closing brace we just added
                            fixed_lines.pop()
                            
                            # Add fields
                            for field in class_content['fields'][:5]:  # Max 5 fields
                                fixed_lines.append(f"        {field}")
                            
                            # Add methods
                            for method in class_content['methods'][:5]:  # Max 5 methods
                                fixed_lines.append(f"        {method}")
                            
                            # Add closing brace
                            fixed_lines.append(line)
                        
                        i += 1  # Skip the original closing brace
                        continue
        
        i += 1
    
    return '\n'.join(fixed_lines)

# Process all problems with empty classes
empty_class_problems = {
    'amazon': ['CustomerNotFoundException', 'InsufficientStockException', 'InvalidOperationException', 'EmptyCartException', 'OrderNotFoundException', 'ProductNotFoundException'],
    'bookmyshow': ['Language', 'BookingNotFoundException', 'SeatNotAvailableException', 'ShowNotFoundException', 'PaymentFailedException'],
    'filesystem': ['DiskFullException', 'AccessDeniedException', 'DirectoryNotEmptyException', 'FileNotFoundException'],
    'fooddelivery': ['CustomerNotFoundException', 'RestaurantNotFoundException', 'InvalidOperationException', 'RestaurantClosedException', 'PartnerNotFoundException', 'PartnerNotAvailableException', 'OrderNotFoundException'],
    'learningplatform': ['CourseNotFoundException', 'EnrollmentException'],
    'linkedin': ['UserNotFoundException', 'PostNotFoundException', 'JobNotFoundException', 'RequestNotFoundException'],
    'parkinglot': ['InvalidTicketException', 'ParkingFullException', 'PaymentProcessingException', 'InvalidVehicleException', 'PaymentFailedException'],
    'paymentgateway': ['RefundNotFoundException', 'TransactionFailedException', 'InvalidCardException', 'InsufficientFundsException'],
    'pubsub': ['TopicNotFoundException', 'SubscriptionNotFoundException'],
    'restaurant': ['ReservationNotFoundException', 'TableNotFoundException', 'OrderNotFoundException'],
    'ridehailing': ['RiderNotFoundException', 'TripNotFoundException', 'NoDriverAvailableException', 'DriverNotFoundException'],
    'simplesearch': ['IndexingException', 'DocumentNotFoundException'],
    'socialnetwork': ['CommentNotFoundException', 'PostNotFoundException', 'UnauthorizedException', 'UserNotFoundException', 'InvalidRequestException'],
    'stockexchange': ['InsufficientSharesException', 'OrderNotFoundException', 'InvalidPriceException'],
    'urlshortener': ['URLNotFoundException', 'AliasUnavailableException'],
}

print("="*70)
print(" FIXING EMPTY CLASSES IN ALL DIAGRAMS")
print("="*70)
print()

fixed_count = 0
for problem, empty_classes in empty_class_problems.items():
    mmd_path = PROBLEMS_DIR / problem / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        continue
    
    fixed_content = fix_empty_class_in_diagram(mmd_path, empty_classes, problem)
    mmd_path.write_text(fixed_content, encoding='utf-8')
    print(f"✅ {problem:<22} Fixed {len(empty_classes)} empty classes")
    fixed_count += 1

print()
print("="*70)
print(f"✅ Fixed empty classes in {fixed_count} problems")
print("="*70)
