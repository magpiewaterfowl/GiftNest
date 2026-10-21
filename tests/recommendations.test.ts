import assert from "node:assert/strict";
import test from "node:test";
import { categories } from "../src/lib/questionnaire";
import {
  giftKey,
  isRecommendation,
  normalizeSuggestion,
  recommendationTemplates,
  restoreRecommendationQueue,
  reviewQueue,
  type Recommendation,
} from "../src/lib/recommendations";

test("category and sample ideas use the same source-free shape", () => {
  const templates = recommendationTemplates(categories);
  assert.equal(templates.length, 23);
  assert.equal(recommendationTemplates([]).length, 3);
  assert.ok(
    templates.every(
      (idea) => Object.keys(idea).sort().join() === "name,price,reason",
    ),
  );
  assert.equal(
    new Set(templates.map((idea) => giftKey(idea.name))).size,
    templates.length,
  );
});

test("suggestion validation normalizes estimates and deduplication keys", () => {
  assert.deepEqual(
    normalizeSuggestion({
      name: "  A thoughtful book  ",
      price: " 19.5 ",
      reason: " A small note ",
    }),
    { name: "A thoughtful book", price: "19.50", reason: "A small note" },
  );
  assert.equal(giftKey(" A  THOUGHTFUL book "), giftKey("a thoughtful book"));
  for (const input of [
    { name: " " },
    { name: "a".repeat(91) },
    { name: "Book", reason: "a".repeat(401) },
    ...["-1", "Infinity", "no", "1000001"].map((price) => ({
      name: "Book",
      price,
    })),
  ]) {
    assert.throws(() => normalizeSuggestion(input));
  }
});

test("review projection hides free-text notes, identities, sources, and other recipients", () => {
  const record: Recommendation = {
    id: "random-id",
    recipientId: "recipient",
    name: "A book",
    reason: "Identifying context must not reach the card",
    price: "20.00",
    status: "new",
  };
  const queue = reviewQueue(
    [record, { ...record, id: "other-id", recipientId: "someone-else" }],
    "recipient",
  );
  assert.deepEqual(queue, [
    { id: "random-id", name: "A book", price: "20.00", status: "new" },
  ]);
  assert.ok(isRecommendation(record));
  assert.equal(isRecommendation({ ...record, senderId: "sender" }), false);
  assert.equal(isRecommendation({ ...record, source: "family" }), false);
  assert.equal(isRecommendation({ ...record, views: 2 }), false);
});

test("legacy and malformed queues migrate without requiring profile or wishlist changes", () => {
  const record: Recommendation = {
    id: "id",
    recipientId: "recipient",
    name: "A book",
    reason: "",
    price: "",
    status: "saved",
  };
  assert.deepEqual(restoreRecommendationQueue(undefined, ["recipient"]), []);
  assert.deepEqual(restoreRecommendationQueue("invalid", ["recipient"]), []);
  assert.deepEqual(
    restoreRecommendationQueue(
      [
        record,
        { ...record, id: "duplicate" },
        { ...record, id: "bad", senderId: "sender" },
        { ...record, recipientId: "unknown" },
        null,
      ],
      ["recipient"],
    ),
    [record],
  );
});

test("review order is stable and does not reveal insertion order or create viewing history", () => {
  const records: Recommendation[] = ["ccc", "aaa", "bbb"].map((id) => ({
    id,
    recipientId: "recipient",
    name: id,
    reason: "",
    price: "",
    status: "new",
  }));
  const before = structuredClone(records);
  assert.deepEqual(
    reviewQueue(records, "recipient"),
    reviewQueue([...records].reverse(), "recipient"),
  );
  assert.deepEqual(records, before);
});
