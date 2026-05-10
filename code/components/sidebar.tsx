"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  LineChart,
  Bot,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Candidates", href: "/candidates", icon: Users },
  { label: "Screening", href: "/screening", icon: FileText },
  { label: "Talent Ranking", href: "/ranking", icon: BarChart3 },
  { label: "Interviews", href: "/interviews", icon: Calendar },
  { label: "Communication", href: "/communication", icon: MessageSquare },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "AI Copilot", href: "/copilot", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">TalentIntel</h1>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Recruitment Engine
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r bg-primary" />
                )}
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {user && (
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  user.name.split(" ").map((n) => n[0]).join("")
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
