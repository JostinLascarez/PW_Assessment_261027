# Product Manager App: E2E Test Automation

[![Playwright Tests](https://github.com/JostinLascarez/PW_Assessment_261027/actions/workflows/playwright.yml/badge.svg)](https://github.com/JostinLascarez/PW_Assessment_261027/actions/workflows/playwright.yml)
[![HTML report](https://img.shields.io/badge/HTML%20report-live-2ea44f)](https://jostinlascarez.github.io/PW_Assessment_261027/)

End-to-end UI tests for the [Product Manager demo app](https://softwaremind-assessments.s3.us-east-1.amazonaws.com/login.html), written in TypeScript with Playwright and the Page Object Model. The suite covers user registration, authentication (rejected logins, field validation and successful logins) and a product CRUD flow, and runs on Chromium, Firefox and WebKit.

The latest HTML report from `main` is published at **<https://jostinlascarez.github.io/PW_Assessment_261027/>**.

## Tech stack

| Tool                                                     | Purpose                                                         |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| Playwright Test 1.64                                     | Test runner, browser automation, HTML report                    |
| TypeScript 6 (strict mode)                               | Typed page objects, fixtures, test data and test cases          |
| dotenv                                                   | Loads the local `.env` file                                     |
| ESLint 10 + typescript-eslint + eslint-plugin-playwright | Static analysis: un-awaited promises, hard waits, focused tests |
| Prettier                                                 | Formatting                                                      |
| GitHub Actions + GitHub Pages                            | Continuous integration and report publishing                    |

## Project structure

```text
.github/workflows/playwright.yml   CI: type check, lint, tests on 3 browsers, report publishing
fixtures/index.ts                  Extended `test`: page objects, registerUser, loggedInDashboard
pages/
  BasePage.ts                      Shared contract: page path, landmark and expectLoaded()
  LoginPage.ts                     login.html: login form, "Register here" link, error message
  RegisterPage.ts                  register.html: registration form and success message
  DashboardPage.ts                 index.html: welcome message, product form, filter, cards, delete dialog
tests/
  registration.spec.ts             Scenario A: user registration
  authentication.spec.ts           Scenario B: invalid credentials, field validation, successful login
  product-management.spec.ts       Scenario C: create, filter and delete a product
types/
  user.ts                          UserCredentials, NewUser
  product.ts                       Product, ProductCategory
utils/
  env.ts                           Typed, validated environment configuration (only reader of process.env)
  step.ts                          @step decorator that reports page-object actions as named steps
  test-data.ts                     uniqueId() and createUser() for unique, repeatable test data
.env.example                       Documented template of the required environment variables
playwright.config.ts               Runner, reporters, failure artifacts, timeouts and browser projects
```

## Getting started

### Prerequisites

- Node.js 20 or later (developed with Node.js 24) and npm.
- On Windows, Playwright's Firefox needs the Microsoft Visual C++ 2015-2022 Redistributable. If Firefox fails to launch with a missing `msvcp140_1.dll`, install it with `winget install Microsoft.VCRedist.2015+.x64`.

### Installation

```bash
git clone https://github.com/JostinLascarez/PW_Assessment_261027.git
cd PW_Assessment_261027
npm ci
npx playwright install --with-deps   # browsers (plus system libraries on Linux)
cp .env.example .env                 # PowerShell: Copy-Item .env.example .env
```

Then fill in the empty values of `.env`:

| Variable                         | Value                      | Where to get it                                                   |
| -------------------------------- | -------------------------- | ----------------------------------------------------------------- |
| `BASE_URL`                       | Pre-filled                 | Root URL of the application (keep the trailing slash)             |
| `DEMO_USERNAME`, `DEMO_PASSWORD` | Demo account               | Shown on the application's login page and in the assessment brief |
| `REGISTER_USERNAME_PREFIX`       | Pre-filled (`qa_`)         | Any prefix of up to 12 characters                                 |
| `REGISTER_EMAIL_DOMAIN`          | Pre-filled (`example.com`) | Any domain                                                        |
| `REGISTER_PASSWORD`              | Your choice                | Any value with at least 6 characters                              |

`.env` is git-ignored. If a variable is missing, the run stops immediately with an error that names it (never its value).

## Running the tests

| Command                     | What it runs                                                  |
| --------------------------- | ------------------------------------------------------------- |
| `npm test`                  | The whole suite on Chromium, Firefox and WebKit               |
| `npm run test:headed`       | The whole suite with visible browsers                         |
| `npm run test:ui`           | Playwright UI mode (watch mode and time-travel debugging)     |
| `npm run test:registration` | Scenario A                                                    |
| `npm run test:auth`         | Scenario B                                                    |
| `npm run test:products`     | Scenario C                                                    |
| `npm run test:smoke`        | `@smoke`: happy paths (registration, successful logins, CRUD) |
| `npm run test:regression`   | `@regression`: every test                                     |
| `npm run test:negative`     | `@negative`: rejected logins and empty-field validation       |
| `npm run report`            | Opens the last HTML report                                    |
| `npm run typecheck`         | TypeScript type check (`tsc --noEmit`)                        |
| `npm run lint`              | ESLint with zero warnings allowed, plus the Prettier check    |
| `npm run format`            | Formats the code with Prettier                                |

Any Playwright CLI option can be appended after `--`:

```bash
npm test -- --project=firefox            # one browser
npm run test:auth -- --project=webkit    # one scenario on one browser
npm test -- -g "demo account"            # tests whose title matches
npm test -- --repeat-each=3              # flakiness check
npx playwright test --debug              # step through with the Playwright Inspector
```

### Reports, screenshots and traces

- **HTML report**: `playwright-report/index.html`, opened with `npm run report`. Tests are grouped by scenario and show their tags and annotations (random username and e-mail, product name and SKU). Every page-object action and every validation appears as a named step.
- **Failures** keep a screenshot, a video and a trace in `test-results/<test>/`; all of them are attached to the failed test in the HTML report.
- **Traces** open from the report or with `npx playwright show-trace test-results/<test-folder>/trace.zip`.
- **CI** uploads the report of every run as the `playwright-report` artifact; runs on `main` also publish it to [GitHub Pages](https://jostinlascarez.github.io/PW_Assessment_261027/).

## Continuous integration

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on pushes and pull requests to `main` and on demand: `npm ci`, type check, lint, browser installation, the full suite, the report artifact and, on `main`, the GitHub Pages deployment. The report is deployed even when tests fail, because a failing report is the one worth reading.

Configuration and credentials are stored separately:

| Kind                                 | Variables                                                       | Why                                                           |
| ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------- |
| Repository **variables** (`vars.*`)  | `BASE_URL`, `REGISTER_USERNAME_PREFIX`, `REGISTER_EMAIL_DOMAIN` | Non-sensitive configuration: readable in logs, easy to change |
| Repository **secrets** (`secrets.*`) | `DEMO_USERNAME`, `DEMO_PASSWORD`, `REGISTER_PASSWORD`           | Credentials: encrypted at rest and masked in logs             |

```bash
gh variable set BASE_URL --body "https://softwaremind-assessments.s3.us-east-1.amazonaws.com/"
gh secret set DEMO_PASSWORD   # prompts for the value, so it never reaches the shell history
```

## Requirements traceability

| Assessment requirement                                                                        | Covered by                                                                                   |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Part I.01: folder `PW_Assessment_YYMMDD` (assessment sent on 2026-10-27)                      | Repository `PW_Assessment_261027`                                                            |
| Part I.02: install Playwright with TypeScript                                                 | `package.json`, `playwright.config.ts`, `tsconfig.json`                                      |
| Part I.03: `.env` with base URL and sensitive data                                            | `.env.example`, `utils/env.ts`                                                               |
| Part II, Scenario A: Login Page, "Register here", randomized user, redirect to Login Page     | `tests/registration.spec.ts`                                                                 |
| Objective: register new credentials taken from environment variables                          | `utils/test-data.ts` (`createUser`) with the `REGISTER_*` variables                          |
| Part III, Scenario B negative: "Invalid username or password"                                 | `tests/authentication.spec.ts`, "Invalid credentials" (2 data-driven cases)                  |
| Part III, Scenario B positive: user from Scenario A or demo account, redirect to `index.html` | `tests/authentication.spec.ts`, "Successful login" (`registerUser` fixture and demo account) |
| Objective: field validations on the login page                                                | `tests/authentication.spec.ts`, "Field validation" (3 data-driven cases and masked password) |
| Part IV, Scenario C: create, filter and delete a product (logged-in precondition)             | `tests/product-management.spec.ts` with the `loggedInDashboard` fixture                      |
| Part V.1: HTML report                                                                         | `playwright.config.ts` (`html` reporter), CI artifact and GitHub Pages                       |
| Part V.2: screenshots or traces on failure                                                    | `playwright.config.ts` (`screenshot`, `trace` and `video` on failure)                        |
| Part V.3: README with installation, execution and trade-offs                                  | This file                                                                                    |

| Evaluation criterion             | How it is addressed                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Functionality and correctness    | 10 tests on 3 browsers, green locally (including `--repeat-each=3`) and in CI                                   |
| Code quality and maintainability | Strict TypeScript, type-aware ESLint, Playwright lint rules, Prettier and TSDoc on every public member          |
| Use of TypeScript and Playwright | Custom fixtures, typed step decorator, web-first assertions, tags, annotations and data-driven typed cases      |
| Field validations                | Required-field messages asserted per field (`toHaveAccessibleDescription`), no redirect, masked password        |
| Secure credential handling       | Git-ignored `.env`, a single validated config module, CI secrets; no secret in titles, annotations or logs      |
| Code structure (POM)             | `pages/` own locators and actions, `fixtures/` own preconditions, specs own assertions and contain no selectors |
| Selectors                        | Role- and text-based locators; one documented CSS hook (`.product-card`); no XPath or index-based locators      |
| Type safety                      | Interfaces and unions in `types/`, typed test cases, no `any`                                                   |
| Reliability                      | No hard waits, isolated browser contexts, fully parallel, unique data, retries only on CI                       |
| Documentation                    | This README, TSDoc and a header in every spec mapping it to the assessment                                      |

## Design decisions and trade-offs

- **Page Object Model and fixtures.** Each page object defines its locators once, as read-only properties, and exposes intention-revealing actions (`login`, `register`, `addProduct`, `filterByCategory`, `deleteProduct`). Specs contain no selectors and own the assertions. `BasePage` exists only because three pages share the same "is this page displayed?" check (URL and landmark). Fixtures inject page objects and preconditions, and Playwright only sets up the ones a test asks for.
- **Step reporting.** The `@step` decorator, a typed standard (TC39) decorator, wraps every page-object action in `test.step` with `box: true`, so the report reads as a sequence of named actions and a failure points at the spec line that called the action. Step titles are static so test data, such as passwords, can never leak into them. Specs add `test.step` for validations and scenario phases.
- **Locators.** Role- and text-based locators mirror what users and assistive technologies perceive. For example, `getByRole('textbox', { name: 'Password' })` is used instead of `getByLabel('Password')`, which also matches the "Toggle password visibility" button. The two exceptions are forced by the application and documented in code and in the findings below: the `.product-card` class and the unnamed "In Stock" checkbox.
- **Assertions.** Only web-first assertions are used. Field validation relies on `toHaveAccessibleDescription`: the messages are linked to their inputs through `aria-describedby`, so a single assertion checks the text and that it belongs to the right field, in any browser. Deletion is confirmed only inside the dialog that names the product, so another product can never be deleted by mistake.
- **Test data.** `uniqueId()` (`node:crypto`, no extra dependency) makes usernames, e-mails, product names and SKUs unique, so runs are repeatable and parallel-safe. Registration combines the environment settings with that random suffix.
- **Environment handling.** `utils/env.ts` is the only reader of `process.env`: it loads `.env`, validates every variable once and fails fast. Pages navigate with paths relative to `BASE_URL`, so targeting another environment means changing one variable.
- **Independent scenarios and the registered user.** The application keeps users in the browser's `localStorage` and every test gets a fresh browser context, so a user registered by Scenario A does not exist in any other test. Instead of chaining tests (order-dependent and not parallel-safe), the `registerUser` fixture registers a user through the same UI flow inside the test's own context. It is a factory, so the data-driven login test only registers when a case needs it.
- **Authenticated precondition.** Scenario C logs in through the UI with the demo account. A saved `storageState` was not used because part of the session lives in `sessionStorage`, which `storageState` does not persist, and the UI login keeps the test independent of the application's internal storage keys.
- **Scenario C as a single test.** Create, filter and delete depend on each other, so they are three steps of one test rather than three order-dependent tests.
- **Waits.** There are no hard waits. The application redirects after fixed delays (1 s after login, 2 s after registration) and shows transient messages; web-first assertions retry until the 10 s expect timeout.
- **Cross-browser execution.** The same tests run on Chromium, Firefox and WebKit, fully parallel and with nothing skipped. On CI, `forbidOnly` rejects a committed `test.only` and two retries absorb infrastructure hiccups while still flagging flaky tests in the report.
- **Tags.** `@regression` marks every test, `@smoke` the happy paths and `@negative` the rejected logins and validation cases.

## Findings from exploratory analysis

Found while inspecting the application's HTML and JavaScript before writing the page objects.

### Specification vs. application

**1. "Add New Product" form and "Save Product" button do not exist**

- **Issue:** the assessment refers to an "Add New Product" form and a "Save Product" button. The application shows an "Add Product" form (renamed "Edit Product" while editing) with a "Save" button.
- **Impact:** locators written from the specification fail, and the specification and the UI disagree.
- **Suggested fix:** align the specification with the UI, or the UI with the specification.
- **Handling:** locators use the real accessible names: region "Add Product" and button "Save".

**2. The product list is not a table**

- **Issue:** the specification mentions a "Product List table" and its rows. The application renders `<div class="product-card">` elements inside a region named "Product list", with no table or list semantics.
- **Impact:** assistive technologies cannot navigate the products as rows or list items, and tests have no row element to target.
- **Suggested fix:** render a `<table>`, or a `<ul>`/`<li>` list whose items are labelled by the product name.
- **Handling:** each card is treated as the product's row and is always located through its exact product-name heading.

**3. SKU is mandatory but not specified**

- **Issue:** the form requires a unique SKU of 4 to 16 characters (`A-Z`, `a-z`, `0-9`, `-`, `_`), but the specification only lists name, price, category and stock status.
- **Impact:** following the specification literally, the product cannot be saved.
- **Suggested fix:** document the field and its rules in the specification.
- **Handling:** the test generates a unique SKU (`AL-<id>`).

### Accessibility

**4. The "In Stock" checkbox has no accessible name**

- **Issue:** the checkbox's associated `<label>` is empty (it only wraps the switch graphic) and the visible "In Stock" text is in a separate label that is not associated with it. The native input is also invisible (`opacity: 0`) beneath the switch, which intercepts clicks.
- **Impact:** screen readers announce an unnamed checkbox, and automation can neither find it by name nor click it directly.
- **Suggested fix:** associate the visible text with the input (`<label for="product-inStock">In Stock</label>`) or add `aria-label="In stock"` to the input.
- **Handling:** the checkbox is located as the only one in the "Add Product" region and toggled with `setChecked(value, { force: true })`, which clicks the switch the user sees.

**5. The login error is not announced to screen readers**

- **Issue:** "Invalid username or password" is written into a `<div>` without `role="alert"` or `aria-live`. The registration success message has the same problem.
- **Impact:** screen-reader users get no feedback after a failed login or a successful registration.
- **Suggested fix:** add `role="alert"` (or `aria-live="assertive"`) to both message containers.
- **Handling:** both messages are located by their exact text.

**6. Product cards have no semantic role or test id**

- **Issue:** a card is a plain `<div>`, with no role, accessible name or `data-testid`.
- **Impact:** assistive technologies cannot identify a card as a unit, and tests need a CSS class to scope a card. This is why `.product-card` is the only CSS locator in the project.
- **Suggested fix:** expose cards as list items labelled by their heading (`aria-labelledby`), or add a `data-testid`.
- **Handling:** `.product-card` is filtered by the exact product-name heading, so every action and assertion stays scoped to one product.

### Security (demo scope)

**7. Passwords are stored in plain text in the browser**

- **Issue:** registered users, including their passwords, are saved unencrypted in `localStorage` (`users:v1`).
- **Impact:** any script running on the origin, or anyone with access to the device, can read every password.
- **Suggested fix:** authenticate against a backend and keep only a session token in an `HttpOnly` cookie.

## Known limitations

- **Typed values appear in reports and traces.** Playwright's action steps (`Fill "…"`) and traces record what is typed, test passwords included, and the report of `main` is public on GitHub Pages. This is acceptable here because the demo password is published by the application itself and the registration password is disposable and only exists inside a short-lived browser context. The suite's own step titles, annotations and logs never contain passwords. With real credentials, reports and traces should not be published, or authentication should happen through an API with `storageState` so no secret is typed in UI tests.
- **Client-side data.** Users and products live in the browser's storage, so tests cannot share data and preconditions are rebuilt through the UI in every test.
- **Workarounds for application defects.** The forced click on the "In Stock" switch and the `.product-card` CSS hook (findings 4 and 6) would go away if the application fixed them.
- **Pull requests from forks** do not receive repository secrets, so their CI runs stop at configuration validation.

## Possible improvements

- Automated accessibility checks with `@axe-core/playwright` to turn the accessibility findings into regression tests.
- API-based preconditions (seeded users and products, `storageState` logins) if the application gets a backend.
- Sharding or a per-browser CI matrix as the suite grows.
- Visual comparisons of the product cards.
