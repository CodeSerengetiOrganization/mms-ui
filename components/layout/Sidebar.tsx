"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Factory, User } from "lucide-react";
import type { NavigationItem } from "@/lib/types/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/config/sidebar.menu.json")
      .then((res) => res.json())
      .then((data: { navigationItems: NavigationItem[] }) => {
        setNavigationItems(data.navigationItems ?? []);
      })
      .catch((err) => console.error("Failed to load sidebar config", err));
  }, []);

  function toggleSubmenu(item: NavigationItem) {
    if (!item.children) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }

  function isActive(route: string, exact?: boolean) {
    if (exact) return pathname === route;
    return pathname === route || pathname.startsWith(route + "/");
  }

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 transition-[width] duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
        isCollapsed ? "w-[4rem]" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-2">
          <Factory className="h-6 w-6 shrink-0 text-zinc-600 dark:text-zinc-400" aria-hidden />
          {!isCollapsed && (
            <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Machine Monitor
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed((c) => !c)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
        >
          <span className="text-sm">{isCollapsed ? "»" : "«"}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              {!item.children && item.route ? (
                <Link
                  href={item.route}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.route, true)
                      ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                >
                  <span className="shrink-0 text-base" aria-hidden>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              ) : item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item)}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isCollapsed ? "justify-center px-2" : ""
                    } text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100`}
                  >
                    <span className="shrink-0 text-base" aria-hidden>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        <span
                          className={`shrink-0 text-xs transition-transform ${
                            expandedIds.has(item.id) ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        >
                          ▼
                        </span>
                      </>
                    )}
                  </button>
                  {!isCollapsed && expandedIds.has(item.id) && (
                    <ul className="ml-2 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-700">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.route ?? "#"}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                              isActive(child.route ?? "", false)
                                ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                                : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                            }`}
                          >
                            <span className="text-xs" aria-hidden>
                              {child.icon}
                            </span>
                            <span className="truncate">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
              <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Admin User
              </div>
              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                System Administrator
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
