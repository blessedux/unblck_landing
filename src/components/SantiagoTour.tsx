"use client";

import { useEffect, useState } from "react";
import { MapPin, QrCode, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type TourLocation = {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  order_index: number;
  location_type: "partner_business" | "cultural" | "prize";
  reward_type: "nft" | "usdc" | "nft_and_discount";
  sozu_claim_url: string;
  qr_code_data: string;
};

type TourClaim = {
  id: string;
  location_id: string;
  claimed_at: string;
};

export function SantiagoTour() {
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [claims, setClaims] = useState<TourClaim[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<TourLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [scanningQR, setScanningQR] = useState(false);

  useEffect(() => {
    fetchLocations();
    fetchClaims();
    getUserLocation();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/hub/tour/locations");
      if (!res.ok) throw new Error("Failed to fetch locations");
      const data = await res.json();
      setLocations(data.locations);
    } catch (err) {
      console.error(err);
      setError("Could not load tour locations");
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await fetch("/api/hub/tour/claims");
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      setClaims(data.claims);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const isNearLocation = (location: TourLocation): boolean => {
    if (!userLocation) return false;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      Number(location.latitude),
      Number(location.longitude)
    );
    return distance <= 50; // Within 50 meters
  };

  const handleClaimReward = async (qrData: string) => {
    if (!selectedLocation) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Verify GPS proximity
      if (!isNearLocation(selectedLocation)) {
        throw new Error("You must be within 50m of the location to claim");
      }

      // Verify QR code
      if (qrData !== selectedLocation.qr_code_data) {
        throw new Error("Invalid QR code");
      }

      // Record claim
      const res = await fetch("/api/hub/tour/claims/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location_id: selectedLocation.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Claim failed");
      }

      setSuccess("Location claimed! Redirecting to Sozu Wallet...");
      fetchClaims();

      // Redirect to Sozu Wallet to collect reward
      setTimeout(() => {
        window.location.href = selectedLocation.sozu_claim_url;
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setLoading(false);
      setScanningQR(false);
    }
  };

  const handleScanQR = () => {
    // In a real implementation, this would open a QR scanner
    // For now, we'll simulate with a prompt
    setScanningQR(true);
    const qrData = prompt("Enter QR code data (for testing):");
    if (qrData) {
      handleClaimReward(qrData);
    } else {
      setScanningQR(false);
    }
  };

  const isClaimed = (locationId: string) =>
    claims.some((claim) => claim.location_id === locationId);

  const getRewardBadge = (location: TourLocation) => {
    switch (location.reward_type) {
      case "nft":
        return <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">NFT</span>;
      case "usdc":
        return <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">USDC</span>;
      case "nft_and_discount":
        return <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">NFT + Discount</span>;
    }
  };

  const getLocationTypeBadge = (type: string) => {
    switch (type) {
      case "partner_business":
        return "Partner Business";
      case "cultural":
        return "Cultural";
      case "prize":
        return "Prize";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-2xl">
          {success}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Progress</h2>
        <p className="text-gray-400 text-sm">
          {claims.length} of {locations.length} locations claimed
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {locations.map((loc, idx) => (
            <div
              key={loc.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                isClaimed(loc.id)
                  ? "bg-green-500/20 text-green-300"
                  : "bg-white/5 text-gray-500"
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {!userLocation && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-2xl">
          <p className="text-sm">
            Location services are required to claim rewards. Please enable location access.
          </p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Tour Locations</h3>
        <div className="space-y-4">
          {locations.map((location) => {
            const claimed = isClaimed(location.id);
            const nearby = isNearLocation(location);

            return (
              <div
                key={location.id}
                className={`border rounded-2xl p-6 transition-colors ${
                  claimed
                    ? "border-green-500/30 bg-green-500/5"
                    : nearby
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{location.name}</h4>
                      {claimed && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{location.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{location.address}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getRewardBadge(location)}
                    <span className="text-xs text-gray-500">
                      {getLocationTypeBadge(location.location_type)}
                    </span>
                  </div>
                </div>

                {!claimed && (
                  <div className="mt-4">
                    {nearby ? (
                      <Button
                        onClick={() => {
                          setSelectedLocation(location);
                          handleScanQR();
                        }}
                        disabled={loading || scanningQR}
                        className="w-full rounded-full bg-white text-black hover:bg-gray-200"
                      >
                        <QrCode size={16} className="mr-2" />
                        {scanningQR ? "Scanning..." : "Scan QR to Claim"}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full rounded-full border-white/20 text-gray-500"
                      >
                        Get within 50m to unlock
                      </Button>
                    )}
                  </div>
                )}

                {claimed && (
                  <Button
                    onClick={() => window.open(location.sozu_claim_url, "_blank")}
                    variant="outline"
                    className="w-full rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View in Sozu Wallet
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
