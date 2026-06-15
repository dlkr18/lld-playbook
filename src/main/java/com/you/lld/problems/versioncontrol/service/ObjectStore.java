package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Blob;
import com.you.lld.problems.versioncontrol.model.Tree;
import java.util.HashMap;
import java.util.Map;

/**
 * Content-addressed object store for blobs and trees.
 */
public final class ObjectStore {

    private final Map<String, Blob> blobs = new HashMap<String, Blob>();
    private final Map<String, Tree> trees = new HashMap<String, Tree>();

    public String storeBlob(String content) {
        Blob blob = new Blob(content);
        blobs.put(blob.getHash(), blob);
        return blob.getHash();
    }

    public String storeTree(Map<String, String> files) {
        Map<String, String> pathToBlob = new HashMap<String, String>();
        for (Map.Entry<String, String> entry : files.entrySet()) {
            pathToBlob.put(entry.getKey(), storeBlob(entry.getValue()));
        }
        Tree tree = new Tree(pathToBlob);
        trees.put(tree.getHash(), tree);
        return tree.getHash();
    }

    public Map<String, String> resolveFiles(String treeHash) {
        Tree tree = trees.get(treeHash);
        if (tree == null) {
            throw new IllegalArgumentException("unknown tree: " + treeHash);
        }
        Map<String, String> files = new HashMap<String, String>();
        for (Map.Entry<String, String> entry : tree.getEntries().entrySet()) {
            Blob blob = blobs.get(entry.getValue());
            if (blob == null) {
                throw new IllegalStateException("missing blob for " + entry.getKey());
            }
            files.put(entry.getKey(), blob.getContent());
        }
        return files;
    }

    public Blob getBlob(String hash) {
        return blobs.get(hash);
    }

    public Tree getTree(String hash) {
        return trees.get(hash);
    }
}
