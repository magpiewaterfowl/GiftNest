import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AuthView,
  DashboardView,
  ProfileView,
  ProfileRouteView,
  QuestionnaireView,
  ResultsView,
} from "@/components/views";
import type { Metadata } from "next";

const titles: Record<string, string> = {
  dashboard: "Family dashboard",
  signup: "Make yourself at home",
  login: "Welcome back",
  profile: "My profile",
  wishlist: "My wishlist",
  questionnaire: "Discover your gift interests",
  results: "Your gift personality",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(titles).map((view) => ({ view }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ view: string }>;
}): Promise<Metadata> {
  const { view } = await params;
  return { title: titles[view] ?? "Not found" };
}

export default async function AppPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  switch (view) {
    case "dashboard":
      return <DashboardView />;
    case "signup":
      return <AuthView signup />;
    case "login":
      return <AuthView />;
    case "profile":
      return (
        <Suspense fallback={<main id="main" className="loading">Getting your nest ready...</main>}>
          <ProfileRouteView />
        </Suspense>
      );
    case "wishlist":
      return <ProfileView wishlistOnly />;
    case "questionnaire":
      return <QuestionnaireView />;
    case "results":
      return <ResultsView />;
    default:
      notFound();
  }
}
