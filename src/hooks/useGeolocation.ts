import { useState, useEffect } from "react";
import type { Coordinates } from "../types";

interface GeolocationState {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
}

// Default fallback location (Chicago)
const FALLBACK_LOCATION: Coordinates = {
  latitude: 41.8781,
  longitude: -87.6298,
  timestamp: new Date(),
};

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({
        location: FALLBACK_LOCATION,
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(position.timestamp),
        },
        loading: false,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Unable to get your location. ";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "Please enable location permissions and refresh the page.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage += "Location request timed out.";
          break;
        default:
          errorMessage += "An unknown error occurred.";
      }

      setState({
        location: FALLBACK_LOCATION,
        loading: false,
        error: errorMessage,
      });
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options || {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Optional: Watch position for updates
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options || {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}