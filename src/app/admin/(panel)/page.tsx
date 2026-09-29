import { redirect } from "next/navigation";

import { ADMIN_HOME_PATH } from "@/features/auth/server/current-employee";

export default function AdminIndexPage() {
  redirect(ADMIN_HOME_PATH);
}
