import * as React from "react";
import { useGoldsteinClientDataContext } from "../context/DataContext";

export function GoldsteinClientDashboard() {
  const { goldsteinData, setGoldsteinData } = useGoldsteinClientDataContext();

  return (
    <div>
      <h3>Association Info</h3>
      <p>FQDN: {goldsteinData.goldsteinFQDN}</p>
      <p>Type: {goldsteinData.associationType}</p>
      <p>ID: {goldsteinData.associationID}</p>

      <button
        onClick={() =>
          setGoldsteinData((prev) => ({
            ...prev,
            goldsteinFQDN: "new.example.com",
          }))
        }
      >
        Change FQDN
      </button>
    </div>
  );
}
