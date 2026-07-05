"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  amenities: string[];
  booking_enabled: boolean;
};

export function RoomManager({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});

  const roomTypes = [
    { value: "small_meeting", label: "Small Meeting Room" },
    { value: "large_meeting", label: "Large Meeting Room" },
    { value: "phone_booth", label: "Phone Booth" },
    { value: "podcast_studio", label: "Podcast Studio" },
    { value: "event_space", label: "Event Space" },
  ];

  const handleCreate = () => {
    setEditing("new");
    setFormData({
      name: "",
      type: "small_meeting",
      capacity: 4,
      amenities: [],
      booking_enabled: true,
    });
  };

  const handleEdit = (room: Room) => {
    setEditing(room.id);
    setFormData(room);
  };

  const handleSave = async () => {
    if (editing === "new") {
      // Create new room
      const res = await fetch("/api/admin/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { room } = await res.json();
        setRooms([...rooms, room]);
        setEditing(null);
      }
    } else {
      // Update existing room
      const res = await fetch(`/api/admin/rooms/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { room } = await res.json();
        setRooms(rooms.map((r) => (r.id === editing ? room : r)));
        setEditing(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    const res = await fetch(`/api/admin/rooms/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRooms(rooms.filter((r) => r.id !== id));
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
          Add Room
        </Button>
      </div>

      {editing && (
        <div className="border border-white/20 rounded-2xl p-6 bg-black">
          <h3 className="text-xl font-semibold mb-4">
            {editing === "new" ? "New Room" : "Edit Room"}
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
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <select
                value={formData.type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={(formData.amenities || []).join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.booking_enabled !== false}
                onChange={(e) =>
                  setFormData({ ...formData, booking_enabled: e.target.checked })
                }
                id="booking-enabled"
              />
              <label htmlFor="booking-enabled" className="text-sm text-gray-400">
                Booking Enabled
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
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-white/10 rounded-2xl p-6 bg-white/5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white mb-2">{room.name}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Type: {room.type} • Capacity: {room.capacity}
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/10 px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <p className="text-sm mt-2">
                  {room.booking_enabled ? (
                    <span className="text-green-500">✓ Enabled</span>
                  ) : (
                    <span className="text-red-500">✗ Disabled</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(room)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  onClick={() => handleDelete(room.id)}
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
