import numpy as np

# ---- spec -------------------------------------------------------------
Q_PER_DAY, WORKDAYS, HOURS = 3000, 22, 8
PEAK_CONCURRENT, HEADROOM = 15, 3
P95_E2E, P95_FIRST = 6.0, 2.0
MONTHLY_CAP, PER_RESOLVED_CAP = 2500, 0.03

# ---- illustrative prices, $ per token (replace with current ones) -----
MID_IN, MID_OUT = 3e-6, 15e-6
SMALL_IN, SMALL_OUT = 0.25e-6, 1.25e-6
RETRIEVAL = 0.0004                    # query embedding + rerank

# Step 1-2: budget and load
monthly_q = Q_PER_DAY * WORKDAYS
print("ceiling per question  $%.3f" % (MONTHLY_CAP / monthly_q))           # 0.038
rate = PEAK_CONCURRENT / 4.5                                             # Little: L = lambda*W
print("peak req/min %.0f, input tokens/min %.0f" % (rate * 60, rate * 60 * 3900))

# Step 3: latency, lognormal noise per hop, router and retrieval serial vs parallel
def latency(parallel, ttft_median, n=200_000):
    rng = np.random.default_rng(0)
    hops = {"gateway": (0.02, .3), "router": (0.45, .35), "embed": (0.08, .4),
            "search": (0.03, .5), "rerank": (0.20, .3), "ttft": (ttft_median, .4),
            "decode": (3.1, .2), "validate": (0.03, .3)}
    s = {k: m * np.exp(sd * rng.standard_normal(n)) for k, (m, sd) in hops.items()}
    retrieval = s["embed"] + s["search"] + s["rerank"]
    before = np.maximum(s["router"], retrieval) if parallel else s["router"] + retrieval
    first = s["gateway"] + before + s["ttft"]
    total = first + s["decode"] + s["validate"]
    return np.percentile(first, 95), np.percentile(total, 95)

for name, par, ttft in [("serial", False, 0.80), ("parallel", True, 0.80),
                        ("parallel + cached prefix", True, 0.65)]:
    f, t = latency(par, ttft)
    print(f"{name:26s} first p95 {f:.2f}s  end-to-end p95 {t:.2f}s")
f, t = latency(True, 0.65)
assert f <= P95_FIRST and t <= P95_E2E, "latency budget broken"

# Step 4: cost per path; agent context grows every call
router = 400 * SMALL_IN + 30 * SMALL_OUT
kb = router + 3500 * MID_IN + 250 * MID_OUT + RETRIEVAL
def agent(calls, prefix=1550, grow=380):
    tin = sum(prefix + k * grow for k in range(calls))
    tout = 100 * (calls - 1) + 200
    return router + tin * MID_IN + tout * MID_OUT
escalate = router + RETRIEVAL
blend = 0.80 * kb + 0.12 * agent(4) + 0.08 * escalate
resolved = 0.80 * 0.92 + 0.12 * 0.85
print("kb $%.4f  agent(4) $%.4f  agent(6) $%.4f" % (kb, agent(4), agent(6)))
print("per question $%.4f, per resolved $%.4f" % (blend, blend / resolved))
assert blend / resolved < PER_RESOLVED_CAP

# Step 5: abstain when P(wrong) exceeds cost ratio
print("answer only if P(wrong) < %.0f%%" % (100 * 4.50 / 150))

# Step 8: storage
print("vectors %.0f MB, traces over 2 years %.1f GB"
      % (40_000 * 1024 * 4 / 1e6, Q_PER_DAY * 5 * 2000 * WORKDAYS * 24 / 1e9))
