import { useState, useEffect, useMemo } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "./merge.css";
import Plan from "./Plan";
import Gemini from "./Gemini";
import Map from "./Map";

export default function MergedDashboard() {
  const [activeTab, setActiveTab] = useState("plan");

  return (
    <div className="merged-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">TaskFast Dashboard</h1>
        <p className="dashboard-subtitle">Plan, Chat, and Visualize Your Tasks</p>
      </div>

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
            <Plan />
          </div>
        )}
        {activeTab === "chat" && (
          <div className="tab-content active">
            <Gemini />
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
            <Plan />
          </div>

          <div className="grid-section chat-section">
            <div className="section-header">
              <h2>Chat Assistant</h2>
            </div>
            <Gemini />
          </div>

          <div className="grid-section map-section">
            <div className="section-header">
              <h2>Location Map</h2>
            </div>
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
}
