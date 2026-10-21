"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Gift,
  Heart,
  Lightbulb,
  Plus,
  X,
} from "lucide-react";
import {
  actions,
  ownRecommendations,
  type Profile,
  useGiftNest,
} from "@/lib/store";
import type { ReviewRecommendation } from "@/lib/recommendations";
import { AppShell, Modal } from "./ui";

export function GiftSuggestionModal({
  recipient,
  onClose,
  onSent,
}: {
  recipient: Pick<Profile, "id" | "name">;
  onClose: () => void;
  onSent: () => void;
}) {
  const [error, setError] = useState("");
  return (
    <Modal
      title={`A little inspiration for ${recipient.name.split(" ")[0]}`}
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          try {
            actions.submitSuggestion(recipient.id, {
              name: String(form.get("name")),
              reason: String(form.get("reason")),
              price: String(form.get("price")),
            });
            onSent();
          } catch (problem) {
            setError((problem as Error).message);
          }
        }}
      >
        <label className="field">
          Gift name
          <input
            name="name"
            maxLength={90}
            required
            placeholder="A little something they might love..."
          />
        </label>
        <label className="field">
          Why it came to mind
          <span className="muted small">
            Optional. This note stays off their review cards.
          </span>
          <textarea
            name="reason"
            rows={3}
            maxLength={400}
            placeholder="A hobby, a favorite pastime, a small everyday pleasure..."
          />
        </label>
        <label className="field">
          Estimated price ($)
          <span className="muted small">Optional. A rough idea is plenty.</span>
          <input
            name="price"
            type="number"
            min="0"
            max="1000000"
            step="0.01"
            placeholder="Leave blank if you are not sure"
          />
        </label>
        <p className="suggestion-note">
          Keep names, purchase details, and clues about who it is from out of
          the gift name. An idea is not a purchase or a reservation.
        </p>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit" className="button primary full">
          <Lightbulb size={17} />
          Submit gift idea
        </button>
      </form>
      <p className="local-note">
        This early version works with accounts in this browser only. It cannot
        protect data from someone who can inspect this browser&apos;s storage.
      </p>
    </Modal>
  );
}

export function RecommendationsView() {
  const { data, user } = useGiftNest();
  const userId = user?.id;
  const [view, setView] = useState<"new" | "saved">("new");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (userId) actions.prepareRecommendations();
  }, [userId]);
  const queue = ownRecommendations(data).filter(
    (record) => record.status === view,
  );

  function review(
    record: ReviewRecommendation,
    decision: "added" | "saved" | "dismissed",
  ) {
    try {
      actions.reviewRecommendation(record.id, decision);
      setError("");
      setMessage(
        decision === "added"
          ? "Added to your wishlist. A lovely little hint."
          : decision === "saved"
            ? "Tucked away for another day."
            : "Set aside. That idea will stay out of your queue.",
      );
      requestAnimationFrame(() => heading.current?.focus());
    } catch (problem) {
      setError((problem as Error).message);
    }
  }

  return (
    <AppShell>
      <div className="page-heading">
        <div>
          <span className="eyebrow">LITTLE POSSIBILITIES, JUST FOR YOU</span>
          <h1>A little gift inspiration.</h1>
          <p>Keep what feels like you. Leave the rest for another day.</p>
        </div>
        <Link className="button secondary" href="/wishlist">
          <Heart size={17} />
          My wishlist
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div
        className="recommendation-filters"
        role="group"
        aria-label="Recommendation view"
      >
        <button
          type="button"
          aria-pressed={view === "new"}
          onClick={() => {
            setView("new");
            setMessage("");
          }}
        >
          <Lightbulb size={17} />
          New ideas
        </button>
        <button
          type="button"
          aria-pressed={view === "saved"}
          onClick={() => {
            setView("saved");
            setMessage("");
          }}
        >
          <Bookmark size={17} />
          Saved for later
        </button>
      </div>
      <p role="status" aria-live="polite" className="success-message">
        {message}
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <section aria-labelledby="recommendation-list-title">
        <div className="section-heading">
          <div>
            <h2 id="recommendation-list-title" ref={heading} tabIndex={-1}>
              {view === "new"
                ? "Something that might make your day"
                : "Little ideas worth keeping"}
            </h2>
            <p>
              {view === "new"
                ? "No need to decide everything today."
                : "Ready whenever the moment feels right."}
            </p>
          </div>
        </div>
        <div className="recommendation-grid">
          {queue.map((record) => (
            <article className="recommendation-card" key={record.id}>
              <span className="recommendation-icon" aria-hidden="true">
                <Gift size={26} strokeWidth={1.5} />
              </span>
              <h3>{record.name}</h3>
              <p className="recommendation-price">
                {record.price
                  ? `Around $${Number(record.price).toFixed(2)}`
                  : "No price in mind"}
              </p>
              <div className="recommendation-actions">
                <button
                  type="button"
                  className="button primary"
                  onClick={() => review(record, "added")}
                >
                  <Plus size={16} />
                  Add to wishlist
                </button>
                <button
                  type="button"
                  className="button secondary"
                  disabled={record.status === "saved"}
                  onClick={() => review(record, "saved")}
                >
                  {record.status === "saved" ? (
                    <BookmarkCheck size={16} />
                  ) : (
                    <Bookmark size={16} />
                  )}
                  {record.status === "saved"
                    ? "Saved for later"
                    : "Save for later"}
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => review(record, "dismissed")}
                >
                  <X size={16} />
                  Not interested
                </button>
              </div>
            </article>
          ))}
        </div>
        {!queue.length && (
          <div className="empty-state">
            <span className="large-icon">
              {view === "new" ? <Check size={28} /> : <Bookmark size={28} />}
            </span>
            <h3>
              {view === "new"
                ? "A little room for fresh inspiration."
                : "Nothing tucked away just yet."}
            </h3>
            <p>
              {view === "new"
                ? "You are all caught up for now. Your saved ideas will be here whenever you need them."
                : "When an idea catches your eye but the timing is not quite right, keep it for another day."}
            </p>
            <button
              type="button"
              className="button secondary"
              onClick={() => setView(view === "new" ? "saved" : "new")}
            >
              {view === "new" ? (
                <Bookmark size={17} />
              ) : (
                <Lightbulb size={17} />
              )}
              {view === "new" ? "See saved ideas" : "Explore new ideas"}
            </button>
          </div>
        )}
      </section>
    </AppShell>
  );
}
