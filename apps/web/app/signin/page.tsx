"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignin } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LogIn } from "lucide-react";

export default function SigninPage() {
    const router = useRouter();
    const { signInUserWithEmailAndPasswordAsync, isPending, isSuccess, error } = useSignin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await signInUserWithEmailAndPasswordAsync({
            email,
            password,
        });

        router.push("/dashboard/forms");
    };

    return (
        <main className="city-shell flex min-h-screen items-center justify-center px-4 py-10 text-white">
            <form
                onSubmit={handleSubmit}
                className="city-panel animate-city-in w-full max-w-sm space-y-5 rounded-lg p-6"
            >
                <div className="space-y-1">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-full border border-sky-100/25 bg-sky-100/15">
                        <LogIn className="size-5 text-sky-100" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                    <p className="text-sm leading-6 text-sky-50/75">
                        Enter your email and password to continue.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sky-50">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="jane@example.com"
                        className="city-input"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sky-50">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        className="city-input"
                    />
                </div>

                {error ? <p className="text-sm text-red-400">{error.message}</p> : null}
                {isSuccess ? <p className="text-sm text-emerald-400">Signed in.</p> : null}

                <Button
                    type="submit"
                    className="city-button w-full"
                    disabled={isPending}
                >
                    <LogIn className="size-4" aria-hidden="true" />
                    {isPending ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </main>
    );
}
