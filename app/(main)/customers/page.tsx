"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Filter, Plus, ChevronLeft, ChevronRight, ArrowUpDown,SquarePen,Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { boolean } from "better-auth";

type Customer = {
  id: number;
  name: string;
  email: string;
  country: string;
};

const PAGE_SIZE = 7;

const AVATAR_COLORS = [
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-orange-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [filteropen,setfilteropen]=useState(false);
  const [filtername,setfiltername]=useState("");
  const [filtercountry,setfiltercountry]=useState("");
  const [applyname,setapplyname]=useState("");
  const [applycountry,setapplycouuntry]=useState("");


  const openEditSheet = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditEmail(customer.email);
    setEditCountry(customer.country);
  };

  const closeEditSheet = () => {
    setEditingCustomer(null);
    setEditSubmitting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editName.trim() || !editEmail.trim() || !editCountry) return;
    setEditSubmitting(true);
    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), email: editEmail.trim(), country: editCountry }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === editingCustomer.id
              ? { ...c, name: editName.trim(), email: editEmail.trim(), country: editCountry }
              : c
          )
        );
        closeEditSheet();
        router.refresh();
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);
  }, []);

  const filtered = useMemo(() => {
    return(customers.filter((c)=>{
      const searchmatch=!search.trim() || c.name.toLowerCase().includes(search.toLowerCase());
      const namematch=!applyname.trim() || c.name.toLowerCase().includes(applyname.toLowerCase());
      const countrymatch=!applycountry || c.country===applycountry;
      return searchmatch && namematch && countrymatch;
    }));},[customers,search,applyname,applycountry]);
  
 
 
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageCustomers = filtered.slice(start, end);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  const handledelete=async(id:number)=>{
    const confirmdel=confirm("Are you sure you want to delete?")
    if(!confirmdel) return;
    const res=await fetch(`/api/customers/${id}`,{
      method:"DELETE",
      headers: { "Content-Type": "application/json" },
    })
    if(res.ok){
      setCustomers((prev=>prev.filter((customer)=>customer.id!==id)));
    }
  };

  return (
    <div suppressHydrationWarning className="flex-1 bg-background min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-56 rounded-lg border border-zinc-800 bg-background pl-9 pr-8 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Button
            onClick={()=>setfilteropen(true)}
            variant="outline"
            className="relative h-9 rounded-lg border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <Filter className="size-4 mr-2" />
            Filters
            
          </Button>

          <Button asChild className="h-9 rounded-lg bg-[#a78bfa] text-white hover:bg-[#a78bfa]/90 cursor-pointer">
            <Link href="/customers/create">
              <Plus className="size-4 mr-2" />
              Create
            </Link>
          </Button>
        </div>
      </div>
                       {/* table */}
      <div className="rounded-xl border border-zinc-800 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    Name
                    <ArrowUpDown className="size-3.5 text-zinc-500" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    Country
                    <ArrowUpDown className="size-3.5 text-zinc-500" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    E-Mail
                    <ArrowUpDown className="size-3.5 text-zinc-500" />
                  </span>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageCustomers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-zinc-500">
                    {search ? "No customers match your search" : "No customers yet"}
                  </td>
                </tr>
              ) : (
                pageCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-9 rounded-full ${getAvatarColor(c.name)} flex items-center justify-center text-sm font-medium text-foreground shrink-0`}>
                          {getInitial(c.name)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{c.country}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{c.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditSheet(c)}
                        className="rounded md p-2 text-zinc-400 hover-bg zinc-800 hover:text-blue-400 transition-colors">
                          <SquarePen className="size-4"/>      
                        </button>
                        <button onClick={()=>handledelete(Number(c.id))}
                        className="rounded md p-2 text-zinc-400 hover-bg zinc-800 hover:text-blue-400 transition-colors">
                           <Trash2 className="size-4"/>
                        </button>
                        </div>  

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
          <p className="text-sm text-zinc-400">
            Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(end, filtered.length)} of {filtered.length} results
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e${i}`} className="flex size-8 items-center justify-center text-sm text-zinc-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${
                    p === safePage
                      ? "bg-[#a78bfa] text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
                             {/* /edit section */}
      <Sheet open={!!editingCustomer} onOpenChange={(open) => { if (!open) closeEditSheet(); }}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="px-4 pt-4 pb-3">
            <SheetTitle>Edit Customer</SheetTitle>
          </SheetHeader>

<form
  onSubmit={handleEditSubmit}
  className="flex h-full flex-col"
>
  <div className="flex-1 overflow-y-auto px-4 py-3">
    <div className="space-y-3">

      <div className="space-y-1.5">
        <Label
          htmlFor="edit-name"
          className="text-sm font-medium text-zinc-400"
        >
          Name
        </Label>

        <Input
          id="edit-name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Enter customer name"
          className="h-10 w-full rounded-lg border-zinc-700/50 bg-background text-white placeholder-zinc-500 focus:border-[#a78bfa] focus:ring-[#a78bfa]/30"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="edit-email"
          className="text-sm font-medium text-zinc-400"
        >
          Email
        </Label>

        <Input
          id="edit-email"
          type="email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          placeholder="Enter email address"
          className="h-10 w-full rounded-lg border-zinc-700/50 bg-background text-white placeholder-zinc-500 focus:border-[#a78bfa] focus:ring-[#a78bfa]/30"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="edit-country"
          className="text-sm font-medium text-zinc-400"
        >
          Country
        </Label>

        <div className="relative">
          <select
            id="edit-country"
            value={editCountry}
            onChange={(e) => setEditCountry(e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-zinc-700/50 bg-background px-3 text-white outline-none transition-[color,box-shadow] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/30"
            required
          >
            <option value="" disabled>
              ---
            </option>

            {[
              "Brazil",
              "Germany",
              "France",
              "United States",
              "India",
            ].map((c) => (
              <option
                key={c}
                value={c}
                className="bg-background"
              >
                {c}
              </option>
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
  </div>

  <div className="border-t border-zinc-800 px-4 py-3">
    <div className="flex items-center justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={closeEditSheet}
        className="h-10 rounded-lg border-zinc-700 bg-transparent px-5 text-zinc-300 hover:bg-zinc-800 hover:text-white"
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={
          editSubmitting ||
          !editName.trim() ||
          !editEmail.trim() ||
          !editCountry
        }
        className="h-10 rounded-lg bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] px-6 text-white hover:from-[#a78bfa]/90 hover:to-[#8b5cf6]/90 disabled:opacity-50"
      >
        {editSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>
</form>
        </SheetContent>
      </Sheet>
                            /filter section
      <Sheet open={filteropen} onOpenChange={setfilteropen}>
  <SheetContent side="right" className="w-full sm:max-w-md p-0">
    <SheetHeader className="px-4 pt-4 pb-3">
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>

    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-name" className="text-sm font-medium text-zinc-400">
              Name
            </Label>
            <Input
              id="filter-name"
              value={filtername}
              onChange={(e) => setfiltername(e.target.value)}
              placeholder="Filter by name"
              className="h-10 w-full rounded-lg border-zinc-700/50 bg-background text-white placeholder-zinc-500 focus:border-[#a78bfa] focus:ring-[#a78bfa]/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-country" className="text-sm font-medium text-zinc-400">
              Country
            </Label>
            <div className="relative">
              <select
                id="filter-country"
                value={filtercountry}
                onChange={(e) => setfiltercountry(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-zinc-700/50 bg-background px-3 text-white outline-none transition-[color,box-shadow] focus:border-[#a78bfa] focus:ring-2 focus:ring-[#a78bfa]/30"
              >
                <option value="">All countries</option>
                {["Brazil", "Germany", "France", "United States", "India"].map((c) => (
                  <option key={c} value={c} className="bg-background">
                    {c}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

               <div className="border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => { setfiltername(""); setfiltercountry("");setapplyname("");setapplycouuntry("") }}
            className="h-10 rounded-lg border-zinc-700 bg-transparent px-5 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => {setapplyname(filtername);setapplycouuntry(filtercountry);setfilteropen(false);}}
            className="h-10 rounded-lg bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] px-6 text-white hover:from-[#a78bfa]/90 hover:to-[#8b5cf6]/90"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  </SheetContent>
</Sheet>

</div>
  );
}