"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Gift,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  actions,
  canViewProfile,
  photos,
  type Profile,
  type WishlistItem,
  useGiftNest,
} from "@/lib/store";
import { questions, scoreAnswers } from "@/lib/questionnaire";
import {
  AppShell,
  Avatar,
  Brand,
  CategoryIcon,
  CategoryTag,
  GroupModal,
  Modal,
} from "./ui";

function DemoButton({
  className = "button secondary",
  children = (
    <>
      Meet the demo family
      <ArrowUpRight size={17} />
    </>
  ),
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={() => {
        actions.demo();
        router.push("/dashboard");
      }}
    >
      {children}
    </button>
  );
}

export function LandingView() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav aria-label="Site navigation">
          <a href="#closer">A little about us</a>
          <Link href="/login">Log in</Link>
          <Link className="button primary" href="/signup">
            Make yourself at home
            <ArrowUpRight size={17} />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section
          className="landing-hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(20,49,42,.88), rgba(20,49,42,.48) 55%, rgba(20,49,42,.08)), url('${photos.gift}')`,
          }}
        >
          <div className="landing-hero-content">
            <span className="eyebrow light">
              <span />
              FOR THE PEOPLE WHO MATTER
            </span>
            <h1>GiftNest.</h1>
            <h2>
              Good gifts start with
              <br />
              knowing your people.
            </h2>
            <p>
              Little wishes. Big smiles. A thoughtful place to bring your family
              together, one gift at a time.
            </p>
            <div className="hero-actions">
              <Link href="/signup" className="button coral">
                Create your family nest
                <ArrowUpRight size={18} />
              </Link>
              <DemoButton className="button glass" />
            </div>
            <div className="hero-footnote">
              <Heart size={15} />
              Less guessing. More &ldquo;you remembered!&rdquo;
            </div>
          </div>
          <a
            href="#closer"
            className="hero-scroll"
            aria-label="Read more about GiftNest"
          >
            <ArrowDown size={21} />
          </a>
        </section>
        <section id="closer" className="landing-about">
          <div>
            <span className="eyebrow">IT IS THE THOUGHT THAT COUNTS</span>
            <h2>
              A little closer.
              <br />A lot more thoughtful.
            </h2>
          </div>
          <div className="about-items">
            <article>
              <Users size={23} />
              <h3>Your people, together</h3>
              <p>
                A shared space for family, close friends, and everyone who feels
                like home.
              </p>
            </article>
            <article>
              <Sparkles size={23} />
              <h3>The things that make them, them</h3>
              <p>
                Discover gift interests through everyday preferences, not
                stereotypes.
              </p>
            </article>
            <article>
              <Heart size={23} />
              <h3>Wishes worth remembering</h3>
              <p>
                Keep a little list of things you love and find inspiration in
                theirs.
              </p>
            </article>
          </div>
        </section>
        <section className="landing-cta">
          <Gift size={31} />
          <h2>Make someone feel known.</h2>
          <Link href="/signup" className="button primary">
            Start your nest
            <ArrowUpRight size={18} />
          </Link>
          <p>Free local preview. No AI. Just a little thoughtfulness.</p>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <span>Made for the people who matter.</span>
        <Link href="/login">
          Already part of the family? Log in
          <ArrowRight size={15} />
        </Link>
      </footer>
    </div>
  );
}

export function AuthView({ signup = false }: { signup?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-page">
      <div
        className="auth-story"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(19,55,43,.9), rgba(19,55,43,.15)), url('${photos.gift}')`,
        }}
      >
        <Brand light />
        <div>
          <span className="eyebrow light">THE BEST GIFTS SAY</span>
          <h2>
            &ldquo;I saw this.
            <br />I thought of you.&rdquo;
          </h2>
          <p>
            A home for little wishes and the people who make life a little
            sweeter.
          </p>
        </div>
        <span className="auth-story-bottom">
          <Heart size={16} />
          Thoughtful by nature. Together by choice.
        </span>
      </div>
      <main id="main" className="auth-main">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} />
          Back to GiftNest
        </Link>
        <div className="auth-form-wrap">
          <span className="large-icon">
            <Gift size={29} />
          </span>
          <span className="eyebrow">A LITTLE SPACE FOR YOUR PEOPLE</span>
          <h1>{signup ? "Welcome to the nest." : "Good to have you back."}</h1>
          <p className="muted">
            {signup
              ? "Thoughtful moments start here."
              : "Your people. Your wishes. All in one place."}
          </p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              setBusy(true);
              const form = new FormData(event.currentTarget);
              try {
                if (signup)
                  await actions.register(
                    String(form.get("name")),
                    String(form.get("email")),
                    String(form.get("password")),
                  );
                else
                  await actions.login(
                    String(form.get("email")),
                    String(form.get("password")),
                  );
                router.push("/dashboard");
              } catch (problem) {
                setError((problem as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {signup && (
              <label className="field">
                Your name
                <input
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  maxLength={60}
                  required
                />
              </label>
            )}
            <label className="field">
              Email address
              <div className="input-icon">
                <Mail size={17} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={120}
                  required
                />
              </div>
            </label>
            <label className="field">
              Password
              <div className="input-icon">
                <LockKeyhole size={17} />
                <input
                  name="password"
                  type={visible ? "text" : "password"}
                  placeholder={
                    signup
                      ? "At least 8 characters"
                      : "Your local account password"
                  }
                  autoComplete={signup ? "new-password" : "current-password"}
                  minLength={signup ? 8 : 1}
                  maxLength={128}
                  required
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button primary full"
              type="submit"
              disabled={busy}
            >
              {busy
                ? "One little moment..."
                : signup
                  ? "Create my account"
                  : "Log in"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="or-divider">
            <span>or take a look around</span>
          </div>
          <DemoButton className="button secondary full" />
          <p className="auth-switch">
            {signup ? "Already have a nest?" : "New around here?"}{" "}
            <Link href={signup ? "/login" : "/signup"}>
              {signup ? "Log in" : "Make yourself at home"}
            </Link>
          </p>
          <p className="local-note">
            <ShieldCheck size={17} />
            Local preview only. Accounts stay in this browser and cannot be
            recovered. Use a unique test password, not a real one.
          </p>
        </div>
        <span className="auth-bottom">A little thought goes a long way.</span>
      </main>
    </div>
  );
}

export function DashboardView() {
  const { data, user, group } = useGiftNest();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"invite" | "create" | "join" | null>(null);
  const [filter, setFilter] = useState<"everyone" | "wishes">("everyone");
  const members =
    data?.profiles.filter((profile) => group?.members.includes(profile.id)) ??
    [];
  const visible = members.filter(
    (profile) =>
      profile.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "everyone" ||
        profile.wishlist.some((item) => !item.received)),
  );
  const wishes = members.flatMap((profile) =>
    profile.wishlist
      .filter((item) => !item.received)
      .map((item) => ({ item, profile })),
  );
  const occasions = members
    .filter((profile) => profile.occasionDate)
    .map((profile) => {
      const now = new Date();
      const [month, day] = profile.occasionDate!.split("-").map(Number);
      let date = new Date(now.getFullYear(), month - 1, day);
      if (new Date(now.getFullYear(), now.getMonth(), now.getDate()) > date)
        date = new Date(now.getFullYear() + 1, month - 1, day);
      return {
        profile,
        date,
        days: Math.ceil(
          (date.getTime() -
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            ).getTime()) /
            86400000,
        ),
      };
    })
    .sort((first, second) => first.days - second.days);
  return (
    <AppShell search={search} onSearch={setSearch}>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR FAMILY, A LITTLE CLOSER</div>
          <h1>
            Hello, {user?.name.split(" ")[0] ?? "friend"}
            <span className="greeting-dot">.</span>
          </h1>
          <p>Let&apos;s make someone&apos;s day.</p>
        </div>
        <button className="button primary" onClick={() => setModal("invite")}>
          <Plus size={17} />
          Invite a loved one
        </button>
      </div>
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow">
            <Heart size={13} />
            THOUGHTFUL COMES NATURALLY
          </span>
          <h2>
            Great gifts begin with
            <br />a little knowing.
          </h2>
          <p>Big passions. Small wishes. Your favorite people.</p>
          <Link href="/questionnaire" className="button white">
            Discover my gift interests
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div
          className="welcome-photo"
          style={{ backgroundImage: `url('${photos.gift}')` }}
          role="img"
          aria-label="Thoughtfully wrapped gifts"
        />
        <span className="banner-label">
          <Gift size={15} />A little thought. A lot of love.
        </span>
      </section>
      <div className="stat-strip">
        <div>
          <span className="stat-icon sage">
            <Users size={19} />
          </span>
          <strong>{members.length}</strong>
          <span>people in your nest</span>
        </div>
        <div>
          <span className="stat-icon peach">
            <Heart size={19} />
          </span>
          <strong>{wishes.length}</strong>
          <span>little wishes to discover</span>
        </div>
        <div>
          <span className="stat-icon blue">
            <Sparkles size={19} />
          </span>
          <strong>
            {members.filter((member) => member.categories.length > 0).length}
          </strong>
          <span>personalities, unwrapped</span>
        </div>
      </div>
      {!group ? (
        <section className="empty-state">
          <span className="large-icon">
            <Users size={30} />
          </span>
          <h2>Every nest starts with someone.</h2>
          <p>Bring your favorite people into a space of their own.</p>
          <div className="button-row">
            <button
              className="button primary"
              onClick={() => setModal("create")}
            >
              <Plus size={17} />
              Create a family group
            </button>
            <button
              className="button secondary"
              onClick={() => setModal("join")}
            >
              Join with a code
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      ) : (
        <div className="dashboard-columns">
          <div className="dashboard-primary">
            <section className="family-section">
              <div className="section-heading">
                <div>
                  <h2>
                    Your favorite people
                    <span className="count-badge">{members.length}</span>
                  </h2>
                  <p>A few things that make them, them.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setModal("invite")}
                >
                  Invite someone
                  <Plus size={15} />
                </button>
              </div>
              <div className="family-toolbar">
                <div
                  className="filter-tabs"
                  role="tablist"
                  aria-label="Family filter"
                >
                  <button
                    role="tab"
                    aria-selected={filter === "everyone"}
                    onClick={() => setFilter("everyone")}
                  >
                    Everyone<span>{members.length}</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={filter === "wishes"}
                    onClick={() => setFilter("wishes")}
                  >
                    With a wishlist
                  </button>
                </div>
                <span className="small muted">Made up of good people.</span>
              </div>
              <div className="member-grid">
                {visible.map((profile) => (
                  <MemberCard
                    key={profile.id}
                    profile={profile}
                    own={profile.id === user?.id}
                  />
                ))}
              </div>
              {!visible.length && (
                <div className="empty-state compact">
                  <Search size={24} />
                  <h3>No one found</h3>
                  <p>Try another name or filter.</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setFilter("everyone");
                    }}
                  >
                    Clear filters
                    <X size={15} />
                  </button>
                </div>
              )}
            </section>
            <section className="wishlist-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">A LITTLE INSPIRATION</span>
                  <h2>Wishes from your nest</h2>
                  <p>They dropped a hint. You remembered.</p>
                </div>
                <Link href="/wishlist" className="text-button">
                  My wishlist
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="wish-preview-grid">
                {wishes.slice(0, 3).map(({ item, profile }) => (
                  <Link
                    href={`/profile/?member=${encodeURIComponent(profile.id)}`}
                    className="wish-preview"
                    key={item.id}
                  >
                    <div className="wish-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <Gift size={38} />
                      )}
                      <span className="wish-heart">
                        <Heart size={16} />
                      </span>
                    </div>
                    <div className="wish-preview-content">
                      <span className="wish-owner">
                        <Avatar profile={profile} size="sm" />
                        {profile.name.split(" ")[0]}&apos;s wishlist
                      </span>
                      <h3>{item.name}</h3>
                      <span className="small muted">
                        {item.price
                          ? `Around $${Number(item.price).toFixed(0)}`
                          : "A thoughtful little wish"}
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {!wishes.length && (
                <div className="empty-state compact">
                  <Heart size={25} />
                  <p>A few little wishes would feel right at home here.</p>
                  <Link href="/wishlist" className="text-button">
                    Add your first wish
                    <Plus size={15} />
                  </Link>
                </div>
              )}
            </section>
          </div>
          <aside className="dashboard-aside">
            <section className="nudge-panel">
              <span className="nudge-icon">
                <Sparkles size={24} />
              </span>
              <span className="eyebrow">A LITTLE SELF-DISCOVERY</span>
              <h3>
                What makes you,
                <br />
                you?
              </h3>
              <p>
                {user?.answers.length
                  ? "Your interests are part of your story. There is always something new to discover."
                  : "A few everyday choices. A few delightful discoveries about your gift personality."}
              </p>
              <Link
                href={user?.answers.length ? "/results" : "/questionnaire"}
                className="button primary full"
              >
                {user?.answers.length
                  ? "See my gift interests"
                  : "Find my gift interests"}
                <ArrowRight size={16} />
              </Link>
              <span className="nudge-time">
                <Clock3 size={13} />
                10 questions. A moment just for you.
              </span>
            </section>
            <section className="occasion-section">
              <div className="section-heading">
                <h3>
                  Coming up
                  <CalendarDays size={16} />
                </h3>
              </div>
              {occasions.length ? (
                occasions.slice(0, 3).map(({ profile, date, days }) => (
                  <Link
                    href={`/profile/?member=${encodeURIComponent(profile.id)}`}
                    key={profile.id}
                    className="occasion"
                  >
                    <div className="occasion-date">
                      <span>
                        {date
                          .toLocaleDateString("en-US", { month: "short" })
                          .toUpperCase()}
                      </span>
                      <strong>{date.getDate()}</strong>
                    </div>
                    <div>
                      <strong>
                        {profile.name.split(" ")[0]}&apos;s{" "}
                        {profile.occasion?.toLowerCase()}
                      </strong>
                      <span>
                        {days === 0
                          ? "Today! A little celebrating is in order."
                          : `In ${days} days`}
                      </span>
                    </div>
                    <ChevronRight size={15} />
                  </Link>
                ))
              ) : (
                <p className="muted small">
                  No occasions on the calendar yet. An optional birthday can be
                  added to your profile.
                </p>
              )}
            </section>
            <div className="thought-note">
              <Heart size={19} />
              <p>
                The best gifts aren&apos;t always things.
                <br />
                Sometimes, they&apos;re a little
                <br />
                &ldquo;I know you.&rdquo;
              </p>
              <span>A GIFTNEST REMINDER</span>
            </div>
          </aside>
        </div>
      )}
      {modal && <GroupModal initial={modal} onClose={() => setModal(null)} />}
    </AppShell>
  );
}

function MemberCard({ profile, own }: { profile: Profile; own: boolean }) {
  return (
    <Link
      href={own ? "/profile" : `/profile/?member=${encodeURIComponent(profile.id)}`}
      className="member-card"
    >
      <div className={`member-cover ${profile.color}`}>
        <span className="member-cover-mark">
          <Leaf size={45} strokeWidth={0.8} />
        </span>
        {own && <span className="you-label">THAT&apos;S YOU</span>}
      </div>
      <div className="member-card-body">
        <Avatar profile={profile} size="lg" />
        <h3>{profile.name}</h3>
        <span className="member-subtitle">
          {profile.categories.length
            ? "A few of their favorite things"
            : "A personality waiting to be unwrapped"}
        </span>
        <div className="member-tags">
          {profile.categories.slice(0, 2).map((category) => (
            <CategoryTag key={category} category={category} />
          ))}
          {!profile.categories.length && (
            <span className="small muted">No gift interests just yet</span>
          )}
        </div>
        <div className="member-card-footer">
          <span>
            <Heart size={14} />
            {profile.wishlist.filter((item) => !item.received).length} wishes
          </span>
          <span className="circle-arrow">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProfileRouteView() {
  const params = useSearchParams();
  return <ProfileView memberId={params.get("member") || undefined} />;
}

export function ProfileView({
  memberId,
  wishlistOnly = false,
}: {
  memberId?: string;
  wishlistOnly?: boolean;
}) {
  const { data, user } = useGiftNest();
  const [editing, setEditing] = useState(false);
  const [wishEdit, setWishEdit] = useState<WishlistItem | "new" | null>(null);
  const [status, setStatus] = useState("");
  const own = !memberId || memberId === user?.id;
  const profile = memberId
    ? data?.profiles.find((entry) => entry.id === memberId)
    : user;
  const allowed = data && profile && canViewProfile(data, profile.id);
  return (
    <AppShell>
      {profile && allowed ? (
        <>
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {wishlistOnly
                  ? "LITTLE HINTS, BIG SMILES"
                  : own
                    ? "A LITTLE MORE YOU"
                    : "GET TO KNOW YOUR PEOPLE"}
              </span>
              <h1>
                {wishlistOnly
                  ? "My little wishlist"
                  : own
                    ? "My profile"
                    : `${profile.name.split(" ")[0]}'s corner`}
              </h1>
              <p>
                {wishlistOnly
                  ? "A few things you would love, for the people who love you."
                  : "The passions, preferences, and little things that matter."}
              </p>
            </div>
            {own && (
              <button
                className="button primary"
                onClick={() =>
                  wishlistOnly ? setWishEdit("new") : setEditing(true)
                }
              >
                {wishlistOnly ? <Plus size={17} /> : <Pencil size={16} />}
                {wishlistOnly ? "Add a wish" : "Edit my profile"}
              </button>
            )}
          </div>
          {!wishlistOnly && (
            <>
              <section className="profile-overview">
                <div className={`profile-banner ${profile.color}`}>
                  <span className="eyebrow">
                    <Heart size={14} />
                    ONE OF A KIND. JUST LIKE YOU.
                  </span>
                </div>
                <div className="profile-details">
                  <Avatar profile={profile} size="xl" />
                  <div>
                    <h2>{profile.name}</h2>
                    <p>
                      {profile.bio ||
                        "There is a little more to discover here."}
                    </p>
                    {profile.occasionDate && (
                      <span className="birthday-line">
                        <CalendarDays size={15} />
                        Birthday:{" "}
                        {new Date(
                          `2000-${profile.occasionDate}T12:00:00`,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  {own && (
                    <span className="profile-own-badge">
                      <CheckCircle2 size={15} />
                      Your personal corner
                    </span>
                  )}
                </div>
              </section>
              <section className="profile-interests">
                <div className="section-heading">
                  <div>
                    <h2>
                      {own
                        ? "My gift interests"
                        : `${profile.name.split(" ")[0]}'s gift interests`}
                    </h2>
                    <p>A thoughtful starting point, not a box to fit into.</p>
                  </div>
                  {own && (
                    <Link href="/questionnaire" className="text-button">
                      {profile.answers.length
                        ? "Retake questionnaire"
                        : "Discover my interests"}
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
                <div className="interest-strip">
                  {profile.categories.map((category, index) => (
                    <div className="interest-tile" key={category}>
                      <span className={`interest-icon tone-${index}`}>
                        <CategoryIcon category={category} size={25} />
                      </span>
                      <span>
                        <small>0{index + 1}</small>
                        <strong>{category}</strong>
                      </span>
                    </div>
                  ))}
                </div>
                {!profile.categories.length && (
                  <div className="empty-state compact">
                    <Sparkles size={24} />
                    <p>
                      {own
                        ? "Your gift personality is waiting to be discovered."
                        : "No gift interests shared yet."}
                    </p>
                    {own && (
                      <Link href="/questionnaire" className="button secondary">
                        Take the questionnaire
                        <ArrowRight size={17} />
                      </Link>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
          <section className="profile-wishlist">
            <div className="section-heading">
              <div>
                <h2>
                  {wishlistOnly
                    ? "All my wishes"
                    : own
                      ? "My wishlist"
                      : `${profile.name.split(" ")[0]}'s wishlist`}
                  <span className="count-badge">{profile.wishlist.length}</span>
                </h2>
                <p>A little inspiration for a lot of thoughtfulness.</p>
              </div>
              {own && !wishlistOnly && (
                <button
                  className="button secondary"
                  onClick={() => setWishEdit("new")}
                >
                  <Plus size={16} />
                  Add a wish
                </button>
              )}
            </div>
            <p role="status" className="success-message">
              {status}
            </p>
            <div className="full-wishlist-grid">
              {profile.wishlist.map((item) => (
                <article
                  className={`wishlist-card ${item.received ? "received" : ""}`}
                  key={item.id}
                >
                  <div className="wishlist-card-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <Gift size={45} strokeWidth={1.2} />
                    )}
                    {item.received && (
                      <span className="received-badge">
                        <Check size={14} />
                        Wish came true
                      </span>
                    )}
                  </div>
                  <div className="wishlist-card-body">
                    <div className="wish-title">
                      <h3>{item.name}</h3>
                      {item.price && (
                        <span>${Number(item.price).toFixed(2)}</span>
                      )}
                    </div>
                    <p>{item.note || "A little something I would love."}</p>
                    <div className="wishlist-card-actions">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-button"
                        >
                          View gift
                          <ArrowUpRight size={16} />
                        </a>
                      ) : (
                        <span className="small muted">
                          A little inspiration
                        </span>
                      )}
                      {own && (
                        <div className="button-row">
                          <button
                            className="icon-button"
                            title={
                              item.received
                                ? "Mark as still wishing"
                                : "Mark as received"
                            }
                            onClick={() => {
                              actions.toggleWish(item.id);
                              setStatus(
                                item.received
                                  ? "Wish moved back to your list."
                                  : "A wish came true. How lovely!",
                              );
                            }}
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button
                            className="icon-button"
                            title="Edit wish"
                            onClick={() => setWishEdit(item)}
                          >
                            <Pencil size={16} />
                          </button>
                          <DeleteWish
                            item={item}
                            onDeleted={() => setStatus("Wish removed.")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!profile.wishlist.length && (
              <div className="empty-state">
                <span className="large-icon">
                  <Heart size={29} />
                </span>
                <h3>
                  {own
                    ? "Every wish starts somewhere."
                    : "A few wishes are still on their way."}
                </h3>
                <p>
                  {own
                    ? "Something useful, something lovely, or an experience to remember."
                    : "Check back for a little inspiration."}
                </p>
                {own && (
                  <button
                    className="button primary"
                    onClick={() => setWishEdit("new")}
                  >
                    <Plus size={17} />
                    Add my first wish
                  </button>
                )}
              </div>
            )}
          </section>
          {editing && (
            <EditProfile profile={profile} onClose={() => setEditing(false)} />
          )}
          {wishEdit && (
            <WishEditor
              item={wishEdit === "new" ? undefined : wishEdit}
              onClose={() => setWishEdit(null)}
              onSaved={() => {
                setWishEdit(null);
                setStatus("Your wish is saved.");
              }}
            />
          )}
        </>
      ) : (
        <section className="empty-state">
          <Users size={32} />
          <h1>This corner is private.</h1>
          <p>You can view profiles of people in your family groups.</p>
          <Link className="button primary" href="/dashboard">
            Back to your family
            <ArrowRight size={17} />
          </Link>
        </section>
      )}
    </AppShell>
  );
}

function DeleteWish({
  item,
  onDeleted,
}: {
  item: WishlistItem;
  onDeleted: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <button
        className="icon-button danger-button"
        title="Remove wish"
        onClick={() => setConfirm(true)}
      >
        <Trash2 size={16} />
      </button>
      {confirm && (
        <Modal
          title="Remove this little wish?"
          onClose={() => setConfirm(false)}
        >
          <p className="muted">
            &ldquo;{item.name}&rdquo; will be removed from your wishlist. This
            cannot be undone.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Keep it
            </button>
            <button
              className="button danger"
              onClick={() => {
                actions.removeWish(item.id);
                onDeleted();
                setConfirm(false);
              }}
            >
              <Trash2 size={16} />
              Remove wish
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function EditProfile({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  return (
    <Modal title="A little more about you" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          actions.saveProfile(
            String(form.get("name")),
            String(form.get("bio")),
            String(form.get("birthday")),
          );
          onClose();
        }}
      >
        <label className="field">
          Your name
          <input
            name="name"
            defaultValue={profile.name}
            required
            maxLength={60}
          />
        </label>
        <label className="field">
          A little about you
          <textarea
            name="bio"
            rows={3}
            maxLength={280}
            defaultValue={profile.bio}
            placeholder="The little things that make you happy..."
          />
        </label>
        <label className="field">
          Birthday, month and day{" "}
          <span className="muted small">Optional. No birth year needed.</span>
          <input
            type="text"
            name="birthday"
            defaultValue={profile.occasionDate}
            placeholder="MM-DD, e.g. 06-15"
            pattern="(02-(0[1-9]|1[0-9]|2[0-9])|(04|06|09|11)-(0[1-9]|[12][0-9]|30)|(01|03|05|07|08|10|12)-(0[1-9]|[12][0-9]|3[01]))"
            title="Enter a valid month and day in MM-DD format"
          />
        </label>
        <button className="button primary full" type="submit">
          Save my profile
          <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}

function WishEditor({
  item,
  onClose,
  onSaved,
}: {
  item?: WishlistItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [image, setImage] = useState(item?.image ?? "");
  const options = [
    { label: "No photo", value: "" },
    { label: "Plants", value: photos.plant },
    { label: "Photography", value: photos.camera },
    { label: "Books", value: photos.book },
    { label: "Coffee", value: photos.coffee },
    { label: "Adventure", value: photos.hiking },
  ];
  return (
    <Modal
      title={item ? "A little wish, refined" : "What are you wishing for?"}
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          try {
            actions.saveWish(
              {
                name: String(form.get("name")),
                price: String(form.get("price")),
                url: String(form.get("url")).trim(),
                note: String(form.get("note")),
                image,
              },
              item?.id,
            );
            onSaved();
          } catch (problem) {
            setError((problem as Error).message);
          }
        }}
      >
        <label className="field">
          Wish name
          <input
            name="name"
            defaultValue={item?.name}
            placeholder="Something you would love..."
            maxLength={90}
            required
          />
        </label>
        <div className="form-columns">
          <label className="field">
            Approximate price ($)
            <input
              type="number"
              name="price"
              defaultValue={item?.price}
              min="0"
              max="1000000"
              step="0.01"
              placeholder="Optional"
            />
          </label>
          <label className="field">
            A little picture
            <select
              value={image}
              onChange={(event) => setImage(event.target.value)}
            >
              {options.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          Product link <span className="muted small">Optional</span>
          <input
            name="url"
            type="url"
            defaultValue={item?.url}
            placeholder="https://..."
            maxLength={2000}
          />
        </label>
        <label className="field">
          A note for your people <span className="muted small">Optional</span>
          <textarea
            name="note"
            defaultValue={item?.note}
            rows={3}
            maxLength={400}
            placeholder="A favorite color, a size, or why you love it..."
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button primary full" type="submit">
          {item ? "Save changes" : "Add to my wishlist"}
          <Heart size={17} />
        </button>
      </form>
    </Modal>
  );
}

export function QuestionnaireView() {
  return (
    <AppShell>
      <Questionnaire />
    </AppShell>
  );
}

function Questionnaire() {
  const { user } = useGiftNest();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [restart, setRestart] = useState(false);
  const question = questions[step];
  return (
    <div className="questionnaire-wrap">
      <Link href="/dashboard" className="back-link">
        <ArrowLeft size={16} />
        Back to your nest
      </Link>
      <div className="questionnaire-heading">
        <span className="large-icon">
          <Sparkles size={30} />
        </span>
        <span className="eyebrow">YOUR GIFT PERSONALITY, UNWRAPPED</span>
        <h1>A few little things about you.</h1>
        <p>No labels. No wrong answers. Just what feels like you.</p>
      </div>
      {user?.answers.length === 10 && !restart && (
        <div className="previous-results">
          <CheckCircle2 size={20} />
          <p>You&apos;ve already unwrapped your interests.</p>
          <Link href="/results">
            View my results
            <ArrowUpRight size={15} />
          </Link>
          <button className="text-button" onClick={() => setRestart(true)}>
            Start fresh
          </button>
        </div>
      )}
      <section className="question-surface" aria-labelledby="question-title">
        <div className="question-progress-label">
          <span>
            QUESTION {String(step + 1).padStart(2, "0")} OF {questions.length}
          </span>
          <span>
            {Math.round(
              (answers.filter((answer) => Number.isInteger(answer)).length /
                questions.length) *
                100,
            )}
            % complete
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Questionnaire progress"
          aria-valuenow={step + 1}
          aria-valuemin={0}
          aria-valuemax={10}
        >
          <span style={{ width: `${(step + 1) * 10}%` }} />
        </div>
        <h2 id="question-title" tabIndex={-1}>
          {question.title}
        </h2>
        <p className="muted">{question.hint}</p>
        <fieldset className="answer-options">
          <legend className="sr-only">
            Choose the answer that feels most like you
          </legend>
          {question.answers.map((answer, index) => (
            <label
              className={`answer-option ${answers[step] === index ? "chosen" : ""}`}
              key={answer.text}
            >
              <input
                type="radio"
                name={`question-${step}`}
                value={index}
                checked={answers[step] === index}
                onChange={() => {
                  setAnswers((previous) => {
                    const next = [...previous];
                    next[step] = index;
                    return next;
                  });
                  setError("");
                }}
              />
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{answer.text}</span>
              <span className="answer-radio">
                {answers[step] === index && <Check size={14} />}
              </span>
            </label>
          ))}
        </fieldset>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="question-navigation">
          <button
            className="button secondary"
            disabled={step === 0}
            onClick={() => {
              setStep(step - 1);
              setError("");
              document.getElementById("question-title")?.focus();
            }}
          >
            <ArrowLeft size={17} />
            Previous
          </button>
          <button
            className="button primary"
            disabled={answers[step] === undefined}
            onClick={() => {
              if (step < questions.length - 1) {
                setStep(step + 1);
                document.getElementById("question-title")?.focus();
              } else {
                try {
                  actions.completeQuestionnaire(answers);
                  router.push("/results");
                } catch (problem) {
                  setError((problem as Error).message);
                }
              }
            }}
          >
            {step === questions.length - 1
              ? "Unwrap my results"
              : "Next question"}
            {step === questions.length - 1 ? (
              <Sparkles size={17} />
            ) : (
              <ArrowRight size={17} />
            )}
          </button>
        </div>
      </section>
      <p className="question-privacy">
        <ShieldCheck size={15} />
        Only your top five interests are shown to your family. Answers stay in
        this browser.
      </p>
      <p className="question-draft">
        Your progress stays while this page is open. Refreshing starts a new
        questionnaire.
      </p>
    </div>
  );
}

export function ResultsView() {
  const { user } = useGiftNest();
  const results = user?.answers.length === 10 ? scoreAnswers(user.answers) : [];
  return (
    <AppShell>
      <div className="results-wrap">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={16} />
          Back to your nest
        </Link>
        {results.length ? (
          <>
            <header className="results-heading">
              <span className="results-spark">
                <Sparkles size={34} strokeWidth={1.4} />
              </span>
              <span className="eyebrow">A LITTLE DISCOVERY. A LOT OF YOU.</span>
              <h1>
                Your gift personality,
                <br />
                <span>thoughtfully unwrapped.</span>
              </h1>
              <p>
                Five interests that feel like you. A little inspiration for your
                people.
              </p>
              <span className="saved-label">
                <CheckCircle2 size={15} />
                Saved to your profile
              </span>
            </header>
            <div className="results-grid">
              {results.map((result, index) => (
                <article
                  key={result.category}
                  className={`result-card result-${index}`}
                >
                  <div className="result-number">
                    0{index + 1}
                    <span>
                      {index === 0
                        ? "YOUR STRONGEST MATCH"
                        : "A LITTLE MORE YOU"}
                    </span>
                  </div>
                  <span className={`result-icon tone-${index}`}>
                    <CategoryIcon category={result.category} size={32} />
                  </span>
                  <h2>{result.category}</h2>
                  <p>
                    {categoryDescriptions[result.category] ??
                      "A thoughtful part of your everyday story."}
                  </p>
                  <div className="result-score">
                    <span
                      style={{
                        width: `${Math.max(8, Math.round((result.score / 30) * 100))}%`,
                      }}
                    />
                  </div>
                  <span className="small muted">
                    {result.score} interest points
                  </span>
                </article>
              ))}
            </div>
            <div className="results-close">
              <Heart size={23} />
              <h2>A starting point, not a label.</h2>
              <p>
                Your interests are as wonderfully varied as you are. Share a few
                wishes to make them even more personal.
              </p>
              <div className="button-row">
                <Link className="button primary" href="/wishlist">
                  <Plus size={17} />
                  Add a little wish
                </Link>
                <Link className="button secondary" href="/profile">
                  View my profile
                  <ArrowUpRight size={17} />
                </Link>
              </div>
              <Link href="/questionnaire" className="text-button">
                Feeling different? Take it again
                <ArrowRight size={15} />
              </Link>
            </div>
          </>
        ) : (
          <section className="empty-state results-empty">
            <span className="large-icon">
              <Sparkles size={35} />
            </span>
            <h1>There is a little more to discover.</h1>
            <p>
              A few everyday preferences can reveal some lovely gift
              inspiration.
            </p>
            <Link href="/questionnaire" className="button primary">
              Find my gift interests
              <ArrowRight size={17} />
            </Link>
            {!!user?.categories.length && (
              <Link href="/profile" className="text-button">
                View sample interests on my profile
                <ArrowUpRight size={15} />
              </Link>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

const categoryDescriptions: Record<string, string> = {
  Technology:
    "Clever little things that make everyday life a bit more extraordinary.",
  Gaming: "New worlds, friendly competition, and one more round together.",
  "Books & Reading":
    "A quiet corner, a new perspective, and just one more chapter.",
  Learning: "Fresh ideas and the joy of discovering something you never knew.",
  Experiences: "The kind of moments you will be talking about for years.",
  Travel: "New places, unexpected discoveries, and stories to bring home.",
  Outdoors: "Fresh air, open paths, and a little room to wander.",
  Fitness: "A little movement and that feel-good, just-for-you energy.",
  Cooking:
    "Something delicious, made with a little patience and a lot of love.",
  "Home Improvement":
    "Thoughtful touches that make your space feel more like you.",
  Crafting: "Making something beautiful, one small detail at a time.",
  Collectibles: "Special finds, little treasures, and a story behind each one.",
  Music: "The perfect soundtrack for your everyday moments.",
  "Movies & TV": "A great story, a favorite character, and a cozy evening in.",
  Fashion: "Personal touches that make you feel wonderfully yourself.",
  "Self-Care": "A deep breath and a little permission to put yourself first.",
  Pets: "Little comforts for the companions who make your days brighter.",
  Gardening: "A little sunshine, something growing, and the joy of tending.",
  "Family Activities":
    "Good company and moments that bring everyone a little closer.",
  "Sentimental Gifts":
    "Memories made tangible. The little things that mean everything.",
};
