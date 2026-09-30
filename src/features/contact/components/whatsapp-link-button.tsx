import { MessageCircle } from "lucide-react";

import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/shared/ui/button";

import { buildWhatsAppLink } from "../build-whatsapp-link";

interface WhatsAppLinkButtonProps {
  phoneNumber: string;
  message: string;
  label: string;
  size?: ButtonSize;
  /** Sobrescreve a cor padrão (verde do WhatsApp); use quando o botão precisa ceder destaque a outra ação na mesma tela. */
  variant?: ButtonVariant;
  className?: string;
}

/** Botão que abre a conversa no WhatsApp da concessionária com a mensagem preenchida. */
export function WhatsAppLinkButton({
  phoneNumber,
  message,
  label,
  size,
  variant = "whatsapp",
  className,
}: WhatsAppLinkButtonProps) {
  return (
    <a
      href={buildWhatsAppLink(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName({ variant, size, className })}
    >
      <MessageCircle aria-hidden className="size-5" />
      {label}
    </a>
  );
}
