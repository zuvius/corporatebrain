"use client";

import { PricingCard } from "@/components/marketing/pricing-card";
import { Sparkles } from "lucide-react";

export default function PricingPage() {
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
              <span className="text-sm font-medium text-violet-300">Simple Pricing</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Transparent
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Start free and scale as your team grows. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 md:grid-cols-3 mb-16">
              <PricingCard
                name="Starter"
                price="$0"
                period="forever"
                description="Perfect for individuals and small teams getting started"
                features={[
                  "Up to 3 team members",
                  "1,000 documents indexed",
                  "Slack & Google Drive integration",
                  "Standard AI models (GPT-3.5)",
                  "7-day conversation history",
                  "Community support",
                ]}
                cta="Get Started Free"
              />
              <PricingCard
                name="Professional"
                price="$49"
                period="month"
                description="For growing teams that need more power and integrations"
                features={[
                  "Up to 20 team members",
                  "50,000 documents indexed",
                  "All integrations (Slack, Drive, Notion, Teams)",
                  "Premium AI models (GPT-4, Claude)",
                  "Unlimited conversation history",
                  "Advanced analytics dashboard",
                  "Priority email support",
                  "Custom branding",
                ]}
                cta="Start 14-Day Trial"
                highlighted
              />
              <PricingCard
                name="Enterprise"
                price="Custom"
                period="annual"
                description="For large organizations with advanced security and compliance needs"
                features={[
                  "Unlimited team members",
                  "Unlimited documents",
                  "Custom integrations & API access",
                  "All AI models with smart routing",
                  "SSO & advanced security",
                  "Dedicated account manager",
                  "SLA guarantee (99.99% uptime)",
                  "On-premise deployment option",
                ]}
                cta="Contact Sales"
              />
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="relative py-20 border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-fuchsia-900/10" />
          <div className="relative mx-auto max-w-7xl px-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
              Compare All Features
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-white/50 font-medium">Feature</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Starter</th>
                    <th className="text-center py-4 px-4 text-violet-400 font-semibold">Professional</th>
                    <th className="text-center py-4 px-6 text-white font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <FeatureRow feature="Team members" starter="3" pro="20" enterprise="Unlimited" />
                  <FeatureRow feature="Documents indexed" starter="1,000" pro="50,000" enterprise="Unlimited" />
                  <FeatureRow feature="Integrations" starter="2" pro="All 10+" enterprise="Custom" />
                  <FeatureRow feature="AI models" starter="GPT-3.5" pro="GPT-4, Claude" enterprise="All + Custom" />
                  <FeatureRow feature="Chat history" starter="7 days" pro="Unlimited" enterprise="Unlimited" />
                  <FeatureRow feature="Analytics" starter="Basic" pro="Advanced" enterprise="Custom reports" />
                  <FeatureRow feature="Support" starter="Community" pro="Priority email" enterprise="Dedicated manager" />
                  <FeatureRow feature="SSO/SAML" starter="—" pro="—" enterprise="✓" />
                  <FeatureRow feature="Audit logs" starter="—" pro="—" enterprise="✓" />
                  <FeatureRow feature="SLA" starter="—" pro="99.9%" enterprise="99.99%" />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <FAQItem
                question="Can I upgrade or downgrade at any time?"
                answer="Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your billing cycle."
              />
              <FAQItem
                question="What happens when I hit my document limit?"
                answer="We'll notify you when you reach 80% of your limit. You can either archive old documents or upgrade to a higher plan for more capacity."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Absolutely. We use enterprise-grade encryption (AES-256) at rest and in transit. We're SOC 2 Type II certified and GDPR compliant."
              />
              <FAQItem
                question="Do you offer refunds?"
                answer="We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can pay by invoice."
              />
            </div>
          </div>
        </section>
    </div>
  );
}

function FeatureRow({ feature, starter, pro, enterprise }: { feature: string; starter: string; pro: string; enterprise: string }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="py-4 px-6 text-white font-medium">{feature}</td>
      <td className="py-4 px-6 text-center text-white/50">{starter}</td>
      <td className="py-4 px-4 text-center text-violet-400 font-medium">{pro}</td>
      <td className="py-4 px-6 text-center text-white font-medium">{enterprise}</td>
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-white/10 pb-6">
      <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
      <p className="text-white/50">{answer}</p>
    </div>
  );
}
