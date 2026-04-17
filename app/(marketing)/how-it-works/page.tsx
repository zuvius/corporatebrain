"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Plug,
  Settings,
  Lightbulb,
  Search,
  FileText,
  BarChart3,
  Bell,
  CheckCircle2,
  Shield,
  Lock,
  Server,
  Fingerprint,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#0a0a0f] to-fuchsia-900/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-violet-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              3 Simple Steps
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            How Corporate Brain
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Works
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            From scattered documents to intelligent answers in three simple
            steps.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-32">
            <Step
              number="01"
              title="Connect Your Tools"
              description="Link Corporate Brain to your existing workspace in minutes. We integrate with Slack, Google Drive, Notion, Microsoft Teams, and more."
              points={[
                "One-click OAuth connections",
                "No code or IT setup required",
                "Choose which channels and folders to sync",
                "Automatic discovery of new content",
              ]}
              icon={Plug}
            />
            <Step
              number="02"
              title="We Process Everything"
              description="Our AI pipeline automatically extracts, chunks, embeds, and indexes your content. Every document, message, and conversation becomes searchable."
              points={[
                "PDFs, Word docs, Markdown, and more",
                "Slack messages and thread context",
                "Email threads and attachments",
                "Notion pages and databases",
              ]}
              icon={Settings}
              reversed
            />
            <Step
              number="03"
              title="Ask & Get Answers"
              description="Just ask a question in natural language. Corporate Brain searches across all your connected sources and delivers cited, contextual answers."
              points={[
                "Type or speak your question",
                "Hybrid RAG finds relevant context",
                "AI synthesizes the answer",
                "Click citations to verify sources",
              ]}
              icon={Lightbulb}
            />
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-fuchsia-900/10" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            The Technology Behind It
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TechCard
              icon={Search}
              title="Hybrid RAG"
              description="Combines vector similarity search with LLM reasoning. We find relevant documents, then use AI to synthesize contextual answers."
            />
            <TechCard
              icon={BarChart3}
              title="Smart Embeddings"
              description="Every piece of content is converted to vector embeddings that capture semantic meaning, not just keywords."
            />
            <TechCard
              icon={Server}
              title="Multi-Model AI"
              description="Route queries to GPT-4, Claude, or Gemini based on complexity. Optimize for speed, cost, or accuracy."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            What Can You Do With Corporate Brain?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UseCase
              icon={Search}
              title="Find Information"
              example="What was our Q3 revenue target?"
            />
            <UseCase
              icon={FileText}
              title="Draft Content"
              example="Write a project brief based on our meeting notes."
            />
            <UseCase
              icon={BarChart3}
              title="Analyze Data"
              example="Summarize customer feedback from last month."
            />
            <UseCase
              icon={Bell}
              title="Stay Updated"
              example="What happened in the #engineering channel yesterday?"
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">
              Enterprise-Grade Security
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Your Data Stays Yours
          </h2>
          <p className="text-lg text-white/50 mb-8">
            We never use your data to train AI models. Everything is encrypted,
            access-controlled, and stored securely.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <SecurityBadge icon={Shield} text="SOC 2 Type II" />
            <SecurityBadge icon={Lock} text="GDPR Compliant" />
            <SecurityBadge icon={Fingerprint} text="AES-256 Encryption" />
            <SecurityBadge icon={Server} text="SSO Ready" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Try It
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Yourself?
            </span>
          </h2>
          <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
            Start your free trial today. No credit card required.
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

function Step({
  number,
  title,
  description,
  points,
  icon: Icon,
  reversed = false,
}: {
  number: string;
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
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30">
              <Icon className="h-16 w-16 text-violet-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-violet-400 font-bold text-lg mb-2">
          STEP {number}
        </div>
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

function TechCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
          <Icon className="h-6 w-6 text-violet-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function UseCase({
  icon: Icon,
  title,
  example,
}: {
  icon: React.ElementType;
  title: string;
  example: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
          <Icon className="h-5 w-5 text-violet-400" />
        </div>
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-violet-400 italic">"{example}"</p>
      </div>
    </div>
  );
}

function SecurityBadge({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 border border-white/10 bg-white/5">
      <Icon className="h-4 w-4 text-violet-400" />
      {text}
    </span>
  );
}
