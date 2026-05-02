# Diagram Reference Fix

## Issue Reported

**User found**: Class diagram image missing on auction page
- **DOM Path**: Trying to load `/lld-playbook/problems/auction/diagrams/class.png`
- **Error**: 404 - Image not found

---

## Root Cause

The diagram files were named `class-diagram.png` but READMEs referenced `class.png`

**Actual file names**:
- `docs/problems/auction/diagrams/class-diagram.png` ✅
- `docs/problems/fooddelivery/diagrams/class-diagram.png` ✅
- `docs/problems/tictactoe/diagrams/class-diagram.png` ✅
- `docs/problems/trafficcontrol/diagrams/class-diagram.png` ✅
- `docs/problems/filesystem/diagrams/class-diagram.png` ✅

**README references** (WRONG):
- `![Auction Class Diagram](diagrams/class.png)` ❌
- `![Food Delivery Class Diagram](diagrams/class.png)` ❌

---

## Fix Applied

Changed references in 2 READMEs:

### 1. auction/README.md
```markdown
- ![Auction Class Diagram](diagrams/class.png)
+ ![Auction Class Diagram](diagrams/class-diagram.png)
```

### 2. fooddelivery/README.md
```markdown
- ![Food Delivery Class Diagram](diagrams/class.png)
+ ![Food Delivery Class Diagram](diagrams/class-diagram.png)
```

**Note**: tictactoe and trafficcontrol didn't have diagram references in their READMEs (no issue there)

---

## Deployment

- **Commit**: `0015897`
- **Message**: "fix: correct diagram references from class.png to class-diagram.png"
- **Status**: ✅ Pushed to github-pages-deploy
- **Branch**: github-pages-deploy

---

## Verification

After GitHub Pages rebuilds (2-5 minutes), the diagrams should now load correctly:

1. **Auction**: https://dlkr18.github.io/lld-playbook/#/problems/auction/README
2. **Food Delivery**: https://dlkr18.github.io/lld-playbook/#/problems/fooddelivery/README

**Clear cache**: Ctrl+Shift+R or Cmd+Shift+R

---

## Status

✅ **FIXED** - Diagram images will now load correctly
