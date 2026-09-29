const WHATSAPP_BASE_URL = "https://wa.me";

/** Monta o link que abre a conversa com a mensagem já preenchida (app no celular, Web no computador). */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return `${WHATSAPP_BASE_URL}/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

/**
 * Substitui marcadores como {vehicle} pelos valores informados.
 * Marcadores sem valor são removidos, e espaços duplicados são limpos.
 */
export function fillMessageTemplate(template: string, values: Record<string, string>): string {
  return template
    .replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
