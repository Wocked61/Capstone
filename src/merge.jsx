import { useState, useEffect, useMemo, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "./merge.css";
import Plan from "./Plan";
import Gemini from "./Gemini";
import Map from "./Map";

export default function MergedDashboard() {
  const [activeTab, setActiveTab] = useState("plan");
  const planRef = useRef(null);

  const handleApplySchedule = (tasks) => {
    if (planRef.current) {
      planRef.current.applySchedule(tasks);
    }
  };

  return (
    <div className="merged-dashboard">
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "plan" ? "active" : ""}`}
          onClick={() => setActiveTab("plan")}
        >
        Plan
        </button>
        <button
          className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
        Chat Assistant
        </button>
        <button
          className={`tab-button ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
        Map View
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "plan" && (
          <div className="tab-content active">
            <Plan ref={planRef} />
          </div>
        )}
        {activeTab === "chat" && (
          <div className="tab-content active">
            <Gemini onApplySchedule={handleApplySchedule} />
          </div>
        )}
        {activeTab === "map" && (
          <div className="tab-content active">
            <div className="map-container">
              <Map />
            </div>
          </div>
        )}
      </div>

      {/* Alternative View: Desktop Grid Layout */}
      <div className="desktop-view">
        <div className="grid-container">
          <div className="grid-section plan-section">
            <div className="section-header">
              <h2>Weekly Plan</h2>
            </div>
            <Plan ref={planRef} />
          </div>

          <div className="grid-section chat-section">
            <div className="section-header">
            </div>
            <Gemini onApplySchedule={handleApplySchedule} />
          </div>

          <div className="grid-section map-section">
            <div className="section-header">
            </div>
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
}
