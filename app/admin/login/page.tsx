"use client";

import { useActionState } from "react";
import Logo from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-forest/10 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Logo size="md" />
            <div>
              <p className="font-serif text-xl font-semibold text-forest tracking-tight">
                {SITE.name}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-sage">Admin</p>
            </div>
          </div>
          <h1 className="font-serif text-2xl text-forest font-semibold">Sign in</h1>
          <p className="text-muted text-sm mt-2">
            Enter the shared admin password to manage events.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={pending}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
