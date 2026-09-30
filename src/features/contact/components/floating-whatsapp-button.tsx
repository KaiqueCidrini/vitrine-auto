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
      className="group bg-whatsapp text-whatsapp-foreground animate-fade-up ease-premium fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full shadow-lg shadow-black/25 transition duration-300 [animation-delay:1.2s] hover:scale-105 sm:right-6 sm:bottom-6"
    >
      {/* Anel pulsando devagar para chamar atenção sem incomodar. */}
      <span
        aria-hidden
        className="bg-whatsapp absolute inset-0 -z-10 animate-ping rounded-full opacity-20 [animation-duration:3s]"
      />
      <MessageCircle
        aria-hidden
        className="size-7 transition-transform duration-300 group-hover:rotate-12"
      />
    </a>
  );
}
