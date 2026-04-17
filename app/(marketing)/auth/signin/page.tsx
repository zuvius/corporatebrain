import { Suspense } from "react";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4">
            <span className="text-white font-bold text-lg">CB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 mt-2">
            Sign in to access your knowledge base
          </p>
        </div>

        {/* Sign In Form */}
        <Suspense
          fallback={
            <div className="h-64 flex items-center justify-center text-white/50">
              Loading...
            </div>
          }
        >
          <SignInForm />
        </Suspense>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign up
            </a>
          </p>
          <p className="text-sm text-white/40">
            <a href="/" className="hover:text-white/60 transition-colors">
              ← Back to homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
