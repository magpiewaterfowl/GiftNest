import type { Category } from "./questionnaire";

export type RecommendationStatus = "new" | "saved" | "dismissed" | "added";
export type GiftSuggestion = { name: string; reason?: string; price?: string };
export type Recommendation = {
  id: string;
  recipientId: string;
  name: string;
  reason: string;
  price: string;
  status: RecommendationStatus;
};
export type ReviewRecommendation = Pick<
  Recommendation,
  "id" | "name" | "price" | "status"
>;

const categoryIdeas: Record<Category, string> = {
  Technology: "A useful everyday gadget",
  Gaming: "A game for a cozy evening",
  "Books & Reading": "A book to get lost in",
  Learning: "A class in something new",
  Experiences: "Tickets to a local experience",
  Travel: "A journal for future adventures",
  Outdoors: "A picnic blanket for days outside",
  Fitness: "A comfortable exercise mat",
  Cooking: "A cookbook full of new favorites",
  "Home Improvement": "A handy kit for small home projects",
  Crafting: "A creative kit for a quiet afternoon",
  Collectibles: "A display for favorite little treasures",
  Music: "An album to enjoy from start to finish",
  "Movies & TV": "A movie-night comfort bundle",
  Fashion: "A versatile everyday accessory",
  "Self-Care": "A little bundle for an evening of rest",
  Pets: "An enrichment toy for a beloved pet",
  Gardening: "A small herb-growing kit",
  "Family Activities": "A game for an afternoon together",
  "Sentimental Gifts": "A keepsake box for favorite memories",
};

const sampleIdeas: GiftSuggestion[] = [
  { name: "A handwritten letter and a little treat", price: "10" },
  { name: "An afternoon together with no plans" },
  { name: "A favorite photograph in a simple frame", price: "20" },
];

export function giftKey(name: string): string {
  return name
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

export function normalizeSuggestion(
  input: GiftSuggestion,
): Required<GiftSuggestion> {
  const name = input.name.trim();
  const reason = (input.reason ?? "").trim();
  const price = (input.price ?? "").trim();
  if (!name || name.length > 90)
    throw new Error("Give this idea a name of 1 to 90 characters.");
  if (reason.length > 400)
    throw new Error("Keep your note to 400 characters or fewer.");
  if (
    price &&
    (!Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      Number(price) > 1000000)
  ) {
    throw new Error(
      "Enter an estimated price between $0 and $1,000,000, or leave it blank.",
    );
  }
  return { name, reason, price: price ? Number(price).toFixed(2) : "" };
}

export function recommendationTemplates(
  interests: readonly Category[],
): Required<GiftSuggestion>[] {
  const ideas: GiftSuggestion[] = [...new Set(interests)].map((category) => ({
    name: categoryIdeas[category],
  }));
  return [...ideas, ...sampleIdeas].map(normalizeSuggestion);
}

export function reviewQueue(
  records: readonly Recommendation[],
  recipientId: string,
): ReviewRecommendation[] {
  return records
    .filter((record) => record.recipientId === recipientId)
    .map(({ id, name, price, status }) => ({ id, name, price, status }))
    .sort((first, second) => first.id.localeCompare(second.id));
}

export function isRecommendation(value: unknown): value is Recommendation {
  if (!value || typeof value !== "object") return false;
  const record = value as Recommendation;
  const keys = ["id", "recipientId", "name", "reason", "price", "status"];
  if (
    Object.keys(record).some((key) => !keys.includes(key)) ||
    keys.some((key) => typeof record[key as keyof Recommendation] !== "string")
  )
    return false;
  if (
    !record.id ||
    !record.recipientId ||
    !["new", "saved", "dismissed", "added"].includes(record.status)
  )
    return false;
  try {
    normalizeSuggestion(record);
    return true;
  } catch {
    return false;
  }
}

export function restoreRecommendationQueue(
  value: unknown,
  recipients: readonly string[],
): Recommendation[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const ids = new Set<string>();
  return value.filter(isRecommendation).filter((record) => {
    const key = JSON.stringify([record.recipientId, giftKey(record.name)]);
    if (
      !recipients.includes(record.recipientId) ||
      seen.has(key) ||
      ids.has(record.id)
    )
      return false;
    seen.add(key);
    ids.add(record.id);
    return true;
  });
}
