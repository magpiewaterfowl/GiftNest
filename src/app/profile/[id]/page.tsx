import { ProfileView } from "@/components/views";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Family member profile" };

export const dynamicParams = false;

export function generateStaticParams() {
  return ["alex", "olivia", "james", "sophie"].map((id) => ({ id }));
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileView memberId={id} />;
}
