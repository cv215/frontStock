import { Component, OnInit } from '@angular/core';
import { MenuModel } from './menu.model';
import { Router } from '@angular/router';
import { User } from '../../services/user/user';

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
        url: 'ensemble',
      },
      {
        id: '12',
        titre: 'Statistiques',
        icon: 'bi bi-bar-chart-line-fill',
        url: 'statistiques',
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
        url: 'articles',
      },
      {
        id: '22',
        titre: 'Mouvement de stock',
        icon: 'bi bi-box2-fill',
        url: 'mvtstk',
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
        url: 'clients',
      },
      {
        id: '32',
        titre: 'Commandes clients',
        icon: 'bi bi-cart-check-fill',
        url: 'commandeclient',
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
        url: 'fournisseurs',
      },
      {
        id: '42',
        titre: 'Commandes fournisseurs',
        icon: 'bi bi-truck-flatbed',
        url: 'commandefournisseur',
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
        url: 'categories',
      },
      {
        id: '52',
        titre: 'Utilisateurs',
        icon: 'bi bi-person-fill',
        url: 'utilisateurs',
      },
    ],
  }
];
  private readonly clientMenuProperties: Array<MenuModel> = [
    {
      id: '1',
      titre: 'Vue d’ensemble',
      icon: 'bi bi-house',
      sousMenu: [{ id: '11', titre: 'Vue d’ensemble', icon: 'bi bi-house', url: 'ensemble' }]
    },
    {
      id: '2',
      titre: 'Catalogue',
      icon: 'bi bi-box',
      sousMenu: [{ id: '21', titre: 'Catalogue', icon: 'bi bi-box', url: 'articles' }]
    },
    {
      id: '3',
      titre: 'Mes commandes',
      icon: 'bi bi-cart',
      sousMenu: [{ id: '31', titre: 'Mes commandes', icon: 'bi bi-cart', url: 'commandeclient' }]
    },
    {
      id: '4',
      titre: 'Livraisons',
      icon: 'bi bi-truck',
      sousMenu: [{ id: '41', titre: 'Commandes livrées', icon: 'bi bi-truck', url: 'commandeclient', queryParams: { etat: 'LIVREE' } }]
    },
    {
      id: '5',
      titre: 'Fournisseurs',
      icon: 'bi bi-people',
      sousMenu: [{ id: '51', titre: 'Fournisseurs', icon: 'bi bi-people', url: 'fournisseurs' }]
    },
    {
      id: '6',
      titre: 'Paramètres',
      icon: 'bi bi-gear',
      sousMenu: [{ id: '61', titre: 'Mon profil', icon: 'bi bi-person', url: 'profil' }]
    }
  ];

  expandedMenuId: string | null = null;
  isClient = false;

  constructor(
    private router: Router,
    private readonly userService: User
  ) {}

  ngOnInit(): void {
    this.isClient = this.userService.getConnectedUser()?.roles?.libelle === 'CLIENT';
    if (this.isClient) {
      this.menuProperties = this.clientMenuProperties;
    }
    this.expandActiveMenu();
  }

  toggleMenu(menu: MenuModel): void {
    if (!menu.id) {
      return;
    }

    this.expandedMenuId = this.expandedMenuId === menu.id ? null : menu.id;
  }

  isExpanded(menu: MenuModel): boolean {
    return this.expandedMenuId === menu.id;
  }

  expandMenu(parent: MenuModel): void {
    this.expandedMenuId = parent.id ?? null;
  }

  private expandActiveMenu(): void {
    if (this.isClient && this.router.url.includes('etat=LIVREE')) {
      this.expandedMenuId = '4';
      return;
    }

    if (this.isClient) {
      const clientRoutePrefixes: Record<string, string[]> = {
        '1': ['ensemble'],
        '2': ['articles'],
        '3': ['commandeclient'],
        '4': ['commandeclient'],
        '5': ['fournisseurs'],
        '6': ['profil', 'changermotdepasse']
      };
      const activeClientMenu = this.menuProperties.find(menu =>
        (clientRoutePrefixes[menu.id ?? ''] ?? []).some(route =>
          this.router.url === `/dashboard/${route}` || this.router.url.startsWith(`/dashboard/${route}/`)
        )
      );
      this.expandedMenuId = activeClientMenu?.id ?? null;
      return;
    }

    const routePrefixes: Record<string, string[]> = {
      '1': ['ensemble', 'statistiques'],
      '2': ['articles', 'nouvelarticle', 'mvtstk'],
      '3': ['clients', 'nouveauclient', 'commandeclient', 'nouvellecommandeclt'],
      '4': ['fournisseurs', 'nouveaufournisseur', 'commandefournisseur', 'nouvellecommandefrs'],
      '5': ['categories', 'nouvellecategorie', 'utilisateurs', 'nouvelutilisateur', 'profil', 'changermotdepasse'],
      '6': ['profil', 'changermotdepasse']
    };
    const activeMenu = this.menuProperties.find(menu =>
      (routePrefixes[menu.id ?? ''] ?? []).some(route =>
        this.router.url === `/dashboard/${route}` || this.router.url.startsWith(`/dashboard/${route}/`)
      )
    );
    this.expandedMenuId = activeMenu?.id ?? null;
  }
}
