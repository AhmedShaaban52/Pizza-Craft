"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const t = useTranslations("Auth.ResetPassword");
    const tc = useTranslations("Auth.Common");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirm) {
            setError(tc("passwordsDontMatch"));
            return;
        }
        if (password.length < 8) {
            setError(t("passwordTooShort"));
            return;
        }

        setLoading(true);
        setError(null);

        const result = await authClient.resetPassword({
            newPassword: password,
            token,
        });

        setLoading(false);

        if (result?.error) {
            setError(t("invalidOrExpiredLink"));
        } else {
            setDone(true);
            setTimeout(() => router.push("/login"), 2500);
        }
    }

    if (!token) {
        return (
            <div className="text-center py-4 space-y-2">
                <p className="text-sm text-red-600 dark:text-red-400">{t("invalidLink")}</p>
            </div>
        );
    }

    if (done) {
        return (
            <div className="text-center py-4 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40">
                    <CheckCircle2 className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                </div>
                <h3 className="text-neutral-900 dark:text-white font-bold">{tc("passwordUpdated")}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{tc("redirectingToSignIn")}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("newPasswordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full h-11 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-10 pr-10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? tc("hidePassword") : tc("showPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {password.length > 0 && (
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${password.length >= level * 2
                                ? password.length >= 8
                                    ? "bg-orange-500"
                                    : "bg-yellow-500"
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
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className={`w-full h-11 bg-neutral-50 dark:bg-neutral-800 border rounded-xl pl-10 pr-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none transition-colors ${confirm && confirm !== password
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-orange-500"
                        }`}
                />
            </div>

            {confirm && confirm !== password && (
                <p className="text-xs text-red-500 dark:text-red-400">{tc("passwordsDontMatch")}</p>
            )}

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading || (!!confirm && confirm !== password)}
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tc("setNewPassword")}
            </button>
        </form>
    );
}