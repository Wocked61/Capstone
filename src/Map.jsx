
// @license
// Copyright 2019 Google LLC. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
 
// let map;

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import "./Map.css";

// IMPORTANT: define outside component to avoid re-renders
const LIBRARIES = ["places"];

export default function Map() {
  // =========================
  // References (no re-renders)
  // =========================
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRenderer = useRef(null);

  // States
  const [maps, setMaps] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");

  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Initialize Map
  useEffect(() => {
    if (!isLoaded) return; // wait for API
    if (!window.google) return;
    if (mapInstance.current) return; // prevent duplicate init

    const maps = window.google.maps;
    setMaps(maps);
    // Update mapInstance (ref to map)
    mapInstance.current = new maps.Map(mapRef.current, {
      // Center on Los Angeles (Temp: Consider using user location)
      center: { lat: 34.0522, lng: -118.2437 },
      zoom: 10,
    });

    // Update directionsRenderer (ref for routing)
    directionsRenderer.current = new maps.DirectionsRenderer();
    directionsRenderer.current.setMap(mapInstance.current);

    // Click to add waypoint
    mapInstance.current.addListener("click", (e) => {
      setWaypoints((prev) => [
        ...prev,
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
    });
  }, [isLoaded]);

  // Handle Searchbar Location Autocomplet
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry?.location) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
    };

    setWaypoints((prev) => [...prev, location]);

    mapInstance.current.panTo(location);
    mapInstance.current.setZoom(12);

    inputRef.current.value = "";
  };

  // Update markers and routing data
  useEffect(() => {
    if (!maps || !mapInstance.current) return;

    // clear markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // add markers
    waypoints.forEach((pos, i) => {
      const marker = new maps.Marker({
        position: pos,
        map: mapInstance.current,
        label: `${i + 1}`,
      });

      marker.addListener("click", () => {
        setWaypoints((prev) => prev.filter((_, idx) => idx !== i));
      });

      markersRef.current.push(marker);
    });

    // route logic
    if (waypoints.length < 2) {
      directionsRenderer.current?.setDirections({ routes: [] });
      setSummary(null);
      return;
    }

    const service = new maps.DirectionsService();

    service.route(
      {
        origin: waypoints[0],
        destination: waypoints[waypoints.length - 1],
        waypoints: waypoints.slice(1, -1).map((p) => ({ location: p })),
        travelMode: maps.TravelMode[travelMode],
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(result);

          // Obtain the legs of the route
          const legs = result.routes[0].legs;

          // Calculate distance by summing the legs (partitions) of the route
          const distance = legs.reduce((sum, l) => sum + l.distance.value, 0);
          const duration = legs.reduce((sum, l) => sum + l.duration.value, 0);

          // Update Route Summary (Route distance in km and duration in minutes)
          setSummary({
            distance: (distance / 1000).toFixed(2),
            duration: (duration / 60).toFixed(1),
          });
        }
      }
    );
  }, [waypoints, maps, travelMode]);

  // Debug Code: detect maps loading errors
  // Map load expeiences error or fails
  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  // Render the maps (after all the hooks)
  // Simple Locations Searchbar with Autocomplete
  // Simple dropdown menu for travel mode
  // Simple summary for distance in kilometer and travel duration
  // for a given route between 2 markers
  // Simple button to clear route markers
  return (
    <div className="map-wrapper">
      <h2>Route Planner</h2>

      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a location..."
          className="map-search"
        />
      </Autocomplete>

      <select
        value={travelMode}
        onChange={(e) => setTravelMode(e.target.value)}
      >
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>

      {summary && (
        <div>
          <p>Distance: {summary.distance} km</p>
          <p>Duration: {summary.duration} mins</p>
        </div>
      )}

      <button onClick={() => setWaypoints([])}>Clear Route</button>

      <div id="map" ref={mapRef} />
    </div>
  );
}