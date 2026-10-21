"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Clapperboard,
  CookingPot,
  Dumbbell,
  Gem,
  GraduationCap,
  Hammer,
  Monitor,
  PawPrint,
  Scissors,
  Shirt,
  Sprout,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Flower2,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Leaf,
  Lightbulb,
  Menu,
  Music2,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
  LogOut,
  ClipboardList,
  Copy,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { actions, type Profile, useGiftNest } from "@/lib/store";
import type { Category } from "@/lib/questionnaire";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="GiftNest home"
    >
      <span className="brand-symbol">
        <Gift size={24} strokeWidth={1.7} />
      </span>
      GiftNest<span className="brand-dot">.</span>
    </Link>
  );
}

export function Avatar({
  profile,
  size = "md",
}: {
  profile: Pick<Profile, "name" | "photo" | "color">;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <span className={`avatar avatar-${size} ${profile.color}`}>
      {profile.photo ? (
        <img src={profile.photo} alt="" />
      ) : (
        <span>
          {profile.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")}
        </span>
      )}
    </span>
  );
}

export function CategoryIcon({
  category,
  size = 17,
}: {
  category: Category;
  size?: number;
}) {
  const icons: Record<Category, LucideIcon> = {
    Technology: Monitor,
    "Books & Reading": BookOpen,
    Learning: GraduationCap,
    Gardening: Sprout,
    Outdoors: Leaf,
    Fitness: Dumbbell,
    Cooking: CookingPot,
    "Home Improvement": Hammer,
    Crafting: Scissors,
    Collectibles: Gem,
    Music: Music2,
    "Movies & TV": Clapperboard,
    Fashion: Shirt,
    "Self-Care": Flower2,
    Pets: PawPrint,
    Gaming: Gamepad2,
    Travel: Compass,
    "Sentimental Gifts": Heart,
    Experiences: PartyPopper,
    "Family Activities": Users,
  };
  const Icon = icons[category] ?? Sparkles;
  return <Icon size={size} aria-hidden="true" />;
}

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className="category-tag">
      <CategoryIcon category={category} size={13} />
      {category}
    </span>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  return (
    <dialog
      className="modal"
      aria-label={title}
      ref={ref}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function GroupModal({
  initial = "invite",
  onClose,
}: {
  initial?: "invite" | "create" | "join";
  onClose: () => void;
}) {
  const { group } = useGiftNest();
  const [tab, setTab] = useState(initial);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <Modal title="Your people, all together" onClose={onClose}>
      <div className="segmented" role="tablist" aria-label="Group actions">
        {(["invite", "create", "join"] as const).map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => {
              setTab(value);
              setError("");
            }}
          >
            {value === "invite"
              ? "Invite family"
              : value === "create"
                ? "Create group"
                : "Join group"}
          </button>
        ))}
      </div>
      {tab === "invite" ? (
        <div className="invite-content">
          <span className="large-icon">
            <Users size={30} />
          </span>
          <h3>A place for your favorite people</h3>
          <p>Invite someone to {group?.name ?? "your group"}.</p>
          {group ? (
            <>
              <div className="invite-code">
                {group.code}
                <button
                  title="Copy invite code"
                  className="icon-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(group.code);
                      setCopied(true);
                    } catch {
                      setError(
                        "Your browser could not copy that. Select the code and copy it instead.",
                      );
                    }
                  }}
                >
                  {copied ? <Check size={19} /> : <Copy size={19} />}
                </button>
              </div>
              <p role="status">
                {copied
                  ? "Invite code copied."
                  : "Share this code with your family."}
              </p>
            </>
          ) : (
            <button className="button primary" onClick={() => setTab("create")}>
              Create your first group
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const value = String(
              new FormData(event.currentTarget).get("value"),
            );
            try {
              if (tab === "create") actions.createGroup(value);
              else actions.joinGroup(value);
              onClose();
            } catch (problem) {
              setError((problem as Error).message);
            }
          }}
        >
          <label className="field">
            {tab === "create" ? "Group name" : "Invite code"}
            <input
              name="value"
              placeholder={
                tab === "create"
                  ? "e.g. The Sunday crew"
                  : "Enter your invite code"
              }
              maxLength={tab === "create" ? 60 : 20}
              required
              autoComplete="off"
            />
          </label>
          <button className="button primary full" type="submit">
            {tab === "create" ? "Create group" : "Join group"}
            <ArrowUpRight size={17} />
          </button>
        </form>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="local-note">
        <CircleHelp size={15} />
        For now, invite codes connect accounts saved in this browser only. They
        cannot connect someone on another device yet.
      </p>
    </Modal>
  );
}

export function AppShell({
  children,
  search,
  onSearch,
}: {
  children: React.ReactNode;
  search?: string;
  onSearch?: (value: string) => void;
}) {
  const { data, user, group, storageError } = useGiftNest();
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [help, setHelp] = useState(false);
  const nav = [
    { href: "/dashboard", label: "Family dashboard", icon: Home },
    { href: "/wishlist", label: "My wishlist", icon: Heart },
    { href: "/recommendations", label: "Gift inspiration", icon: Lightbulb },
    { href: "/results", label: "My gift interests", icon: Sparkles },
    { href: "/questionnaire", label: "Questionnaire", icon: ClipboardList },
  ];
  if (!data)
    return (
      <main id="main" className="loading">
        <Gift size={32} />
        <p>Getting your nest ready...</p>
      </main>
    );
  if (!user)
    return (
      <main id="main" className="gate">
        <Brand />
        <span className="large-icon">
          <Users size={35} />
        </span>
        <h1>Your people are waiting.</h1>
        <p>
          Log in to the account saved on this device, or meet our fictional
          family while you take a look around.
        </p>
        <Link className="button primary" href="/login">
          Log in
          <ArrowUpRight size={18} />
        </Link>
        <button className="button secondary" onClick={() => actions.demo()}>
          Explore the demo family
        </button>
        <p className="muted small">
          Just looking? The example family is a lovely place to start.
        </p>
      </main>
    );
  return (
    <div className="app-layout">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <button className="group-selector" onClick={() => setGroupModal(true)}>
          <span className="group-icon">
            <Users size={19} />
          </span>
          <span>
            <small>YOUR FAMILY SPACE</small>
            <strong>{group?.name ?? "Find your people"}</strong>
          </span>
          <ChevronDown size={15} />
        </button>
        <p className="nav-caption">MAKE YOURSELF AT HOME</p>
        <nav aria-label="Main navigation">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`nav-item ${pathname === href ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} />
              {label}
              {pathname === href && <span className="active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-invite">
          <span className="invite-art">
            <Gift size={31} strokeWidth={1.4} />
            <Heart size={13} />
          </span>
          <h3>Better with your people.</h3>
          <p>
            A little less guessing.
            <br />A lot more thoughtful gifting.
          </p>
          <button onClick={() => setGroupModal(true)}>
            Invite your family
            <Plus size={16} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setHelp(true)}>
            <CircleHelp size={19} />A little help
          </button>
          <Link
            href="/profile"
            className={`sidebar-user ${pathname === "/profile" ? "selected" : ""}`}
          >
            <Avatar profile={user} size="sm" />
            <span>
              <strong>{user.name}</strong>
              <small>My profile & preferences</small>
            </span>
            <Settings2 size={17} />
          </Link>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-only"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Your nest <span>/</span>{" "}
              <strong>
                {pathname === "/dashboard"
                  ? "Family dashboard"
                  : pathname === "/wishlist"
                    ? "My wishlist"
                    : pathname === "/recommendations"
                      ? "Gift inspiration"
                      : pathname === "/questionnaire"
                        ? "Questionnaire"
                        : pathname === "/results"
                          ? "Gift interests"
                          : "Profile"}
              </strong>
            </span>
          </div>
          <div className="topbar-right">
            {onSearch && (
              <label className="search-box">
                <Search size={17} />
                <input
                  aria-label="Search family members"
                  placeholder="Find someone in your nest..."
                  value={search}
                  onChange={(event) => onSearch(event.target.value)}
                />
              </label>
            )}
            <span
              className="local-badge"
              title="Your account, groups, and wishes are saved in this browser on this device only."
            >
              <span />
              This device only
            </span>
            <button
              title="Log out"
              className="icon-button logout"
              onClick={() => actions.logout()}
            >
              <LogOut size={18} />
            </button>
            <Link href="/profile" aria-label="Open your profile">
              <Avatar profile={user} size="sm" />
            </Link>
          </div>
        </header>
        <main id="main" className="page-content">
          {storageError && (
            <p className="error" role="alert">
              {storageError}
            </p>
          )}
          {children}
          <footer className="app-footer">
            <span>
              <Gift size={14} />
              Made for the people who matter.
            </span>
            <span>A little thought goes a long way.</span>
          </footer>
        </main>
      </div>
      {groupModal && (
        <Modal title="Your family spaces" onClose={() => setGroupModal(false)}>
          <div className="group-list">
            {data.groups
              .filter((entry) => entry.members.includes(user.id))
              .map((entry) => (
                <button
                  key={entry.id}
                  className="group-choice"
                  onClick={() => {
                    actions.switchGroup(entry.id);
                    setGroupModal(false);
                  }}
                >
                  <Users size={21} />
                  <span>
                    <strong>{entry.name}</strong>
                    <small>
                      {entry.members.length}{" "}
                      {entry.members.length === 1 ? "member" : "members"}
                    </small>
                  </span>
                  {group?.id === entry.id && <Check size={18} />}
                </button>
              ))}
          </div>
          <GroupActions onClose={() => setGroupModal(false)} />
        </Modal>
      )}
      {help && (
        <Modal title="A little help" onClose={() => setHelp(false)}>
          <div className="help-copy">
            <h3>A thoughtful start</h3>
            <p>
              Complete the questionnaire to discover your five strongest gift
              interests. Add wishes to your profile so your family has a few
              ideas to start with.
            </p>
            <h3>About this preview</h3>
            <p>
              Your account, groups, and wishes stay in this browser on this
              device. This early version does not have the security of a real
              account service. Use a made-up password and leave out sensitive
              details.
            </p>
            <p>
              To try inviting someone, copy your group code, log out, create
              another account in this browser, and join with that code.
            </p>
            <p>
              Clearing your browser data can remove your account and wishes.
              This version cannot recover a forgotten password.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function GroupActions({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"create" | "join" | "invite" | null>(null);
  return (
    <>
      <div className="group-action-buttons">
        <button className="button secondary" onClick={() => setMode("create")}>
          <Plus size={16} />
          Create
        </button>
        <button className="button secondary" onClick={() => setMode("join")}>
          <Users size={16} />
          Join
        </button>
        <button className="button primary" onClick={() => setMode("invite")}>
          Invite
          <ArrowUpRight size={16} />
        </button>
      </div>
      {mode && (
        <GroupModal
          initial={mode}
          onClose={() => {
            setMode(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
