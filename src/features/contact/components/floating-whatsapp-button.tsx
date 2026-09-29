import { MessageCircle } from "lucide-react";

import { buildWhatsAppLink } from "../build-whatsapp-link";

interface FloatingWhatsAppButtonProps {
  phoneNumber: string;
  message: string;
}

export function FloatingWhatsAppButton({ phoneNumber, message }: FloatingWhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppLink(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      data-floating-whatsapp
      className="bg-whatsapp text-whatsapp-foreground fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full shadow-lg shadow-black/20 transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle aria-hidden className="size-7" />
    </a>
  );
}
