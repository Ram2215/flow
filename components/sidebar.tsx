"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Warehouse,
  ChevronDown,
  Search,
  Settings,
  PanelLeftClose,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Warehouse", href: "/warehouse", icon: Warehouse, hasSubmenu: true,
    children:[{label: "Brands", href: "/dashboard/warehouse/brands",icon:Award,},
              {label: "Categories",href:"/dashboard/warehouse/categories"},
              {label:"Products",href:"/dashboard/warehouse/products"},

    ]
   },
  
];

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type Session = {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
  };
};

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [warehouseopen,setwarehouseopen]=useState(false)

  useEffect(() => {
    fetch("/api/auth/get-session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  const user = session?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-full flex-col bg-[#0f172a] border-r border-zinc-800 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center gap-2.5 px-6 pt-8 pb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        {!collapsed && <span className="text-xl font-bold text-[#C084FC] tracking-tight">flow</span>}
      </div>

      <div className={cn("mb-6 flex items-center gap-3 rounded-lg py-3 bg-[#1e293b]", collapsed ? "mx-0 justify-center px-3" : "mx-4 px-3")}>
        {loading ? (
          <>
            <Skeleton className="size-10 shrink-0 rounded-full bg-zinc-700" />
            {!collapsed && (
              <>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-20 bg-zinc-700" />
                  <Skeleton className="h-3 w-28 bg-zinc-700" />
                </div>
                <Skeleton className="size-4 shrink-0 rounded bg-zinc-700" />
              </>
            )}
          </>
        ) : (
          <>
            <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white shrink-0">
              {initial}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email ?? ""}</p>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  <Settings className="size-4" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          if(item.children){
            return(
              <div key={item.label} >
                <button onClick={()=>setwarehouseopen(true)}
                   className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#1e293b]/50">
                  <Icon className="size-4 shrink-0"/>
                  {!collapsed && (
            <>
              <span className="flex-1 text-left">
                {item.label}
              </span>

              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  warehouseopen && "rotate-180"
                )}
              />
            </>
          )}

                  
                </button>
                {!collapsed && warehouseopen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child)=>
                    <Link key={child.href} href={child.href} className={cn("block rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-[#1e293b] hover:text-white",
                      pathname===child.href && "bg-[#1e293b] text-white"
                    )}>{child.label}</Link>
                    )}
                  </div>
                )}
              </div>
            );
          }
          const isActive = pathname === item.href;
       
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-[#1e293b] text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1e293b]/50"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.hasSubmenu && <ChevronDown className="size-3.5 text-zinc-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 my-3 h-px bg-zinc-800" />

      <div className="px-3 pb-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#1e293b]/50 transition-all cursor-pointer">
          <Search className="size-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Search</span>}
          {!collapsed && (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
              ⌘G
            </kbd>
          )}
        </button>
      </div>

      <div className="flex flex-col">
        <div className="border-t border-zinc-800" />
        <div className="px-3 py-4">
          <button
            onClick={onToggle}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-[#1e293b]/50 transition-all cursor-pointer"
          >
            <PanelLeftClose className={`size-4 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
