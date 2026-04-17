"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  disabled?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  disabled = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-8 transition-all duration-300",
        highlighted
          ? "bg-gradient-to-b from-violet-600 to-fuchsia-600 text-white border border-violet-500/50"
          : "bg-white/[0.02] text-white border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.04]"
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white text-sm font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p
          className={cn(
            "mt-2 text-sm",
            highlighted ? "text-white/70" : "text-white/50"
          )}
        >
          {description}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span
          className={cn(
            "text-sm ml-1",
            highlighted ? "text-white/60" : "text-white/40"
          )}
        >
          /{period}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full mr-3 flex-shrink-0",
                highlighted ? "bg-white/20" : "bg-violet-500/20"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  highlighted ? "text-white" : "text-violet-400"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm",
                highlighted ? "text-white/80" : "text-white/60"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        disabled={disabled}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold transition-all",
          highlighted
            ? "bg-white text-violet-600 hover:bg-white/90"
            : disabled
            ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/10"
            : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90"
        )}
      >
        {cta}
      </button>
    </div>
  );
}
