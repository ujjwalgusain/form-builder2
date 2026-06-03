"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    ClipboardList,
    FileText,
    Home,
    LayoutDashboard,
    LogIn,
    Map,
    PencilLine,
    UserPlus,
} from "lucide-react";

const staticLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard/forms", label: "Dashboard", icon: LayoutDashboard },
    { href: "/signin", label: "Sign in", icon: LogIn },
    { href: "/signup", label: "Sign up", icon: UserPlus },
];

export function RouteSideTab() {
    const pathname = usePathname();
    const params = useParams();
    const formId = typeof params?.id === "string" ? params.id : undefined;

    const formLinks = formId
        ? [
              {
                  href: `/dashboard/forms/${formId}`,
                  label: "Builder",
                  icon: PencilLine,
              },
              {
                  href: `/form/${formId}`,
                  label: "Public form",
                  icon: FileText,
              },
              {
                  href: `/form/${formId}/submissions`,
                  label: "Submissions",
                  icon: ClipboardList,
              },
          ]
        : [];

    return (
        <aside className="fixed left-3 top-24 z-50 print:hidden">
            <details className="group">
                <summary className="city-outline-button flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-lg marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70">
                    <Map className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Routes</span>
                </summary>

                <nav
                    aria-label="Quick routes"
                    className="city-panel mt-2 w-56 rounded-lg p-2 text-sm animate-city-in"
                >
                    <div className="space-y-1">
                        {staticLinks.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-sky-100/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 ${
                                        active
                                            ? "bg-sky-100/20 text-white"
                                            : "text-sky-50/80"
                                    }`}
                                >
                                    <Icon className="size-4" aria-hidden="true" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {formLinks.length > 0 ? (
                        <>
                            <div className="my-2 h-px bg-sky-100/15" />
                            <div className="space-y-1">
                                {formLinks.map(({ href, label, icon: Icon }) => {
                                    const active = pathname === href;

                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            aria-current={active ? "page" : undefined}
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-sky-100/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 ${
                                                active
                                                    ? "bg-sky-100/20 text-white"
                                                    : "text-sky-50/80"
                                            }`}
                                        >
                                            <Icon className="size-4" aria-hidden="true" />
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </>
                    ) : null}
                </nav>
            </details>
        </aside>
    );
}
