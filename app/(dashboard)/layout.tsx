import { Sidebar } from "@/components/sidebar";
import { Bell, HelpCircle, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={{
          name: "Alex Rivera",
          role: "Senior Recruiter",
        }}
      />
      <div className="pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search talent pool..."
              className="h-10 w-full rounded border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-all duration-200 active:scale-90">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-all duration-200 active:scale-90">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full border border-border">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
