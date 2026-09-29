import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

/**
 * Gerente (admin) administra a equipe; vendedor (seller) só gerencia anúncios.
 * A permissão de anúncios é verificada pelo próprio app (qualquer funcionário ativo).
 */
export const accessControl = createAccessControl(defaultStatements);

export const employeeRoles = {
  admin: accessControl.newRole(adminAc.statements),
  seller: accessControl.newRole(userAc.statements),
};
