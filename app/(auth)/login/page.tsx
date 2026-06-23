"use client";

import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let message = "Invalid email or password";
        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {}
        setError(message);
        setLoading(false);
        return;
      }

      const data = await res.json();
      window.location.href = data.url || "/dashboard";
    } catch (err) {
      setError("Network error. Is the server running?");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <div className="flex items-center gap-2.5 mb-10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h1 className="text-xl font-bold text-[#C084FC] tracking-tight">Flow</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-white tracking-wide">
                E-mail
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#1e293b] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-white tracking-wide">
                Password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#1e293b] border border-zinc-700 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="border-t border-zinc-700" />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-center gap-3 mt-8 text-xs">
          <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            Source code
          </a>
          <span className="text-zinc-700">·</span>
          <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">
            Built with maryUI
          </a>
        </div>
      </div>
    </div>
  );
}