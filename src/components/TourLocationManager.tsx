"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
  enabled: boolean;
};

export function TourLocationManager({
  initialLocations,
}: {
  initialLocations: TourLocation[];
}) {
  const [locations, setLocations] = useState<TourLocation[]>(initialLocations);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TourLocation>>({});

  const handleCreate = () => {
    setEditing("new");
    setFormData({
      name: "",
      description: "",
      address: "",
      latitude: -33.4489,
      longitude: -70.6693,
      order_index: locations.length + 1,
      location_type: "cultural",
      reward_type: "nft",
      sozu_claim_url: "",
      qr_code_data: "",
      enabled: true,
    });
  };

  const handleEdit = (location: TourLocation) => {
    setEditing(location.id);
    setFormData(location);
  };

  const handleSave = async () => {
    if (editing === "new") {
      const res = await fetch("/api/admin/tour-locations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { location } = await res.json();
        setLocations([...locations, location]);
        setEditing(null);
      }
    } else {
      const res = await fetch(`/api/admin/tour-locations/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { location } = await res.json();
        setLocations(locations.map((l) => (l.id === editing ? location : l)));
        setEditing(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this location?")) return;
    const res = await fetch(`/api/admin/tour-locations/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLocations(locations.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleCreate}
          className="rounded-full bg-white text-black hover:bg-gray-200"
        >
          <Plus size={16} className="mr-2" />
          Add Location
        </Button>
      </div>

      {editing && (
        <div className="border border-white/20 rounded-2xl p-6 bg-black">
          <h3 className="text-xl font-semibold mb-4">
            {editing === "new" ? "New Location" : "Edit Location"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Address</label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Location Type
                </label>
                <select
                  value={formData.location_type || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location_type: e.target.value as TourLocation["location_type"],
                    })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="partner_business">Partner Business</option>
                  <option value="cultural">Cultural</option>
                  <option value="prize">Prize</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Reward Type
                </label>
                <select
                  value={formData.reward_type || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reward_type: e.target.value as TourLocation["reward_type"],
                    })
                  }
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="nft">NFT</option>
                  <option value="usdc">USDC</option>
                  <option value="nft_and_discount">NFT + Discount</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Sozu Claim URL
              </label>
              <input
                type="url"
                value={formData.sozu_claim_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sozu_claim_url: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                placeholder="https://sozu.example.com/claim/..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                QR Code Data
              </label>
              <input
                type="text"
                value={formData.qr_code_data || ""}
                onChange={(e) =>
                  setFormData({ ...formData, qr_code_data: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
                placeholder="unique-qr-identifier"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled !== false}
                onChange={(e) =>
                  setFormData({ ...formData, enabled: e.target.checked })
                }
                id="location-enabled"
              />
              <label htmlFor="location-enabled" className="text-sm text-gray-400">
                Enabled
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="rounded-full bg-white text-black hover:bg-gray-200"
              >
                Save
              </Button>
              <Button
                onClick={() => setEditing(null)}
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="border border-white/10 rounded-2xl p-6 bg-white/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  #{location.order_index} {location.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {location.description}
                </p>
                <p className="text-sm text-gray-500 mb-2">{location.address}</p>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                    {location.location_type}
                  </span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                    {location.reward_type}
                  </span>
                </div>
                <p className="text-sm">
                  {location.enabled ? (
                    <span className="text-green-500">✓ Enabled</span>
                  ) : (
                    <span className="text-red-500">✗ Disabled</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(location)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  onClick={() => handleDelete(location.id)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
