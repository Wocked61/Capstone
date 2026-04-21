
// @license
// Copyright 2019 Google LLC. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
 
// let map;

import { useEffect, useRef, useState } from "react";
import "./Map.css";

let googleMapsScriptPromise;

// Function to load the Google Maps JavaScript API
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  // Script is loading => return the promise
  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      // Handle script loading errors
      script.onerror = () => reject(new Error("Google Maps failed to load."));
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
}

// React component to display the map
export default function Map() {
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  // Run operations to set up and load the map
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Check if the API key is provided
    if (!apiKey) {
      setError("Missing VITE_GOOGLE_MAPS_API_KEY in .env");
      return;
    }
    // Load the Google Maps API and initialize the map
    loadGoogleMaps(apiKey)
      .then((maps) => {
        new maps.Map(mapRef.current, {
          center: { lat: 34.0522, lng: -118.2437 },
          zoom: 10,
        });
      })
      // Handle errors that occur during the loading of the Google Maps API
      .catch((e) => setError(e.message));
  }, []);
  // Display an error message if there was an issue loading the map
  if (error) return <p className="map-error">{error}</p>;
  // Render the map container
  return (
    <div className="map-wrapper">
      <div id="map" ref={mapRef} />
    </div>
  );
}

// Dylan Phan, Helen Ngo, Vincent Nguyen< Matthew Lim
// Copyright [2026] [Google LLC]

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.