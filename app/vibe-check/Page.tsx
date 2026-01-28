
"use client";

import { useRouter } from "next/navigation";
import { Screen4VibeCheck } from "@/app/components/Screen4VibeCheck";
import { ProgressIndicator } from "@/app/components/ProgressIndicator";
import { ShareButtons } from "@/app/components/ShareButtons";
import { useWrapStore } from "@/app/store/wrapStore";

export default function VibeCheckPage() {
  const router = useRouter();
  const { result } = useWrapStore();
  const vibes = result?.vibes ?? [];

  return (
    <div className="relative w-full h-screen">
      <Screen4VibeCheck vibes={vibes} />

      <ProgressIndicator
        currentStep={4}
        totalSteps={6}
        onNext={() => router.push("/persona")}
        showNext={true}
      />

      <ShareButtons
        title="My Vibe Check - Stellar Wrapped 2026"
        text={
          vibes.length
            ? `My Stellar vibe: ${vibes[0].percentage}% ${vibes[0].label}! What's yours? 🎨 #StellarWrapped #DeFi`
            : "Check out my Stellar Vibe Check! 🎨 #StellarWrapped #DeFi"
        }
        hashtags={["StellarWrapped", "DeFi", "CryptoVibe"]}
      />
    </div>
  );
}
