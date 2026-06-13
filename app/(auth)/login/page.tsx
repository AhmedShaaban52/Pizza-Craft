"use client";

import { authClient } from "@/lib/auth-client";

export default function GithubSignInButton() {
    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
        });
    };

    return (
        <button
            onClick={handleSignIn}
            className="rounded-md bg-red-500 text-white hover:bg-red-800"
        >
            Sign in with GitHub
        </button>
    );
}