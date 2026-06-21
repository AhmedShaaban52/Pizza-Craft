import { GithubSignInButton } from "./_components/GithubSignInButton";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Welcome to <span className="text-emerald-400">PizzaCraft</span>
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        Sign in to order your favorite pizza
                    </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                    <GithubSignInButton />
                </div>

                <p className="mt-6 text-center text-xs text-neutral-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}