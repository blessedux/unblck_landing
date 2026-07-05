import Image from "next/image";

export function HubBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Image
        src="/leneriabg2.webp"
        alt=""
        fill
        priority
        className="object-cover scale-105 blur-md"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#d4a574]/75" aria-hidden />
    </div>
  );
}
