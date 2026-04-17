"use client";

import Link from "next/link";
import {
  Brain,
  Database,
  Quote,
  Plug,
  Target,
  Shield,
  Wallet,
  TrendingUp,
  Zap,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Globe,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#0a0a0f] to-fuchsia-900/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-violet-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">
                13 Powerful Features
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                build your second brain
              </span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-2xl mx-auto">
              Transform your company knowledge into a competitive advantage with
              our complete suite of AI-powered tools.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
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
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Hybrid RAG AI"
              description="Our unique Hybrid RAG approach combines vector similarity search with LLM reasoning for answers that are both accurate and contextually aware."
            />
            <FeatureCard
              icon={Database}
              title="Universal Knowledge Base"
              description="Ingest documents from PDFs, Word, Markdown, and more. Our processing pipeline automatically chunks, embeds, and indexes everything."
            />
            <FeatureCard
              icon={Quote}
              title="Source Citations"
              description="Every answer includes clickable citations to original documents. Know exactly where information comes from and verify with one click."
            />
            <FeatureCard
              icon={Plug}
              title="50+ Integrations"
              description="Connect Slack, Google Drive, Notion, Microsoft Teams, Confluence, GitHub, and more. New integrations added monthly."
            />
            <FeatureCard
              icon={Target}
              title="Smart Model Routing"
              description="Automatically route queries to GPT-4, Claude, or Gemini based on complexity. Optimize for speed, cost, or accuracy as needed."
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="SOC 2 Type II certified, GDPR compliant, SSO/SAML support, audit logs, and data encryption at rest and in transit."
            />
            <FeatureCard
              icon={Wallet}
              title="Cost Analytics"
              description="Track spending per department, set budgets, and optimize AI model selection. Full transparency into your AI costs."
            />
            <FeatureCard
              icon={TrendingUp}
              title="ROI Dashboard"
              description="Measure time saved, productivity gains, and cost savings. Prove the value of Corporate Brain with real data."
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Sync"
              description="Changes in connected platforms sync automatically. New Slack messages, Drive files, and Notion pages appear instantly."
            />
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-32">
            <FeatureBlock
              title="Ask Questions, Get Cited Answers"
              description="Stop searching through folders and threads. Just ask Corporate Brain a question and get an immediate answer with links to source materials."
              points={[
                "Natural language questions in any format",
                "Precise citations to documents and messages",
                "Multi-hop reasoning across multiple sources",
                "Context-aware follow-up questions",
              ]}
              icon={MessageSquare}
              reversed
            />
            <FeatureBlock
              title="Connect Everything in Minutes"
              description="OAuth-based integrations mean no complex setup. Click, authorize, and your data starts flowing into Corporate Brain automatically."
              points={[
                "One-click OAuth connections",
                "Automatic content discovery",
                "Selective sync by channel or folder",
                "Real-time webhook updates",
              ]}
              icon={Globe}
            />
            <FeatureBlock
              title="AI That Fits Your Budget"
              description="Choose between fast, balanced, and deep analysis modes. Smart routing picks the right model for each query, optimizing for both cost and quality."
              points={[
                "Fast mode for simple questions (GPT-3.5)",
                "Balanced mode for most queries (Claude)",
                "Deep mode for complex analysis (GPT-4)",
                "Automatic cost tracking per query",
              ]}
              icon={BarChart3}
              reversed
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-fuchsia-900/10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="99.9%" label="Uptime SLA" />
            <StatCard number="50+" label="Integrations" />
            <StatCard number="10M+" label="Documents Processed" />
            <StatCard number="10,000+" label="Active Teams" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to experience
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              these features?
            </span>
          </h2>
          <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
            Start your free 14-day trial today. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
          <Icon className="h-6 w-6 text-violet-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureBlock({
  title,
  description,
  points,
  icon: Icon,
  reversed = false,
}: {
  title: string;
  description: string;
  points: string[];
  icon: React.ElementType;
  reversed?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-20 items-center`}
    >
      <div className="flex-1">
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-12">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10" />
          <div className="relative flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30">
              <Icon className="h-12 w-12 text-violet-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {title}
        </h3>
        <p className="text-lg text-white/50 mb-8">{description}</p>
        <ul className="space-y-4">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
              </div>
              <span className="text-white/70">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}
