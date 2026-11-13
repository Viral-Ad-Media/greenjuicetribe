"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/sign-in/");
      }}
      className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20"
    >
      Sign out
    </button>
  );
}
