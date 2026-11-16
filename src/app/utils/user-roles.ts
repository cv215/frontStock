import { UtilisateurDto } from '../api/models';
import { Roles } from '../api/models/roles';

const ROLE_LABELS: Record<string, string> = {
  ADMIN_ENTREPRISE: 'Administrateur',
  GESTIONNAIRE_STOCK: 'Gestionnaire de stock',
  COMMERCIAL: 'Commercial',
  CAISSIER: 'Caissier',
  FOURNISSEUR: 'Fournisseur',
  CLIENT: 'Client',
  UTILISATEUR: 'Utilisateur',
};

/** L'API renvoie une liste de rôles ; on accepte aussi un objet seul (anciennes sessions stockées). */
export function userRoles(user: UtilisateurDto | null | undefined): Roles[] {
  const roles = user?.roles as Roles[] | Roles | undefined | null;
  if (!roles) {
    return [];
  }
  return Array.isArray(roles) ? roles : [roles];
}

export function hasRole(user: UtilisateurDto | null | undefined, role: NonNullable<Roles['libelle']>): boolean {
  return userRoles(user).some(r => r?.libelle === role || r?.roleName === role);
}

export function isClientUser(user: UtilisateurDto | null | undefined): boolean {
  return hasRole(user, 'CLIENT');
}

export function roleLabel(user: UtilisateurDto | null | undefined, fallback = 'Utilisateur'): string {
  const role = userRoles(user)[0];
  const key = role?.libelle ?? role?.roleName;
  return key ? (ROLE_LABELS[key] ?? key) : fallback;
}
