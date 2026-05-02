#!/usr/bin/env python3
"""
Remove Mermaid code blocks from READMEs that already have PNG diagrams.
Keep only the PNG image reference.
"""

import re
import os
from pathlib import Path

PROBLEMS_DIR = Path("docs/problems")

# Problems that have PNG files but still have mermaid blocks
problems_with_png = [
    "bookmyshow", "chess", "coffeemachine", "cricinfo", "elevator",
    "library", "loggingframework", "lrucache", "notification", "parkinglot",
    "pubsub", "ratelimiter", "ridehailing", "socialnetwork", "taskscheduler",
    "urlshortener", "vendingmachine", "versioncontrol"
]

def remove_mermaid_blocks(readme_path):
    """Remove mermaid code blocks from README, keep PNG reference."""
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the class diagram section
    # Pattern: ## Class Diagram\n\n![...](...png)\n\n```mermaid\n...\n```
    # We want to remove the ```mermaid...``` part
    
    # Remove mermaid blocks after PNG references
    pattern = r'(!\[.*?\]\(.*?\.png\))\s*```mermaid\s+classDiagram.*?```'
    content = re.sub(pattern, r'\1', content, flags=re.DOTALL)
    
    # Also remove standalone mermaid blocks (not after PNG)
    pattern = r'```mermaid\s+classDiagram.*?```\s*'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    print("Removing Mermaid blocks from 18 READMEs...")
    print()
    
    fixed_count = 0
    for problem in problems_with_png:
        readme_path = PROBLEMS_DIR / problem / "README.md"
        if readme_path.exists():
            # Check if has mermaid blocks
            content = readme_path.read_text()
            if '```mermaid' in content:
                remove_mermaid_blocks(readme_path)
                print(f"✅ {problem}")
                fixed_count += 1
            else:
                print(f"⏭️  {problem} - no mermaid blocks")
        else:
            print(f"❌ {problem} - README not found")
    
    print()
    print(f"Fixed {fixed_count} READMEs")

if __name__ == "__main__":
    main()
