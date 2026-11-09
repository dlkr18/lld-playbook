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
          ["Initial loss should be ≈ ln(num classes)", "Overfit one batch first: loss must reach ≈ 0",
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
           [N("b", "≈ 800 ms to first audio: STT 150–300 · LLM first token 200–400 · TTS 100–200", "red", 1500)]],
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

    # ---- boards drawn for the deep lessons (scripts/ai_depth) ----
    board("chroma-write-path", "WHAT AN UPSERT DOES",
          "An upsert is embedded if needed, validated and recorded in a durable SQLite write log, then applied to the metadata "
          "segment and to the vector segment, where new vectors wait in a small buffer before being merged into the HNSW graph.",
          [[N("up", "upsert()\nids · embeddings\ndocuments · metadatas", "ink"),
            N("em", "Embed\nonly if no vectors\nwere given", "purple"),
            N("va", "Validate\ndimensions match\nids unique in batch", "orange"),
            N("wl", "Write log\nSQLite\ndurable record", "blue")],
           [GAP(1, 40), N("md", "Metadata segment (SQLite)\nids · metadata · document text\nfull-text index for where_document", "teal"),
            N("vs", "Vector segment\nsmall exact buffer\nmerged into HNSW in batches\ngraph files saved periodically", "green")]],
          [("up", "em"), ("em", "va"), ("va", "wl"), ("wl", "md", "", "teal"), ("wl", "vs", "", "green")],
          ["Batch writes: every call pays fixed overhead", "Deletes are tombstones until a rebuild",
           "The HNSW graph must be loaded into RAM", "Heavy churn? build a fresh collection, switch"],
          ["Call", "Apply"]),

    board("constitutional-ai-defence-in-depth", "DEFENCE IN DEPTH",
          "No single layer is reliable, so each catches what another misses: guardrails on the way in and out, a CAI-trained "
          "model with a system prompt, and tools that enforce authorisation, least privilege and human approval.",
          [[N("in", "User · documents", "ink", 300), N("ig", "Input\nguardrail", "orange"),
            N("m", "Model\nCAI-trained\n+ system prompt", "blue"), N("og", "Output\nguardrail", "orange"),
            N("out", "User", "ink", 300)],
           [N("t", "Tools\nauthorisation checks · least privilege\nhuman approval for risky actions", "red")]],
          [("in", "ig"), ("ig", "m"), ("m", "og"), ("og", "out"), ("m", "t", "tool calls", "red")],
          ["Training sets default behaviour and tone", "The system prompt helps; it can be overridden",
           "Guardrails catch known attacks and leaked data", "Monitoring feeds the red-team regression set"]),

    board("crewai-sequential-process", "A SEQUENTIAL CREW",
          "kickoff runs the three tasks in the order listed; each task is an agent loop, and context hands top_reasons' output "
          "to both later tasks and review_themes' output to the writer.",
          [[N("k", "kickoff()\ninputs={\"week\": \"2026-W45\"}", "ink"),
            N("tr", "top_reasons\nagent: analyst\ntool: query_returns_db\n→ table of top 5 products\n4 calls · 4,500 tokens in", "blue"),
            N("rt", "review_themes\nagent: researcher\ntool: search_reviews\n→ themes per product, quotes\n5 calls · 8,750 tokens in", "purple"),
            N("wr", "write_report\nagent: writer\ntools: none\n→ one-page markdown report\n2 calls · 3,150 tokens in", "green")]],
          [("k", "tr"), ("tr", "rt", "context", "blue"), ("rt", "wr", "context", "purple"),
           ("tr", "wr", "context", "blue", "curvedash")],
          ["Tasks run in the order listed", "context = exactly those outputs: be explicit",
           "Crew total: 11 calls, 16,400 input tokens", "async_execution=True runs independent tasks"]),

    board("document-ingestion-pipeline", "THE INGESTION PIPELINE",
          "Ingestion is a chain of stages with one job each, from a source change to an updated index; the diff against "
          "content hashes means only new chunks are embedded and removed chunks are deleted.",
          [[N("src", "Source change\nwebhook · nightly listing", "ink"), N("fe", "Fetch\nbytes + metadata", "blue"),
            N("dt", "Detect type", "orange"), N("pa", "Parse\nheadings · lists · tables", "orange"),
            N("cl", "Clean\n+ normalise", "orange")],
           [N("up", "Upsert new chunks\ndelete removed ones", "green"), N("em", "Embed\nnew chunks only", "purple"),
            N("df", "Diff vs index\ncontent hashes", "teal"), N("ch", "Chunk\nwith heading paths", "orange"),
            N("dd", "Deduplicate", "orange")]],
          [("src", "fe"), ("fe", "dt"), ("dt", "pa"), ("pa", "cl"), ("cl", "dd"), ("dd", "ch"), ("ch", "df"),
           ("df", "em"), ("em", "up")],
          ["Fix the output contract before any stage", "Each chunk: doc id, URL, anchor, heading path",
           "Version, dates, content hash, ACL groups", "Parser + embedding model versions: know what to rebuild"],
          ["Prepare", "Index"]),

    board("hybrid-patterns-extract-decide", "LLM EXTRACTS, CODE DECIDES",
          "The model only translates: email text into fields, and a decision back into a reply. Validation and the refund "
          "policy run in code, where they are versioned, tested and auditable.",
          [[N("em", "Refund email\nfree text", "ink", 340), N("ex", "LLM extracts\nintent · order_id\namount · reason", "purple", 340),
            N("rp", "LLM writes reply\nfrom the decision", "purple", 340)],
           [GAP(2, 340), N("va", "Validate\nschema + orders DB", "green", 340),
            N("po", "Refund policy\n30-day window\nauto-approve up to $100", "green", 340)]],
          [("em", "ex"), ("ex", "va", "fields", "purple"), ("va", "po", "", "green"),
           ("po", "rp", "approve · reject · human", "green")],
          ["97% right on 4,000 emails/day: ≈120 wrong a day", "The schema is the boundary",
           "'Approve $500' at worst extracts amount = 500", "Policy changes by pull request, not prompt"],
          ["LLM: fuzzy", "Code: checkable"]),

    board("hybrid-search-retrieval-stage", "THE RETRIEVAL STAGE",
          "Optionally rewrite the query, run BM25 and dense retrieval in parallel with the same metadata filters, fuse "
          "with RRF, then rerank the top 50 down to 5 to 8.",
          [[N("q", "User message\n+ conversation", "ink", 500),
            N("rw", "Rewrite · expand · extract filters\noptional · LLM · 100s of ms", "orange", 500)],
           [N("bm", "BM25 top 50\nfilters: tenant · ACL · language\n10-30 ms", "blue", 500),
            N("de", "Dense top 50\nfilters: tenant · ACL · language\n10-30 ms", "purple", 500)],
           [N("rrf", "RRF fuse\ndeduplicate · < 1 ms", "teal", 500), N("rr", "Rerank top 50\nkeep 5 to 8", "green", 500)]],
          [("q", "rw"), ("rw", "bm", "", "blue"), ("rw", "de", "", "purple"), ("bm", "rrf", "", "blue"),
           ("de", "rrf", "", "purple"), ("rrf", "rr", "", "green")],
          ["Parallel: latency is the slower one, not the sum", "A filter on one side only leaks documents",
           "Retrieve deeper than you keep (20 to 100)", "Measure recall at retrieval depth"],
          ["Query", "In parallel", "Narrow"]),

    board("langchain-retrieval-layer", "THE RETRIEVAL LAYER",
          "Offline, a loader, a text splitter and an embeddings class fill a vector store; online, a retriever made from "
          "that store turns a question into Documents that are formatted into the prompt.",
          [[N("ld", "Loader", "ink"), N("dc", "Documents\ntext + metadata", "blue"),
            N("sp", "TextSplitter\n→ chunks", "orange"), N("eb", "Embeddings\nembed_documents", "purple")],
           [N("vs", "VectorStore\nadd_documents · similarity_search", "teal")],
           [N("qu", "Question", "ink"), N("rt", "Retriever\nas_retriever(k, filter)", "teal"),
            N("ld2", "list[Document]", "blue"), N("pr", "Format\ninto the prompt", "green")]],
          [("ld", "dc"), ("dc", "sp"), ("sp", "eb"), ("eb", "vs", "add_documents", "purple"),
           ("vs", "rt", "as_retriever", "teal", "dash"), ("qu", "rt"), ("rt", "ld2"), ("ld2", "pr")],
          ["Metadata filter syntax is not standardised", "1,200 articles → about 5,100 chunks",
           "A Retriever is a Runnable: string → Documents", "Wrappers add model calls: read the trace"],
          ["Offline", "Store", "Online"]),

    board("langgraph-refund-graph", "THE REFUND AGENT AS A STATE MACHINE",
          "The agent node routes to lookup_order or issue_refund or ends the run; after a tool the graph always returns "
          "to the agent, and a refund over $100 pauses for human approval first.",
          [[N("st", "START", "ink"), GAP(1), N("en", "END", "ink")],
           [N("ir", "issue_refund\ntool\n> $100: pause for approval", "red"), N("ag", "agent\nmodel", "blue"),
            N("lo", "lookup_order\ntool", "green")]],
          [("st", "ag"), ("ag", "en", "done", "ink"), ("ag", "lo", "asks for a tool", "green", "curve"),
           ("lo", "ag", "always back", "green"), ("ag", "ir", "refund needed", "red", "curve"),
           ("ir", "ag", "always back", "red")],
          ["Nodes do work; edges decide what runs next", "agent → next is conditional (the router)",
           "The router enforces the $100 rule in code", "Rules that must hold belong in edges"]),

    board("llamaindex-pipelines", "TWO PIPELINES MEET AT ONE STORE",
          "Ingest is a batch job that turns documents into nodes and writes them to the StorageContext; query is a request handler that only reads from it.",
          [[N("rd", "Readers", "ink"), N("doc", "Documents", "ink"),
            N("tf", "Transformations\nsplitter → extractors → embedder", "orange"), N("nd", "Nodes", "orange")],
           [N("sc", "StorageContext\nvector store · docstore · index store", "purple", 560)],
           [N("q", "Question\nembed the query", "blue"), N("rt", "Retriever", "blue"),
            N("pp", "Node postprocessors\nrerank · filter · window swap", "blue"), N("sy", "Synthesizer", "blue"),
            N("rs", "Response\n+ source_nodes", "green")]],
          [("rd", "doc"), ("doc", "tf"), ("tf", "nd"), ("nd", "sc", "write", "purple"),
           ("sc", "rt", "read", "purple", "dash"), ("q", "rt"), ("rt", "pp"), ("pp", "sy"), ("sy", "rs", "", "green")],
          ["Ingest: batch, minutes, on schedule or change", "Query: online, seconds, never embeds a document",
           "Mistake: from_documents() at server startup", "That re-embeds ≈3.5M tokens every deploy"],
          ["Ingest", "Store", "Query"]),

    board("mcp-roles", "HOST, CLIENTS, SERVERS",
          "The host runs the agent loop and keeps one client per server; each server wraps one system and sees only the requests its client sends.",
          [[N("h", "Host: the support agent service\nagent loop · model API · user · policies · approvals", "pink", 760)],
           [N("ca", "Client A", "blue", 260), N("cb", "Client B", "blue", 260), N("cc", "Client C", "blue", 260)],
           [N("so", "Orders server", "green", 260), N("sp", "Payments server", "green", 260), N("st", "Tickets server", "green", 260)],
           [N("bo", "Orders DB", "ink", 260), N("bp", "Payments API", "ink", 260), N("bt", "Ticketing SaaS", "ink", 260)]],
          [("h", "ca"), ("h", "cb"), ("h", "cc"),
           ("ca", "so", "stdio", "blue"), ("cb", "sp", "HTTP", "blue"), ("cc", "st", "HTTP", "blue"),
           ("so", "bo", "", "green"), ("sp", "bp", "", "green"), ("st", "bt", "", "green")],
          ["Three servers = three clients, one session each", "Budgets and approvals stay in the host",
           "A server never sees the conversation", "A server knows nothing of the model or its peers"],
          ["Host", "Clients", "MCP servers", "Systems"]),

    board("memory-context-window", "THE WINDOW IS THE ONLY MEMORY",
          "Your code assembles the context for every model call from up to six kinds of content; long-term memory lives outside it and must be read in and written out.",
          [[N("sys", "System\nrole · rules · policies", "blue"), N("tools", "Tools\nfixed per agent", "blue"),
            N("mem", "Memories\nthis user + request", "purple"), N("conv", "Conversation\nuser + model turns", "orange"),
            N("res", "Tool results\ngrows every step", "orange"), N("out", "Output room\nreserved, empty", "ink")],
           [N("st", "Long-term store\noutside the window", "teal", 360)]],
          [("st", "mem", "read in", "teal", "dash"), ("conv", "st", "write out", "teal", "dash")],
          ["Not in the window = the model cannot know it", "Working memory: what stays in the message list",
           "Long-term memory: what you write out and read back", "Memory is a read path and a write path you design"],
          ["One model call", "Outside"]),

    board("moe-all-to-all", "ONE MOE LAYER ACROSS GPUS",
          "With expert parallelism every MoE layer is two all-to-all exchanges: dispatch each token to the GPUs holding its experts, then combine the results back on its home GPU.",
          [[N("at", "Attention\ndense, every GPU, its own tokens", "blue"), N("ro", "Router\n2 experts per token", "orange"),
            N("d", "All-to-all #1: dispatch\nsend tokens to their experts' GPUs", "red")],
           [N("nx", "Next layer", "ink"), N("c", "All-to-all #2: combine\nresults to home GPU, weight by g_i", "red"),
            N("ex", "Experts\neach GPU runs its own experts", "green")],
           [N("tr", "Traffic for a batch of 4,096 tokens\none all-to-all: 4,096 tokens × 2 experts × 4,096 wide × 2 bytes = about 67 MB\n2 per layer × 32 layers = about 4.3 GB per forward pass", "purple", 1100)]],
          [("at", "ro"), ("ro", "d"), ("d", "ex"), ("ex", "c"), ("c", "nx")],
          ["Experts 0, 1 on GPU 0; 2, 3 on GPU 1; and so on", "Keep EP inside one NVLink node",
           "A hot expert gets more compute and more traffic", "Every other GPU waits for the slowest"],
          ["Dispatch", "Combine", "Traffic"]),

    board("multi-agent-orchestrator", "ORCHESTRATOR AND WORKERS",
          "The orchestrator writes one brief per complaint, twelve workers investigate in parallel in fresh contexts, and their short reports come back for synthesis.",
          [[N("pl", "Orchestrator: plan\n12 complaints → 12 briefs", "pink", 460)],
           [N("w1", "Worker 1\nfresh context", "blue"), N("w2", "Worker 2\nfresh context", "blue"),
            N("w3", "Worker 3\nfresh context", "blue"), N("wn", "Workers 4–11\nsame shape", "blue"),
            N("w12", "Worker 12\nfresh context", "blue")],
           [N("sy", "Orchestrator: synthesis\n12 reports (≈4,800 tokens) → incident report", "pink", 620)]],
          [("pl", "w1"), ("pl", "w2"), ("pl", "w3", "brief"), ("pl", "wn"), ("pl", "w12"),
           ("w1", "sy", "", "green"), ("w2", "sy", "", "green"), ("w3", "sy", "400-token report", "green"),
           ("wn", "sy", "", "green"), ("w12", "sy", "", "green")],
          ["Brief: order id · question · fields · tools · turn limit", "Workers: read-only tools, 10 calls each",
           "Each starts at ≈3,100 tokens, peaks ≈9,800", "vs one agent: ≈36,000 tokens, ≈278 s, ≈$8.40"],
          ["Plan", "In parallel", "Synthesis"]),

    board("multimodal-projector", "HOW AN IMAGE BECOMES TOKENS",
          "The vision encoder turns the receipt into 576 patch vectors, the projector maps them into the LLM's embedding space, and they join the text tokens in one sequence.",
          [[N("img", "Receipt image", "ink"), N("enc", "Vision encoder\nViT · 576 patches · width 1,024", "purple"),
            N("pj", "Projector\nMLP: 1,024 → 4,096", "orange")],
           [N("sx", "System text tokens", "blue"), N("vt", "576 visual tokens\nfor the receipt", "orange"),
            N("ux", "User text tokens\n\"Extract the receipt...\"", "blue")],
           [N("llm", "LLM\none sequence, attends to every position", "green", 560)]],
          [("img", "enc"), ("enc", "pj"), ("pj", "vt", "576 vectors", "orange"),
           ("sx", "llm", "", "green"), ("vt", "llm", "", "green"), ("ux", "llm", "", "green")],
          ["To the LLM the image is 576 more positions", "Stage 1: train only the projector",
           "Stage 2: unfreeze the LLM, instruction-tune", "Compress: 2 × 2 merge or a resampler (e.g. 64)"],
          ["Vision", "Sequence", "Language"]),

    board("pinecone-serverless", "SERVERLESS: STORAGE APART FROM COMPUTE",
          "Writes land in a durable log, show up in a fresh layer within seconds, and are built into immutable index files in object storage; query nodes cache those files and search them with the fresh layer.",
          [[N("up", "Upsert", "ink"), N("lg", "Write log\ndurable, acknowledged", "orange"),
            N("ib", "Index builder", "orange"), N("ix", "Index files\nimmutable, object storage", "purple")],
           [N("fr", "Fresh layer\nrecent writes, searchable in seconds", "teal")],
           [N("q", "Query", "ink"), N("qn", "Query nodes\nsearch files + fresh layer\nmerge · filter", "blue", 420),
            N("tk", "Top-k results", "green")]],
          [("up", "lg"), ("lg", "ib"), ("ib", "ix"), ("lg", "fr", "", "teal"),
           ("fr", "qn", "", "teal"), ("ix", "qn", "cache files", "purple", "dash"), ("q", "qn"), ("qn", "tk", "", "green")],
          ["Upsert returns when logged, not when searchable", "Tests: poll fetch by id before asserting",
           "Storage is cheap; compute is paid per query", "Cold namespace: first query is slower"],
          ["Write", "Fresh", "Read"]),

    board("rag-pipeline-paths", "TWO PIPELINES, OFFLINE AND ONLINE",
          "The indexing path runs on every document change; the query path runs per question, and its latency budget shows that generation, not retrieval, dominates.",
          [[N("src", "Source docs", "ink"), N("pc", "Parse + clean", "orange"), N("dd", "Dedupe", "orange"),
            N("ck", "Chunk\n+ heading paths", "orange"), N("em", "Embed", "purple"),
            N("ix", "Index\nvectors · BM25 · metadata · ACLs", "purple")],
           [N("s1", "1 Question\n+ history + account", "ink"), N("s2", "2 Rewrite\nfollow-ups only\n0–400 ms", "blue"),
            N("s3", "3 Hybrid retrieve\nBM25 50 || vectors 50\n20–40 ms", "blue"),
            N("s4", "4 Fuse + rerank\nRRF · 50 → keep 6\n30–80 ms", "blue")],
           [N("s7", "7 Verify citations\nanswer · regenerate · abstain\n10–300 ms", "red"),
            N("s6", "6 Generate, streamed\nfirst token 300–800 ms\nfull answer 2–4 s", "green"),
            N("s5", "5 Assemble context\nwithin token budget\n< 5 ms", "blue")]],
          [("src", "pc"), ("pc", "dd"), ("dd", "ck"), ("ck", "em"), ("em", "ix"),
           ("ix", "s3", "", "purple", "dash"),
           ("s1", "s2"), ("s2", "s3"), ("s3", "s4"), ("s4", "s5"), ("s5", "s6"), ("s6", "s7")],
          ["Before generation: ≈100 ms on a first turn", "Users feel first token: stream the answer",
           "An LLM rewrite can double pre-generation time", "Chunk: text · heading path · source · ACL groups"],
          ["Offline", "Online", ""]),

    board("reference-architectures-design", "THE EXPENSE ASSISTANT ON ONE PAGE",
          "One front door routes each message to the simplest shape for its job: retrieval for policy questions, a batch workflow for report checks, an agent only for claim fixes. Every handler calls models through one model gateway.",
          [[N("emp", "Employee", "ink", 460), N("api", "API gateway\nauth · region · quotas · streaming", "orange", 460), GAP(1, 460)],
           [GAP(2, 460), N("rt", "Router\nsmall model, one-word label", "orange", 460), N("oos", "Out of scope\nask one clarifying question", "red", 460)],
           [N("qa", "Policy Q&A\nretrieve with ACL filter\nrerank\nanswer with citations", "purple", 460),
            N("rc", "Report check (async)\nqueue → extract receipts in parallel\nsmall model, batch API\ncode applies the rules\nexplain violations · notify", "blue", 460),
            N("cf", "Claim fix (agent)\ntools: read claims, propose change\nstep cap + token budget\nuser approves a summary\nfinance API: idempotent, audited", "pink", 460)],
           [N("mg", "Model gateway\nkeys · retries · fallback provider · cost per feature", "ink", 900)],
           [N("tr", "Traces + release IDs", "teal"), N("gd", "Guardrails", "teal"), N("ca", "Caches", "teal"), N("eg", "Eval gates", "teal")]],
          [("emp", "api"), ("api", "rt"), ("rt", "oos", "", "red"), ("rt", "qa", "", "purple"), ("rt", "rc", "", "blue"),
           ("rt", "cf", "", "pink"), ("qa", "mg"), ("rc", "mg"), ("cf", "mg")],
          ["The model extracts, code decides", "Access control lives in the retrieval query",
           "The agent proposes; code executes after approval", "About $82 a day for 10,000 employees"],
          ["Front door", "Route", "Three jobs", "Shared", "Cross-cutting"]),

    board("rlhf-ppo-loop", "ONE PPO ITERATION, FOUR MODELS",
          "Each iteration generates with the current policy, scores with the frozen reward and reference models, estimates advantages with the value model, then updates policy and value. Two of the four models are trained.",
          [[N("gen", "1 · Generate\npolicy samples responses\nfor a batch of prompts", "blue"),
            N("sc", "2 · Score\nreward model: score\nreference: KL per token", "purple"),
            N("adv", "3 · Advantages\nvalue model, per token", "orange"),
            N("up", "4 · Update\nclipped PPO objective\npolicy + value model", "green")],
           [N("p", "Policy\ntrained · 112 GB", "green"), N("v", "Value model\ntrained · 112 GB", "green"),
            N("r", "Reward model\nfrozen · 14 GB", "ink"), N("ref", "Reference\nfrozen · 14 GB", "ink")]],
          [("gen", "sc"), ("sc", "adv"), ("adv", "up"), ("up", "gen", "repeat with the updated policy", "green", "curve")],
          ["Reward used = score − β · KL to the reference", "The clip (ε ≈ 0.2) keeps each update proximal",
           "≈ 252 GB before activations, for a 7B policy", "Generation is redone every iteration: slow"],
          ["One iteration", "Memory at 7B"]),

    board("semantic-cache-lookup", "TWO TIERS BEFORE THE FULL PIPELINE",
          "A question is scoped first, then tried against an exact cache and a semantic cache; only a miss on both runs the full RAG pipeline, whose checked answer is stored for next time.",
          [[N("q", "Question", "ink", 280), N("sc", "Build scope\ntenant · permissions\nlocale · versions", "orange", 280),
            N("t1", "Tier 1: exact\nnormalised text\n≈ 1 ms", "blue", 280), N("em", "Embed question\n≈ 10–20 ms", "purple", 280),
            N("t2", "Tier 2: semantic\nnearest cached question\nin this scope, ≈ 5–10 ms", "purple", 280)],
           [GAP(1, 280), GAP(2, 280), GAP(3, 280), N("ans", "Stored answer\n+ its citations", "green", 280),
            N("th", "Close enough?\nsimilarity ≥ threshold\noptional verifier", "orange", 280)],
           [GAP(4, 280), GAP(5, 280), N("st", "Store entry\nquestion · embedding\nanswer · cited docs\nscope · timestamp", "teal", 280),
            N("ad", "Admission check\npassed output checks?", "orange", 280), N("rag", "Full RAG pipeline\nanswers the user\n≈ 2.8 s", "red", 280)]],
          [("q", "sc"), ("sc", "t1"), ("t1", "em", "miss"), ("em", "t2"), ("t1", "ans", "hit", "green"), ("t2", "th"),
           ("th", "ans", "yes", "green"), ("th", "rag", "no", "red"), ("rag", "ad"), ("ad", "st")],
          ["Scope is matched exactly, before similarity", "The threshold is a classifier: measure it",
           "A hit costs tens of milliseconds", "A miss costs almost nothing extra"]),

    board("serving-parts", "FOUR LAYERS, ONE JOB EACH",
          "A request passes the gateway (about the caller), the router (which replica) and an engine replica, whose scheduler, KV manager and model runner repeat one forward pass per iteration and stream tokens back.",
          [[N("cl", "Client", "ink", 380), N("gw", "Gateway\nauth · quotas\nrate limits · request logs", "orange", 380),
            N("rt", "Router\npicks the replica\nload · prefix · model / adapter", "blue", 380), N("en", "Engine replica\none GPU", "purple", 380)],
           [GAP(1, 380), N("mr", "Model runner\nthe forward pass", "purple", 380), N("kv", "KV manager\nblocks per sequence", "purple", 380),
            N("sch", "Scheduler\nwho runs this step", "purple", 380)]],
          [("cl", "gw"), ("gw", "rt"), ("rt", "en"), ("mr", "cl", "streams tokens back (SSE)", "green", "dash"),
           ("en", "sch", "", "purple"), ("sch", "kv", "", "purple"), ("kv", "mr", "", "purple"),
           ("mr", "sch", "next iteration", "purple", "curve")],
          ["Route on outstanding tokens, not request count", "Prefix affinity reuses a conversation's KV cache",
           "Engines are stateful: drain before a deploy", "Scale on queue depth, KV usage and p95 TTFT"],
          ["Request path", "Inside the engine"]),

    board("voice-agents-pipeline", "THE CASCADED VOICE PIPELINE",
          "Caller audio flows through VAD, streaming STT and endpointing to the LLM, then streaming TTS back to the caller. If the caller speaks while the agent talks, barge-in stops the audio and cancels generation.",
          [[N("in", "Caller audio\n20–30 ms frames", "ink", 380), N("vad", "VAD\nspeech or not, per frame", "orange", 380),
            N("stt", "Streaming STT\nfinal words: 100 ms", "blue", 380), N("ep", "Endpointing\nwait: 300 ms", "orange", 380)],
           [N("out", "Caller hears it\n+ 150 ms network", "ink", 380), N("tts", "Streaming TTS\nfirst audio: 120 ms", "green", 380),
            N("llm", "LLM (+ tools)\nfirst token: 300 ms", "purple", 380), GAP(1, 380)]],
          [("in", "vad"), ("vad", "stt"), ("stt", "ep"), ("ep", "llm"), ("llm", "tts"), ("tts", "out"),
           ("vad", "tts", "barge-in: stop TTS", "red", "dash")],
          ["Latency is won by overlap, not faster parts", "Streamed ≈ 1,070 ms; speculative ≈ 720 ms",
           "Barge-in also cancels the in-flight LLM", "History keeps only what the caller heard"],
          ["Listen", "Reply"]),

    board("what-is-an-agent-workflow", "A WORKFLOW: CODE OWNS THE CONTROL FLOW",
          "The duplicate-charge workflow: code fixes the order of steps and the branch; the model is used twice, once to classify and once to write the reply.",
          [[N("m", "Message", "ink"), N("go", "get_order", "blue"), N("gc", "get_charges", "blue"),
            N("dup", "Duplicate?\nLLM classifies", "purple"), N("rf", "refund", "blue"), N("wr", "Write reply\nLLM writes", "purple")],
           [GAP(1, 200), GAP(2, 200), GAP(3, 200), N("esc", "Escalate\nto a human", "orange"), GAP(4, 200), GAP(5, 200)]],
          [("m", "go"), ("go", "gc"), ("gc", "dup"), ("dup", "rf", "yes", "green"), ("rf", "wr"), ("dup", "esc", "no", "red")],
          ["The model is a classifier, then a writer", "Code decides the order, the branch and the end",
           "2 model calls, about $0.0081", "Read the code and you can predict the steps"]),

    board("what-is-an-agent-loop", "AN AGENT: THE MODEL PICKS THE NEXT STEP",
          "The agent loop: the model reads everything so far and either chooses a tool call, which your code runs and returns as an observation, or chooses to answer and stop. Your code still stops it after N steps.",
          [[N("g", "Goal", "ink"), N("mo", "Model\nreads everything so far\nchooses the next step", "purple", 380), N("rp", "Reply", "green")],
           [N("cd", "Your code runs the tool\nchecks permissions\nstops the loop after N steps", "blue", 420),
            N("ob", "Observation\nresult or error,\nadded to the history", "orange", 420)]],
          [("g", "mo"), ("mo", "rp", "answer and stop", "green"), ("mo", "cd", "tool + arguments", "blue"),
           ("cd", "ob"), ("ob", "mo", "", "orange")],
          ["Agent = the model decides the control flow", "Steps are unknown in advance: 2 or 9",
           "The loop is yours: tools, limits, permissions", "Test: can you predict the steps from the code?"]),
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
