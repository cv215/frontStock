import { model } from "@angular/core";

export interface MenuModel {
  id?: string;
  titre?: string;
  icon?: string;
  url?: string;
  active?: boolean;
  sousMenu?: Array<MenuModel>;
}
