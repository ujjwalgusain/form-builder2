// apps/web/app/page.tsx

"use client";

import { useHealth } from "~/hooks/api/health";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export default function Home() {
    const { data } = useHealth();
    const { user } = useUser();
    const router = useRouter();

    return (
        <main className="city-shell flex min-h-screen items-center justify-center px-4 py-10 text-white">
            <section className="city-panel animate-city-in w-full max-w-md rounded-lg p-8 text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-sky-100/25 bg-sky-100/15">
                    <ArrowRight className="size-6 text-sky-100" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-100/80">
                    City blue form studio
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">ZenoForms</h1>
                <p className="mt-3 text-sm leading-6 text-sky-50/75">
                    Build, publish, and review form responses from a cleaner matchday-ready
                    workspace.
                </p>
                <p className="mt-4 text-sm text-sky-100/80">
                    Server status: <span className="font-medium text-white">{data?.status ?? "checking"}</span>
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {user?.id ? (
                        <Button
                            onClick={() => router.push("/dashboard/forms")}
                            className="city-button"
                        >
                            <LayoutDashboard className="size-4" aria-hidden="true" />
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => router.push("/signin")}
                                className="city-button"
                            >
                                <LogIn className="size-4" aria-hidden="true" />
                                Sign in
                            </Button>
                            <Button
                                onClick={() => router.push("/signup")}
                                variant="outline"
                                className="city-outline-button"
                            >
                                <UserPlus className="size-4" aria-hidden="true" />
                                Sign up
                            </Button>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
