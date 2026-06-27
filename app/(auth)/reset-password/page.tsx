import Logo from "@/app/(public)/_components/layout/Logo";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";
import Link from "next/link";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-sm">

                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                    <ResetPasswordForm />
                </div>

                <p className="mt-4 text-center text-sm text-neutral-500">
                    <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                        Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}