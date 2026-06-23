"use client";

import { useActionState } from "react";

async function signUpAction(_prev: { error: string } | null, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err?.message || err?.statusText || "Registration failed" };
    }

    window.location.href = "/login";
    return null;
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <div className="flex items-center gap-2.5 mb-10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h1 className="text-xl font-bold text-[#a78bfa] tracking-tight">Flow</h1>
        </div>

        <form action={formAction}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-white tracking-wide">Name</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <input id="name" name="name" type="text" placeholder="Your name" required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#1e293b] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-white tracking-wide">E-mail</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input id="email" name="email" type="email" placeholder="me@example.com" required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#1e293b] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-white tracking-wide">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input id="password" name="password" type="password" placeholder="••••••••" required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#1e293b] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors" />
              </div>
            </div>

            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

            <div className="border-t border-zinc-700" />

            <div className="flex justify-end">
              <button type="submit" disabled={isPending}
                className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer">
                {isPending ? "Creating..." : "Register"}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-6 text-xs text-zinc-500">
          Already have an account? <a href="/login" className="text-indigo-400 hover:text-indigo-300">Login</a>
        </p>
      </div>
    </div>
  );
}
