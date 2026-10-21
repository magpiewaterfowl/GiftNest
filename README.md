# GiftNest

A warm, responsive gift-planning foundation for families and friend groups. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and Lucide icons. Light mode first, with keyboard-accessible dialogs, visible focus states, reduced-motion support, and mobile navigation.

GiftNest's long-term aim is to help families and friends discover thoughtful gifts, coordinate wishlists, avoid duplicate purchases, and preserve the surprise of giving. This browser-local prototype is a starting point; secure shared coordination and duplicate-purchase prevention are future capabilities.

## Run locally

Use Node.js 22 or 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Choose **Meet the demo family** to explore the sample Morgan family, or create a local account and a family group.

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run check:export
npm start
```

No external service credentials are needed. `npm start` previews the exported frontend at http://localhost:4173 after building; it is not a backend. `npm run build` and `npm run export` both run the official Next.js static-export build and write `out/`. There is no separate `next export` command in this Next.js version.

## Included

- Landing, sign-up, login, dashboard, profile, wishlist, questionnaire, and results pages.
- Create and join multiple family groups; switch groups and copy invitation codes.
- Create and edit a profile, including an optional month/day birthday without birth year.
- Ten behavioral and preference-based questions covering all twenty initial categories. No age, gender, or sensitive demographic questions.
- Deterministic weighted scoring and five saved top categories.
- Add, edit, remove, and mark wishlist items as received, with optional prices, links, notes, and photos.
- Browse profiles, interests, wishes, and upcoming occasions in your family groups.
- Submit unattributed gift ideas for other group members and review a source-neutral mix of category ideas, sample ideas, and submitted suggestions.
- Add recommendations to your wishlist, save them for later, or dismiss them without sender-facing activity feedback.
- Unit and local-store workflow tests, plus GitHub Actions checks.

## Gift Suggestions

Choose **Suggest a gift** on another member's profile. Suggestions go to their recommendation queue, never directly to their wishlist. The recipient can review **Gift inspiration**, add an idea to their wishlist, save it for later, or choose Not interested. All sources use the same card layout without attribution, popularity counts, or activity receipts. Optional reasons stay off recipient cards to avoid revealing identifying context.

The browser-local model does not store sender identity, but **it cannot guarantee anonymity or confidentiality from someone who inspects browser storage or recognizes gift wording**. Adding an idea to a shared wishlist can also allow inferences. Do not enter purchase plans or sensitive details. See [the gift-suggestion data model and privacy notes](docs/gift-suggestions.md) for migration behavior, deduplication, mixing, and future backend requirements. No authentication provider, backend, or AI integration was added.

## Important: local preview, not production accounts

This initial implementation uses `localStorage`, under `giftnest:v1`. Data persists on the same browser and origin, with updates synchronized between tabs. It is not uploaded to a server. Clearing browser data deletes accounts and changes. Private browsing and blocked/full storage may prevent persistence; the app displays a warning when writes fail.

Accounts and application data are **not shared between devices or browsers**. GitHub Pages publishes only the static frontend; it does not provide accounts, a database, or private group access. Real family accounts, private groups, cross-device access, secure gift reservations, and notifications will require a backend and authentication in a later phase. Nothing about publishing this prototype changes these limitations.

Passwords are salted and hashed with Web Crypto PBKDF2, but browser-local credentials are **not secure production authentication**. Anyone with access to the browser's storage can change accounts and read the data. Do not enter real passwords or sensitive information. There is no email verification or password recovery. The sample family is fictional and intentionally available through the demo button.

Invitation codes connect only accounts stored in this browser. To test: create a group, copy its code, log out, create a second account, and join with the code. Cross-device accounts, real email invitations, access enforcement, and shared persistence require a backend. Profile visibility and ownership checks here are UX boundaries, not security boundaries.

Questionnaire progress lasts while the page is mounted; completion saves answers and top categories. Ties follow the original category order. Each selected answer awards its three mapped categories 3, 2, and 1 points respectively. Results display raw interest points, not statistical confidence. Sample profile categories are illustrative; a questionnaire must be completed to produce scored results.

## Project structure

```text
src/app/                 Routes, root layout, metadata, global styles
src/components/ui.tsx    Shared navigation, avatars, dialogs, group controls
src/components/views.tsx Page views and workflow forms
src/lib/store.ts         Local data types, persistence, and mutation actions
src/lib/questionnaire.ts Questions, twenty categories, scoring function
src/lib/recommendations.ts Source-free queue model, templates, validation, projection
src/components/recommendations.tsx Suggestion form and recipient review page
tests/                   Scoring and store workflow tests
.github/workflows/ci.yml  Lint, tests, build, and type checks
.github/workflows/pages.yml Personal-account-only Pages build and deployment
scripts/                 Static preview and export verification (Node built-ins)
next.config.ts           Static export, trailing slashes, build-time base path
```

## GitHub Pages deployment

This is a personal project. The verified personal GitHub account is `magpiewaterfowl`. The deployment workflow refuses to run outside that account, on organization-owned repositories, or from branches other than `main`. No remote is configured automatically. No organization resource, Azure service, or other hosting infrastructure is required.

Create an empty personal repository first (public for free GitHub Pages). Before connecting or pushing, verify its owner and review `git remote -v`; do not reuse an unrelated remote. After explicitly approving the connection and initial push, choose **Settings > Pages > Build and deployment > Source: GitHub Actions** in that personal repository. The workflow deploys pushes to `main` and supports **Actions > Deploy GiftNest to GitHub Pages > Run workflow** on `main`. Publishing has not been performed as part of baseline preparation.

The workflow uses only GitHub-maintained `actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. Only `out/` is uploaded. Deployment permissions are limited to the deployment job. No personal access token or manually created deployment secret is required.

`actions/configure-pages` supplies the actual Pages `base_path` to `PAGES_BASE_PATH` at build time. No guessed username or repository name is used for URLs. The same export supports `https://USERNAME.github.io/REPOSITORY-NAME/`, a user-site root, or a configured custom-domain root by rebuilding with the correct path. Next.js applies `basePath` to links, navigation, styles, and scripts; trailing slashes produce directory indexes for direct visits and refreshes. External Unsplash and Google Fonts URLs remain absolute.

On Windows, the installed Next.js exporter can emit nested route-segment text files where its client expects dot-separated filenames. The `postbuild` and `postexport` steps create the matching flattened copies inside `out/` only; they do not modify Next.js, application data, or source files. The step is a no-op when the exporter already emits the expected names. Export checks compare these copies with their originals, and static-preview browser checks verify navigation without prefetch 404s.

Member profiles stored in a browser cannot be enumerated at build time. New member navigation therefore uses `/profile/?member=ID`, resolved on the client within a Suspense boundary. The existing four demo URLs (`/profile/alex/`, `/profile/olivia/`, `/profile/james/`, `/profile/sophie/`) are also exported. Arbitrary old `/profile/ID` paths are not supported by static hosting; use the query-based member links instead. Profile visibility checks and wishlist ownership behavior are unchanged. There are no Server Actions, API route handlers, runtime cookies, request-dependent pages, or server image optimization requirements.

To test a repository subpath locally in PowerShell, use any placeholder path; this does not configure a remote:

```powershell
$env:PAGES_BASE_PATH = '/pages-check'
npm run export
npm run check:export
npm start
```

Open http://localhost:4173/pages-check/. Use the same path for building, verifying, and previewing. Clear it with `Remove-Item Env:PAGES_BASE_PATH` and rebuild to return to a root-path preview. Build-time base paths cannot be changed after export. Export checks verify routes, local references, scripts/styles, and the absence of development files, credential patterns, machine paths, and known test-account fixtures.

Deployment does not transfer localhost data to the published origin. Browser storage is origin-scoped rather than repository-path-scoped: multiple GiftNest prototypes on the same `USERNAME.github.io` origin share the current `giftnest:v1` key. This existing storage behavior is intentionally unchanged; do not treat a project subpath as a privacy boundary.

## Planned Features

These describe the future shared product, not new functionality delivered in this baseline:

- Private family or friend groups.
- Member profiles and gift-interest categories.
- Wishlists that retain items after reservation or purchase.
- Private gift reservations that prevent duplicate purchases.
- Secure cross-device family suggestions blended into recommendation lists (the browser-local simulation is now included).
- Surprise-preserving recipient and gift-giver views.
- Optional privacy-conscious AI prompt generation.
- A future backend for shared, cross-device data.

The current groups and accounts are local simulations, not private shared services. A later phase will replace the local-store adapter with authenticated server endpoints and persistent storage, move permission checks to the server, and introduce questionnaire versioning and migrations. The pure questionnaire scoring function can remain independent of that infrastructure.

No AI integration, external gift recommendation service, or adaptive questionnaire logic is implemented.

## Product design

See [the product-design summary](docs/product-design-summary.md) for the year-round theme, palette, typography, screens reviewed, accessibility decisions, and remaining opportunities. This presentation pass does not change storage, questionnaire scoring, routes, or planned-feature availability.

## Assets and dependencies

Photos load from Unsplash; DM Sans and Lora load from Google Fonts. These third-party requests require internet access. For a production privacy policy or offline deployment, self-host licensed copies of fonts and chosen photos. System font and initial-avatar fallbacks are available.

The current dependency audit reports five high-severity **development-only** advisories in the Next.js ESLint toolchain's transitive glob dependencies. The audit's suggested automatic fix downgrades the Next.js lint configuration across major versions; it has intentionally not been applied. Recheck `npm audit` as upstream patches become available. Production dependencies are checked separately with `npm audit --omit=dev`.
