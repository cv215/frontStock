export interface MenuModel {
  id?: string;
  titre?: string;
  icon?: string;
  url?: string;
  active?: boolean;
  sousMenu?: Array<MenuModel>;
  queryParams?: Record<string, string>;
}
