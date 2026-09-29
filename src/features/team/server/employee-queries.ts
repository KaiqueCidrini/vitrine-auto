import "server-only";

import { asc } from "drizzle-orm";

import { isEmployeeRole, type EmployeeRole } from "@/features/auth/domain/employee-role";
import { getDatabase } from "@/shared/db/database";
import { users } from "@/shared/db/schema";

export interface EmployeeListItem {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  createdAt: Date;
}

export async function listEmployees(): Promise<EmployeeListItem[]> {
  const rows = await getDatabase()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.name));

  return rows.map((row) => ({ ...row, role: isEmployeeRole(row.role) ? row.role : "seller" }));
}
