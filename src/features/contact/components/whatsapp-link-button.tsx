import { MessageCircle } from "lucide-react";

import { buttonClassName, type ButtonSize } from "@/shared/ui/button";

import { buildWhatsAppLink } from "../build-whatsapp-link";

interface WhatsAppLinkButtonProps {
  phoneNumber: string;
  message: string;
  label: string;
  size?: ButtonSize;
  className?: string;
}

/** Botão que abre a conversa no WhatsApp da concessionária com a mensagem preenchida. */
export function WhatsAppLinkButton({
  phoneNumber,
  message,
  label,
  size,
  className,
}: WhatsAppLinkButtonProps) {
  return (
    <a
      href={buildWhatsAppLink(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName({ variant: "whatsapp", size, className })}
    >
      <MessageCircle aria-hidden className="size-5" />
      {label}
    </a>
  );
}
