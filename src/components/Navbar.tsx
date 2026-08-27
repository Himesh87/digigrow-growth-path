import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/my-business", label: "My Business" },
  { to: "/challenge", label: "7-Day Challenge" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-card">
            <Rocket className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Digi<span className="text-gradient">Grow</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full bg-gradient-primary shadow-card">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col py-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleSignOut}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-primary" onClick={() => setOpen(false)}>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
