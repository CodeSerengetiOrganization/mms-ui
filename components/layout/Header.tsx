"use client";

import { useState } from "react";
import { User } from "lucide-react";

const APP_TITLE = "Machine Monitoring System";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {APP_TITLE}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700"
                aria-hidden
              >
                <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Admin User
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLoggedIn(false)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
