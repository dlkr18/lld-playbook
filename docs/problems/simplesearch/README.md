# Simple Search / Autocomplete

## Overview
Basic search with autocomplete suggestions using Trie data structure for prefix matching.

## Key Algorithms
```java
public List<String> autocomplete(String prefix) {
    TrieNode node = root;
    for (char c : prefix.toCharArray()) {
        if (!node.hasChild(c)) return Collections.emptyList();
        node = node.getChild(c);
    }
    return collectWords(node, prefix);
}
```

## Source Code
📄 **[View Complete Source Code](/problems/simplesearch/CODE)**
