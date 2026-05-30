"use client";

import { useState } from "react";
import { useCRM } from "../store";

export function LoginScreen() {
  const { login, addToast } = useCRM();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(email, password);
      if (!ok) {
        setError("Invalid credentials. Try admin@synergycrm.com / admin123");
        addToast("Login failed", "error");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">SynergyCRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Recruiting Portal</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-5">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@synergycrm.com"
                required
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">Demo credentials:</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground text-center">admin@synergycrm.com / admin123</p>
              <p className="text-xs text-muted-foreground text-center">recruiter@synergycrm.com / recruiter123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
