"use client";

import { useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  Building2,
  Check,
  ChevronDown,
  Wallet,
  Wrench,
  Users,
  Handshake,
  Lightbulb,
  Bug,
  Newspaper
} from "lucide-react";

const inquiryTypes = [
  { value: "sales", label: "Sales Inquiry", icon: Wallet, description: "Learn about pricing and plans" },
  { value: "support", label: "Technical Support", icon: Wrench, description: "Get help with technical issues" },
  { value: "enterprise", label: "Enterprise Demo", icon: Building2, description: "Schedule a custom demo" },
  { value: "partners", label: "Partnership Opportunity", icon: Handshake, description: "Explore partnership options" },
  { value: "training", label: "Training & Onboarding", icon: Users, description: "Get team training support" },
  { value: "bug", label: "Report a Bug", icon: Bug, description: "Submit bug reports" },
  { value: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest new features" },
  { value: "press", label: "Press & Media", icon: Newspaper, description: "Media and press inquiries" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    type: "sales",
  });
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedType = inquiryTypes.find((t) => t.value === formState.type);

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
              <MessageCircle className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">Get in Touch</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              We're Here to
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                Help
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Have questions about Corporate Brain? Our team is ready to assist you.
              Fill out the form and we'll get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                <p className="text-white/50 mb-8">
                  Choose the best way to reach us based on your needs.
                </p>

                <div className="space-y-6 mb-8">
                  <ContactMethod
                    icon={Mail}
                    title="Email Us"
                    detail="support@corporatebrain.com"
                    description="For general inquiries and support"
                  />
                  <ContactMethod
                    icon={MessageCircle}
                    title="Live Chat"
                    detail="Available 9am-6pm EST"
                    description="Get instant help from our team"
                  />
                  <ContactMethod
                    icon={Phone}
                    title="Call Us"
                    detail="+1 (555) 123-4567"
                    description="For enterprise sales and support"
                  />
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-violet-400" />
                      <h3 className="font-semibold text-white">Enterprise Inquiries</h3>
                    </div>
                    <p className="text-sm text-white/50 mb-4">
                      Looking for custom integrations, SSO, or dedicated support?
                      Our enterprise team is ready to help.
                    </p>
                    <a href="mailto:enterprise@corporatebrain.com" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
                      enterprise@corporatebrain.com →
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5" />
                <div className="relative">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 mx-auto mb-4">
                        <Check className="h-8 w-8 text-violet-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-white/50 mb-6">
                        Thanks for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Premium Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          How can we help?
                        </label>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white hover:border-violet-500/30 hover:bg-white/[0.07] transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            {selectedType && (
                              <>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                                  <selectedType.icon className="h-4 w-4 text-violet-400" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">{selectedType.label}</div>
                                  <div className="text-xs text-white/40">{selectedType.description}</div>
                                </div>
                              </>
                            )}
                          </div>
                          <ChevronDown className={`h-5 w-5 text-white/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {dropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#0f0f16] shadow-2xl overflow-hidden">
                            <div className="py-2">
                              {inquiryTypes.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => {
                                    setFormState({ ...formState, type: type.value });
                                    setDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                                    formState.type === type.value ? "bg-violet-500/10" : ""
                                  }`}
                                >
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    formState.type === type.value ? "bg-violet-500/30" : "bg-white/5"
                                  }`}>
                                    <type.icon className={`h-4 w-4 ${
                                      formState.type === type.value ? "text-violet-400" : "text-white/40"
                                    }`} />
                                  </div>
                                  <div className="text-left">
                                    <div className={`font-medium ${
                                      formState.type === type.value ? "text-violet-400" : "text-white"
                                    }`}>
                                      {type.label}
                                    </div>
                                    <div className="text-xs text-white/40">{type.description}</div>
                                  </div>
                                  {formState.type === type.value && (
                                    <Check className="h-4 w-4 text-violet-400 ml-auto" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={formState.company}
                          onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                          placeholder="Acme Inc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                          Message *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      >
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}

function ContactMethod({ icon: Icon, title, detail, description }: { icon: React.ElementType; title: string; detail: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex-shrink-0">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-violet-400 font-medium">{detail}</p>
        <p className="text-sm text-white/40">{description}</p>
      </div>
    </div>
  );
}
