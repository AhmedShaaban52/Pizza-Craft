"use client";

import { useTransition, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "password" | "done";

export function ForgotPasswordForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<Step>("email");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1: request OTP
    function handleRequestOtp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result = await authClient.emailOtp.requestPasswordReset({ email });

            if (result?.error) {
                setError("Could not send code. Check your email and try again.");
            } else {
                setStep("otp");
            }
        });
    }

    // Step 2: advance
    function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        if (otp.length < 6) return;
        setStep("password");
    }

    // Step 3: reset password
    function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }

        startTransition(async () => {
            const result = await authClient.emailOtp.resetPassword({
                email,
                otp,
                password,
            });

            if (result?.error) {
                setError("Invalid or expired code. Please start over.");
            } else {
                setStep("done");
                setTimeout(() => router.push("/login"), 2500);
            }
        });
    }

    function handleResend() {
        setError(null);
        startTransition(async () => {
            await authClient.emailOtp.requestPasswordReset({ email });
        });
    }

    // ── Done ─────────────────────────────────────────────────────────────────
    if (step === "done") {
        return (
            <div className="text-center py-4 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40">
                    <CheckCircle2 className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                </div>
                <p className="text-neutral-900 dark:text-white font-bold">Password updated!</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Redirecting you to sign in…</p>
            </div>
        );
    }

    // ── Step 1: Email ─────────────────────────────────────────────────────────
    if (step === "email") {
        return (
            <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isPending}
                        className="w-full h-11 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    />
                </div>

                {error && (
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Code"}
                </button>
            </form>
        );
    }

    // ── Step 2: OTP ───────────────────────────────────────────────────────────
    if (step === "otp") {
        return (
            <div className="space-y-4">
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 mb-2">
                        <Mail className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                    </div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Enter the code</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        We sent a 6-digit code to{" "}
                        <span className="text-orange-500 dark:text-orange-400 font-semibold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                        disabled={isPending}
                        className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 text-center text-xl font-bold text-neutral-900 dark:text-white tracking-widest placeholder:text-neutral-300 dark:placeholder:text-neutral-600 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    />

                    {error && (
                        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={otp.length < 6}
                        className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        Continue
                    </button>
                </form>

                <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
                    Didn&apos;t receive it?{" "}
                    <button
                        onClick={handleResend}
                        disabled={isPending}
                        className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? "Sending…" : "Resend code"}
                    </button>
                </p>

                <button
                    onClick={() => { setStep("email"); setOtp(""); setError(null); }}
                    className="w-full text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400 transition-colors cursor-pointer"
                >
                    ← Use a different email
                </button>
            </div>
        );
    }

    // ── Step 3: New password ──────────────────────────────────────────────────
    return (
        <form onSubmit={handleReset} className="space-y-3">
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isPending}
                    className="w-full h-11 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-4 h-4 cursor-pointer" /> : <Eye className="w-4 h-4 cursor-pointer" />}
                </button>
            </div>

            {password.length > 0 && (
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${password.length >= level * 2
                                ? password.length >= 8 ? "bg-orange-500" : "bg-yellow-500"
                                : "bg-neutral-200 dark:bg-neutral-700"
                                }`}
                        />
                    ))}
                </div>
            )}

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={isPending}
                    className={`w-full h-11 bg-neutral-50 dark:bg-neutral-800 border rounded-xl pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none transition-colors disabled:opacity-50 ${confirm && confirm !== password
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-orange-500"
                        }`}
                />
            </div>

            {confirm && confirm !== password && (
                <p className="text-xs text-red-500 dark:text-red-400">Passwords don&apos;t match</p>
            )}

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
                type="submit"
                disabled={isPending || (!!confirm && confirm !== password)}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set New Password"}
            </button>
        </form>
    );
}