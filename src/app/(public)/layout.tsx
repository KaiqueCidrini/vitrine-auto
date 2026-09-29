import { FloatingWhatsAppButton } from "@/features/contact/components/floating-whatsapp-button";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getTenant } from "@/tenants/tenant-registry";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  const tenant = getTenant();

  return (
    <>
      <SiteHeader tenant={tenant} />
      <main className="flex-1">{children}</main>
      <SiteFooter tenant={tenant} />
      <FloatingWhatsAppButton
        phoneNumber={tenant.contact.whatsappNumber}
        message={tenant.whatsappMessages.general}
      />
    </>
  );
}
