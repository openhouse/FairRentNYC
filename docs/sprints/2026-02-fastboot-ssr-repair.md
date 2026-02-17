<!-- File: docs/sprints/2026-02-fastboot-ssr-repair.md -->

# Sprint Strategy: FastBoot SSR Repair on `repair/reset`

**Branch:** `repair/reset`  
**Baseline:** reset branch created from commit `9ee7b7b`  
**Sprint theme:** Make FastBoot SSR _boring_ (deterministic + repeatable) on local + CI + Dokku.

---

## Why this sprint exists

FairRentNYC is an older Ember app with cross-era dependencies. Recent work attempted to enable FastBoot SSR while also changing multiple system “axes” at once (Node/tooling, deploy lifecycle, runtime deps, build output assumptions). That created a failure mode where:

- installs can drift,
- production-only pruning can break runtime,
- local dev and deploy behave differently,
- and “fixes” become hard to attribute.

This sprint intentionally prioritizes **confidence over velocity**.

---

## Goals

### Primary goals (must hit)

1. **One canonical SSR contract** that works locally and is identical in CI.
2. **FastBoot build output is real** (we are actually producing a FastBoot-capable `dist/`).
3. **Prod-shaped runtime works after pruning devDependencies** (mirrors Dokku/Herokuish behavior).
4. **Dokku deploy runs the same lifecycle** (build → prune → start → curl check).

### Secondary goals (nice to have)

- Reduce “mystery runtime deps” by documenting exactly why each FastBoot runtime dep exists.
- Add a short “debug playbook” so future contributors can recover quickly.

### Non-goals (explicitly out of scope for this sprint)

- Major Ember upgrades / Embroider migration / sweeping lint modernization.
- “Babel surgery” or custom compiler rewrite plugins as a first-line fix.
- Live-reloading SSR dev environment. (We want SSR correctness first.)

---

## Working agreements (guardrails)

### 1) One axis per PR

Each PR must primarily touch **one** of these axes:

- **Axis A:** CI / smoke-test harness correctness
- **Axis B:** FastBoot build output correctness (producing the right `dist/`)
- **Axis C:** Runtime dependency correctness after prune
- **Axis D:** Dokku deploy parity with CI contract
- **Axis E:** SSR-safe app code guards (window/document, browser-only addons)

If a change spans multiple axes, split it into multiple PRs.

### 2) Determinism is the default

- Prefer `npm ci` over `npm install` for normal development.
- Treat `package-lock.json` as authoritative; update it only in intentional dependency PRs.
- If a transitive dependency must be pinned, do it explicitly and document the “why”.

### 3) No patch stacking

If we hit a build/runtime incompatibility:

- we write down the exact failure (error message + where it happens),
- we choose **one** strategy to address it,
- we verify it via the smoke test,
- and we avoid layering multiple speculative mitigations.

---

## Canonical local workflows

### Local browser dev loop (fast)

```bash
nvm use
npm ci
npm run start:dev
# visit http://localhost:4200

===

<!--
Repo path: docs/sprint-2026-02-fastboot-ssr-repair.md
Branch: repair/reset (reset from commit 9ee7b7b)
-->

# Sprint Strategy: FastBoot SSR Repair (local + Dokku) on `repair/reset`

## Why this sprint exists
FairRentNYC is an older Ember application that we want to keep developing forward.

Over the last couple of weeks, we pushed on multiple axes at once:
- Modern Node/toolchain expectations
- FastBoot SSR (server-side rendering)
- Dokku deployment behavior
- Dependency alignment across “eras” of Ember and JS tooling

That created a failure mode where “it breaks” but it’s unclear **which** axis broke it.

This sprint is about making FastBoot SSR **boring and repeatable** again.

## North Star
**One command** should tell us if SSR is healthy in a production-shaped environment:

- `npm run test:fastboot-smoke`

If that passes locally and in CI, we’re allowed to modernize.
If it fails, we fix SSR before doing anything else.

## The production-shaped lifecycle we standardize on
We treat SSR as a runtime boundary with an explicit lifecycle:

1. Deterministic install: `npm ci`
2. Production build: `npm run build`
3. Production-like runtime (no devDependencies): `npm prune --omit=dev`
4. Boot the FastBoot server: `npm start`
5. Verify SSR via curl + known HTML marker on `/`

This same lifecycle must be used for:
- Local verification
- CI
- Dokku deployment

## Working agreements (how we avoid “compatibility hell”)
### 1) One axis per PR
Each PR may touch only one axis:
- A) SSR runtime correctness (FastBoot sandbox/runtime deps/globals)
- B) Deployment lifecycle parity (Dokku build/prune/start)
- C) Toolchain determinism (Node/npm pinning, lockfile discipline, CI rules)
- D) Ember modernization (framework/addon upgrades)

No mixed PRs.

### 2) Lockfile discipline is non-negotiable
- Use `npm ci` for installs.
- Never land a PR that changes `package.json` without the matching `package-lock.json`.
- Avoid “drive-by” dependency upgrades in unrelated PRs.

### 3) Treat FastBoot as a sandbox, not “Node but server”
FastBoot runs application code in a sandboxed environment.
Assume browser globals are missing and must be explicitly provided or guarded.

Rule of thumb:
- If it relies on `window`, `document`, DOM APIs, or browser-only libraries → guard it for SSR.
- If it relies on `fetch`, `ReadableStream`, etc. → make it explicit via `config/fastboot.js` if needed.

## Definition of Done (for this sprint)
By end of sprint, we want:

### Local
- `nvm use` (Node 20.x)
- `npm ci`
- `npm test`
- `npm run test:fastboot-smoke` ✅ consistently

### CI
- All checks green, including FastBoot smoke test

### Dokku
- Deploy builds successfully
- Runtime boots FastBoot server
- Curl `/` returns SSR HTML consistently (same marker expectations as smoke test)

## Planned PR sequence (small, gated steps)

### PR #1 — Make FastBoot sandbox globals explicit (no upgrades)
Goal: fix the most common “FastBoot works locally but not in sandbox” problems by explicitly providing required globals.

Work:
- Add `config/fastboot.js` with `buildSandboxGlobals`:
  - `fetch`, `Headers`, `Request`, `Response`
  - `AbortController`
  - `ReadableStream`, `WritableStream`, `TransformStream` (fallback to `node:stream/web` when needed)
- Update `fastboot-server.js` to load that config and pass it into `FastBootAppServer` (parity with recommended patterns).
- Keep scope tight: no dependency upgrades.

Success:
- Smoke test is more likely to fail for “real app SSR issues” rather than missing runtime primitives.

### PR #2 — Make the smoke test maximally trustworthy
Goal: ensure smoke test failures are actionable (not false positives).

Work:
- Reformat `scripts/ci-fastboot-smoke.sh` for readability and better debugging output:
  - Clear logs
  - Clear failure messaging
  - Print the first N lines of server log on failure
- Optional improvement: test both before-prune and after-prune (Dokku parity).

Success:
- When it fails, we know *why* within 2 minutes.

### PR #3 — Dokku parity audit (build vs runtime)
Goal: ensure Dokku runs the exact same lifecycle as local smoke test.

Work:
- Confirm build stage installs devDeps, runs build, then prunes devDeps (or equivalent).
- Confirm runtime starts `npm start`.
- Document required Dokku config/env in README or docs.

Success:
- No “works locally, fails on Dokku” surprises caused by lifecycle mismatches.

### PR #4 — SSR-safe app code passes on real routes
Goal: fix remaining SSR crashes caused by browser-only code paths.

Work:
- Add SSR guards where needed (maps/leaflet usage, direct DOM access, etc.)
- Prefer graceful degradation on SSR; hydrate on client.

Success:
- SSR returns meaningful HTML for `/` and key routes without server crashes.

## Notes / reminders
- The goal is not “latest versions.” The goal is “repeatable builds + stable SSR contract.”
- Modernization resumes only after SSR is boring.

===

<!-- File: docs/sprints/2026-02-fastboot-ssr-recovery.md -->

# Sprint Strategy: FastBoot SSR Recovery (repair/reset)

**Branch:** `repair/reset`
**Baseline commit:** `9ee7b7b`
**Sprint theme:** Make FastBoot SSR boring again (local + Dokku), then modernize safely.

---

## Why this sprint exists

FairRentNYC is an older Ember app with “cross-era dependencies” (older Ember/Ember CLI expectations + newer Node/tooling realities).

FastBoot SSR work recently became a loop of reactive fixes (runtime deps, pruning behavior, deploy hooks, Babel/runtime experiments). The failure mode of that loop is predictable: each fix changes the system, which changes the symptoms, which makes it harder to know what was actually broken.

This sprint resets us to a calmer baseline (`repair/reset` from `9ee7b7b`) and reintroduces SSR and deploy confidence in **small, test-gated steps**.

---

## Goals (Definition of Done)

By end of sprint, we want:

1. **Local SSR is deterministic**
   - `npm ci`
   - `npm run build` (FastBoot SSR build)
   - `npm start`
   - `curl /` returns SSR HTML reliably
   - `npm run test:fastboot-smoke` passes consistently

2. **Dokku SSR is deterministic**
   - Dokku build produces the same SSR artifact as local
   - Runtime boots `fastboot-server.js` with no missing-module crashes
   - “Works after prune” (devDependencies are not required at runtime)

3. **Guardrails prevent re-entering dependency hell**
   - CI enforces the FastBoot smoke test
   - Dependency changes are small, deliberate, and documented
   - We avoid speculative compiler/Babel hacks unless we have a minimal reproduction

---

## Non-goals (this sprint)

- No “live-reloading SSR dev mode” perfection. The win is **production SSR correctness**, not a fancy DX.
- No major Ember upgrade jumps while SSR is still unstable.
- No experimental Babel plugins / module-rewrite hacks unless we can prove necessity with a minimal reproduction.

---

## The Golden Contract (Local == CI == Dokku)

We treat FastBoot as a production runtime boundary. The canonical flow is:

1) Install deterministically
- `npm ci`

2) Build SSR artifact
- `npm run build`
  (this must produce a FastBoot-capable `dist/`)

3) Mimic production pruning
- `npm prune --omit=dev`
  (the running server must not rely on devDependencies)

4) Boot the FastBoot server
- `npm start` (runs `node fastboot-server.js`)

5) Verify SSR output
- `curl http://127.0.0.1:$PORT/`
- Assert a known SSR marker string is present in HTML

**CI enforces this via:** `./scripts/ci-fastboot-smoke.sh` (build → prune → start → curl → assert).
If CI is green, Dokku should be “mechanically the same.”

---

## Working agreements (how we avoid brambles)

### One axis per PR
Each PR must primarily change ONE of:
- SSR build artifact correctness
- SSR runtime dependencies / sandbox globals
- App code FastBoot-compatibility (guards for browser-only code)
- Deploy lifecycle parity (Dokku build/start)
- Modernization upgrades (Ember/tooling) — only after SSR is stable

### Deterministic installs
- Use `npm ci`, not ad hoc `npm install`, on shared branches.
- When changing dependencies, always commit `package.json` + `package-lock.json` together.
- Prefer `overrides` for transitive pins, and document why.

### Runtime deps live in `dependencies`
If the FastBoot server needs it at runtime (post-prune), it must be in:
- `dependencies` (not `devDependencies`)
- and in `fastbootDependencies` if required from within the sandbox.

---

## Planned PR sequence

### PR #1 — Make the SSR build artifact real (no functional changes beyond build wiring)
**Intent:** Ensure `npm run build` produces FastBoot SSR output (not browser-only output), so the smoke test is testing the real thing.

Expected changes:
- Update `package.json` so `npm run build` uses `ember fastboot:build --environment=production`
- Keep `build:browser` for browser-only builds
- Update README “Building” section to match reality

Acceptance:
- CI runs FastBoot smoke using the correct SSR build artifact.
- If smoke fails, the logs represent a real SSR runtime failure (not “we built the wrong artifact”).

### PR #2 — Centralize FastBoot server config + sandbox globals
**Intent:** Add `config/fastboot.js` and wire `fastboot-server.js` to consume it.
Use `buildSandboxGlobals(defaultGlobals)` for sandbox globals/polyfills when needed.

Acceptance:
- We can reason about SSR environment in one file.
- Fixes are made through supported FastBoot hooks (not ad hoc hacks).

### PR #3 — Fix app-level FastBoot incompatibilities
**Intent:** Address browser-only assumptions (e.g. `window`, `document`, Leaflet) via FastBoot guards.
Keep changes small and route-focused.

Acceptance:
- SSR succeeds on `/` and at least one additional route (if applicable).
- No runtime crash in FastBoot logs.

### PR #4 — Dokku parity tightening
**Intent:** Ensure Dokku build/start lifecycle matches the Golden Contract.
If necessary, add minimal configuration (e.g. Procfile) to make runtime intent explicit.

Acceptance:
- Staging deploy boots FastBoot SSR reliably.
- Post-deploy curl check succeeds.

---

## Debugging workflow (when smoke fails)

1) Run:
- `npm run test:fastboot-smoke`

2) If it fails, inspect:
- `/tmp/fairrentnyc-fastboot.log`
- `/tmp/fairrentnyc-fastboot-response.html`

3) Classify the failure:
- **Build artifact problem** (wrong dist shape / missing FastBoot manifest)
- **Missing runtime dependency post-prune**
- **Sandbox globals missing (fetch / AbortController / URL, etc.)**
- **App code executed in FastBoot that assumes DOM APIs**

4) Fix only one class per PR.

---

## Notes for future modernization (after SSR is stable)

Once SSR is boring:
- Upgrade Ember in small, compatible hops (prefer LTS-to-LTS style progress).
- Keep `ember-source`, `ember-cli`, `ember-cli-babel`, `ember-cli-fastboot`, and Node toolchain aligned intentionally.
- Do not mix “framework upgrade” + “deploy pipeline change” + “runtime polyfill change” in the same PR.

---

## Quick commands (for humans)

Local dev (client-side):
- `nvm use`
- `npm ci`
- `npm run start:dev`

SSR verification (production-shaped):
- `nvm use`
- `npm ci`
- `npm run build`
- `PORT=3100 npm start`
- `curl -i http://127.0.0.1:3100/`

CI parity smoke:
- `npm run test:fastboot-smoke`

===

<!-- File: docs/sprints/2026-02-fastboot-ssr-repair.md -->

# Sprint Strategy: FastBoot SSR Repair & Deterministic Deploy
Branch: `repair/reset`

## Why this document exists
We’re working on an older, cross-era Ember app. When SSR breaks, the failure mode can come from:
- build-time vs runtime dependency drift
- Node/toolchain drift between local/CI/Dokku
- “browser-only” code running during SSR
- layered mitigations (pins + plugins + deploy hooks) obscuring the root cause

This sprint is about making FastBoot SSR *boring and repeatable* on:
1) local, and
2) Dokku deploy

…without re-entering dependency compatibility hell.

---

## Baseline we are building from
**Reset point:** commit `9ee7b7b` (merged PR #16)
**Branch:** `repair/reset`

Why this baseline:
- It’s after the Ember/FastBoot alignment + host handling hardening.
- It is before the rapid cascade of “fix the next SSR failure” patches that added multiple moving parts at once.

What we are *not* doing:
- We are not merging back “compiler rewrite” experiments (Babel surgery, import suffix stripping) unless we can name the precise failing package and reproduce the issue in isolation.

---

## Sprint goals (Definition of Done)
By the end of this sprint:

### A) Local SSR is deterministic
From a clean checkout:
- `nvm use` (or equivalent Node version enforcement)
- `npm ci`
- `npm run build`
- `npm run test:fastboot-smoke`

…works consistently.

### B) Local SSR matches production shape
We must be able to run the production-shaped lifecycle locally:
- build with devDependencies available
- prune devDependencies
- start FastBoot server
- curl a real route and assert SSR output

### C) Dokku deploy matches the same contract
Dokku deploy must:
- run `npm run build` during buildpack compile
- run the runtime process via `npm start` (FastBoot server)
- successfully serve SSR HTML for `/` (and ideally at least one additional route)

### D) Dependency drift is controlled
- We use `npm ci` for reproducible installs.
- Any dependency change updates BOTH `package.json` and `package-lock.json` in the same PR.
- We avoid ad-hoc “just install the thing” fixes on shared branches.

---

## Non-goals (for this sprint)
- “Live-reloading SSR dev mode.” We’ll keep local dev fast (`ember serve`) and SSR verification separate.
- Major Ember upgrades. Modernization is a separate lane that happens *after* SSR is stable.

---

## Operating principles (guardrails)
1) **One axis per PR**
   Each PR must primarily be ONE of:
   - CI/test harness determinism
   - FastBoot SSR runtime correctness
   - Dokku lifecycle parity
   - App code SSR-safety guards
   - Modernization/upgrades (not in this sprint)

2) **Build-time vs runtime dependencies are different worlds**
   - Build-time tooling belongs in `devDependencies`.
   - Anything required by the running FastBoot server belongs in `dependencies`.
   - If the Ember app needs to `FastBoot.require()` a module, it must also be whitelisted in `fastbootDependencies`.

3) **Make “production-shaped local testing” mandatory**
   If it only fails on Dokku, we haven’t made the local smoke test production-shaped enough yet.

---

## Golden paths

### Local dev (client-side, fast iteration)
- `npm run start:dev` (aka `ember serve`)
- This is NOT our proof that SSR works.

### Local SSR verification (production-shaped)
Canonical SSR flow:
1) `npm ci`
2) `npm run build`
3) `npm run test:fastboot-smoke`

The smoke test should:
- build
- prune devDependencies
- start the FastBoot server
- curl `/`
- assert SSR output (not just “some HTML came back”)
- on failure, print actionable logs

### CI contract
CI must run the same smoke test, and it must be blocking (no “green but broken SSR”).

### Dokku contract
Dokku (Herokuish buildpack) will run `npm run build` during deploy if a `build` script is present.
Therefore:
- our `"build"` script must be the SSR-capable build
- `npm start` must run the FastBoot server from built `dist/`

---

## Work plan for this sprint

### PR #1 — Make the pipeline trustworthy (guardrails + smoke test)
Goal: remove “false green / false red” and eliminate config contradictions.

Scope:
- Align Node version documentation + enforcement (README, `.nvmrc`, CI).
- Make the FastBoot smoke test script readable and resilient:
  - clear failure messages
  - always prints server logs on failure
  - handles “server never returned a 200” cleanly
- Make README reflect the *actual* scripts in `package.json` (no contradictions).

Acceptance criteria:
- CI passes and failures are diagnosable from logs alone.
- A teammate can run the smoke test locally from a clean checkout.

### PR #2 — Fix actual SSR crashes (app-level SSR safety)
Goal: if the FastBoot server boots but SSR crashes at runtime, fix the root causes.

Scope:
- Identify browser-only code paths used during initial render (common culprits: Leaflet/maps, direct `window`/`document`, `localStorage`, `matchMedia`).
- Add FastBoot guards via the `fastboot` service checks.
- Prefer “guard at the boundary”:
  - component wrappers that render a placeholder in SSR
  - defer browser-only initialization to `didInsertElement` / client-only hooks

Acceptance criteria:
- `npm run test:fastboot-smoke` passes locally and in CI.

### PR #3 — Dokku parity pass (deployment lifecycle)
Goal: eliminate any differences between “passes locally/CI” and “fails on Dokku.”

Scope:
- Ensure Dokku buildpack installs what it needs to build.
- Ensure `npm run build` produces the correct `dist/` artifacts.
- Ensure runtime has all SSR-required dependencies after pruning devDependencies.
- Add a simple post-deploy manual check procedure (curl + log inspection).

Acceptance criteria:
- Deploy to staging works and serves SSR for `/`.

### PR #4 — Document the compatibility set (and freeze it)
Goal: reduce future “compatibility hell.”

Scope:
- Add a short compatibility matrix:
  - Node + npm
  - ember-source
  - ember-cli
  - ember-cli-fastboot
  - fastboot-app-server
- Document the rule: no upgrades across more than one “era boundary” per PR.

Acceptance criteria:
- Anyone can see what set of versions constitutes “known-good” for SSR.

---

## Debugging checklist (when SSR fails)
When the smoke test fails, answer these in order:

1) Did the server start and stay alive?
   - If it exited, inspect the server log first.

2) Did curl ever get a 200 response?
   - If not, capture:
     - response code(s)
     - server log
     - whether the failure only occurs after `npm prune --omit=dev`

3) Is this a missing-module problem after pruning?
   - If yes:
     - move module from devDependencies -> dependencies
     - add to fastbootDependencies if the Ember app requires it

4) Is this a browser-only code path?
   - If yes:
     - guard it behind `fastboot.isFastBoot === false`
     - delay initialization to client-only hooks

---

## Working agreement
- We keep `repair/reset` as the protected “SSR lane.”
- Any modernization work happens on short-lived branches and merges back only when:
  - lint/test pass
  - FastBoot smoke test passes
  - Dokku parity is preserved

End state: SSR becomes a boring invariant, and modernization becomes tractable.

===

<!--
Path: docs/sprints/2026-02-fastboot-ssr-repair-reset.md
-->

# FastBoot SSR Repair Sprint Strategy (repair/reset)

**Branch:** `repair/reset`
**Baseline commit:** `9ee7b7b`
**Theme:** *Make SSR boring (repeatable, prune-proof, Dokku-shaped).*

This repo is an older Ember app being developed forward. This sprint is about stabilizing **FastBoot SSR** on both:
- Local verification (developer machine)
- Dokku deployment (production-shaped lifecycle)

We are treating SSR as a **contract** we can test, not a vibe we chase.

---

## Sprint goals

### G1 — Deterministic installs
- `npm ci` is the standard install path (local + CI + deploy build).
- Lockfile is authoritative: every dependency change updates both `package.json` **and** `package-lock.json`.

### G2 — One canonical SSR verification loop
We maintain a single “golden path” command sequence that mirrors production:

1. Build SSR artifacts into `dist/`
2. Prune devDependencies (simulate production slug/runtime)
3. Start the FastBoot server from `dist/`
4. `curl /` and assert an SSR marker string exists in the HTML output
5. Fail fast with actionable logs if anything breaks

### G3 — Dokku parity
Dokku deploy must follow the same lifecycle as our smoke test:
- install (dev deps available during build)
- build SSR output
- prune dev deps
- run `npm start`

### G4 — Reduce cross-era churn
During this sprint:
- **No speculative Babel surgery.**
- **No broad dependency upgrades.**
- **No “multi-axis” PRs.**

We are stabilizing the boundary first. Modernization comes after SSR is repeatable.

---

## Non-goals (explicitly not this sprint)

- Upgrading Ember/Ember CLI across major eras
- Refactoring application architecture
- Adding new product features unrelated to SSR stability
- “Perfect SSR dev mode” (hot reloading SSR). We only need SSR to be correct and repeatable.

---

## Working agreements

### One axis per PR
Every PR must primarily be one of:
1. **Guardrails / CI contract**
2. **FastBoot build + runtime correctness**
3. **Dokku build/runtime lifecycle**
4. **SSR-safety in app code** (guards for browser-only usage)

### Reproducibility discipline
- Prefer `npm ci` over `npm install`.
- If you change dependencies, you must:
  - explain *why*
  - pin/override with intent
  - keep the change as small as possible

### “Boring-first” debugging
- Before adding a new fix, make the failure **reproducible** via the smoke test.
- Prefer removing complexity over adding cleverness.

---

## Definition of Done (for this sprint)

We consider the sprint successful when:

### Local
- `npm ci`
- `npm run test`
- `npm run test:fastboot-smoke`

…passes reliably, including the prune step inside the smoke test.

### CI
- CI runs the same smoke test and is green on PRs.

### Dokku
- Dokku build produces SSR artifacts.
- Dokku runtime serves SSR HTML for `/` reliably (not blank, not erroring).
- No “works before prune, fails after prune” surprises.

---

## The SSR contract

### Canonical commands

**Local dev (browser)**
- `npm run start:dev` (aka `ember serve`)

**SSR verification (production-shaped)**
- `npm run test:fastboot-smoke`

### What the smoke test must enforce
- Build produces the correct SSR `dist/` shape
- Starting `npm start` serves from that `dist/`
- `/` responds successfully
- Response HTML includes a stable marker string
- On failure: show server logs and exit non-zero

---

## Sprint plan (PR-sized chunks)

### PR #1 — Make the SSR contract unambiguous
Owner: teammate
Scope:
- Ensure `npm run build` produces **FastBoot SSR output** (not browser-only output).
- Keep `npm run build:browser` as browser-only.
- Make `scripts/ci-fastboot-smoke.sh` trustworthy + readable:
  - clean `dist/` before building
  - assert expected SSR build artifacts exist
  - improve failure output (server logs + response snippet)
- Update README “Building” section to match the actual commands.

Acceptance:
- CI green.
- `npm run test:fastboot-smoke` is an accurate proxy for production.

### PR #2 — Dokku lifecycle parity (build runs SSR)
Owner: maintainer
Scope (choose one approach and document it):
- Ensure Dokku build runs the SSR build step (e.g. Heroku-style postbuild hook).
- Confirm runtime command is `npm start` and serves from `dist/`.

Acceptance:
- Deploy builds dist during slug compile.
- No manual steps required post-deploy.

### PR #3 — SSR runtime “prune-proofing”
Owner: maintainer + teammate
Scope:
- If SSR fails only after prune, move required modules into `dependencies`
- Ensure any FastBoot sandbox requires are whitelisted in `fastbootDependencies`

Acceptance:
- Smoke test passes pre/post prune consistently.

### PR #4 — SSR-safety patches (only if proven by smoke test)
Owner: maintainer
Scope:
- Add FastBoot guards around browser-only codepaths (window/document, map libs, etc.)
- Keep changes route-specific and minimal.

Acceptance:
- Smoke test demonstrates the fix.

---

## Debugging playbook (when something breaks)

1. Run the contract locally:
   - `npm ci`
   - `npm run test:fastboot-smoke`

2. If the server exits early:
   - Inspect the smoke test server log output
   - Look for missing-module errors (often prune/dependency placement)
   - Look for `window` / `document` access (missing FastBoot guards)

3. If SSR marker is missing but server stays up:
   - Confirm the build is actually producing SSR dist artifacts
   - Confirm the route `/` is rendering expected content server-side

---

## Notes / decision log

- **Baseline choice:** `repair/reset` from `9ee7b7b` is the last commit before heavier mitigation stacking. We will not “chase” changes from later commits without proving them via the SSR contract first.
- **Open decision:** toolchain-era alignment (Node/Ember CLI support matrix). We will address this after SSR is stable and the smoke test is authoritative.

===

# docs/sprints/repair-reset-fastboot-ssr-sprint.md

# Sprint Strategy: FastBoot SSR Stabilization (repair/reset)

**Branch:** `repair/reset`
**Baseline commit:** `9ee7b7b`
**Sprint theme:** Make FastBoot SSR *boring* (local + Dokku) by enforcing a deterministic, production-shaped contract and avoiding dependency drift.

---

## Why this sprint exists

This repo is an “elder Ember app” being developed forward. That’s doable, but it demands discipline because the dependency graph spans multiple eras (Ember 3.x conventions + modern Node tooling + deployment pruning behavior).

When SSR fails in this context, it often fails in *production-shaped* ways:
- It works with devDependencies installed, then fails after pruning.
- It works locally, then fails on Dokku due to build/install differences.
- It fails only under FastBoot because browser-only code executes during SSR.

This sprint is about making the build/run/deploy pipeline deterministic and then fixing SSR from a stable baseline without re-entering “compatibility hell.”

---

## Definition of Done

FastBoot SSR is considered “fully functional” when all of the following are true:

### Local
- `npm ci` succeeds consistently.
- `npm test` passes (or any known legacy failures are explicitly documented).
- **Production-shaped SSR check passes:**
  - build
  - prune devDependencies
  - start FastBoot server
  - `curl /` returns 200
  - response contains a FastBoot-specific marker (not just “some string”)
  - server does not crash / logs show no fatal SSR runtime errors

### Dokku
- Dokku build succeeds deterministically (same Node major, same lockfile behavior).
- Deployed app serves SSR HTML for `/` reliably.
- No “missing module” crashes at runtime (i.e. runtime deps are in `dependencies`, and FastBoot sandbox deps are whitelisted in `fastbootDependencies`).

---

## Sprint guardrails (how we avoid getting lost again)

### 1) One axis per PR
Every PR must be primarily about **one** of:
- **A. Observability / test harness** (smoke test, logging, docs)
- **B. SSR runtime correctness** (FastBoot guards, sandbox deps)
- **C. Deploy parity** (Dokku build/install/prune/start contract)
- **D. Modernization** (Ember/tooling upgrades)

If a change touches two axes, split it.

### 2) Deterministic installs only
- Prefer `npm ci` locally and in CI.
- Do not land “npm install” churn without intent.
- Any `package.json` change must be accompanied by a matching lockfile change in the same PR.

### 3) Treat FastBoot as a runtime boundary
- **Runtime deps** must be in `dependencies` (not `devDependencies`).
- **FastBoot sandbox deps** must be listed in `fastbootDependencies` (even if they are built-ins or transitive assumptions).
- Validate this by testing after pruning devDependencies locally (mirrors Dokku/Herokuish behavior).

---

## The canonical SSR verification loop (source of truth)

This is the “golden path” we want to keep green.

1) Install:
- `nvm use` (Node 20.x)
- `npm ci`

2) Build production dist:
- `npm run build`

3) Simulate production runtime:
- `npm prune --omit=dev`

4) Start FastBoot server:
- `PORT=3100 npm start`

5) Verify SSR:
- `curl -i http://127.0.0.1:3100/`

**SSR must be verified by a FastBoot-specific marker**, not only content strings.
Suggested markers:
- Presence of `<script type="fastboot/shoebox" ...>` (shoebox script tag)
- (Optionally) additional checks like “expected homepage content string”

---

## Dokku deployment parity

This repo deploys as a Node service running `npm start` (FastBoot server).

### Dokku requirements
- Use the Node buildpack.
- Ensure the build environment installs devDependencies (needed to run Ember build).
  - If Dokku/Herokuish prunes devDependencies, that’s fine — but they must be present at build time.
- Runtime must not depend on devDependencies.

### Post-deploy verification
After deploying to staging:
- `curl -i https://<staging-host>/`
- Confirm:
  - 200 response
  - SSR marker present (shoebox)
  - No runtime crash loops in logs

---

## Work plan (sequenced PRs)

### PR 1 — Make the contract truthful (no dependency changes)
Goal: Improve signal-to-noise so we stop debugging ghosts.

- Harden `scripts/ci-fastboot-smoke.sh`:
  - Assert a FastBoot-specific SSR marker (shoebox).
  - Keep the “expected homepage phrase” check as a secondary assertion.
  - Improve failure output (print headers/body snippet + server log on failure).
- Update README so it matches reality:
  - Node pin statement
  - what `scripts/fetch-council-districts.js` actually does
  - what `npm run build` actually runs
  - how Dokku build/install should be configured

Success: CI is green and local `npm run test:fastboot-smoke` is a trustworthy indicator.

### PR 2 — Fix SSR runtime crashes (small, targeted)
Goal: Make SSR complete without “window/document” or Leaflet/map crashes.

Typical approach:
- Guard browser-only imports/usage behind FastBoot checks
- Defer Leaflet initialization to after render in the browser
- Ensure no initializer touches DOM in SSR

Success: smoke test passes consistently, and server logs show no fatal SSR errors.

### PR 3 — Dokku parity + staging verification
Goal: Make staging behave like local/CI.

- Ensure build uses devDependencies at build time
- Ensure runtime has everything it needs after prune
- Add a simple “deploy verification checklist” to docs

Success: staging SSR works reliably and matches the smoke-test contract.

### PR 4+ — Modernize *after* SSR is boring
Goal: Begin modernization without destabilizing SSR.

- Upgrade in deliberate steps (LTS hops)
- Never mix upgrades with deploy changes
- Require smoke test green for every hop

---

## Debugging playbook (when SSR fails)

1) **Does the server boot?**
- If it exits immediately, read FastBoot server logs.

2) **Does `/` return 200?**
- If not 200, capture headers and body to see whether it’s a crash vs redirect vs asset issue.

3) **Is the SSR marker present?**
- If 200 but no marker: SSR likely didn’t run or returned non-SSR output.

4) **Is it a prune-only failure?**
- If it works before prune and fails after prune:
  - move required runtime packages from devDependencies → dependencies
  - and/or add to `fastbootDependencies`

5) **Is it a FastBoot-only runtime error?**
- Look for `window`, `document`, Leaflet, or other browser-only globals being referenced during SSR.
- Add FastBoot guards and defer browser-only initialization.

---

## Collaboration norms

- Keep PRs small.
- Prefer clarity over cleverness.
- If you fix something with a pin/override, document:
  - what broke
  - why the pin works
  - what the eventual removal plan is

This repo can absolutely move forward. The trick is to keep the “SSR lane” protected and boring, and do modernization as a sequence of small, verified steps.

===

<!-- File: docs/sprints/2026-02-fastboot-ssr-stabilization.md -->

# Sprint Strategy: FastBoot SSR Stabilization (repair/reset)

Branch: `repair/reset`
Baseline commit: `9ee7b7b`

## Why this sprint exists

FairRentNYC is a cross-era Ember app: older Ember/CLI assumptions + modern Node + FastBoot SSR + Dokku buildpack deployment. When multiple axes move at once (Node/toolchain, FastBoot runtime, Babel output, deploy lifecycle), failures become hard to attribute and easy to “patch-stack.”

This sprint is a reset: we are making SSR **deterministic**, **prune-proof**, and **deploy-shaped** before resuming modernization.

## Sprint goals (definition of “we shipped”)

By the end of this sprint:

1. **Local SSR works deterministically**
   - `npm ci`
   - `npm run build`
   - `npm prune --omit=dev`
   - `PORT=3100 npm start`
   - `curl http://127.0.0.1:3100/` returns SSR HTML (not an error page, not blank)

2. **CI enforces SSR**
   - GitHub Actions runs the same SSR smoke flow and fails loudly with actionable logs.

3. **Dokku buildpack deploy matches the same contract**
   - Build phase runs the SSR build (FastBoot dist is generated)
   - Runtime phase starts `fastboot-server.js` via `npm start`
   - No production-only “missing module after prune” surprises

## Non-goals (intentionally NOT doing this sprint)

- Upgrading Ember, Ember CLI, or major addon versions
- Introducing Babel runtime/helper experiments
- Adding custom compiler rewriting (ex: “strip .js extensions” plugins)
- Trying to perfect “SSR live reload dev workflow”
- Broad refactors unrelated to SSR determinism

## Operating principles (guardrails)

### 1) One axis per PR
Each PR must touch **one** of:
- SSR build correctness
- Runtime dependency hygiene (prune-proof)
- Dokku lifecycle parity
- CI guardrails / smoke harness quality
- SSR-safe app guards (browser-only code)

No mixed PRs.

### 2) Lockfile-first installs
- Use `npm ci` for deterministic installs.
- Avoid `npm install` unless the explicit goal is to change dependencies (and if so, do it in a dedicated PR with clear intent).

### 3) Production-shaped verification (the constitution)
Our canonical verification flow is:

1) build SSR dist
2) prune devDependencies
3) start FastBoot server
4) curl `/` and assert an SSR marker
5) dump logs on failure

If this flow isn’t green, we don’t “keep going anyway.”

## Contracts we are enforcing

### Build contract
- `npm run build` must generate a **FastBoot-capable** `dist/` suitable for `fastboot-app-server`.
- We will keep a separate command for browser-only output (ex: `npm run build:browser`).

### Runtime contract
- `npm start` runs the FastBoot server (`node fastboot-server.js`) against `dist/`.
- After pruning devDependencies, runtime must still work.

### SSR verification contract
- Curling `/` must return HTML containing a stable marker string (we currently use a phrase expected on the homepage).

### Prune contract
- Local verification must include `npm prune --omit=dev` to mimic buildpack behavior.
- Anything required at runtime belongs in `dependencies` and (if needed by the FastBoot sandbox) must be whitelisted in `fastbootDependencies`.

## Daily loops (how we work this sprint)

### Local dev loop (fast feedback)
- `npm run start:dev`
- Visit http://localhost:4200

### Local SSR loop (truth)
Run this exactly when making SSR changes:

- `nvm use` (Node 20.x)
- `npm ci`
- `npm run build`
- `npm prune --omit=dev`
- `PORT=3100 npm start`
- `curl -i http://127.0.0.1:3100/ | head`

### CI loop (must match local SSR loop)
CI should run:
- `npm ci`
- lint + tests
- FastBoot smoke script that performs: build → prune → start → curl → assert

## Work plan (PR sequence)

### PR #1 — Make the build + smoke harness truthful (highest priority)
Goals:
- Ensure `npm run build` actually builds FastBoot SSR output (not browser-only output).
- Refactor `scripts/ci-fastboot-smoke.sh` to be readable and reliable:
  - fail clearly if curl never succeeds
  - fail clearly if response is empty
  - fail clearly if SSR marker is missing
  - always print server logs on failure
  - always clean up the server process

Deliverables:
- `package.json` scripts updated so:
  - `build` produces FastBoot dist (SSR)
  - `build:browser` produces browser-only dist
- README “Building” section matches reality
- Smoke script is multi-line, commented, deterministic, and CI-friendly

### PR #2 — Align Node version messaging + tooling
Goals:
- Ensure `.nvmrc`, CI, and docs agree on a Node 20 version strategy.
- Reduce “works on my machine” variance.

### PR #3 — Runtime dependency audit (prune-proof)
Goals:
- Run the SSR loop after prune and fix missing-runtime-module failures.
- Ensure FastBoot sandbox whitelist is correct (`fastbootDependencies`).

### PR #4 — Dokku parity notes + post-deploy verification
Goals:
- Document the minimal Dokku config that makes the contract true.
- Add a “post-deploy curl check” step (manual is fine for now).

## Debugging playbook (when it breaks)

### If the server exits before responding
- Inspect the FastBoot server log emitted by the smoke script.
- Confirm `dist/` exists and looks like FastBoot output.
- Confirm runtime deps survived prune.

### If the server responds but SSR marker is missing
- Confirm the request is returning HTML (not redirecting to assets or error pages).
- Confirm FastBoot is actually rendering (not falling back to an empty shell).
- Print the first ~80 lines of the HTML response for context.

### If it only fails on Dokku
- Compare build output (did `build` run? did it run the correct command?)
- Confirm devDependencies were available during build and pruned after
- Confirm runtime is starting from the built `dist/`

## Decision log

- We reset to baseline commit `9ee7b7b` on branch `repair/reset` to escape recent dependency churn and re-establish a stable SSR contract.
- We will not “patch stack” (Babel/runtime hacks) until the harness and build lifecycle are verified and deterministic.
```
