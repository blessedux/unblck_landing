import { ChannelLinks } from "@/components/ChannelLinks";

export default function HubConnectPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-black">
          Connect Messaging
        </h1>
        <p className="text-black/60">
          Link your Telegram or WhatsApp account to book hub check-ins through
          chat with the UNBLCK bot.
        </p>
      </div>

      <ChannelLinks />
    </div>
  );
}
