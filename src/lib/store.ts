"use client";

import { useSyncExternalStore } from "react";
import { categories, scoreAnswers, type Category } from "./questionnaire";
import {
  giftKey,
  normalizeSuggestion,
  recommendationTemplates,
  restoreRecommendationQueue,
  reviewQueue,
  type GiftSuggestion,
  type Recommendation,
  type ReviewRecommendation,
} from "./recommendations";

export type WishlistItem = {
  id: string;
  name: string;
  url: string;
  price: string;
  note: string;
  image: string;
  received: boolean;
};
export type Profile = {
  id: string;
  name: string;
  email: string;
  bio: string;
  photo: string;
  color: string;
  categories: Category[];
  answers: number[];
  wishlist: WishlistItem[];
  occasion?: string;
  occasionDate?: string;
};
export type Group = {
  id: string;
  name: string;
  code: string;
  members: string[];
};
type Credential = { profileId: string; salt: string; hash: string };
export type Data = {
  version: 1;
  profiles: Profile[];
  groups: Group[];
  credentials: Credential[];
  recommendations: Recommendation[];
  currentId: string | null;
  activeGroupId: string | null;
};

export const photos = {
  gift: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1400&q=85",
  plant:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=85",
  camera:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85",
  book: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85",
  coffee:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85",
  hiking:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=85",
};

const seedProfiles: Profile[] = [
  {
    id: "alex",
    name: "Alex Morgan",
    email: "alex@example.com",
    bio: "Happiest with a good book, a fresh coffee, and a weekend with no plans.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=180&h=180&q=85",
    color: "sage",
    categories: [
      "Books & Reading",
      "Cooking",
      "Outdoors",
      "Music",
      "Technology",
    ],
    answers: [],
    wishlist: [
      {
        id: "wish-1",
        name: "A little more green",
        price: "35",
        note: "A low-maintenance plant for my reading corner.",
        url: "",
        image: photos.plant,
        received: false,
      },
      {
        id: "wish-2",
        name: "A weekend coffee ritual",
        price: "45",
        note: "Whole beans from a small local roaster would be lovely.",
        url: "",
        image: photos.coffee,
        received: false,
      },
    ],
  },
  {
    id: "olivia",
    name: "Olivia Morgan",
    email: "olivia@example.com",
    bio: "Plant parent, weekend baker, and collector of little moments.",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=180&h=180&q=85",
    color: "peach",
    categories: [
      "Gardening",
      "Cooking",
      "Self-Care",
      "Crafting",
      "Sentimental Gifts",
    ],
    answers: [],
    occasion: "Birthday",
    occasionDate: "11-08",
    wishlist: [
      {
        id: "wish-3",
        name: "Something for the garden",
        price: "30",
        note: "A beautiful pot or a new leafy friend.",
        url: "",
        image: photos.plant,
        received: false,
      },
    ],
  },
  {
    id: "james",
    name: "James Morgan",
    email: "james@example.com",
    bio: "Always planning the next hike. Usually carrying a camera.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&h=180&q=85",
    color: "blue",
    categories: ["Outdoors", "Technology", "Travel", "Fitness", "Experiences"],
    answers: [],
    occasion: "Birthday",
    occasionDate: "12-02",
    wishlist: [
      {
        id: "wish-4",
        name: "Film for my next adventure",
        price: "25",
        note: "35mm color film. Any brand is welcome!",
        url: "",
        image: photos.camera,
        received: false,
      },
    ],
  },
  {
    id: "sophie",
    name: "Sophie Morgan",
    email: "sophie@example.com",
    bio: "One more chapter. One more song. One more adventure.",
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&h=180&q=85",
    color: "lilac",
    categories: [
      "Books & Reading",
      "Music",
      "Travel",
      "Fashion",
      "Experiences",
    ],
    answers: [],
    wishlist: [
      {
        id: "wish-5",
        name: "My next great read",
        price: "20",
        note: "A book you loved, with a note inside.",
        url: "",
        image: photos.book,
        received: false,
      },
    ],
  },
];

const initialData: Data = {
  version: 1,
  profiles: seedProfiles,
  groups: [
    {
      id: "morgan",
      name: "The Morgan family",
      code: "MORGAN26",
      members: seedProfiles.map((profile) => profile.id),
    },
  ],
  credentials: [],
  recommendations: [],
  currentId: null,
  activeGroupId: "morgan",
};
const storageKey = "giftnest:v1";
let snapshot: Data | null = null;
const listeners = new Set<() => void>();
let storageError = "";

function isStoredData(value: unknown): value is Data {
  if (!value || typeof value !== "object") return false;
  const data = value as Data;
  return (
    data.version === 1 &&
    Array.isArray(data.profiles) &&
    Array.isArray(data.groups) &&
    Array.isArray(data.credentials) &&
    (data.currentId === null || typeof data.currentId === "string") &&
    (data.activeGroupId === null || typeof data.activeGroupId === "string") &&
    data.profiles.every(
      (profile) =>
        typeof profile.id === "string" &&
        typeof profile.name === "string" &&
        typeof profile.email === "string" &&
        typeof profile.bio === "string" &&
        typeof profile.photo === "string" &&
        typeof profile.color === "string" &&
        Array.isArray(profile.categories) &&
        profile.categories.every((category) => categories.includes(category)) &&
        Array.isArray(profile.answers) &&
        Array.isArray(profile.wishlist) &&
        profile.wishlist.every(
          (item) =>
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.url === "string" &&
            typeof item.price === "string" &&
            typeof item.note === "string" &&
            typeof item.image === "string" &&
            typeof item.received === "boolean",
        ),
    ) &&
    data.groups.every(
      (group) =>
        typeof group.id === "string" &&
        typeof group.name === "string" &&
        typeof group.code === "string" &&
        Array.isArray(group.members) &&
        group.members.every((member) => typeof member === "string"),
    ) &&
    data.credentials.every(
      (credential) =>
        typeof credential.profileId === "string" &&
        typeof credential.salt === "string" &&
        typeof credential.hash === "string",
    )
  );
}

function readStorage(): Data {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isStoredData(parsed))
        return {
          ...parsed,
          recommendations: restoreRecommendationQueue(
            parsed.recommendations,
            parsed.profiles.map((profile) => profile.id),
          ),
        };
      storageError =
        "Saved data could not be read. A fresh local workspace has been opened.";
    }
  } catch {
    storageError =
      "Browser storage is unavailable. Changes will last for this visit only.";
  }
  return structuredClone(initialData);
}

function getSnapshot() {
  if (!snapshot && typeof window !== "undefined") snapshot = readStorage();
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      snapshot = readStorage();
      listeners.forEach((notify) => notify());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(change: (data: Data) => void) {
  const data = structuredClone(getSnapshot() ?? initialData);
  change(data);
  snapshot = data;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    storageError =
      "Changes could not be saved to this browser. Keep this tab open to retain them.";
  }
  listeners.forEach((listener) => listener());
}

function ownProfile(data: Data): Profile {
  const profile = data.profiles.find((person) => person.id === data.currentId);
  if (!profile) throw new Error("Please log in to continue.");
  return profile;
}

async function passwordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export const actions = {
  demo() {
    update((data) => {
      data.currentId = "alex";
      data.activeGroupId = "morgan";
    });
  },
  logout() {
    update((data) => {
      data.currentId = null;
    });
  },
  async register(name: string, email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || password.length < 8)
      throw new Error(
        "Enter your name and a password of at least 8 characters.",
      );
    const salt = crypto.randomUUID();
    const hash = await passwordHash(password, salt);
    update((data) => {
      if (
        data.profiles.some(
          (profile) => profile.email.toLowerCase() === normalized,
        )
      )
        throw new Error(
          "This email already has a local profile. Please log in.",
        );
      const id = crypto.randomUUID();
      data.profiles.push({
        id,
        name: name.trim(),
        email: normalized,
        bio: "",
        photo: "",
        color: "sage",
        categories: [],
        answers: [],
        wishlist: [],
      });
      data.credentials.push({ profileId: id, salt, hash });
      data.currentId = id;
      data.activeGroupId = null;
    });
  },
  async login(email: string, password: string) {
    const data = getSnapshot() ?? initialData;
    const profile = data.profiles.find(
      (person) => person.email.toLowerCase() === email.trim().toLowerCase(),
    );
    const credential = data.credentials.find(
      (entry) => entry.profileId === profile?.id,
    );
    if (
      !profile ||
      !credential ||
      (await passwordHash(password, credential.salt)) !== credential.hash
    )
      throw new Error(
        "Email or password does not match a local account on this browser.",
      );
    update((next) => {
      next.currentId = profile.id;
      next.activeGroupId =
        next.groups.find((group) => group.members.includes(profile.id))?.id ??
        null;
    });
  },
  createGroup(name: string) {
    if (!name.trim()) throw new Error("Give your group a name.");
    update((data) => {
      const profile = ownProfile(data);
      const id = crypto.randomUUID();
      let code = crypto.randomUUID().slice(0, 8).toUpperCase();
      while (data.groups.some((group) => group.code === code))
        code = crypto.randomUUID().slice(0, 8).toUpperCase();
      data.groups.push({ id, name: name.trim(), code, members: [profile.id] });
      data.activeGroupId = id;
    });
  },
  joinGroup(code: string) {
    update((data) => {
      const profile = ownProfile(data);
      const group = data.groups.find(
        (entry) => entry.code === code.trim().toUpperCase(),
      );
      if (!group)
        throw new Error(
          "That invite code was not found in this browser. Check the code and try again.",
        );
      if (!group.members.includes(profile.id)) group.members.push(profile.id);
      data.activeGroupId = group.id;
    });
  },
  switchGroup(id: string) {
    update((data) => {
      if (
        data.groups.some(
          (group) =>
            group.id === id && group.members.includes(ownProfile(data).id),
        )
      )
        data.activeGroupId = id;
    });
  },
  saveProfile(name: string, bio: string, occasionDate: string) {
    update((data) => {
      const profile = ownProfile(data);
      profile.name = name.trim() || profile.name;
      profile.bio = bio.trim();
      profile.occasionDate = occasionDate || undefined;
      profile.occasion = occasionDate ? "Birthday" : undefined;
    });
  },
  completeQuestionnaire(answers: number[]) {
    const results = scoreAnswers(answers);
    update((data) => {
      const profile = ownProfile(data);
      profile.answers = answers;
      profile.categories = results.map((result) => result.category);
    });
  },
  saveWish(item: Omit<WishlistItem, "id" | "received">, id?: string) {
    if (!item.name.trim()) throw new Error("Add a name for your wish.");
    if (
      item.price &&
      (!Number.isFinite(Number(item.price)) || Number(item.price) < 0)
    )
      throw new Error("Enter a valid price.");
    if (item.url) {
      const url = new URL(item.url);
      if (!["http:", "https:"].includes(url.protocol))
        throw new Error("Use an http or https product link.");
    }
    update((data) => {
      const profile = ownProfile(data);
      const existing = profile.wishlist.find((wish) => wish.id === id);
      if (existing) Object.assign(existing, item);
      else
        profile.wishlist.unshift({
          ...item,
          name: item.name.trim(),
          id: crypto.randomUUID(),
          received: false,
        });
    });
  },
  removeWish(id: string) {
    update((data) => {
      const profile = ownProfile(data);
      profile.wishlist = profile.wishlist.filter((item) => item.id !== id);
    });
  },
  toggleWish(id: string) {
    update((data) => {
      const item = ownProfile(data).wishlist.find((wish) => wish.id === id);
      if (item) item.received = !item.received;
    });
  },
  submitSuggestion(recipientId: string, suggestion: GiftSuggestion) {
    const gift = normalizeSuggestion(suggestion);
    update((data) => {
      const sender = ownProfile(data);
      if (
        recipientId === sender.id ||
        !data.profiles.some((profile) => profile.id === recipientId) ||
        !canViewProfile(data, recipientId)
      ) {
        throw new Error("Choose another person in one of your family groups.");
      }
      if (
        data.recommendations.some(
          (record) =>
            record.recipientId === recipientId &&
            giftKey(record.name) === giftKey(gift.name),
        )
      )
        return;
      data.recommendations.push({
        id: crypto.randomUUID(),
        recipientId,
        ...gift,
        status: "new",
      });
    });
  },
  prepareRecommendations() {
    update((data) => {
      const profile = ownProfile(data);
      const known = new Set([
        ...data.recommendations
          .filter((record) => record.recipientId === profile.id)
          .map((record) => giftKey(record.name)),
        ...profile.wishlist.map((wish) => giftKey(wish.name)),
      ]);
      for (const gift of recommendationTemplates(profile.categories)) {
        if (known.has(giftKey(gift.name))) continue;
        known.add(giftKey(gift.name));
        data.recommendations.push({
          id: crypto.randomUUID(),
          recipientId: profile.id,
          ...gift,
          status: "new",
        });
      }
    });
  },
  reviewRecommendation(id: string, decision: "added" | "saved" | "dismissed") {
    if (!["added", "saved", "dismissed"].includes(decision))
      throw new Error("Choose an available recommendation action.");
    update((data) => {
      const profile = ownProfile(data);
      const recommendation = data.recommendations.find(
        (record) => record.id === id && record.recipientId === profile.id,
      );
      if (!recommendation)
        throw new Error("That recommendation is not available in your queue.");
      if (
        recommendation.status === "added" ||
        recommendation.status === "dismissed"
      )
        return;
      if (
        decision === "added" &&
        !profile.wishlist.some(
          (wish) => giftKey(wish.name) === giftKey(recommendation.name),
        )
      ) {
        profile.wishlist.unshift({
          id: crypto.randomUUID(),
          name: recommendation.name,
          price: recommendation.price,
          note: "",
          image: "",
          url: "",
          received: false,
        });
      }
      recommendation.status = decision;
    });
  },
};

export function ownRecommendations(data: Data | null): ReviewRecommendation[] {
  if (!data?.currentId) return [];
  const profile = data.profiles.find((person) => person.id === data.currentId);
  if (!profile) return [];
  const wishes = new Set(profile.wishlist.map((wish) => giftKey(wish.name)));
  return reviewQueue(data.recommendations, profile.id).filter(
    (record) => !wishes.has(giftKey(record.name)),
  );
}

export function useGiftNest() {
  const data = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const user = data?.profiles.find((profile) => profile.id === data.currentId);
  const group = data?.groups.find(
    (entry) =>
      entry.id === data.activeGroupId &&
      !!user &&
      entry.members.includes(user.id),
  );
  return { data, user, group, storageError };
}

export function canViewProfile(data: Data, profileId: string) {
  return (
    data.currentId === profileId ||
    data.groups.some(
      (group) =>
        !!data.currentId &&
        group.members.includes(data.currentId) &&
        group.members.includes(profileId),
    )
  );
}
