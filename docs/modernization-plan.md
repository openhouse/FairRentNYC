# Modernization Plan (Ember-way, incremental)

This plan keeps FastBoot stable while upgrading the app in small, reviewable PRs.

## 1) Guardrails first (this PR)
- Replace Travis with GitHub Actions on Node `20.19.x`.
- Run `npm ci`, lint (`lint:js`, `lint:hbs`), and `npm test`.
- Add a FastBoot smoke test (`npm run build` + `npm start` + HTTP 200 HTML assertion).

## 2) Deterministic installs (this PR)
- Replace floating `git clone` for `council-districts` with a pinned GitHub archive download by commit SHA.
- Preserve the same `node_modules/council-districts` import paths used by `ember-cli-build.js`.
- Keep install idempotent by recording the pinned SHA in a generated stub package metadata field.

## 3) Remove addon packaging warning surface (this PR)
- Remove `ember-oil-pastels` addon dependency.
- Vendor the tiny SCSS palette files used by the app directly under `app/styles/`.
- This avoids addon JS preprocessor warnings and keeps styling behavior unchanged.

## 4) Ember upgrade ladder (future PRs)
1. **3.12 -> 3.28 LTS**
   - Use `ember-cli-update`.
   - Resolve deprecations with `ember-cli-deprecation-workflow`.
2. **3.28 -> 4.x LTS**
   - Validate FastBoot + routing redirects.
   - Revisit `ember-ajax` and legacy polyfill assumptions.
3. **4.x -> 5.x**
   - Remove jQuery integration when no longer needed.
   - Replace deprecated build addons (`ember-cli-uglify` -> `ember-cli-terser`).
4. **5.x -> 6.8 LTS**
   - Finalize Octane-era cleanup and stricter linting.

## 5) Warning debt reduction track (parallel)
- **Sass deprecations**: prioritize addon/framework upgrades first (bootstrap/ember-bootstrap), then migrate app SCSS from `@import` and slash division.
- **Style attribute binding warnings**: replace dynamic inline `style=` bindings with class-based patterns or validated helper output.

## Suggested next 2 PRs
1. First stepping-stone upgrade to Ember `3.28` + deprecation workflow baseline.
2. FastBoot package alignment (`ember-cli-fastboot` 4.x) with CI smoke test enforcement.
