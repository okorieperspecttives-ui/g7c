"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center text-center px-4">
      <div className="mb-6 rounded-full bg-destructive/10 p-6 text-destructive">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="text-3xl font-black tracking-tighter text-foreground mb-2">
        Something went <span className="text-destructive">wrong!</span>
      </h2>
      <p className="text-muted-foreground font-medium mb-10 max-w-md">
        An error occurred while loading the admin dashboard. This could be due to a connection issue or insufficient permissions.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </div>
  );
}
