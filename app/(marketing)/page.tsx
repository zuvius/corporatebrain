"use client";

import React from "react";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  Zap, 
  Shield, 
  BarChart3, 
  Layers,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Database,
  Workflow,
  CheckCircle2,
  Brain,
  Mail,
  AlertTriangle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#0a0a0f] to-fuchsia-900/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-sm font-medium text-violet-300">Now with enterprise SSO</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                All your work,
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  all powered by AI
                </span>
              </h1>
              
              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-xl">
                Corporate Brain connects your docs, conversations, and knowledge into one intelligent system. Ask questions, get cited answers, automate workflows.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  See How It Works
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-white/40">Trusted by 10,000+ teams</p>
                </div>
              </div>
            </div>

            {/* Right Content - UI Mockup */}
            <div className="relative lg:h-[600px]">
              {/* Main Dashboard Mockup */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-[1px]">
                <div className="h-full rounded-2xl bg-[#0f0f16] p-6 overflow-hidden">
                  {/* Mock Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <div className="flex-1 mx-4">
                      <div className="h-8 rounded-lg bg-white/5 flex items-center px-3">
                        <span className="text-xs text-white/30">Ask anything about your work...</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Content Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 text-violet-400" />
                        <span className="text-xs text-white/60">Recent Conversations</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">Q4 budget review discussion...</span>
                        </div>
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">Product roadmap updates...</span>
                        </div>
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">Engineering standup notes...</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-xs text-white/60">Documents</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">2026_Strategic_Plan.pdf</span>
                        </div>
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">API_Documentation_v2.md</span>
                        </div>
                        <div className="h-8 rounded bg-white/5 flex items-center px-3">
                          <span className="text-xs text-white/40 truncate">Q3_Customer_Feedback.xlsx</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-4 border border-violet-500/20">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/30">
                          <Sparkles className="h-4 w-4 text-violet-300" />
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">AI Suggestion</p>
                          <p className="text-xs text-white/50">Found 3 relevant docs about Q4 planning from your Slack conversations</p>
                        </div>
                      </div>
                      {/* Contextual connection lines */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-white/30">Connected sources:</span>
                          <span className="px-2 py-1 rounded bg-white/5 text-white/50">Slack</span>
                          <span className="px-2 py-1 rounded bg-white/5 text-white/50">Notion</span>
                          <span className="px-2 py-1 rounded bg-white/5 text-white/50">Drive</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search Input Bar */}
                    <div className="col-span-2 mt-4">
                      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <Search className="h-4 w-4 text-white/40" />
                        <span className="text-sm text-white/40 flex-1">Ask anything about your work...</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/30">
                          <ArrowRight className="h-3 w-3 text-violet-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 rounded-xl bg-white p-3 shadow-2xl shadow-violet-500/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Connected</p>
                    <p className="text-[10px] text-gray-500">Slack, Drive, Notion</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-xl bg-[#1a1a24] border border-white/10 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">10x Faster</p>
                    <p className="text-[10px] text-white/50">Query response time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement - Knowledge Fragmentation */}
      <section className="relative py-20 lg:py-28 bg-[#0d0d14] border-y border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Your knowledge is scattered
              <br />
              <span className="text-white/60">— your AI can't find it.</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Critical answers trapped across Slack threads, Notion docs, emails, and files. Corporate Brain unifies it all.
            </p>
          </div>

          {/* Visual Flow Diagram */}
          <div className="relative mb-20">
            {/* Animated Dotted Connection Line - touches outermost edges of Data Silos and AI Hallucinations */}
            <div className="absolute top-[60px] left-[calc(50%-144px)] right-[calc(50%-144px)] hidden lg:block">
              {/* Base dotted line */}
              <div className="absolute inset-0 border-t-2 border-dashed border-white/20" />
              {/* Animated flowing gradient - dark to light dotted flow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 border-t-2 border-dashed border-transparent bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-[shimmer_2s_linear_infinite]" style={{ backgroundSize: '200% 100%' }} />
              </div>
              {/* Flowing particles moving along the line */}
              <div className="absolute top-0 left-0 w-full h-1">
                <div className="absolute top-0 left-0 w-2 h-2 -mt-1 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,1)] animate-[flowRight_3s_linear_infinite]" />
                <div className="absolute top-0 left-0 w-1.5 h-1.5 -mt-0.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,1)] animate-[flowRight_3s_linear_infinite_1s]" />
                <div className="absolute top-0 left-0 w-2 h-2 -mt-1 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(167,139,250,1)] animate-[flowRight_3s_linear_infinite_2s]" />
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Data Silos */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon Node */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                      <Database className="h-7 w-7 text-orange-400" />
                    </div>
                    {/* Connector dot - outgoing with bounce animation */}
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)] hidden lg:block animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">Data Silos</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                    Knowledge trapped in <span className="text-orange-400 font-semibold">15+</span> different apps and platforms
                  </p>
                </div>
              </div>

              {/* Knowledge Gaps */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon Node - Center (larger, highlighted) */}
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-400/40 shadow-[0_0_30px_rgba(139,92,246,0.3)] lg:scale-110">
                      <Search className="h-9 w-9 text-violet-400" />
                    </div>
                    {/* Connector dots - incoming & outgoing with pulse animation */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] hidden lg:block animate-pulse" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] hidden lg:block animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">Knowledge Gaps</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                    <span className="text-violet-400 font-semibold">47%</span> of decisions made without complete information
                  </p>
                </div>
              </div>

              {/* AI Hallucinations */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon Node */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                      <AlertTriangle className="h-7 w-7 text-rose-400" />
                    </div>
                    {/* Connector dot - incoming with pulse animation */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)] hidden lg:block animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">AI Hallucinations</h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                    Generic AI answers lack <span className="text-rose-400 font-semibold">context</span> from your actual documents
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* App Icons Flow with Pulsating Brain Animation */}
          <div className="relative max-w-5xl mx-auto bg-[#0f0f1a]/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl shadow-black/50">
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
              {/* App icons with connecting lines */}
              <AppIcon icon={<GoogleDriveSVG className="h-5 w-5" />} color="from-white to-gray-100" label="Drive" />
              <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />
              <AppIcon icon={<MessageSquare className="h-5 w-5" />} color="from-blue-500 to-blue-600" label="Slack" />
              <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />
              <AppIcon icon={<FileText className="h-5 w-5" />} color="from-slate-500 to-slate-600" label="Notion" />
              <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />
              <AppIcon icon={<Mail className="h-5 w-5" />} color="from-green-500 to-emerald-600" label="Gmail" />
              <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />
              
              {/* Pulsating Brain Animation - Pure Tailwind */}
              <div className="relative flex items-center justify-center w-32 h-32 mx-2">
                {/* Outer expanding pulse rings - highly visible */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 animate-ping" style={{ animationDuration: '2s' }} />
                <span className="absolute inline-flex h-[90%] w-[90%] rounded-full bg-fuchsia-400 opacity-60 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
                <span className="absolute inline-flex h-[80%] w-[80%] rounded-full bg-violet-500 opacity-50 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
                
                {/* Solid vibrant background circle */}
                <div className="absolute inset-5 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600 shadow-[0_0_50px_rgba(139,92,246,0.6)]" />
                
                {/* Inner glow pulse using Tailwind */}
                <div className="absolute inset-5 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 opacity-50 animate-pulse" />
                
                {/* Brain icon container */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Pulsing border rings using Tailwind */}
                  <div className="absolute inset-0 rounded-full border-2 border-violet-300 opacity-40 animate-pulse" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute -inset-2 rounded-full border border-fuchsia-300 opacity-30 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                  
                  {/* Brain icon with Tailwind shadow utilities */}
                  <div className="relative z-10 animate-pulse" style={{ animationDuration: '2s' }}>
                    <Brain className="h-14 w-14 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
                  </div>
                  
                  {/* Central energy point - perfectly centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(232,121,249,1)] animate-ping" style={{ animationDuration: '1.5s' }} />
                  </div>
                </div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />
              
              {/* Answer icon with surrounding question bubbles - MORE SPACING */}
              <div className="relative">
                <AppIcon icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} color="from-emerald-500/30 to-green-500/30 border-2 border-emerald-400/50" label="Answer" />
                
                {/* Question bubbles - INCREASED SPACING to prevent overlap */}
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 hidden md:block z-20">
                  <div className="bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs text-white/80 whitespace-nowrap shadow-lg backdrop-blur-sm animate-[float_4s_ease-in-out_infinite]">
                    Where's the Q3 roadmap?
                  </div>
                </div>
                <div className="absolute -top-14 -right-44 hidden lg:block z-20">
                  <div className="bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs text-white/80 whitespace-nowrap shadow-lg backdrop-blur-sm animate-[float_5s_ease-in-out_infinite_0.5s]">
                    Who approved this budget?
                  </div>
                </div>
                <div className="absolute top-8 -right-52 hidden xl:block z-20">
                  <div className="bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs text-white/80 whitespace-nowrap shadow-lg backdrop-blur-sm animate-[float_4.5s_ease-in-out_infinite_1s]">
                    What did we decide last week?
                  </div>
                </div>
                <div className="absolute -bottom-28 -right-52 hidden lg:block z-20">
                  <div className="bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs text-white/80 whitespace-nowrap shadow-lg backdrop-blur-sm animate-[float_3.5s_ease-in-out_infinite_1.5s]">
                    Is this data still accurate?
                  </div>
                </div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 hidden md:block z-20">
                  <div className="bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs text-white/80 whitespace-nowrap shadow-lg backdrop-blur-sm animate-[float_5.5s_ease-in-out_infinite_2s]">
                    Which version is final?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud - Subtle Background */}
      <section className="border-y border-gray-200 py-12 bg-gradient-to-r from-neutral-50 to-cyan-50">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-black/60 mb-8">Trusted by forward-thinking teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Airbnb"].map((company) => (
              <span key={company} className="text-lg font-semibold text-black/40 hover:text-black/70 transition-colors">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase - ClickUp Style */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Vibrant Gradient Background - Purple → Pink → Orange */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 via-rose-400 to-orange-400" />
        
        {/* Vibrant blur orbs - no black */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-fuchsia-400/30 rounded-full blur-[100px] animate-pulse delay-700" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-400/25 rounded-full blur-[100px] animate-pulse delay-1500" />
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-8 shadow-2xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            All your knowledge,
            <br />
            <span className="text-white/90">one intelligent search.</span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Connect your apps. Ask questions. Get answers with sources. 
            It's that simple.
          </p>
          
          {/* CTA Button */}
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-violet-600 font-bold hover:bg-white/90 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          {/* Product Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
            
            {/* Mockup Container */}
            <div className="relative bg-[#1a1a2e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f1a] border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/5 rounded-lg px-4 py-1.5 text-sm text-white/40 text-center">
                    app.corporatebrain.ai
                  </div>
                </div>
              </div>
              
              {/* Mockup Content - Chat Interface */}
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                  {/* Sidebar */}
                  <div className="hidden lg:block space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">Mango Tech</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">Chat</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:bg-white/5">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Knowledge Base</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:bg-white/5">
                        <Workflow className="h-4 w-4" />
                        <span className="text-sm">Integrations</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
                      <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                        <p className="text-white/90 text-sm">What's our Q3 marketing budget?</p>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                        <p className="text-white/90 text-sm mb-3">
                          Your Q3 marketing budget is <span className="text-violet-400 font-semibold">$450,000</span>, approved by Sarah Chen on June 15th. Here's the breakdown:
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-violet-400 font-bold text-lg">$180K</div>
                            <div className="text-white/40 text-xs">Paid Ads</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-violet-400 font-bold text-lg">$150K</div>
                            <div className="text-white/40 text-xs">Events</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <div className="text-violet-400 font-bold text-lg">$120K</div>
                            <div className="text-white/40 text-xs">Content</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <FileText className="h-3 w-3" />
                          <span>Source: Budget Planning Q3 2026.docx</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Input Area */}
                    <div className="mt-6 flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-3">
                      <Search className="h-5 w-5 text-white/30" />
                      <span className="text-white/30 text-sm flex-1">Ask anything about your work...</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-400 text-xs">
                        <Zap className="h-3 w-3" />
                        <span>AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Light Tone */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-neutral-50 to-cyan-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to work smarter
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              One platform that connects your entire knowledge stack and makes it instantly accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Hybrid RAG Search"
              description="Combines vector similarity with LLM reasoning for contextual, accurate answers every time."
              gradient="from-violet-500 to-purple-500"
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Source Citations"
              description="Every answer includes clickable citations. Know exactly where information comes from."
              gradient="from-purple-500 to-fuchsia-500"
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="Multi-Model AI"
              description="Route queries to GPT-4, Claude, or Gemini based on complexity and cost requirements."
              gradient="from-fuchsia-500 to-pink-500"
            />
            <FeatureCard
              icon={<Workflow className="h-6 w-6" />}
              title="50+ Integrations"
              description="Connect Slack, Drive, Notion, Teams, Confluence, GitHub, and more in minutes."
              gradient="from-blue-500 to-violet-500"
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Cost Analytics"
              description="Track spending per department, set budgets, and optimize AI model selection."
              gradient="from-cyan-500 to-blue-500"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Enterprise Security"
              description="SOC 2 Type II, GDPR compliant, SSO/SAML, audit logs, and end-to-end encryption."
              gradient="from-emerald-500 to-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes flowLeft {
          0%, 100% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flowRight {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes glow-pulse-fast {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        @keyframes brain-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .animate-glow-pulse-fast {
          animation: glow-pulse-fast 1.5s ease-in-out infinite;
        }
        .animate-brain-pulse {
          animation: brain-pulse 2s ease-in-out infinite;
        }
        .animate-core-pulse {
          animation: core-pulse 1.5s ease-in-out infinite;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCard value="10x" label="Faster Answers" description="vs traditional search" />
            <StatCard value="50+" label="Integrations" description="Native connections" />
            <StatCard value="99.9%" label="Uptime" description="Enterprise SLA" />
            <StatCard value="2M+" label="Queries" description="Served monthly" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Vibrant gradient: purple → pink → purple */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600" />
        
        {/* Vibrant blur orbs - purple/pink theme */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fuchsia-400/30 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform how your team works?
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who find answers faster, make better decisions, and unlock their collective knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-black font-semibold hover:bg-white/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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

function FeatureCard({ icon, title, description, gradient }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
      <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${gradient} p-3 mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label, description }: { value: string; label: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-white font-semibold mb-1">{label}</div>
      <div className="text-sm text-white/40">{description}</div>
    </div>
  );
}

function AppIcon({ icon, color, label }: { icon: React.ReactNode; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        {icon}
      </div>
      <span className="text-xs text-white/60 font-medium">{label}</span>
    </div>
  );
}

// Google Drive Custom SVG Icon
function GoogleDriveSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.71 2.29L1.71 12.29C1.32 12.88 1.32 13.64 1.71 14.23L5.29 20.41C5.68 21 6.36 21.38 7.07 21.38H16.93C17.64 21.38 18.32 21 18.71 20.41L22.29 14.23C22.68 13.64 22.68 12.88 22.29 12.29L16.29 2.29C15.9 1.71 15.22 1.32 14.5 1.32H9.5C8.78 1.32 8.1 1.71 7.71 2.29Z" fill="#0066DA"/>
      <path d="M22.29 14.23L18.71 20.41C18.32 21 17.64 21.38 16.93 21.38H7.07C6.36 21.38 5.68 21 5.29 20.41L1.71 14.23L8.67 14.23L11.33 18.84L14 14.23H22.29Z" fill="#00AC47"/>
      <path d="M22.29 14.23L16.29 2.29C15.9 1.71 15.22 1.32 14.5 1.32H9.5C8.78 1.32 8.1 1.71 7.71 2.29L1.71 14.23H8.67L11.33 9.61L14 14.23H22.29Z" fill="#2684FC"/>
      <path d="M11.33 9.61L8.67 14.23L1.71 14.23C1.32 13.64 1.32 12.88 1.71 12.29L7.71 2.29C8.1 1.71 8.78 1.32 9.5 1.32H14.5C15.22 1.32 15.9 1.71 16.29 2.29L11.33 9.61Z" fill="#EA4335"/>
    </svg>
  );
}
