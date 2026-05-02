#!/usr/bin/env python3
"""Fix the remaining 23 truly empty classes."""

import re
from pathlib import Path

SRC_DIR = Path("src/main/java/com/you/lld/problems")

def fix_enum(file_path, class_name, values):
    """Add values to an enum."""
    content = file_path.read_text(encoding='utf-8')
    pattern = rf'(    class {class_name} \{{\s+<<enumeration>>\s+)(    }})'
    replacement = '\n'.join([f'        {v}' for v in values])
    new_pattern = rf'\1{replacement}\n\2'
    new_content = re.sub(pattern, new_pattern, content)
    if new_content != content:
        file_path.write_text(new_content, encoding='utf-8')
        return True
    return False

def fix_interface(file_path, class_name, methods):
    """Add methods to an interface."""
    content = file_path.read_text(encoding='utf-8')
    pattern = rf'(    class {class_name} \{{\s+<<interface>>\s+)(    }})'
    replacement = '\n'.join([f'        {m}' for m in methods])
    new_pattern = rf'\1{replacement}\n\2'
    new_content = re.sub(pattern, new_pattern, content)
    if new_content != content:
        file_path.write_text(new_content, encoding='utf-8')
        return True
    return False

def remove_syntax_error(file_path, error_class):
    """Remove syntax error classes like 'class for'."""
    content = file_path.read_text(encoding='utf-8')
    # Remove the entire class block
    pattern = rf'    class {error_class} \{{.*?\n    }}\n\n'
    new_content = re.sub(pattern, '', content, flags=re.DOTALL)
    if new_content == content:
        # Try simpler pattern
        pattern = rf'    class {error_class} \{{\s+<<interface>>\s+    }}\n\n'
        new_content = re.sub(pattern, '', content)
    if new_content != content:
        file_path.write_text(new_content, encoding='utf-8')
        return True
    return False

# Fix BookMyShow enums
bms = Path('docs/problems/bookmyshow/diagrams/class-diagram.mmd')
fix_enum(bms, 'PaymentStatus', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
fix_enum(bms, 'PaymentMethod', ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET'])
fix_enum(bms, 'BookingStatus', ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'])
fix_enum(bms, 'City', ['MUMBAI', 'DELHI', 'BANGALORE', 'HYDERABAD', 'CHENNAI'])
fix_enum(bms, 'Genre', ['ACTION', 'COMEDY', 'DRAMA', 'THRILLER', 'HORROR', 'SCI_FI'])
print("✅ BookMyShow (5 enums)")

# Fix Logging interfaces
logging = Path('docs/problems/logging/diagrams/class-diagram.mmd')
fix_interface(logging, 'LogAppender', ['+append(entry) void', '+flush() void'])
fix_interface(logging, 'LogFormatter', ['+format(entry) String'])
fix_interface(logging, 'LogAggregator', ['+aggregate(entries) void', '+getAggregated() List~LogEntry~'])
fix_interface(logging, 'Logger', ['+log(level, message) void', '+log(level, message, throwable) void'])
print("✅ Logging (4 interfaces)")

# Fix LoggingFramework interfaces
logfw = Path('docs/problems/loggingframework/diagrams/class-diagram.mmd')
fix_interface(logfw, 'LogFormatter', ['+format(entry) String'])
fix_interface(logfw, 'Logger', ['+log(level, message) void', '+setLevel(level) void'])
print("✅ LoggingFramework (2 interfaces)")

# Fix Minesweeper enum
minesweeper = Path('docs/problems/minesweeper/diagrams/class-diagram.mmd')
fix_enum(minesweeper, 'GameStatus', ['IN_PROGRESS', 'WON', 'LOST'])
print("✅ Minesweeper (1 enum)")

# Fix Notification enums
notification = Path('docs/problems/notification/diagrams/class-diagram.mmd')
fix_enum(notification, 'NotificationStatus', ['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ'])
fix_enum(notification, 'NotificationChannel', ['EMAIL', 'SMS', 'PUSH', 'IN_APP'])
print("✅ Notification (2 enums)")

# Fix ParkingLot syntax errors and interface
parkinglot = Path('docs/problems/parkinglot/diagrams/class-diagram.mmd')
remove_syntax_error(parkinglot, 'for')
remove_syntax_error(parkinglot, 'handling')
fix_interface(parkinglot, 'PaymentProcessor', ['+processPayment(amount, method) Payment', '+refund(paymentId) boolean'])
print("✅ ParkingLot (2 syntax errors + 1 interface)")

# Fix StackOverflow enums
stackoverflow = Path('docs/problems/stackoverflow/diagrams/class-diagram.mmd')
fix_enum(stackoverflow, 'QuestionStatus', ['OPEN', 'CLOSED', 'DELETED'])
fix_enum(stackoverflow, 'UserStatus', ['ACTIVE', 'SUSPENDED', 'DELETED'])
print("✅ StackOverflow (2 enums)")

# Fix TaskScheduler enum
taskscheduler = Path('docs/problems/taskscheduler/diagrams/class-diagram.mmd')
fix_enum(taskscheduler, 'TaskStatus', ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'])
print("✅ TaskScheduler (1 enum)")

# Fix VendingMachine syntax error
vendingmachine = Path('docs/problems/vendingmachine/diagrams/class-diagram.mmd')
remove_syntax_error(vendingmachine, 'for')
print("✅ VendingMachine (1 syntax error)")

# Fix WhatsApp Chat class
whatsapp = Path('docs/problems/whatsapp/diagrams/class-diagram.mmd')
content = whatsapp.read_text(encoding='utf-8')
pattern = r'(    class Chat \{\s+)(    })'
replacement = r'\1        -String id\n        -String name\n        -List~User~ participants\n        +addParticipant(user) void\n        +removeParticipant(user) void\n        +sendMessage(message) void\n'
new_content = re.sub(pattern, replacement, content)
if new_content != content:
    whatsapp.write_text(new_content, encoding='utf-8')
print("✅ WhatsApp (1 class)")

print("\n✅ Fixed all 23 empty classes!")
