"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  Shield,
  Users,
  Quote,
} from "lucide-react";

export default function AboutPage() {
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
              Our Story
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Building the Future of
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Workplace Knowledge
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Corporate Brain was founded in 2025 with a simple mission: make
            company knowledge accessible, actionable, and intelligent.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-white/50 mb-6 leading-relaxed">
                Every company sits on a goldmine of knowledge trapped in
                documents, messages, and emails. Yet finding the right
                information when you need it is frustratingly hard.
              </p>
              <p className="text-white/50 mb-6 leading-relaxed">
                We believe AI can change this. Not by replacing human expertise,
                but by making it instantly accessible. Corporate Brain connects
                to your existing tools, understands your company's unique
                context, and delivers answers with sources you can trust.
              </p>
              <p className="text-white/50 leading-relaxed">
                Our goal is simple: help every team member make better
                decisions, faster.
              </p>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10" />
              <div className="relative">
                <Quote className="h-8 w-8 text-violet-400 mb-4" />
                <blockquote className="text-lg italic text-white/80 mb-4">
                  "The best time to organize your company knowledge was when you
                  started. The second best time is now."
                </blockquote>
                <p className="text-sm text-violet-400">
                  — Corporate Brain Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-fuchsia-900/10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={Target}
              title="Transparency First"
              description="We believe you deserve to know where answers come from. Every response includes citations to source materials."
            />
            <ValueCard
              icon={Shield}
              title="Security by Design"
              description="Your data never trains our models. Enterprise-grade encryption, SOC 2 compliance, and strict access controls."
            />
            <ValueCard
              icon={Users}
              title="Human-Centered AI"
              description="AI should amplify human expertise, not replace it. We build tools that make your team smarter, not obsolete."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat number="500+" label="Teams Using Corporate Brain" />
            <Stat number="10M+" label="Documents Processed" />
            <Stat number="50+" label="Countries Served" />
            <Stat number="99.9%" label="Customer Satisfaction" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-fuchsia-900/10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-white/50 text-center max-w-2xl mx-auto mb-12">
            We're a diverse team of engineers, designers, and AI researchers
            passionate about making knowledge work for everyone.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember
              name="Sarah Chen"
              role="CEO & Co-Founder"
              bio="Former product lead at Google. 10+ years in enterprise SaaS."
            />
            <TeamMember
              name="Marcus Johnson"
              role="CTO & Co-Founder"
              bio="PhD in ML from MIT. Built AI systems at OpenAI and Anthropic."
            />
            <TeamMember
              name="Elena Rodriguez"
              role="Head of Design"
              bio="Previously led design at Notion. Focused on intuitive AI interfaces."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Us on Our
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
          <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
            We're always looking for talented people who share our vision for
            the future of work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/careers"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              View Open Positions
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
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
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  );
}

function TeamMember({
  name,
  role,
  bio,
}: {
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-violet-400 text-sm mb-2">{role}</p>
      <p className="text-white/50 text-sm">{bio}</p>
    </div>
  );
}
