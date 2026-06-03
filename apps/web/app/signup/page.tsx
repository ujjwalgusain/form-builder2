"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignUp } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { createUserWithEmailAndPasswordAsync, isPending, isSuccess, error } = useSignUp();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createUserWithEmailAndPasswordAsync({
            fullName,
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
                        <UserPlus className="size-5 text-sky-100" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
                    <p className="text-sm leading-6 text-sky-50/75">
                        Register with your name, email, and password.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sky-50">Full name</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Jane Doe"
                        className="city-input"
                    />
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
                {isSuccess ? <p className="text-sm text-emerald-400">Account created.</p> : null}

                <Button
                    type="submit"
                    className="city-button w-full"
                    disabled={isPending}
                >
                    <UserPlus className="size-4" aria-hidden="true" />
                    {isPending ? "Registering..." : "Register"}
                </Button>
            </form>
        </main>
    );
}
