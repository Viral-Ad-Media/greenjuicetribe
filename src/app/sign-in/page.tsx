"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") || email) });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? "Something went wrong.");
      return;
    }
    router.push("/admin/");
    router.refresh();
  }

  const input = "mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2.5 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200";

  return (
    <main className="flex flex-1 items-center justify-center bg-leaf-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-leaf-100">
        <Image src="/uploads/2022/10/Green-Juice-02.png" alt="Green Juice" width={160} height={55} className="mx-auto h-10 w-auto" />
        <h1 className="mt-6 text-center font-display text-2xl font-black">{mode === "in" ? "Admin sign in" : "Create admin account"}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "up" && (
            <label className="block text-sm font-semibold">
              Name
              <input name="name" className={input} autoComplete="name" />
            </label>
          )}
          <label className="block text-sm font-semibold">
            Email
            <input name="email" type="email" required className={input} autoComplete="email" />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input name="password" type="password" required minLength={mode === "up" ? 12 : undefined} className={input} autoComplete={mode === "in" ? "current-password" : "new-password"} />
          </label>
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-leaf-600 py-2.5 font-semibold text-white transition hover:bg-leaf-700 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-leaf-700 hover:underline">
          {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
