"use client";
import { useState } from "react";
import { ERC6551APIs } from "./ERC6551APIs";
import { ProfileAPIs } from "./ProfileAPIs";
import { RecommendationAPIs } from "./RecommendationAPIs";
import EnhancementAPIs from "./EnhancementAPIs";

export default function Home() {
  const [view, setView] = useState("erc6551");

  return (
    <>
      <div>
        <div>
          <p className="text-3xl text-slate-400 mb-4">Airstack</p>
          <p className="mb-2 font-bold">API type</p>
          <button onClick={() => setView("erc6551")}>
            <p
              className={`
        mr-2 rounded-lg px-5 py-2 bg-slate-200
         ${view === "erc6551" ? "text-black" : "text-gray-400"}
        `}
            >
              ERC6551
            </p>
          </button>
          <button onClick={() => setView("profiles")}>
            <p
              className={`
        mr-2 rounded-lg px-5 py-2 bg-slate-200
         ${view === "profiles" ? "text-black" : "text-gray-400"}
        `}
            >
              Profiles
            </p>
          </button>
          <button onClick={() => setView("recommendations")}>
            <p
              className={`
           mr-2 rounded-lg px-5 py-2 bg-slate-200
           ${view === "recommendations" ? "text-black" : "text-gray-400 "}
           `}
            >
              Recommendations
            </p>
          </button>
          <button onClick={() => setView("enhancements")}>
            <p
              className={`
           mr-2 rounded-lg px-5 py-2 bg-slate-200
           ${view === "enhancements" ? "text-black" : "text-gray-400 "}
           `}
            >
              Enhancements
            </p>
          </button>
        </div>
        {view === "erc6551" && <ERC6551APIs />}
        {view === "profiles" && <ProfileAPIs />}
        {view === "recommendations" && <RecommendationAPIs />}
        {view === "enhancements" && <EnhancementAPIs />}
      </div>
    </>
  );
}
