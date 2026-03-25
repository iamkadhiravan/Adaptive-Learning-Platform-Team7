import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Library, 
  TrendingUp, 
  Target, 
  User,
  Bell,
  Search,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStudent } from "@workspace/api-client-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: Library },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/assessments", label: "Assessments", icon: Target },
  { href: "/account", label: "Account", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: student } = useGetStudent();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-sidebar-border bg-sidebar flex flex-col hidden md:flex shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            L
          </div>
          <span className="font-display font-bold text-xl tracking-tight">LearnNova</span>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                  : "text-sidebar-foreground hover:bg-muted"
              )}>
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/10">
            <h4 className="font-bold text-sm text-foreground">Pro Features</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Unlock advanced AI learning paths.</p>
            <button className="w-full text-xs font-bold bg-primary text-primary-foreground py-2 rounded-lg hover:shadow-md transition-shadow">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search courses, concepts..." 
                className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background"></span>
            </button>
            <div className="h-8 w-px bg-border mx-2"></div>
            <Link href="/account" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold leading-none">{student?.name || "Student"}</div>
                <div className="text-xs text-primary font-medium mt-1">Lvl {student?.level || 1} • {student?.totalXp || 0} XP</div>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student?.name || 'alex'}&backgroundColor=e2e8f0`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-primary/20 bg-muted"
              />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 pb-24">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-2 z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
