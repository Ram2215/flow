"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const COUNTRIES = [
 "Brazil","Germany","France","United States","India"
];

export default function CreateCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !country) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), country }),
      });
      if (res.ok) {
        router.push("/dashboard/customers");
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0f172a] min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">New Customer</h1>
          <Separator className="mt-4 bg-zinc-800" />
        </div>

        <div className="flex gap-12">
          <div className="w-[65%]">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label className="mb-2 block text-sm font-medium text-zinc-400">Avatar</Label>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex size-[190px] items-center justify-center rounded-xl bg-[#1e293b] border border-zinc-700/50">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <div className="size-16 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Upload className="size-6" />
                      </div>
                      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="text-xs text-zinc-600">Upload photo</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">Click to change &bull; Max 1MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name"
                    className="h-10 w-full rounded-lg border-zinc-700/50 bg-[#1e293b] text-white placeholder-zinc-500 focus:border-[#a78bfa] focus:ring-[#a78bfa]/30"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="h-10 w-full rounded-lg border-zinc-700/50 bg-[#1e293b] text-white placeholder-zinc-500 focus:border-[#a78bfa] focus:ring-[#a78bfa]/30"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium text-zinc-400">Country</Label>
                  <div className="relative">
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-zinc-700/50 bg-[#1e293b] px-3 text-white outline-none transition-[color,box-shadow] focus:border-[#a78bfa] focus:ring-3 focus:ring-[#a78bfa]/30"
                      required
                    >
                      <option value="" disabled>---</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1e293b]">{c}</option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <Separator className="my-6 bg-zinc-800" />

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/customers")}
            className="h-10 rounded-lg border-zinc-700 bg-transparent px-5 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !email.trim() || !country}
            className="h-10 rounded-lg bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] px-6 text-white hover:from-[#a78bfa]/90 hover:to-[#8b5cf6]/90 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
