"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { GithubSignInButton } from "../../login/_components/GithubSignInButton";

export function SignUpForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/",
            });

            if (result?.error) {
                setError(result.error.message || "Failed to create an account. Try again.");
            } else {
                router.push("/");
            }
        });
    }

    return (
        <>
            <GithubSignInButton />

            <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="text-xs text-neutral-600 uppercase tracking-widest font-medium">or</span>
                <div className="flex-1 h-px bg-neutral-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isPending}
                        className="w-full h-11 bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    />
                </div>

                {/* Email Address */}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isPending}
                        className="w-full h-11 bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isPending}
                        className="w-full h-11 bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                {error && (
                    <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-black text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
            </form>
        </>
    );
}