"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Welcome", description: "Let's get you set up" },
  { id: 2, title: "Workspace", description: "Configure your team" },
  { id: 3, title: "Connect", description: "Add integrations" },
  { id: 4, title: "Complete", description: "You're all set" },
];

interface OnboardingState {
  currentStep: number;
  workspace: {
    name: string;
    teamSize: string;
    useCase: string;
  };
  isLoading: boolean;
  error: string | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    workspace: {
      name: "",
      teamSize: "",
      useCase: "",
    },
    isLoading: true,
    error: null,
  });

  // Fetch onboarding status on mount
  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding/status");
      if (!response.ok) throw new Error("Failed to fetch status");
      
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        currentStep: data.onboardingStep || 1,
        workspace: {
          name: data.workspace?.name || "",
          teamSize: data.workspace?.teamSize || "",
          useCase: data.workspace?.useCase || "",
        },
        isLoading: false,
      }));

      // If onboarding already completed, redirect to app
      if (data.onboardingCompleted) {
        router.push("/app");
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load onboarding",
      }));
    }
  };

  const updateStep = async (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const saveWorkspace = async (workspaceData: {
    name: string;
    teamSize: string;
    useCase: string;
  }) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch("/api/onboarding/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save workspace");
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        workspace: workspaceData,
        currentStep: data.nextStep || 3,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to save workspace",
      }));
    }
  };

  const completeOnboarding = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete onboarding");
      }

      router.push("/app");
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to complete onboarding",
      }));
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      updateStep(state.currentStep - 1);
    }
  };

  const nextStep = () => {
    if (state.currentStep < 4) {
      updateStep(state.currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  if (state.isLoading && state.currentStep === 1) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {state.error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{state.error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 ${
                  step.id <= state.currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.id < state.currentStep ? "✓" : step.id}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(state.currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {state.currentStep === 1 && <WelcomeStep onNext={nextStep} />}
        {state.currentStep === 2 && (
          <WorkspaceStep
            initialData={state.workspace}
            onSave={saveWorkspace}
            isLoading={state.isLoading}
          />
        )}
        {state.currentStep === 3 && <ConnectStep onNext={nextStep} />}
        {state.currentStep === 4 && <CompleteStep onComplete={completeOnboarding} isLoading={state.isLoading} />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={prevStep}
          disabled={state.currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            state.currentStep === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Back
        </button>
        {state.currentStep !== 2 && state.currentStep !== 4 && (
          <button
            onClick={nextStep}
            disabled={state.isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {state.isLoading ? "Loading..." : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to Corporate Brain!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
        Let&apos;s get your team&apos;s knowledge base set up in just a few minutes. 
        We&apos;ll guide you through connecting your tools and inviting your team.
      </p>
      <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">5 minute setup</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="text-2xl mb-2">🔌</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Connect your tools</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="text-2xl mb-2">🚀</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Start asking questions</p>
        </div>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}

function WorkspaceStep({
  initialData,
  onSave,
  isLoading,
}: {
  initialData: { name: string; teamSize: string; useCase: string };
  onSave: (data: { name: string; teamSize: string; useCase: string }) => Promise<void>;
  isLoading: boolean;
}) {
  const [teamName, setTeamName] = useState(initialData.name);
  const [teamSize, setTeamSize] = useState(initialData.teamSize);
  const [useCase, setUseCase] = useState(initialData.useCase);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    if (!teamName.trim()) newErrors.name = "Team name is required";
    if (!teamSize) newErrors.teamSize = "Team size is required";
    if (!useCase) newErrors.useCase = "Use case is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ name: teamName, teamSize, useCase });
    }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set Up Your Workspace</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Tell us a bit about your team so we can optimize your experience.
      </p>

      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team or Company Name *
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            placeholder="Acme Inc."
            className={`w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Size *
          </label>
          <select
            value={teamSize}
            onChange={(e) => {
              setTeamSize(e.target.value);
              if (errors.teamSize) setErrors({ ...errors, teamSize: "" });
            }}
            className={`w-full px-4 py-2 rounded-lg border ${errors.teamSize ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          >
            <option value="">Select team size</option>
            <option value="1-10">1-10 people</option>
            <option value="11-50">11-50 people</option>
            <option value="51-200">51-200 people</option>
            <option value="201-500">201-500 people</option>
            <option value="500+">500+ people</option>
          </select>
          {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What best describes your use case? *
          </label>
          <div className="space-y-2">
            {[
              { id: "internal_kb", label: "Internal knowledge base" },
              { id: "customer_support", label: "Customer support" },
              { id: "research", label: "Research & analysis" },
              { id: "other", label: "Other" },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  useCase === option.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="usecase"
                  value={option.id}
                  checked={useCase === option.id}
                  onChange={(e) => {
                    setUseCase(e.target.value);
                    if (errors.useCase) setErrors({ ...errors, useCase: "" });
                  }}
                  className="mr-3"
                />
                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.useCase && <p className="text-red-500 text-sm mt-1">{errors.useCase}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

function ConnectStep({ onNext }: { onNext: () => void }) {
  const [integrations, setIntegrations] = useState<Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    status?: string;
    canConnect: boolean;
    isTeaserRestricted: boolean;
    unavailableReason?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [teaserInfo, setTeaserInfo] = useState<{
    isTeaserMode: boolean;
    connectedCount: number;
    maxIntegrations: number;
    remainingSlots: number;
  } | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/integrations/list");
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.providers);
        setTeaserInfo({
          isTeaserMode: data.teaserMode,
          connectedCount: data.connectedCount,
          maxIntegrations: data.maxIntegrations,
          remainingSlots: data.remainingSlots,
        });
      }
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      setConnecting(provider);
      const response = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        const data = await response.json();
        // In production, this would redirect to OAuth provider
        // For now, open in new window or show coming soon
        if (data.oauthUrl) {
          window.open(data.oauthUrl, "_blank", "width=600,height=700");
        }
        // Refresh list after a delay
        setTimeout(fetchIntegrations, 2000);
      }
    } catch (error) {
      console.error("Failed to connect integration:", error);
    } finally {
      setConnecting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect Your Tools</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Link the platforms where your team stores knowledge. You can add more later.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            onClick={() => handleConnect(integration.id)}
            className={`p-4 border rounded-xl cursor-pointer transition-colors ${
              integration.status === "connected"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : integration.status === "pending"
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
            }`}
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">{integration.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                  {integration.popular && integration.status !== "connected" && (
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                      Popular
                    </span>
                  )}
                  {integration.status === "connected" && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      Connected
                    </span>
                  )}
                  {integration.status === "pending" && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {connecting === integration.id ? "Connecting..." : integration.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={onNext}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Skip for now →
          </button>
        </p>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function CompleteStep({
  onComplete,
  isLoading,
}: {
  onComplete: () => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">✅</span>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        You&apos;re All Set!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
        Your workspace is configured and ready to go. Start asking questions or 
        invite your team to join.
      </p>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 max-w-md mx-auto mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Start Guide</h3>
        <ul className="text-left space-y-3">
          <li className="flex items-center text-gray-700 dark:text-gray-300">
            <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm mr-3">1</span>
            Ask your first question in the chat
          </li>
          <li className="flex items-center text-gray-700 dark:text-gray-300">
            <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm mr-3">2</span>
            Connect more integrations from Settings
          </li>
          <li className="flex items-center text-gray-700 dark:text-gray-300">
            <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm mr-3">3</span>
            Invite teammates to collaborate
          </li>
          <li className="flex items-center text-gray-700 dark:text-gray-300">
            <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm mr-3">4</span>
            Explore the Admin Dashboard for insights
          </li>
        </ul>
      </div>

      <button
        onClick={onComplete}
        disabled={isLoading}
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Setting up..." : "Go to Dashboard"}
      </button>
    </div>
  );
}
