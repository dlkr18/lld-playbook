#!/bin/bash

fix_empty_exception() {
    local file="$1"
    local class_name="$2"
    
    # Replace empty exception class with standard exception content
    perl -i -pe "
        if (/class $class_name \{/) {
            \$_ .= \"        -String message\\n        -Throwable cause\\n        +$class_name(message)\\n        +getMessage() String\\n\";
        } elsif (/class $class_name \{/ .. /^    \}/ and /^    \}/) {
            next if \$seen{\$class_name}++;
        }
    " "$file"
}

# Fix Amazon exceptions
for exc in CustomerNotFoundException ProductNotFoundException EmptyCartException InvalidOperationException InsufficientStockException OrderNotFoundException; do
    fix_empty_exception "docs/problems/amazon/diagrams/class-diagram.mmd" "$exc"
done

# Fix BookMyShow exceptions
for exc in SeatNotAvailableException PaymentFailedException BookingNotFoundException ShowNotFoundException; do
    fix_empty_exception "docs/problems/bookmyshow/diagrams/class-diagram.mmd" "$exc"
done

# Fix Filesystem exceptions
for exc in DiskFullException AccessDeniedException DirectoryNotEmptyException FileNotFoundException; do
    fix_empty_exception "docs/problems/filesystem/diagrams/class-diagram.mmd" "$exc"
done

echo "✅ Fixed empty exception classes"
