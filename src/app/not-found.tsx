import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="gate">
      <Gift size={40} />
      <h1>This little corner is empty.</h1>
      <p>Let&apos;s get you back to your people.</p>
      <Link className="button primary" href="/dashboard">
        Back to your nest
        <ArrowRight size={17} />
      </Link>
    </main>
  );
}
