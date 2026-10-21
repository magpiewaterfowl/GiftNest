import assert from "node:assert/strict";
import test from "node:test";
import {
  actions,
  canViewProfile,
  ownRecommendations,
  type Data,
} from "../src/lib/store";

const entries = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
  },
  configurable: true,
});

function saved(): Data {
  return JSON.parse(entries.get("giftnest:v1")!);
}

test("local account, family membership, profile ownership and wishlist lifecycle", async () => {
  await actions.register("Taylor", "Taylor@Example.com", "test-password-482!");
  const account = saved();
  const profileId = account.currentId!;
  assert.equal(
    account.profiles.find((profile) => profile.id === profileId)?.email,
    "taylor@example.com",
  );
  assert.ok(account.credentials[0].hash);
  assert.ok(!JSON.stringify(account).includes("test-password-482!"));
  assert.equal(canViewProfile(account, "alex"), false);

  actions.createGroup("Test family");
  const created = saved().groups.find(
    (group) => group.id === saved().activeGroupId,
  )!;
  assert.deepEqual(created.members, [profileId]);
  assert.throws(() => actions.joinGroup("NOT-REAL"));
  actions.joinGroup("morgan26");
  actions.joinGroup("MORGAN26");
  assert.equal(
    saved()
      .groups.find((group) => group.id === "morgan")
      ?.members.filter((member) => member === profileId).length,
    1,
  );
  assert.equal(canViewProfile(saved(), "alex"), true);

  actions.saveProfile("Taylor Updated", "A reader and gardener.", "05-14");
  actions.completeQuestionnaire(Array(10).fill(0));
  const profile = saved().profiles.find((person) => person.id === profileId)!;
  assert.equal(profile.name, "Taylor Updated");
  assert.equal(profile.categories.length, 5);
  assert.equal(profile.answers.length, 10);
  assert.throws(() =>
    actions.saveWish({
      name: "Unsafe",
      price: "",
      url: "javascript:alert(1)",
      note: "",
      image: "",
    }),
  );
  actions.saveWish({
    name: "A book",
    price: "20",
    url: "https://example.com",
    note: "Hardcover",
    image: "",
  });
  const wishId = saved().profiles.find((person) => person.id === profileId)!
    .wishlist[0].id;
  actions.saveWish(
    { name: "A better book", price: "22", url: "", note: "", image: "" },
    wishId,
  );
  actions.toggleWish(wishId);
  assert.equal(
    saved().profiles.find((person) => person.id === profileId)!.wishlist[0]
      .received,
    true,
  );
  assert.equal(
    saved().profiles.find((person) => person.id === "alex")!.wishlist.length,
    2,
  );
  actions.removeWish(wishId);
  assert.equal(
    saved().profiles.find((person) => person.id === profileId)!.wishlist.length,
    0,
  );

  actions.logout();
  assert.throws(() => actions.createGroup("Unauthorized family"));
  await assert.rejects(actions.login("taylor@example.com", "wrong-password"));
  await actions.login("taylor@example.com", "test-password-482!");
  assert.equal(saved().currentId, profileId);
  await assert.rejects(
    actions.register("Duplicate", "taylor@example.com", "another-password"),
  );
});

test("suggestions stay anonymous and queued until the recipient explicitly reviews them", async () => {
  await actions.register(
    "Jordan Example",
    "jordan.suggestions@example.com",
    "prototype-test-482!",
  );
  const senderId = saved().currentId!;
  assert.throws(() =>
    actions.submitSuggestion("alex", { name: "A reading lamp" }),
  );
  actions.joinGroup("MORGAN26");
  const oldWishlist = saved().profiles.find(
    (person) => person.id === "alex",
  )!.wishlist;
  actions.submitSuggestion("alex", {
    name: "A reading lamp",
    reason: "A note that must not be displayed",
    price: "25",
  });
  actions.submitSuggestion("alex", {
    name: " A READING lamp ",
    reason: "Another note",
    price: "30",
  });
  const suggestion = saved().recommendations.find(
    (record) => record.recipientId === "alex",
  )!;
  assert.equal(
    saved().recommendations.filter((record) => record.recipientId === "alex")
      .length,
    1,
  );
  assert.deepEqual(
    saved().profiles.find((person) => person.id === "alex")!.wishlist,
    oldWishlist,
  );
  assert.ok(!JSON.stringify(suggestion).includes(senderId));
  assert.deepEqual(Object.keys(suggestion).sort(), [
    "id",
    "name",
    "price",
    "reason",
    "recipientId",
    "status",
  ]);
  assert.equal(ownRecommendations(saved()).length, 0);
  assert.throws(() =>
    actions.submitSuggestion(senderId, { name: "For myself" }),
  );
  assert.throws(() => actions.reviewRecommendation(suggestion.id, "added"));

  actions.demo();
  actions.prepareRecommendations();
  const queue = ownRecommendations(saved());
  assert.equal(queue.length, 9);
  assert.ok(
    queue.every(
      (record) => Object.keys(record).sort().join() === "id,name,price,status",
    ),
  );
  const size = saved().recommendations.length;
  actions.prepareRecommendations();
  assert.equal(saved().recommendations.length, size);
  actions.reviewRecommendation(suggestion.id, "saved");
  assert.equal(
    saved().recommendations.find((record) => record.id === suggestion.id)!
      .status,
    "saved",
  );
  actions.reviewRecommendation(suggestion.id, "added");
  actions.reviewRecommendation(suggestion.id, "added");
  const added = saved()
    .profiles.find((person) => person.id === "alex")!
    .wishlist.filter((wish) => wish.name === "A reading lamp");
  assert.equal(added.length, 1);
  assert.equal(added[0].note, "");
  assert.equal(added[0].price, "25.00");
  const unwanted = queue.find((record) => record.id !== suggestion.id)!;
  actions.reviewRecommendation(unwanted.id, "dismissed");
  actions.reviewRecommendation(unwanted.id, "added");
  assert.equal(
    saved().recommendations.find((record) => record.id === unwanted.id)!.status,
    "dismissed",
  );
  await actions.login("jordan.suggestions@example.com", "prototype-test-482!");
  actions.submitSuggestion("alex", { name: unwanted.name });
  assert.equal(
    saved().recommendations.find((record) => record.id === unwanted.id)!.status,
    "dismissed",
  );
  actions.logout();
  assert.throws(() => actions.submitSuggestion("alex", { name: "A gift" }));
  assert.throws(() => actions.prepareRecommendations());
  assert.throws(() => actions.reviewRecommendation(suggestion.id, "saved"));
  assert.deepEqual(ownRecommendations(saved()), []);
});
