import { FolderOpen, MessageCircle } from "lucide-react";

type RoomImagePlaceholderProps = {
  className?: string;
};

export function RoomImagePlaceholder({ className = "" }: RoomImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-black/10 bg-gradient-to-br from-[#E1E0CC]/40 via-white/60 to-[#d4a574]/30 ${className}`}
      aria-hidden
    >
      <div className="flex aspect-[16/10] items-center justify-center gap-3 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5">
          <FolderOpen className="text-black/40" size={22} />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
          <MessageCircle className="text-black/35" size={18} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}
