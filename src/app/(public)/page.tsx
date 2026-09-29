import { connection } from "next/server";

import { HomeSections } from "@/features/home/home-sections";
import { getTenant } from "@/tenants/tenant-registry";

export default async function HomePage() {
  // Destaques e contagens vêm do banco a cada acesso.
  await connection();

  return <HomeSections tenant={getTenant()} />;
}
