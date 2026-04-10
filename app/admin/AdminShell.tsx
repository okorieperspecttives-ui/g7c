"use client";

import { useState, ReactNode } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tags, 
  Bookmark, 
  ShoppingCart, 
  Users, 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  children: ReactNode;
  profile: {
    full_name: string | null;
    email: string | null;
    role: string;
  };
}

export default function AdminShell({ children, profile }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin" },
    { label: "Products", icon: <ShoppingBag className="h-5 w-5" />, href: "/admin/products" },
    { label: "Categories", icon: <Tags className="h-5 w-5" />, href: "/admin/categories" },
    { label: "Brands", icon: <Bookmark className="h-5 w-5" />, href: "/admin/brands" },
    { label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, href: "/admin/orders" },
    { label: "Users", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95 ${
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <div className={`transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
              {item.icon}
            </div>
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-20 items-center px-8 border-b border-border/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <span className="text-xl font-black text-primary-foreground italic">7</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Admin <span className="text-primary">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-6 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-6 border-t border-border/50">
          <Link
            href="/"
            className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 flex-col border-r border-border bg-card flex lg:hidden shadow-2xl"
            >
              <div className="flex h-20 items-center justify-between px-8 border-b border-border/50">
                <Link href="/admin" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <span className="text-xl font-black text-primary-foreground italic">7</span>
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase italic">Admin</span>
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-secondary text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-2 p-6 overflow-y-auto">
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              </nav>

              <div className="p-6 border-t border-border/50">
                <Link
                  href="/"
                  className="flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-muted-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Back to Site
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="h-11 w-80 rounded-2xl border-none bg-secondary/50 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-xl bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground truncate max-w-[120px]">
                  {profile.full_name || "Admin User"}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  {profile.role}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                {profile.full_name?.[0] || profile.email?.[0] || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
