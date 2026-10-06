import { Component, OnInit } from '@angular/core';
import { MenuModel } from './menu.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  public menuProperties: Array<MenuModel> = [
    {
      id: '1',
      titre: 'Tableau de bord',
      icon: 'bi bi-graph-up-arrow',
      url: '',
      sousMenu: [
      {
        id: '11',
        titre: 'Vue d\'ensemble',
        icon: 'bi bi-pie-chart-fill',
        url: 'dashboard/ensemble',
      },
      {
        id: '12',
        titre: 'Statistiques',
        icon: 'bi bi-bar-chart-line-fill',
        url: 'dashboard/statistiques',
      },
    ],
  },

  { id: '2',
    titre: 'Articles',
    icon: 'bi bi-archive-fill',
    url: '',
    sousMenu: [
      {
        id: '21',
        titre: 'Articles',
        icon: 'bi bi-archive-fill',
        url: 'dashboard/articles',
      },
      {
        id: '22',
        titre: 'Mouvement de stock',
        icon: 'bi bi-box2-fill',
        url: 'dashboard/mvtstk',
      },
    ],
  },
  {
    id: '3',
    titre: 'Clients',
    icon: 'bi bi-person-bounding-box',
    url: '',
    sousMenu: [
      {
        id: '31',
        titre: 'Clients',
        icon: 'bi bi-person-bounding-box',
        url: 'dashboard/clients',
      },
      {
        id: '32',
        titre: 'Commandes clients',
        icon: 'bi bi-cart-check-fill',
        url: 'dashboard/commandeclient',
      },
    ],
  },
  {
    id: '4',
    titre: 'Fournisseurs',
    icon: 'bi bi-truck',
    url: '',
    sousMenu: [
      {
        id: '41',
        titre: 'Fournisseurs',
        icon: 'bi bi-truck',
        url: 'dashboard/fournisseurs',
      },
      {
        id: '42',
        titre: 'Commandes fournisseurs',
        icon: 'bi bi-truck-flatbed',
        url: 'dashboard/commandefournisseur',
      },
    ],
  },
  {
    id: '5',
    titre: 'Paramètrages',
    icon: 'bi bi-gear-fill',
    url: '',
    sousMenu: [
      {
        id: '51',
        titre: 'Catégories',
        icon: 'bi bi-tags-fill',
        url: 'dashboard/categories',
      },
      {
        id: '52',
        titre: 'Utilisateurs',
        icon: 'bi bi-person-fill',
        url: 'dashboard/utilisateurs',
      },
    ],
  }
];

private lastSelectedMenu: MenuModel | undefined;
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  navigate(menu: MenuModel): void {
    if (this.lastSelectedMenu) {
      this.lastSelectedMenu.active = false;
    }
    menu.active = true;
    this.lastSelectedMenu = menu;
    this.router.navigate([menu.url]);

  }
}
