"use client";
import { useActionState } from "react";
import { adminLogin } from "@/lib/actions/admin-login";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Admin Access</h1>
          <p className="text-sm text-slate-500 mb-6">Enter the admin password to continue.</p>

          <form action={action} className="flex flex-col gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoFocus
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {state?.error && (
              <p className="text-sm text-red-600">{state.error}</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {pending ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
