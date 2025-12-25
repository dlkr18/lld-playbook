# Deployment Test Page

## Environment Detection

**Current Environment**: 
<script>
document.write(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'LOCAL (localhost)' : 'GITHUB PAGES (github.io)');
</script>

**Base Path**: 
<script>
document.write(window.$docsify.basePath || '/');
</script>

**Full URL**: 
<script>
document.write(window.location.href);
</script>

---

## Link Tests

### Internal Navigation Links
- [Home](home)
- [Social Network CODE](problems/socialnetwork/CODE)
- [Amazon CODE](problems/amazon/CODE)
- [Food Delivery CODE](problems/fooddelivery/CODE)
- [Week 1 Overview](week1/README)

### Test Results
✅ If all links above work, deployment is correct!
❌ If links break, there's a path issue

---

## Configuration Check

**Expected Behavior**:
- **Local** (localhost:8888): basePath = `/`
- **GitHub Pages** (github.io): basePath = `/lld-playbook/`

**Current basePath**: 
<script>
document.write(window.$docsify.basePath);
</script>

---

## Quick Links for Testing

1. Click each link in sidebar - should work
2. Search for "social network" - should find results
3. Navigate to Social Network → should see directory tree
4. Go back to home - should work

✅ All working? Deployment is configured correctly!

