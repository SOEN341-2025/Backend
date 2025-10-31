# Code Smell Summary

Date: 2025-10-31
Branch: branch_DC-user-tests
PR: https://github.com/SOEN341-2025/Backend/pull/32

## Goal
Provide a concise, prioritized report of code smells discovered during a quick audit of the backend repository (models, utils, tests). This is a non-invasive audit — no code changes were made except test-only fixes previously requested.

## Scope (files inspected)
- utils/db.mjs
- models/event.mjs
- models/user.mjs
- models/organization.mjs
- models/role.mjs
- test/* (user.test.mjs, organization.test.mjs, event.test.mjs, role.test.mjs, jwt.test.mjs)

---

## Executive summary (top 6 smells)
1. Mixed test targets: some tests use persistent `./database.db` while others use `:memory:` (flaky / stateful tests).
2. Global mutable DB singleton in `utils/db.mjs` (fragile lifecycle & test interaction).
3. Repeated callback → Promise boilerplate across models (readability & duplication).
4. Inconsistent API return shapes and error types (strings vs Error objects, numeric vs boolean deletes).
5. Assumed seeded data (e.g., owner role) required by models — leads tests to seed manually.
6. Console logging and side-effects inside model code (noisy tests and production logs).

Each item below contains details, risk, and low-risk recommended actions.

---

## 1) Mixed test DB targets (High priority for tests)
- Symptom: `test/organization.test.mjs` originally used the on-disk DB while other suites used `db.init(':memory:')`.
- Risk: Persistent DB leads to non-deterministic tests, pollution of developer DB, and CI flakiness.
- Action taken: I updated `test/organization.test.mjs` to call `db.init(':memory:')`, `await db.createDB()` and ensure owner role exists.
- Recommendation (you own this):
  - Ensure every test file calls `db.init(':memory:')` + `await db.createDB()` in `beforeEach` or `beforeAll`.
  - Alternatively create a small test helper `test/helpers/dbTestSetup.mjs` and import it from each test so the pattern is enforced.
- Example quick change for a test file (beforeAll):
  - db.init(':memory:');
  - await db.createDB();
  - await Role.addRole('owner'); // seed required roles

## 2) Global mutable DB singleton (Medium-high)
- File: `utils/db.mjs`
- Symptom: `init(path)` mutates module-level `dbPath` and `dbInstance`; `getDB()` lazily opens a singleton.
- Risk: Tests or code calling `init()` concurrently with other code can race. Closing and reopening `dbInstance` mid-run can create subtle bugs.
- Recommendation (non-blocking):
  - Short term: document lifecycle and make `init()` return a Promise; make `close()` async. Keep current API but make lifecycle explicit.
  - Medium term: provide `createConnection(path)` that returns a connection object rather than relying on a module-level singleton. Then models can import a DB wrapper or accept the DB as an injected dependency.
- Low-risk improvement to apply later: add small async `init()`/`close()` contract and call these explicitly in tests/boot scripts.

## 3) Repeated callback→Promise boilerplate (Medium)
- Symptom: Many model functions wrap sqlite3 callbacks with `new Promise(...)` inline.
- Risk: Repetition increases chance of mistakes and makes refactors tedious.
- Recommendation: Add a small promisified helper in `utils/db.mjs`, e.g. `runAsync(sql, params)`, `getAsync(sql, params)`, `allAsync(sql, params)` implemented using `util.promisify` or custom wrappers. Refactor a few model functions to use them.
- Example helper:
  - const { promisify } = require('util');
  - export const runAsync = (sql, params=[]) => new Promise((res, rej) => db.run(sql, params, function(err){ if(err) rej(err); else res(this); }));

## 4) Inconsistent return types & error shapes (Medium)
- Symptom: `deleteUser` returns number-of-rows (this.changes) while `deleteEventById` returns boolean. Errors are sometimes rejected as strings (e.g., "Email or Password is wrong").
- Risk: Consumers and tests must handle multiple shapes; error stack and type information is lost when rejecting strings.
- Recommendation:
  - Standardize: CRUD Create => returns inserted ID (number), Read => object or null/undefined, Update/Delete => boolean true/false. Use `throw new Error(msg)` for errors.
  - Small step: change `deleteUser` to `resolve(this.changes > 0)` and change string rejects to `reject(new Error('...'))`.

## 5) Seeded data required by models (Medium)
- Symptom: `createOrganization` expects an owner role to exist; tests must add it manually.
- Risk: Missing seed leads to runtime errors; differences between local dev and CI.
- Recommendation:
  - Add idempotent seeds in `db.createDB()` such as `INSERT OR IGNORE INTO roles (name) VALUES ('owner')` so any DB created by `createDB()` has required roles.
  - Alternative: publish a `seedDefaults()` helper and call from bootstrap and tests.
- Note: Because you asked earlier not to change models now, I did not seed DB here — but adding `INSERT OR IGNORE` in `createDB()` is a low-risk improvement to consider later.

## 6) Logging/side-effects in models (Low → Medium)
- Symptom: `console.log` and `console.error` appear in model functions (e.g., `createOrganization`, `deleteUser`, `getDB`) printing database path or created IDs.
- Risk: Tests and production logs become noisy; tests depend on console output sometimes.
- Recommendation: Replace console.* statements with a logger that can be silenced in tests, or remove logs from hot-paths and log at controller/entrypoint instead.

---

## Small, low-risk fixes you can apply now (recommended order)
1. Tests: ensure every `test/*.mjs` calls `db.init(':memory:')` + `await db.createDB()` in setup. (You asked this is your responsibility; I already changed `organization.test.mjs`.)
2. `test-results/code_smell_summary.md` (this file) provides an audit record for reviewers.
3. Replace `reject('message')` with `reject(new Error('message'))` across models to standardize error objects. (Low-risk, quick)
4. Change `deleteUser` to return boolean `this.changes > 0` to match `deleteEventById`.

## Bigger improvements (schedule for next iteration)
- Add promisified DB helpers and refactor most model code into async/await style.
- Convert DB singleton into an injectable connection to improve test isolation and concurrency correctness.
- Add a small seeding/migration utility to create required rows (roles, etc.) in `createDB()`.
- Consider adopting a light-weight ORM/Query builder (knex / objection) if the data layer grows.

---

## Traceability / files to look at for fixes
- `utils/db.mjs` — lifecycle, promisify helpers, seed defaults
- `models/event.mjs` — await org check (already fixed), other functions use run/get/all
- `models/user.mjs` — bcrypt callbacks, inconsistent delete return (resolve this.changes)
- `models/organization.mjs` — uses seed role; ensure role exists
- `test/` — make all tests use `db.init(':memory:')` + `db.createDB()` before tests

---

## Next steps I can perform (if you want)
- Apply ONLY step 1 for any test files still using the on-disk DB (I already updated `organization.test.mjs`). I will not change models unless you request them.
- Create a small test helper to centralize `db.init(':memory:')` + `db.createDB()` for all suites.
- Produce a targeted PR with small, non-invasive improvements (promisify helpers or standardized delete returns).

If you want me to apply any of the above (test-only) changes now, tell me which one and I will implement and push them.

---

Generated by automated inspection + manual review on 2025-10-31.
