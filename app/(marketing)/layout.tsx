"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header - Shared across all marketing pages */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Corporate Brain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-18">
        {children}
      </main>

      {/* Footer - Shared across all marketing pages */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">Corporate Brain</span>
              </div>
              <p className="text-sm text-white/40">
                The AI-powered knowledge platform for modern enterprises.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-sm text-white/40 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="text-sm text-white/40 hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/enterprise" className="text-sm text-white/40 hover:text-white transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-sm text-white/40 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-white/40 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-sm text-white/40 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="text-sm text-white/40 hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/security" className="text-sm text-white/40 hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              © 2026 Corporate Brain. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-white/30 hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-sm text-white/30 hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
