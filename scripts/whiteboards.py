"""Whiteboard diagrams for the AI topic pages, in the house style of the LLD
sheets (docs/cheatsheets/img/*.svg): white board, Marker Felt titles,
Chalkboard SE labels, coloured pen strokes.

Each diagram is a short spec: rows of boxes, arrows between them, and a strip
of notes. Layout is automatic (rows spread evenly across the board), so a
spec stays readable and editable. render_all() writes <name>.svg and
<name>.png (rsvg-convert) and returns {name: caption}.

Used by build_ai_learning.py; run it directly to redraw only the boards:
    python3 scripts/whiteboards.py
"""
import math
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

W = 2140
PEN = {  # stroke, fill
    "blue": ("#2563eb", "#eff6ff"), "green": ("#16a34a", "#f0fdf4"), "orange": ("#ea580c", "#fff7ed"),
    "purple": ("#7e22ce", "#faf5ff"), "pink": ("#db2777", "#fdf2f8"), "red": ("#dc2626", "#fef2f2"),
    "ink": ("#1f2937", "#f8fafc"), "teal": ("#0f766e", "#f0fdfa"),
}
TITLE_FONT, BODY_FONT = "Marker Felt", "Chalkboard SE"


def N(id, text, pen="blue", w=None):
    return {"id": id, "lines": text.split("\n"), "pen": pen, "w": w}


def GAP(k, w=260):
    """An empty slot in a row, so a box can sit under the box it relates to."""
    return N(f"_{k}", "", "ink", w)


def board(name, title, caption, rows, edges=(), notes=(), row_labels=()):
    return {"name": name, "title": title, "caption": caption, "rows": rows, "edges": edges,
            "notes": notes, "row_labels": row_labels}


# ---------------------------------------------------------------------------
# layout + SVG
# ---------------------------------------------------------------------------

# Real glyph widths, so boxes fit their text (rsvg uses these same system fonts).
_FONTS = {}


def text_w(text, size, bold=False, face="body"):
    from PIL import ImageFont
    key = (size, bold, face)
    if key not in _FONTS:
        if face == "title":
            _FONTS[key] = ImageFont.truetype("/System/Library/Fonts/MarkerFelt.ttc", size, index=1)
        else:
            _FONTS[key] = ImageFont.truetype("/System/Library/Fonts/Supplemental/ChalkboardSE.ttc", size,
                                             index=2 if bold else 1)
    return _FONTS[key].getlength(text)


def _size(node):
    if node["id"].startswith("_"):                  # spacer slot: keeps columns aligned, draws nothing
        return node["w"] or 260, 66
    need = max(text_w(l, 23 if k == 0 else 19, bold=(k == 0)) for k, l in enumerate(node["lines"])) + 56
    w = max(node["w"] or 0, need, 200)
    h = 36 + 30 * len(node["lines"])
    return w, h


def _layout(b):
    y, boxes = 140, {}
    label_w = 190 if b["row_labels"] else 0
    for r, row in enumerate(b["rows"]):
        sizes = [_size(n) for n in row]
        h = max(s[1] for s in sizes)
        total = sum(s[0] for s in sizes)
        usable = W - 120 - label_w
        gap = (usable - total) / (len(row) + 1)
        x = 60 + label_w + gap
        for n, (w, hh) in zip(row, sizes):
            boxes[n["id"]] = {"x": x, "y": y + (h - hh) / 2, "w": w, "h": hh, "node": n, "row": r, "rowy": y, "rowh": h}
            x += w + gap
        y += h + 110
    return boxes, y


def _edge_point(bx, tx, ty):
    """Where the line from a box's centre toward (tx, ty) leaves the box."""
    cx, cy = bx["x"] + bx["w"] / 2, bx["y"] + bx["h"] / 2
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0:
        return cx, cy
    sx = (bx["w"] / 2) / abs(dx) if dx else math.inf
    sy = (bx["h"] / 2) / abs(dy) if dy else math.inf
    s = min(sx, sy)
    return cx + dx * s, cy + dy * s


def _last_row_loop(b, boxes):
    """Extra room under the last row when a loop-back arc hangs below it."""
    last = max(bx["row"] for bx in boxes.values())
    for e in b["edges"]:
        kind = e[4] if len(e) > 4 else "line"
        if kind.startswith("curve") and boxes[e[0]]["row"] == boxes[e[1]]["row"] == last:
            return 50
    return 0


def svg(b):
    boxes, y_end = _layout(b)
    notes_h = 0
    if b["notes"]:
        notes_h = 70 + 44 * math.ceil(len(b["notes"]) / 2)
    H = int(y_end - 40 + _last_row_loop(b, boxes) + notes_h + 40)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">', "<defs>"]
    for k, (stroke, _) in PEN.items():
        out.append(f'<marker id="ah-{k}" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto">'
                   f'<path d="M0,0 L11,5 L0,10 z" fill="{stroke}"/></marker>')
    out.append("</defs>")
    out.append(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
    out.append(f'<text x="{W / 2}" y="70" font-family="{TITLE_FONT}" font-size="46" fill="#1e40af" '
               f'text-anchor="middle" font-weight="bold">{escape(b["title"])}</text>')
    tw = min(W - 200, text_w(b["title"], 46, face="title") + 40)
    out.append(f'<path d="M{W / 2 - tw / 2},88 Q{W / 2},106 {W / 2 + tw / 2},86" stroke="#1e40af" '
               f'stroke-width="3.5" fill="none" stroke-linecap="round"/>')

    for i, lab in enumerate(b["row_labels"]):
        rb = [bx for bx in boxes.values() if bx["row"] == i]
        if lab and rb:
            yy = rb[0]["rowy"] + rb[0]["rowh"] / 2 + 8
            out.append(f'<text x="70" y="{yy}" font-family="{TITLE_FONT}" font-size="24" fill="#6b7280" '
                       f'font-weight="bold">{escape(lab)}</text>')

    # edges under boxes
    for e in b["edges"]:
        a, c = boxes[e[0]], boxes[e[1]]
        label = e[2] if len(e) > 2 else ""
        pen = e[3] if len(e) > 3 else "ink"
        kind = e[4] if len(e) > 4 else "line"
        stroke = PEN[pen][0]
        dash = ' stroke-dasharray="10 8"' if kind in ("dash", "curvedash") else ""
        acx, acy = a["x"] + a["w"] / 2, a["y"] + a["h"] / 2
        ccx, ccy = c["x"] + c["w"] / 2, c["y"] + c["h"] / 2
        if kind.startswith("curve") and a["row"] != c["row"]:
            kind = "dash"                    # a loop-back across rows: a straight dashed arrow reads better
            dash = ' stroke-dasharray="10 8"'
        if kind.startswith("curve"):
            # loop back: leave from the bottom, come in from the bottom, arc below the row
            x1, y1 = acx, a["y"] + a["h"]
            x2, y2 = ccx, c["y"] + c["h"]
            low = max(a["rowy"] + a["rowh"], c["rowy"] + c["rowh"]) + 70
            out.append(f'<path d="M{x1},{y1} C{x1},{low} {x2},{low} {x2},{y2 + 8}" stroke="{stroke}" stroke-width="3" '
                       f'fill="none"{dash} marker-end="url(#ah-{pen})"/>')
            lx, ly = (x1 + x2) / 2, low - 6
        else:
            x1, y1 = _edge_point(a, ccx, ccy)
            x2, y2 = _edge_point(c, acx, acy)
            # stop short of the box so the arrowhead sits on the border
            d = math.hypot(x2 - x1, y2 - y1) or 1
            x2s, y2s = x2 - (x2 - x1) / d * 6, y2 - (y2 - y1) / d * 6
            out.append(f'<line x1="{x1}" y1="{y1}" x2="{x2s}" y2="{y2s}" stroke="{stroke}" stroke-width="3"'
                       f'{dash} marker-end="url(#ah-{pen})"/>')
            lx, ly = (x1 + x2) / 2, (y1 + y2) / 2 - 10
        if label:
            lw = text_w(label, 19) + 20
            out.append(f'<rect x="{lx - lw / 2}" y="{ly - 22}" width="{lw}" height="30" rx="6" fill="#ffffff"/>')
            out.append(f'<text x="{lx}" y="{ly}" font-family="{BODY_FONT}" font-size="19" fill="{stroke}" '
                       f'text-anchor="middle">{escape(label)}</text>')

    for bx in boxes.values():
        if bx["node"]["id"].startswith("_"):
            continue
        stroke, fill = PEN[bx["node"]["pen"]]
        out.append(f'<rect x="{bx["x"]}" y="{bx["y"]}" width="{bx["w"]}" height="{bx["h"]}" rx="16" '
                   f'fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
        lines = bx["node"]["lines"]
        for k, line in enumerate(lines):
            first = k == 0
            yy = bx["y"] + 44 + 30 * k
            out.append(f'<text x="{bx["x"] + bx["w"] / 2}" y="{yy}" font-family="{BODY_FONT}" '
                       f'font-size="{23 if first else 19}" fill="{stroke if first else "#374151"}" text-anchor="middle"'
                       f'{" font-weight=" + chr(34) + "bold" + chr(34) if first else ""}>{escape(line)}</text>')

    if b["notes"]:
        ny = y_end - 40 + _last_row_loop(b, boxes)
        out.append(f'<rect x="60" y="{ny}" width="{W - 120}" height="{notes_h}" rx="18" fill="#fffbeb" '
                   f'stroke="#d97706" stroke-width="2.5" stroke-dasharray="12 8"/>')
        out.append(f'<text x="96" y="{ny + 46}" font-family="{TITLE_FONT}" font-size="26" fill="#b45309" '
                   f'font-weight="bold">REMEMBER</text>')
        for k, note in enumerate(b["notes"]):
            col, row = k % 2, k // 2
            nx = 96 + col * ((W - 192) / 2)
            yy = ny + 92 + row * 44
            out.append(f'<text x="{nx}" y="{yy}" font-family="{BODY_FONT}" font-size="21" fill="#374151">'
                       f'&#8226; {escape(note)}</text>')
    out.append("</svg>")
    return "\n".join(out)


def _seg_hits_rect(x1, y1, x2, y2, r, pad=6):
    """Does segment (x1,y1)-(x2,y2) pass through rect r (shrunk by pad)?"""
    rx1, ry1, rx2, ry2 = r["x"] + pad, r["y"] + pad, r["x"] + r["w"] - pad, r["y"] + r["h"] - pad
    for t in [i / 60 for i in range(61)]:
        x, y = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
        if rx1 < x < rx2 and ry1 < y < ry2:
            return True
    return False


_CMAPS = {}


def missing_glyphs(text, face="body"):
    """Characters the board's font cannot draw (rsvg would substitute a stray glyph)."""
    import logging
    from fontTools.ttLib import TTCollection
    logging.getLogger("fontTools").setLevel(logging.ERROR)
    if face not in _CMAPS:
        path = "/System/Library/Fonts/MarkerFelt.ttc" if face == "title" else "/System/Library/Fonts/Supplemental/ChalkboardSE.ttc"
        cmap = set()
        for f in TTCollection(path).fonts:
            cmap |= set(f.getBestCmap())
        _CMAPS[face] = cmap
    return sorted({ch for ch in text if ord(ch) not in _CMAPS[face] and not ch.isspace() and ch not in FALLBACK_OK})


# Not in Chalkboard/Marker Felt, but the system fallback draws them cleanly at
# these sizes (checked by eye on the rendered boards). Anything else is flagged.
FALLBACK_OK = set("→←−∇×∝")


def lint(b):
    """Layout defects a reader would notice. Returns a list of strings."""
    issues = []
    texts = [l for row in b["rows"] for n in row for l in n["lines"]] + list(b["notes"]) + \
            [e[2] for e in b["edges"] if len(e) > 2 and e[2]] + [l for l in b["row_labels"] if l]
    bad = sorted({ch for t in texts for ch in missing_glyphs(t)})
    if bad:
        issues.append("font cannot draw: " + " ".join(f"{c!r}(U+{ord(c):04X})" for c in bad))
    tbad = missing_glyphs(b["title"], "title")
    if tbad:
        issues.append("title font cannot draw: " + " ".join(repr(c) for c in tbad))
    boxes, y_end = _layout(b)
    if text_w(b["title"], 46, face="title") > W - 120:
        issues.append("title wider than the board")
    rows = {}
    for bx in boxes.values():
        if not bx["node"]["id"].startswith("_"):
            rows.setdefault(bx["row"], []).append(bx)
    for r, bs in rows.items():
        bs.sort(key=lambda q: q["x"])
        if bs[0]["x"] < 40 or bs[-1]["x"] + bs[-1]["w"] > W - 40:
            issues.append(f"row {r} runs off the board")
        for p, q in zip(bs, bs[1:]):
            if q["x"] - (p["x"] + p["w"]) < 60:
                issues.append(f"row {r}: {p['node']['id']} and {q['node']['id']} are cramped "
                              f"({int(q['x'] - p['x'] - p['w'])}px apart)")
    labels = []
    for e in b["edges"]:
        if e[0] not in boxes or e[1] not in boxes:
            issues.append(f"edge {e[0]}->{e[1]} names a missing box")
            continue
        a, c = boxes[e[0]], boxes[e[1]]
        kind = e[4] if len(e) > 4 else "line"
        if kind.startswith("curve") and a["row"] == c["row"]:
            continue
        acx, acy = a["x"] + a["w"] / 2, a["y"] + a["h"] / 2
        ccx, ccy = c["x"] + c["w"] / 2, c["y"] + c["h"] / 2
        x1, y1 = _edge_point(a, ccx, ccy)
        x2, y2 = _edge_point(c, acx, acy)
        for o in boxes.values():
            if o is not a and o is not c and not o["node"]["id"].startswith("_") and _seg_hits_rect(x1, y1, x2, y2, o):
                issues.append(f"edge {e[0]}->{e[1]} cuts through {o['node']['id']}")
        if len(e) > 2 and e[2]:
            lx, ly = (x1 + x2) / 2, (y1 + y2) / 2 - 10
            lw = text_w(e[2], 19) + 20
            seg = math.hypot(x2 - x1, y2 - y1)
            if lw > seg - 30 and abs(y2 - y1) < 20:
                issues.append(f"label '{e[2]}' longer than its arrow")
            lab = {"x": lx - lw / 2, "y": ly - 22, "w": lw, "h": 30}
            for o in boxes.values():
                if not (lab["x"] + lab["w"] < o["x"] or o["x"] + o["w"] < lab["x"] or
                        lab["y"] + lab["h"] < o["y"] or o["y"] + o["h"] < lab["y"]):
                    issues.append(f"label '{e[2]}' sits on box {o['node']['id']}")
            for l2 in labels:
                if not (lab["x"] + lab["w"] < l2["x"] or l2["x"] + l2["w"] < lab["x"] or
                        lab["y"] + lab["h"] < l2["y"] or l2["y"] + l2["h"] < lab["y"]):
                    issues.append(f"label '{e[2]}' collides with another label")
            labels.append(lab)
    linked_ids = {e[0] for e in b["edges"]} | {e[1] for e in b["edges"]}
    for r, bs in rows.items():
        labelled = r < len(b["row_labels"]) and b["row_labels"][r]
        if len(rows) > 1 and not labelled and not any(bx["node"]["id"] in linked_ids for bx in bs):
            issues.append(f"row {r} has no arrows and no label: it floats")
    for n in b["notes"]:
        if text_w("• " + n, 21) > (W - 192) / 2 - 30:
            issues.append(f"note too long for its column: '{n[:40]}'")
    ids = [bx["node"]["id"] for bx in boxes.values()]
    linked = {e[0] for e in b["edges"]} | {e[1] for e in b["edges"]}
    loose = [i for i in ids if i not in linked]
    if b["edges"] and len(loose) == len(ids):
        issues.append("no box is connected")
    return issues


def render_all(out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    captions = {}
    for b in BOARDS:
        s = out_dir / f"{b['name']}.svg"
        p = out_dir / f"{b['name']}.png"
        text = svg(b)
        if not s.exists() or s.read_text(encoding="utf-8") != text or not p.exists():
            s.write_text(text, encoding="utf-8")
            subprocess.run(["rsvg-convert", "-w", str(W), "-o", str(p), str(s)], check=True)
        captions[b["name"]] = b["caption"]
    return captions


# ---------------------------------------------------------------------------
# the boards
# ---------------------------------------------------------------------------

BOARDS = [
    board("big-picture", "THE WHOLE FIELD ON ONE BOARD",
          "Two engines and four add-ons. Everything else in AI engineering is plumbing around a generative model and an embedding model.",
          [[N("gen", "Generative model\ntext → next text", "blue", 420), N("emb", "Embedding model\ntext → vector", "purple", 420)],
           [N("pr", "Prompting\nword it well", "orange"), N("tl", "Tools\nact on the world", "green"),
            N("ag", "Agents\nloop until done", "pink"), N("rag", "RAG\nlook facts up first", "purple")],
           [N("prod", "Production\nevals · observability · cost · security", "ink", 760)]],
          [("gen", "pr"), ("emb", "rag", "", "purple"), ("gen", "tl", "", "green"), ("tl", "ag", "", "pink"),
           ("rag", "ag", "as a tool", "purple", "dash"), ("pr", "prod"), ("ag", "prod")],
          ["The model only sees its context window", "An agent = model + tools + a loop",
           "RAG = search, then paste facts into the prompt", "Multi-agent = several loops cooperating"]),

    board("interviews", "WHAT THE SCREENING QUESTIONS REALLY ASK",
          "Q4 asks whether you can measure an AI feature; Q5 asks whether you have built beyond one prompt. Both want one specific story with numbers.",
          [[N("q4", "Q4 · designed an eval?", "blue", 420)],
           [N("s1", "Define 'good'\nthresholds per slice", "blue"), N("s2", "Golden set\nreal + edge cases", "blue"),
            N("s3", "Graders\ncode → judge → human", "blue"), N("s4", "Decide\nship · block · compare", "blue"),
            N("s5", "Online\nA/B · feedback", "blue")],
           [N("q5", "Q5 · built beyond a prompt?", "green", 460)],
           [N("r", "Retrieval pipeline\nchunk · hybrid · rerank", "green"), N("a", "Agents\ntools · loop · bounds", "green"),
            N("h", "Hybrid patterns\nLLM + code + ML", "green")]],
          [("q4", "s1", "", "blue"), ("s1", "s2", "", "blue"), ("s2", "s3", "", "blue"), ("s3", "s4", "", "blue"), ("s4", "s5", "", "blue"),
           ("q5", "r", "", "green"), ("q5", "a", "", "green"), ("q5", "h", "", "green")],
          ["'Tell me about a time' = one real story", "Name the numbers: set size, metric, delta",
           "Depth in one beats a list of three", "Say what broke and how you measured the fix"]),

    board("learning-path", "THE FASTEST ROUTE TO COMPETENCE",
          "Read the few primary sources, then build one agent and grow it step by step. One shipped, traced, evaluated agent teaches more than ten courses.",
          [[N("a", "Read\nprimary sources", "purple"), N("b", "Agent loop\n2 real tools, no framework", "blue"),
            N("c", "+ RAG tool\nmeasure recall@k", "blue")],
           [N("f", "Ship it\nwrite up the numbers", "pink"), N("e", "+ Critic loop\nbudgets · retry", "orange"),
            N("d", "+ Tracing\n+ 10 evals", "green")]],
          [("a", "b"), ("b", "c"), ("c", "d", "", "ink", "line"), ("d", "e"), ("e", "f")],
          ["Build before you read more", "Every step adds one measurable thing"]),

    board("math", "THE MATH THAT CARRIES 90% OF AI",
          "Vectors and matrices represent, derivatives and the chain rule learn, probability and cross-entropy score. Each feeds the next.",
          [[N("v", "Vectors\ndot · cosine", "blue"), N("m", "Matrices\nmatmul · shapes", "blue"), N("l", "A layer\ny = Wx + b", "blue")],
           [N("p", "Probability\ndistributions", "purple"), N("s", "Softmax\nlogits → probabilities", "purple"),
            N("ce", "Cross-entropy\n−log p(correct)", "purple")],
           [N("d", "Derivatives\nslope · gradient", "green"), N("c", "Chain rule\nmultiply sensitivities", "green"),
            N("bp", "Backprop + update\nθ ← θ − η∇L", "green")]],
          [("v", "m", "", "blue"), ("m", "l", "", "blue"), ("p", "s", "", "purple"), ("s", "ce", "", "purple"),
           ("l", "s", "logits", "ink"), ("d", "c", "", "green"), ("c", "bp", "", "green"), ("ce", "bp", "loss", "red")],
          ["cosine ignores length: angle only", "minimize cross-entropy = maximize likelihood",
           "matmul cost ≈ 2·m·k·n FLOPs", "subtract max before exp (stable softmax)"],
          ["Represent", "Score", "Learn"]),

    board("classical-ml", "THE TRAINING STORY IN MINIATURE",
          "Model, loss, gradient, update, repeat; then the real question is whether it generalizes. Every later model obeys the same discipline.",
          [[N("d", "Data\nscale features", "ink"), N("sp", "Split\ntrain · val · test", "orange"), N("f", "Model\nf(x; θ)", "blue"),
            N("lo", "Loss\nMSE · cross-entropy", "purple"), N("g", "Gradient step\nθ ← θ − η∇L", "green")],
           [N("u", "Underfit\nhigh bias", "red"), N("j", "Just right\nval error lowest", "green"), N("o", "Overfit\nhigh variance", "red")],
           [N("me", "Metrics\nprecision · recall · F1 · AUC · calibration", "teal", 760)]],
          [("d", "sp"), ("sp", "f"), ("f", "lo"), ("lo", "g"), ("g", "f", "repeat", "green", "curve"), ("u", "j", "more capacity"), ("o", "j", "regularize")],
          ["Leakage gives wins that vanish in production", "Tune on validation, touch test once",
           "Accuracy lies on imbalanced data", "Calibration matters as much as ranking"],
          ["Train", "Generalize", "Measure"]),

    board("neural-networks", "FORWARD, BACKWARD, AND THE TRICKS THAT MAKE IT TRAIN",
          "A network is stacked linear layers with nonlinearities. Backprop runs the chain rule in reverse; init, AdamW, schedules, normalization and residuals keep deep stacks trainable.",
          [[N("x", "Input x", "ink"), N("lin", "Linear\nWx + b", "blue"), N("act", "Activation\nReLU · GELU", "blue"),
            N("more", "× many layers\n+ residual + norm", "blue"), N("lg", "Logits → loss", "purple")],
           [N("up", "AdamW step\nwarmup + cosine LR", "green"), N("gw", "∂L/∂W = δ · x^T", "green"), N("gx", "∂L/∂x = W^T · δ", "green")],
           [N("i", "Init\nHe / Xavier", "orange"), N("n", "LayerNorm / RMSNorm", "orange"), N("r", "Residual\nx + F(x)", "orange"),
            N("dr", "Dropout · weight decay", "orange")]],
          [("x", "lin"), ("lin", "act"), ("act", "more"), ("more", "lg"), ("lg", "gx", "backward", "red", "dash"),
           ("gx", "gw", "", "green"), ("gw", "up", "", "green")],
          ["Without nonlinearity, depth collapses to one layer", "Activations are saved for backward: memory ∝ batch × depth",
           "Gradients accumulate: zero_grad() every step", "Residuals give gradients an identity path"],
          ["Forward", "Backward", "Tricks"]),

    board("pytorch", "A TRAINING LOOP YOU CAN TRUST",
          "One step of a production training loop, read left to right along the top and back along the bottom, and where a GPU's memory goes.",
          [[N("dl", "DataLoader\nworkers · pin_memory", "ink"), N("fw", "Forward\nautocast bf16", "blue"),
            N("ls", "Loss\n÷ accum steps", "purple"), N("bw", "loss.backward()", "green")],
           [N("zg", "zero_grad()", "green"), N("op", "opt.step()\nsched.step()", "green"), N("cl", "clip_grad_norm_\n1.0", "orange")],
           [N("mem", "Per parameter: bf16 weights 2 B + grads 2 B + fp32 master 4 B + Adam m,v 8 B = 16 B", "red", 1500)]],
          [("dl", "fw"), ("fw", "ls"), ("ls", "bw"), ("bw", "cl"), ("cl", "op"), ("op", "zg"), ("zg", "dl", "next batch", "ink", "dash")],
          ["Initial loss should be ≈ ln(num classes)", "Overfit one batch first: loss must reach ~0",
           ".item() every step forces a GPU sync", "Checkpoint model · optimizer · scheduler · RNG",
           "OOM? micro-batch + accumulation, checkpointing", "then LoRA / QLoRA, then FSDP"],
          ["One step", "", "Memory"]),

    board("decoding", "FROM LOGITS TO THE NEXT TOKEN",
          "Every generated token passes through the same pipeline. Temperature reshapes the distribution; top-k and top-p cut its tail; then one token is sampled and fed back.",
          [[N("lg", "Logits\none score per token", "blue"), N("t", "÷ temperature T", "orange"), N("sm", "Softmax", "purple"),
            N("f", "Filter\ntop-k · top-p", "orange"), N("s", "Sample\none token", "green")],
           [N("g", "T → 0\ngreedy, repeatable", "blue"), N("one", "T = 1\nthe model's distribution", "purple"),
            N("hot", "T > 1\nflatter, riskier", "red")]],
          [("lg", "t"), ("t", "sm"), ("sm", "f"), ("f", "s"), ("s", "lg", "append and repeat", "green", "curve")],
          ["Extraction and code: low T", "Brainstorming: higher T, top-p ≈ 0.9",
           "Same prompt, same T > 0 → different outputs", "Stop sequences and max_tokens bound the run"],
          ["Each token", "Temperature"]),

    board("prompt-anatomy", "ANATOMY OF A PROMPT",
          "A prompt has parts with distinct jobs. Put stable parts first so they can be cached, and the specific task and format last.",
          [[N("sy", "System\nrole · rules · tone", "blue"), N("cx", "Context\nfacts · data", "purple"),
            N("ex", "Examples\nfew-shot pairs", "teal"), N("tk", "Task\ninstruction + limits", "orange"),
            N("of", "Output format\nschema · length", "orange")],
           [N("m", "Model", "ink", 320)],
           [N("a", "Answer\nchecked against the format", "green", 520)]],
          [("sy", "m"), ("cx", "m"), ("ex", "m"), ("tk", "m"), ("of", "m"), ("m", "a", "", "green")],
          ["Static first (cacheable), variable last", "Delimit untrusted text clearly",
           "Show the format, don't only describe it", "One task per prompt beats a mega-prompt"]),

    board("structured-output", "GETTING MACHINE-READABLE OUTPUT",
          "Constrain generation with a schema, validate everything, repair or retry on failure, and escalate when repairs run out.",
          [[N("p", "Prompt\n+ JSON schema", "blue"), N("m", "Model\nconstrained decoding", "purple"), N("raw", "Raw output", "ink"),
            N("v", "Parse + validate\ntypes · ranges · enums", "orange")],
           [N("fix", "Invalid\nrepair / retry with error", "red"), N("esc", "Still failing\nescalate · fallback", "red"),
            N("ok", "Valid\nbusiness code runs", "green")]],
          [("p", "m"), ("m", "raw"), ("raw", "v"), ("v", "ok", "pass", "green"), ("v", "fix", "fail", "red"),
           ("fix", "m", "retry ≤ N", "red", "curvedash"), ("fix", "esc", "", "red")],
          ["The schema is a contract: version it", "Validate server-side even with strict mode",
           "Feed the validator's error back on retry", "Log every repair: it is an eval signal"]),

    board("prompt-pitfalls", "PROMPT PITFALLS → PRO HABITS",
          "The mistakes that cost the most in production prompts, each paired with the habit that prevents it.",
          [[N("p1", "Vague instruction", "red"), N("p2", "Key rule buried\nin the middle", "red"), N("p3", "Edits without\na test set", "red"),
            N("p4", "Trusting pasted\ndocuments", "red")],
           [N("f1", "Specific, testable\nsuccess criteria", "green"), N("f2", "Critical rules\nfirst and last", "green"),
            N("f3", "Eval set before\nany change", "green"), N("f4", "Treat retrieved text\nas data, not orders", "green")]],
          [("p1", "f1", "", "green"), ("p2", "f2", "", "green"), ("p3", "f3", "", "green"), ("p4", "f4", "", "green")],
          ["A prompt change is a code change", "Read 50 outputs before trusting a score",
           "Pin model versions in production", "Shorter, clearer prompts usually win"],
          ["Pitfall", "Habit"]),

    board("reasoning", "HOW AGENTS THINK",
          "Three reasoning patterns side by side: ReAct interleaves thought and action, plan-and-execute separates planning from doing, reflection critiques and revises its own draft.",
          [[N("t", "Thought", "blue"), N("a", "Action\ncall a tool", "green"), N("o", "Observation\ntool result", "purple")],
           [N("pl", "Planner\nwrites the steps", "blue"), N("ex", "Executor\nruns step i", "green"), N("rp", "Re-plan\nif a step fails", "orange")],
           [N("dr", "Draft", "blue"), N("cr", "Critique\nagainst criteria", "red"), N("rv", "Revise", "green")]],
          [("t", "a"), ("a", "o"), ("o", "t", "repeat until done", "blue", "curve"),
           ("pl", "ex"), ("ex", "rp"), ("rp", "pl", "re-plan", "orange", "curvedash"),
           ("dr", "cr"), ("cr", "rv"), ("rv", "cr", "until it passes", "green", "curvedash")],
          ["ReAct: flexible, can wander", "Plan-and-execute: predictable, cheaper",
           "Reflection: needs clear criteria to help", "Always cap steps and tokens"],
          ["ReAct", "Plan & execute", "Reflection"]),

    board("agent-evals", "EVALUATING AN AGENT",
          "Run a realistic task suite several times, keep full traces, then score the end state, the trajectory, consistency and safety.",
          [[N("ts", "Task suite\nrealistic tasks", "blue"), N("run", "Run each task\nk times", "blue")],
           [N("tr", "Traces\nevery step logged", "ink")],
           [N("es", "End state\ntask success", "green"), N("tj", "Trajectory\ntool choice · steps · cost", "purple"),
            N("cs", "Consistency\npass^k", "orange"), N("sf", "Safety cases\ninjection · refusal", "red")]],
          [("ts", "run"), ("run", "tr"), ("tr", "es"), ("tr", "tj"), ("tr", "cs"), ("tr", "sf")],
          ["Check the end state in code, not by reading", "pass^k (every run succeeds) is the production bar",
           "Categorize failures from traces", "Add every production failure as a task"]),

    board("dpo", "RLHF VS DPO",
          "Both start from an SFT model and preference pairs. RLHF trains a reward model and runs RL with a KL leash; DPO gets the same target with one supervised loss.",
          [[N("s1", "SFT model", "blue"), N("rm", "Reward model\nfrom chosen > rejected", "purple"), N("ppo", "PPO\n+ KL to reference", "orange"),
            N("a1", "Aligned model", "green")],
           [N("s2", "SFT model", "blue"), N("pp", "Preference pairs\n(chosen, rejected)", "purple"),
            N("dl", "DPO loss\nlog-ratio vs reference", "orange"), N("a2", "Aligned model", "green")]],
          [("s1", "rm"), ("rm", "ppo"), ("ppo", "a1"), ("s2", "pp"), ("pp", "dl"), ("dl", "a2")],
          ["DPO: no reward model, no RL loop", "β controls how far from the reference",
           "KTO: thumbs up/down only · IPO: bounded loss", "ORPO: preference folded into SFT"],
          ["RLHF", "DPO"]),

    board("model-compression", "MAKING A MODEL SMALLER AND FASTER",
          "Four independent levers: quantize the weights, distill into a smaller student, prune, and compile. Check quality after each one.",
          [[N("m", "FP16 model", "ink", 320)],
           [N("q", "Quantize\nint8 · int4 · GPTQ · AWQ · NF4", "blue"), N("d", "Distill\nteacher → student", "purple"),
            N("p", "Prune\nunstructured · 2:4", "orange")],
           [N("c", "Compile / export\nONNX · TensorRT · kernel fusion", "teal", 620)],
           [N("f", "Smaller, faster model\nre-run the evals", "green", 520)]],
          [("m", "q"), ("m", "d"), ("m", "p"), ("q", "c"), ("d", "c"), ("p", "c"), ("c", "f", "", "green")],
          ["Decode is memory-bound: fewer bytes = faster", "4-bit weights ≈ 0.56 B/param with scales",
           "Distillation needs a good teacher and data", "Measure quality on YOUR eval set"]),

    board("gpus-scale", "SPLITTING TRAINING ACROSS GPUS",
          "Four ways to spread work across GPUs, and the two hardware limits behind every choice: compute in the SMs and bandwidth to HBM.",
          [[N("dp", "Data parallel\ncopy model, split batch", "blue"), N("z", "ZeRO / FSDP\nshard params · grads · opt", "purple"),
            N("tp", "Tensor parallel\nsplit each matmul", "orange"), N("pp", "Pipeline parallel\nsplit the layers", "green")],
           [N("ar", "All-reduce gradients\nNCCL", "blue"), N("ag", "All-gather params\non demand", "purple"),
            N("nv", "Needs NVLink\nwithin a node", "orange"), N("bb", "Micro-batches\nhide the bubble", "green")],
           [N("sm", "SMs + tensor cores\ncompute", "red"), N("hbm", "HBM\nmemory bandwidth", "red")]],
          [("dp", "ar"), ("z", "ag"), ("tp", "nv"), ("pp", "bb"), ("sm", "hbm", "roofline: which limits you?", "red")],
          ["Low arithmetic intensity = memory-bound", "FSDP: 16 B/param ÷ number of GPUs",
           "Tensor parallel inside a node, data parallel across", "Checkpoint often: failures are routine at scale"],
          ["Strategy", "What it costs", "Hardware"]),

    board("reliability", "SURVIVING FLAKY MODELS AND APIS",
          "Bound every call with a timeout, retry with backoff, fall back to another model, and degrade gracefully when all else fails.",
          [[N("rq", "Request", "ink"), N("to", "Timeout\n+ retry, backoff + jitter", "orange"), N("pm", "Primary model", "blue"),
            N("ok", "Validated answer", "green")],
           [GAP(1), GAP(2), N("fb", "Fallback model\nother provider / tier", "purple"), N("dg", "Degraded answer\ncache · template · human", "red")],
           [N("cb", "Circuit breaker", "teal"), N("id", "Idempotent tools", "teal"), N("rl", "Rate limits · queue", "teal")]],
          [("rq", "to"), ("to", "pm"), ("pm", "ok", "", "green"), ("pm", "fb", "fails", "red", "dash"), ("fb", "ok", "", "green"),
           ("fb", "dg", "fails", "red", "dash")],
          ["Retry only what is safe to retry", "Fallbacks need their own evals",
           "Trip the breaker before the queue melts", "Every failure path is logged and traced"],
          ["Happy path", "When it fails", "Guards"]),

    board("hybrid-patterns", "LLMS WRAPPED IN ORDINARY SOFTWARE",
          "Three patterns that cover most production AI: route each request to the cheapest path that works, cascade from small to large models, and let the LLM extract while code decides.",
          [[N("rt", "Router\na cheap classifier picks the path", "orange")],
           [N("c", "FAQ cache", "teal"), N("r", "RAG", "purple"), N("s", "SQL tool", "blue"), N("h", "Human", "pink")],
           [N("sm", "Small model", "blue"), N("vd", "Check\nvalidator or confidence", "orange"), N("lg", "Large model", "purple")],
           [N("ex", "LLM extracts\nJSON", "purple"), N("cd", "Code validates\nand decides", "green"), N("db", "Database", "ink")]],
          [("rt", "c"), ("rt", "r"), ("rt", "s"), ("rt", "h"),
           ("sm", "vd"), ("vd", "lg", "low confidence", "red"), ("ex", "cd"), ("cd", "db")],
          ["Cascades often cut cost 50–80%", "Tune thresholds on the eval set (like an ROC point)",
           "LLM labels can train a small fast model", "Never let the LLM write to the DB directly"],
          ["Routing", "", "Cascade", "Extract → decide"]),

    board("mlops-drift", "VERSION EVERYTHING, WATCH THE WORLD MOVE",
          "Every behaviour change (data, prompt, model, code) is versioned and gated by evals before rollout; monitoring catches drift and triggers retraining or rollback.",
          [[N("dv", "Data version", "ink"), N("mv", "Model / prompt\nversion", "blue"), N("eg", "Eval gate", "orange"),
            N("rg", "Registry", "purple"), N("cn", "Canary / shadow", "teal"), N("pd", "Production", "green")],
           [N("al", "Alert → runbook", "red"), N("mo", "Monitor\ninput drift · prediction drift · quality", "red", 620)]],
          [("dv", "mv"), ("mv", "eg"), ("eg", "rg"), ("rg", "cn"), ("cn", "pd"), ("pd", "mo", "", "red", "dash"), ("mo", "al", "", "red"),
           ("al", "dv", "retrain / roll back", "red", "dash")],
          ["Training-serving skew is a silent killer", "Pin model versions; vendors change under you",
           "Shadow first, then 1% → 10% → 100%", "Drift alerts need a runbook"],
          ["Release", "Watch"]),

    board("frameworks", "FRAMEWORK, THIN HARNESS, OR RAW?",
          "A spectrum from full control to most built in. Pick the least framework that gives you the control flow, checkpoints and debuggability you need.",
          [[N("raw", "Raw API loop\nyou own every line", "green"), N("th", "Thin harness\nyour loop + small helpers", "blue"),
            N("fw", "Framework\nLangGraph · CrewAI · Agents SDK\nPydantic AI · AutoGen", "purple", 520)],
           [N("c1", "Control flow\nvisible?", "orange"), N("c2", "Checkpoint\n+ resume?", "orange"), N("c3", "Debuggable\ntraces?", "orange"),
            N("c4", "Lock-in\ncost?", "orange")]],
          [("raw", "th", "+ helpers", "ink"), ("th", "fw", "+ abstractions", "ink")],
          ["Learn the raw loop first", "Frameworks change fast; wire formats don't",
           "LangGraph: explicit state graphs", "Adopt one for checkpoints, not for magic"],
          ["Spectrum", "Ask"]),

    board("voice-agents", "A VOICE AGENT IS A LATENCY BUDGET",
          "Streaming end to end: detect speech, transcribe, think, speak. Barge-in cancels speech and generation the moment the user talks over the bot.",
          [[N("mic", "Mic", "ink"), N("vad", "VAD +\nendpointing", "orange"), N("stt", "STT\nstreaming", "blue"),
            N("llm", "LLM\nstreaming tokens", "purple"), N("tts", "TTS\nstreaming audio", "green"), N("sp", "Speaker", "ink")],
           [N("b", "~800 ms to first audio: STT 150–300 · LLM first token 200–400 · TTS 100–200", "red", 1500)]],
          [("mic", "vad"), ("vad", "stt"), ("stt", "llm"), ("llm", "tts"), ("tts", "sp"),
           ("mic", "tts", "barge-in: cancel", "red", "curvedash")],
          ["Stream every stage; never wait for full text", "Endpointing too early cuts users off",
           "Short sentences speak sooner", "Measure p95, not the average"],
          ["Pipeline", "Budget"]),

    board("build", "THE COMPLETE BUILD, ON ONE BOARD",
          "The system built end to end in this stage: an order-support agent with tools, a knowledge layer for policy questions, and evals, tracing and budgets around it.",
          [[N("u", "Customer", "ink"), N("gw", "API gateway\nauth · rate limit", "orange"), N("ag", "Order agent\nloop · budgets · approvals", "pink", 460)],
           [N("t1", "Order DB tool", "blue"), N("t2", "Refund tool\nhuman approval", "red"), N("kb", "Policy search\nRAG tool", "purple")],
           [N("in", "Ingest → chunk → embed", "purple"), N("pg", "pgvector + full-text", "purple")],
           [N("ev", "Evals in CI", "green"), N("tr", "Tracing", "teal"), N("co", "Cost budget", "orange"), N("gd", "Guardrails", "red")]],
          [("u", "gw"), ("gw", "ag"), ("ag", "t1"), ("ag", "t2"), ("ag", "kb"), ("in", "pg"), ("kb", "pg", "", "purple")],
          ["Spec first: what 'done' means, in numbers", "Retrieved text is data; injections are tested",
           "Every run is traced and replayable", "Ship only what the eval gate passes"],
          ["Request", "Tools", "Knowledge", "Around it"]),

    board("build-knowledge", "THE KNOWLEDGE LAYER",
          "Policy documents are parsed, chunked with their heading path, embedded and indexed in Postgres for hybrid search; queries are rewritten, fused and reranked.",
          [[N("src", "Policy docs\nPDF · HTML · markdown", "ink"), N("pa", "Parse + clean", "orange"), N("ch", "Chunk\n+ heading path", "orange"),
            N("em", "Embed", "purple"), N("ix", "Index\npgvector + tsvector", "purple")],
           [N("q", "Query", "ink"), N("rw", "Rewrite", "blue"), N("hy", "Hybrid search\nvector + BM25", "blue"), N("rrf", "RRF fuse", "blue"),
            N("rr", "Rerank\ntop 5", "green")]],
          [("src", "pa"), ("pa", "ch"), ("ch", "em"), ("em", "ix"), ("q", "rw"), ("rw", "hy"), ("hy", "rrf"), ("rrf", "rr"),
           ("ix", "hy", "", "purple", "dash")],
          ["Measure recall@k before tuning generation", "Re-index incrementally when docs change",
           "Filter by permissions at retrieval time", "Store chunk ids for citations"],
          ["Offline", "Online"]),

    board("build-agent", "THE ORDER AGENT",
          "The agent loop for an order-support request: gather facts with read tools first, ask for approval before any refund, and treat order notes as data.",
          [[N("u", "Customer message", "ink"), N("lp", "Agent loop\nsteps ≤ 8 · token budget", "pink", 420), N("ans", "Validated answer\n+ citations", "green")],
           [N("rd", "Read tools\nget_order · search_policy", "blue"), N("wr", "Write tool\nissue_refund", "red"), N("hm", "Human approval\nabove $ limit", "orange")],
           [N("inj", "Order notes = untrusted data\nnever instructions", "red", 620)]],
          [("u", "lp"), ("lp", "ans", "", "green"), ("lp", "rd", "facts first", "blue"), ("lp", "wr", "", "red"), ("wr", "hm", "needs", "orange"),
           ("rd", "inj", "may contain", "red", "dash")],
          ["Errors go back to the model as tool results", "Every step traced: replayable",
           "Idempotency key on the refund tool", "Stop on budget, not on hope"]),

    board("build-ship", "PROVE IT, SERVE IT, AFFORD IT",
          "The release path for the build: evals gate every change, traffic shifts gradually, and cost and quality are watched in production.",
          [[N("pr", "Change\nprompt · model · code", "ink"), N("ev", "Eval suite in CI\ntrajectory + answer checks", "green"),
            N("sh", "Shadow / canary", "teal")],
           [N("pd", "Production", "blue", 320)],
           [N("tr", "Traces\nevery step", "purple"), N("co", "Cost per task\nbudget alerts", "orange"), N("qa", "Sampled judging\ndaily", "green")]],
          [("pr", "ev"), ("ev", "sh", "pass"), ("sh", "pd"), ("pd", "tr", "", "purple", "dash"), ("pd", "co", "", "orange", "dash"),
           ("pd", "qa", "", "green", "dash")],
          ["A failing eval blocks the merge", "Cache the stable prompt prefix",
           "Route easy requests to a smaller model", "Every production failure becomes an eval case"],
          ["Release", "Run", "Watch"]),

    board("answer-kit", "HOW A STRONG ANSWER IS BUILT",
          "The shape of a strong answer to either screening question: one real situation, the decisions you made, the numbers, and what you would do next.",
          [[N("s", "Situation\none real feature", "blue"), N("d", "Decisions\nwhat you chose, and why", "purple"),
            N("n", "Numbers\nset size · metric · delta", "orange"), N("l", "Lessons\nwhat broke · next step", "green")],
           [N("w", "Weak\ndefinitions, 'we used a vector DB'", "red"), N("st", "Strong\ntrade-offs, measured fixes", "green")]],
          [("s", "d"), ("d", "n"), ("n", "l"), ("w", "st", "turn into", "green")],
          ["Two minutes, then let them dig", "Have the follow-ups ready (judge validity, cost, latency)"],
          ["Shape", "Upgrade"]),
    board("portfolio-projects", "PROJECTS THAT PROVE IT",
          "A build ladder from first principles to a shipped service, plus a weekend project that turns interview answers into real stories.",
          [[N("p1", "micrograd\n+ MNIST MLP", "blue"), N("p2", "GPT from\nscratch", "blue"), N("p3", "QLoRA\nfine-tune", "purple"),
            N("p4", "Distill +\nserve fast", "orange"), N("p5", "Ship it\nAPI · evals · cost", "green")],
           [N("w1", "Weekend day 1\nretrieval, measured", "teal"), N("w2", "Weekend day 2\nagent + evals in CI", "teal")]],
          [("p1", "p2"), ("p2", "p3"), ("p3", "p4"), ("p4", "p5"), ("w1", "w2", "", "teal")],
          ["Every project ends with a results table", "Write up decisions and numbers, not features"],
          ["Ladder", "Weekend"]),
]


if __name__ == "__main__":
    import sys
    if "--lint" in sys.argv:
        bad = 0
        for b in BOARDS:
            for i in lint(b):
                bad += 1
                print(f"{b['name']}: {i}")
        print(f"{len(BOARDS)} boards, {bad} issues")
        sys.exit(1 if bad else 0)
    caps = render_all(Path(__file__).resolve().parent.parent / "docs" / "cheatsheets" / "ai" / "img")
    print(f"{len(caps)} boards")
