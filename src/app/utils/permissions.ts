import { UtilisateurDto } from '../api/models';
import { Roles } from '../api/models/roles';
import { userRoles } from './user-roles';

export type Role = NonNullable<Roles['libelle']>;

/** Personnel de l'entreprise (UTILISATEUR = lecture seule). */
const EQUIPE: Role[] = ['ADMIN_ENTREPRISE', 'GESTIONNAIRE_STOCK', 'COMMERCIAL', 'CAISSIER', 'UTILISATEUR'];

/**
 * Droits de l'application, identiques aux règles de l'API (SecurityConfiguration).
 * L'interface s'en sert pour masquer les menus, pages et boutons non autorisés ;
 * l'API reste la seule vraie protection.
 */
export const PERMISSIONS = {
  /** Tout utilisateur connecté. */
  connecte: [...EQUIPE, 'CLIENT', 'FOURNISSEUR'],
  equipe: EQUIPE,
  gererCatalogue: ['ADMIN_ENTREPRISE', 'GESTIONNAIRE_STOCK'],
  gererStock: ['ADMIN_ENTREPRISE', 'GESTIONNAIRE_STOCK'],
  gererClients: ['ADMIN_ENTREPRISE', 'COMMERCIAL'],
  voirCommandesClients: [...EQUIPE, 'CLIENT'],
  creerCommandeClient: ['ADMIN_ENTREPRISE', 'COMMERCIAL', 'CLIENT'],
  gererCommandesClients: ['ADMIN_ENTREPRISE', 'COMMERCIAL'],
  gererFournisseurs: ['ADMIN_ENTREPRISE', 'GESTIONNAIRE_STOCK'],
  voirCommandesFournisseurs: [...EQUIPE, 'FOURNISSEUR'],
  gererCommandesFournisseurs: ['ADMIN_ENTREPRISE', 'GESTIONNAIRE_STOCK'],
  gererUtilisateurs: ['ADMIN_ENTREPRISE'],
} satisfies Record<string, Role[]>;

export type Permission = keyof typeof PERMISSIONS;

/** Rôles qu'un administrateur peut attribuer à un membre de son équipe. */
export const ROLES_EQUIPE: { valeur: Role; libelle: string; description: string }[] = [
  { valeur: 'UTILISATEUR', libelle: 'Consultation', description: 'Lecture seule de toutes les données' },
  { valeur: 'GESTIONNAIRE_STOCK', libelle: 'Gestionnaire de stock', description: 'Catalogue, stock, fournisseurs et leurs commandes' },
  { valeur: 'COMMERCIAL', libelle: 'Commercial', description: 'Clients, commandes clients et ventes' },
  { valeur: 'CAISSIER', libelle: 'Caissier', description: 'Ventes et consultation' },
  { valeur: 'ADMIN_ENTREPRISE', libelle: 'Administrateur', description: 'Tous les droits, dont la gestion des utilisateurs' },
];

export function currentUser(): UtilisateurDto | null {
  try {
    const raw = localStorage.getItem('connectedUser');
    return raw ? JSON.parse(raw) as UtilisateurDto : null;
  } catch {
    return null;
  }
}

export function hasAnyRole(roles: readonly Role[], user: UtilisateurDto | null = currentUser()): boolean {
  return userRoles(user).some(r => {
    const role = (r?.libelle ?? r?.roleName) as Role | undefined;
    return role != null && roles.includes(role);
  });
}

export function can(permission: Permission, user: UtilisateurDto | null = currentUser()): boolean {
  return hasAnyRole(PERMISSIONS[permission], user);
}

export function isFournisseurUser(user: UtilisateurDto | null = currentUser()): boolean {
  return hasAnyRole(['FOURNISSEUR'], user) && !hasAnyRole(EQUIPE, user);
}
