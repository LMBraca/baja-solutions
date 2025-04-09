"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export function Map({ onAddressSelect, initialLocation, readOnly = false }) {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentMarkerRef = useRef(null);
  const mapRef = useRef(null);
  const placeAutoCompleteRef = useRef(null);
  const googleRef = useRef(null);
  const [place, setPlace] = useState(null);
  const mapInitializedRef = useRef(false);

  // Load Google Maps API
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "marker"],
    });

    const loadMap = async () => {
      try {
        const google = await loader.load();
        googleRef.current = google;
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    loadMap();
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInitializedRef.current) {
      const mapOptions = {
        center: initialLocation || {
          lat: 32.638029794224146,
          lng: -115.46966738822272,
        },
        zoom: 15,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
      };

      const mexicaliBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(31.452024691105972, -117.35508845099321),
        new window.google.maps.LatLng(32.862912315683516, -114.43358618572425)
      );

      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);

      if (!readOnly) {
        googleMap.addListener("click", (event) => {
          const clickedPosition = event.latLng;
          placeMarkerOnMap(clickedPosition, googleMap);
          getAddressFromLatLng(clickedPosition);
        });

        const autocomplete = new window.google.maps.places.Autocomplete(
          placeAutoCompleteRef.current,
          {
            bounds: mexicaliBounds,
            fields: ["formatted_address", "geometry"],
            componentRestrictions: { country: "mx" },
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const position = place.geometry.location;

          if (position) {
            googleMap.setCenter(position);
            placeMarkerOnMap(position, googleMap);

            if (onAddressSelect && place.formatted_address) {
              onAddressSelect(place.formatted_address, {
                lat: position.lat(),
                lng: position.lng(),
              });
            }
          }
        });

        setAutocomplete(autocomplete);
      }

      setMap(googleMap);
      mapInitializedRef.current = true;
    }
  }, [isLoaded, initialLocation, readOnly, onAddressSelect]);

  // Handle initial location change (update marker without reloading map)
  useEffect(() => {
    if (map && initialLocation) {
      const position = new window.google.maps.LatLng(
        initialLocation.lat,
        initialLocation.lng
      );

      // Only center the map on initialLocation changes if we're in readOnly mode
      // or if this is the first time we're setting the location
      if (readOnly || !currentMarkerRef.current) {
        map.setCenter(position);
      }

      placeMarkerOnMap(position, map);
    }
  }, [initialLocation, map, readOnly]);

  function placeMarkerOnMap(position, mapInstance) {
    if (currentMarkerRef.current) {
      currentMarkerRef.current.map = null;
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map: mapInstance,
      title: "Selected Location",
    });

    currentMarkerRef.current = marker;
  }

  function getAddressFromLatLng(latLng) {
    const geocoder = new window.google.maps.Geocoder();

    geocoder
      .geocode({ location: latLng })
      .then((response) => {
        if (response.results[0]) {
          const address = response.results[0].formatted_address;

          if (onAddressSelect) {
            onAddressSelect(address, {
              lat: latLng.lat(),
              lng: latLng.lng(),
            });
          }

          if (placeAutoCompleteRef.current) {
            placeAutoCompleteRef.current.value = address;
          }
        }
      })
      .catch((error) => {
        console.error("Geocoding error:", error);
      });
  }

  return (
    <div>
      {isLoaded ? (
        <div>
          {!readOnly && (
            <div style={{ marginBottom: "10px" }}>
              <input
                ref={placeAutoCompleteRef}
                type="text"
                placeholder="Address"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
          <div
            ref={mapRef}
            style={{ height: readOnly ? "300px" : "600px" }}
          ></div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Map;
