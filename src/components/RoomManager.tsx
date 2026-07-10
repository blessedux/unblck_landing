"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getRoomTypeLabel, ROOM_TYPE_VALUES } from "@/lib/rooms/room-types";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  amenities: string[];
  booking_enabled: boolean;
  image_url: string | null;
};

export function RoomManager({ initialRooms }: { initialRooms: Room[] }) {
  const { t } = useLocale();
  const copy = t.adminRooms;

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});

  const roomTypes = ROOM_TYPE_VALUES.map((value) => ({
    value,
    label: getRoomTypeLabel(copy.roomTypes, value),
  }));

  const handleCreate = () => {
    setEditing("new");
    setFormData({
      name: "",
      type: "small_meeting",
      capacity: 4,
      amenities: [],
      booking_enabled: true,
      image_url: null,
    });
  };

  const handleEdit = (room: Room) => {
    setEditing(room.id);
    setFormData(room);
  };

  const handleSave = async () => {
    if (editing === "new") {
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
    if (!confirm(copy.deleteConfirm)) return;
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
          {copy.addRoom}
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-white/20 bg-black p-6">
          <h3 className="mb-4 text-xl font-semibold">
            {editing === "new" ? copy.newRoom : copy.editRoom}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {copy.name}
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {copy.type}
              </label>
              <select
                value={formData.type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {copy.capacity}
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
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {copy.amenities}
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
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                {copy.imageUrl}
              </label>
              <input
                type="text"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image_url: e.target.value || null,
                  })
                }
                placeholder={copy.imageUrlPlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white"
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
                {copy.bookingEnabled}
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="rounded-full bg-white text-black hover:bg-gray-200"
              >
                {copy.save}
              </Button>
              <Button
                onClick={() => setEditing(null)}
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
              >
                {copy.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="mb-2 font-semibold text-white">{room.name}</h3>
                <p className="mb-2 text-sm text-gray-400">
                  {copy.typeCapacity
                    .replace(
                      "{type}",
                      getRoomTypeLabel(copy.roomTypes, room.type),
                    )
                    .replace("{capacity}", String(room.capacity))}
                </p>
                {room.image_url && (
                  <p className="mb-2 max-w-md truncate text-sm text-gray-500">
                    {copy.imageLabel.replace("{url}", room.image_url)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white/10 px-2 py-1 text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm">
                  {room.booking_enabled ? (
                    <span className="text-green-500">✓ {copy.enabled}</span>
                  ) : (
                    <span className="text-red-500">✗ {copy.disabled}</span>
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
