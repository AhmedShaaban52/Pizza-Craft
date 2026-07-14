import Logo from "@/app/(public)/_components/layout/Logo";
import Link from "next/link";
import { SignUpForm } from "./_components/Signupform";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage() {
    const t = await getTranslations("Auth.SignUp");

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 transition-colors duration-200">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-sm dark:shadow-none">
                    <SignUpForm />
                </div>

                <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                    {t("alreadyHaveAccount")}{" "}
                    <Link href="/login" className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors cursor-pointer">
                        {t("signIn")}
                    </Link>
                </p>
            </div>
        </div>
    );
}