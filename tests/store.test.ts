import assert from "node:assert/strict";
import test from "node:test";
import { actions, canViewProfile, type Data } from "../src/lib/store";

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
