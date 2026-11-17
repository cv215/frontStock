import { Permission } from '../../utils/permissions';

export interface MenuModel {
  id?: string;
  titre?: string;
  icon?: string;
  url?: string;
  active?: boolean;
  sousMenu?: Array<MenuModel>;
  queryParams?: Record<string, string>;
  /** Droit requis pour voir l'entrée (aucun = tout utilisateur connecté). */
  permission?: Permission;
}
