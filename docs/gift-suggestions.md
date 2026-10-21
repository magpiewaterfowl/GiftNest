# Gift Suggestions and Recommendations

## Local Workflow

Open another member's profile and choose **Suggest a gift**. The submitting account must share at least one group with the recipient; self-suggestions and suggestions outside shared groups are rejected. The form accepts a gift name, an optional reason, and an optional estimated price in USD. Submission never changes a wishlist.

The recipient opens **Gift inspiration** at `/recommendations/`. On entry, the app fills missing ideas from the recipient's existing gift-interest categories and three sample system ideas. Those records and family-submitted ideas share one queue and one card layout. With no questionnaire interests, sample and submitted ideas still work. There is no AI, external recommendation API, reservation, purchase, delivery notification, or automatic wishlist insertion.

Every recommendation has the same three actions:

- **Add to wishlist:** explicitly copy the gift name and estimate into the recipient's wishlist. No note, queue identifier, source, or actor information is copied. Repeated additions do not create duplicate wishes.
- **Save for later:** persist the idea in the recipient's Saved for later view; it can still be added or dismissed there.
- **Not interested:** retain a dismissed marker so revisits and duplicate submissions do not resurface it. There is no notification or sender feedback.

There is no sent-suggestions list, submission count, vote count, viewer list, read receipt, interaction feed, or ordering by submission date. The sender receives the same neutral confirmation for a new or duplicate submission.

## Data Model

The existing `giftnest:v1` local-storage object gains an additive `recommendations` array. Each record has only these fields:

| Field         | Meaning                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `id`          | Random UUID, with no source prefix or actor information                                                 |
| `recipientId` | Profile whose private review queue contains the idea                                                    |
| `name`        | Required gift name, trimmed, 1-90 characters                                                            |
| `reason`      | Optional submission note, stored as a string; never passed to recipient cards                           |
| `price`       | Optional nonnegative USD estimate up to 1,000,000, normalized to two decimal places, or an empty string |
| `status`      | `new`, `saved`, `dismissed`, or `added`                                                                 |

**Sender identity is not stored.** There is no source type, group identifier, author identifier, timestamp, popularity count, viewer field, or interaction actor field. Category and sample templates have no persisted source metadata either. The private recipient projection is explicitly limited to `{ id, name, price, status }`. Review cards do not show free-text reasons because those notes can identify the writer or reveal purchase plans. Names and surprise details should not be entered into the gift name or note.

Mixing is simulated through source-free records with random UUIDs, sorted by UUID rather than creation order. This produces stable, interleaved presentation without chronological sections, provenance badges, or a newly submitted item always appearing last. It is not a personalized ranking or an anonymity protocol.

Gift names are deduplicated per recipient after Unicode NFKC normalization, whitespace folding, and case folding. The first queued record is retained; later submissions neither count votes nor overwrite a note, price, or recipient decision. Matching is not fuzzy. Existing wishlist names are omitted from the review projection; adding a recommendation already present on a wishlist marks it added without duplicating that wish. Added/dismissed records remain as suppression markers even if the wish is later removed.

## Migration and Scope

Existing version-1 accounts, credentials, profiles, groups, answers, interests, and wishlists are preserved. On read, a missing queue becomes an empty array. Malformed records, records with attribution/unknown fields, unknown recipients, duplicate IDs, and duplicate recipient/name pairs are excluded from the restored queue without discarding the base profile data. Future record extensions require an explicit migration rather than silently accepting extra metadata.

Queue mutations use the signed-in local account: only that recipient can save, dismiss, or add their recommendation. Preparation is idempotent and adds only missing templates. Reading a queue does not track views. Existing questionnaire questions, score mappings, and authentication behavior are unchanged. GitHub Pages exports the review page as static frontend content; browser-created suggestions never enter the build output.

## Privacy Limits

This prototype provides **interface-level concealment, not secure anonymity or private shared accounts**. All accounts on this origin share browser storage, and anyone able to inspect or edit it can read private notes, infer recipient decisions from stored statuses, or impersonate a local profile. Developer tools can also recognize built-in template phrases. Free-text names/notes, unusual gifts, knowledge outside the app, or seeing an item on a shared wishlist can allow inferences. We cannot promise that recipients or suggesters will never guess a source or interaction.

The application does not itself expose an author association, submission multiplicity, viewers, or activity receipts. It does not retain sender identity even in storage. There are no source-bearing HTML attributes or badges, and no free-text reasons in recipient card props or wishlist copies. These choices reduce accidental disclosure, but client-side checks cannot enforce confidentiality against somebody controlling the browser. Do not enter sensitive information, names in gift titles, or real purchase plans. Clearing browser storage removes the prototype data; devices and browsers do not synchronize.

## Future Backend Considerations

- Require real authenticated sessions and server-side shared-group membership checks on submission and recipient ownership checks on every review mutation. Client-supplied account/recipient IDs are not authorization.
- Store recipient deliveries and review states behind row-level access controls. Do not return sender associations, family counts, timestamps, activity logs, or hidden notes in recipient or family API responses, analytics payloads, notifications, caches, or exports.
- Prefer not retaining sender identity. If abuse prevention requires an association, isolate it in a server-only, access-audited table with a clear retention policy. It must never join into recipient responses or sender activity receipts.
- Use neutral server-generated delivery IDs, batching and source-independent ordering. Do not transmit pools to the client with hidden CSS badges or client-filtered provenance. A real threat model must address timing and content inference, which a visual shuffle cannot solve.
- Apply content validation/moderation for self-identifying or surprise-spoiling text, minimal retention, consent and deletion controls, rate limits, and atomic deduplication. Use transactional/idempotent wishlist insertion so concurrent reviews do not create duplicate items.
- Keep sender confirmations independent of recipient choices. Deliberately design what shared-wishlist visibility means for inference; do not add view analytics or activity notifications by default.
- Version the storage/API schema and migrate existing local data only with informed consent. Add multi-account authorization, response-field allowlist, replay/concurrency, and privacy-regression tests before any shared deployment.

None of this backend infrastructure, authentication work, or AI integration is implemented in the current feature.
