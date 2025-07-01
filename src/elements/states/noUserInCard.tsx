import React, { useEffect, useState } from "react";
import { registerBadge } from "../../core/registerBadge";
import { useGoldsteinClientDataContext } from "../../context/DataContext";

// Define the types for the props
interface NoUserInCardProps {
  badgeUID: string; 
}

export default function NoUserInCard({ badgeUID }: NoUserInCardProps) {
  const [onboardingWord, setOnboardingWord] = useState<string | undefined>(
    undefined,
  );

  const { goldsteinData } = useGoldsteinClientDataContext();

  const registerBadgeHelper = async () => {
    const rawOnboardingWord = await registerBadge(
      "https://" + goldsteinData.goldsteinFQDN,
      JSON.parse(badgeUID).badge_uuid,
    );

    setOnboardingWord(JSON.parse(rawOnboardingWord).onboarding_word);
  };

  useEffect(() => {
    setOnboardingWord(undefined);
  }, [badgeUID]);

  return (
    <div className="text-center">
      <div className="alert alert-warning mb-4" role="alert">
        <h1 className="h4 alert-heading">No user is registered in the card</h1>
      </div>
      <div className="card mb-3">
        <div className="card-header bg-light-subtle">Card Information</div>
        <div className="card-body">
          <p className="card-text">
            <strong>Badge UUID:</strong> <code>{badgeUID}</code>
          </p>
          {onboardingWord && (
            <p className="card-text">
              <strong>Your secret word:</strong> <code>{onboardingWord}</code>
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={registerBadgeHelper}
      >
        Register badge
      </button>
    </div>
  );
}
