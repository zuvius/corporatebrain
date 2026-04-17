"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Video,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bug,
  Lightbulb,
  Shield,
  Check,
} from "lucide-react";

const FAQS = [
  {
    question: "How do I upload documents?",
    answer:
      "Click the 'Add your first source' button in the Sources tab, or drag and drop files directly. We support PDF, DOCX, TXT, and MD files up to 50MB each. Once uploaded, documents are automatically processed and indexed for search.",
  },
  {
    question: "What types of questions can I ask?",
    answer:
      "You can ask anything related to your uploaded documents and connected integrations. The AI searches through your knowledge base to find relevant information and provides cited answers. Try asking about specific topics, summaries, or comparisons.",
  },
  {
    question: "How do integrations work?",
    answer:
      "Connect Slack, Google Drive, Notion, or Microsoft Teams from the Integrations page. Once connected, we'll automatically sync your content and make it searchable. You can manually trigger syncs anytime or wait for automatic daily updates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes! Your data is encrypted at rest and in transit. Documents are processed in isolated environments and never used to train AI models. Each tenant's data is completely segregated. See our Security page for more details.",
  },
  {
    question: "How does pricing work?",
    answer:
      "You're charged based on AI token usage. Each query shows the cost before you send it. The Admin Dashboard provides detailed cost breakdowns and ROI calculations. Set budget alerts to stay informed.",
  },
  {
    question: "Can I share conversations?",
    answer:
      "Currently conversations are private to each user. Shared workspaces and team collaboration features are coming soon. For now, you can export conversation content manually.",
  },
];

const QUICK_LINKS = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Detailed guides and API reference",
    href: "#docs",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step walkthroughs",
    href: "#tutorials",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Ask questions, share tips",
    href: "#community",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Bug,
    title: "Report a Bug",
    description: "Help us improve",
    href: "#bug",
    color: "bg-red-100 text-red-600",
  },
];

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Question", icon: MessageCircle },
  { value: "technical", label: "Technical Support", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "billing", label: "Billing Issue", icon: Shield },
  { value: "bug", label: "Report a Bug", icon: Bug },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "guides">(
    "faq",
  );
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Help & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers, learn how to use Corporate Brain, or get in touch
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("faq")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "faq"
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("guides")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "guides"
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Guides & Resources
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "contact"
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "faq" && (
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-violet-600 hover:text-violet-700"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "guides" && (
          <div>
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {QUICK_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className={`p-2 rounded-lg ${link.color}`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {link.title}
                      </h3>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Getting Started Guide */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-100 dark:bg-violet-800 rounded-xl">
                  <Lightbulb className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Getting Started Guide
                  </h3>
                  <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-violet-600">1.</span>
                      Upload your first document from the Sources tab
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-violet-600">2.</span>
                      Wait for processing (usually takes 1-2 minutes)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-violet-600">3.</span>
                      Click "New Chat" and ask a question about your document
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-violet-600">4.</span>
                      Explore the Context Map to visualize your knowledge
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-violet-600">5.</span>
                      Connect integrations to expand your knowledge base
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">
                    New Chat
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-600 rounded border text-gray-700 dark:text-gray-300 font-mono">
                    ⌘N
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">
                    Focus Search
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-600 rounded border text-gray-700 dark:text-gray-300 font-mono">
                    ⌘K
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">
                    Send Message
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-600 rounded border text-gray-700 dark:text-gray-300 font-mono">
                    Enter
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-600 dark:text-gray-400">
                    Toggle Sidebar
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-600 rounded border text-gray-700 dark:text-gray-300 font-mono">
                    ⌘B
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Send us a Message
              </h3>
              <form className="space-y-4">
                {/* Premium Custom Dropdown */}
                <div ref={subjectDropdownRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-violet-400 dark:hover:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                        <selectedSubject.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="font-medium">
                        {selectedSubject.label}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-transform duration-200 ${isSubjectOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Premium Dropdown Menu */}
                  {isSubjectOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-900/10 dark:shadow-black/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Select a subject
                        </div>
                        {SUBJECT_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const isSelected =
                            selectedSubject.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSelectedSubject(option);
                                setIsSubjectOpen(false);
                              }}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 transition-all duration-200 ${
                                isSelected
                                  ? "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30"
                                  : ""
                              }`}
                            >
                              <div
                                className={`p-1.5 rounded-lg ${isSelected ? "bg-violet-200 dark:bg-violet-800" : "bg-gray-100 dark:bg-gray-700"}`}
                              >
                                <Icon
                                  className={`h-4 w-4 ${isSelected ? "text-violet-700 dark:text-violet-300" : "text-gray-500 dark:text-gray-400"}`}
                                />
                              </div>
                              <span
                                className={`flex-1 text-left ${isSelected ? "font-semibold text-violet-900 dark:text-violet-200" : "text-gray-700 dark:text-gray-300"}`}
                              >
                                {option.label}
                              </span>
                              {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                                  <Check className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {/* Decorative gradient footer */}
                      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your issue or question..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Email Support
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      support@corporatebrain.app
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Response time: Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Security
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      security@corporatebrain.app
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      For security-related concerns only
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Documentation
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      docs.corporatebrain.app
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Self-service guides and API docs
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800 p-4">
                <p className="text-sm text-violet-800 dark:text-violet-200">
                  <strong>Enterprise Support:</strong> If you have a dedicated
                  account manager, please reach out to them directly for
                  priority support.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
