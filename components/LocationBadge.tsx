"use client";
import { useEffect, useState } from "react";

export default function LocationBadge() {
  const [location, setLocation] = useState("Sweetwaters, Pietermaritzburg");

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const suburb =
            data.address?.suburb ||
            data.address?.quarter ||
            data.address?.neighbourhood ||
            data.address?.town ||
            data.address?.city_district;
          const city =
            data.address?.city ||
            data.address?.county ||
            data.address?.state_district;
          if (suburb || city) {
            setLocation([suburb, city].filter(Boolean).join(", "));
          }
        } catch {
          // keep default
        }
      },
      () => {
        // permission denied — keep default
      },
      { timeout: 6000 }
    );
  }, []);

  return (
    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full mb-6">
      📍 Now live in {location}
    </span>
  );
}
