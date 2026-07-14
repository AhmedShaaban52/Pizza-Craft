import Logo from "@/app/(public)/_components/layout/Logo";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ResetPasswordPage() {
    const t = await getTranslations("Auth.ResetPassword");

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 transition-colors duration-200">
            <div className="w-full max-w-sm">

                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm dark:shadow-none">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>

                <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    <Link href="/login" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors cursor-pointer">
                        {t("backToSignIn")}
                    </Link>
                </p>
            </div>
        </div>
    );
}