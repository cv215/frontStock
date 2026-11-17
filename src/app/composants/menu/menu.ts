import { Component, OnInit } from '@angular/core';
import { MenuModel } from './menu.model';
import { Router } from '@angular/router';
import { User } from '../../services/user/user';
import { isClientUser } from '../../utils/user-roles';
import { can, isFournisseurUser } from '../../utils/permissions';

type MenuItem = MenuModel;

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  /** Menu du personnel de l'entreprise, filtré selon les rôles de l'utilisateur. */
  private readonly equipeMenu: MenuItem[] = [
    {
      id: '1', titre: 'Tableau de bord', icon: 'bi bi-graph-up-arrow',
      sousMenu: [
        { id: '11', titre: 'Vue d\'ensemble', icon: 'bi bi-pie-chart-fill', url: 'ensemble' },
        { id: '12', titre: 'Statistiques', icon: 'bi bi-bar-chart-line-fill', url: 'statistiques', permission: 'equipe' },
      ],
    },
    {
      id: '2', titre: 'Articles', icon: 'bi bi-archive-fill',
      sousMenu: [
        { id: '21', titre: 'Articles', icon: 'bi bi-archive-fill', url: 'articles' },
        { id: '22', titre: 'Mouvement de stock', icon: 'bi bi-box2-fill', url: 'mvtstk', permission: 'equipe' },
      ],
    },
    {
      id: '3', titre: 'Clients', icon: 'bi bi-person-bounding-box',
      sousMenu: [
        { id: '31', titre: 'Clients', icon: 'bi bi-person-bounding-box', url: 'clients', permission: 'equipe' },
        { id: '32', titre: 'Commandes clients', icon: 'bi bi-cart-check-fill', url: 'commandeclient', permission: 'voirCommandesClients' },
      ],
    },
    {
      id: '4', titre: 'Fournisseurs', icon: 'bi bi-truck',
      sousMenu: [
        { id: '41', titre: 'Fournisseurs', icon: 'bi bi-truck', url: 'fournisseurs', permission: 'equipe' },
        { id: '42', titre: 'Commandes fournisseurs', icon: 'bi bi-truck-flatbed', url: 'commandefournisseur', permission: 'voirCommandesFournisseurs' },
      ],
    },
    {
      id: '5', titre: 'Paramètrages', icon: 'bi bi-gear-fill',
      sousMenu: [
        { id: '51', titre: 'Catégories', icon: 'bi bi-tags-fill', url: 'categories', permission: 'equipe' },
        { id: '52', titre: 'Utilisateurs', icon: 'bi bi-person-fill', url: 'utilisateurs', permission: 'gererUtilisateurs' },
        { id: '53', titre: 'Mon profil', icon: 'bi bi-person-circle', url: 'profil' },
      ],
    },
  ];

  private readonly clientMenu: MenuItem[] = [
    { id: '1', titre: 'Vue d’ensemble', icon: 'bi bi-house', sousMenu: [{ id: '11', titre: 'Vue d’ensemble', icon: 'bi bi-house', url: 'ensemble' }] },
    { id: '2', titre: 'Catalogue', icon: 'bi bi-box', sousMenu: [{ id: '21', titre: 'Catalogue', icon: 'bi bi-box', url: 'articles' }] },
    {
      id: '3', titre: 'Mes commandes', icon: 'bi bi-cart',
      sousMenu: [
        { id: '31', titre: 'Mes commandes', icon: 'bi bi-cart', url: 'commandeclient' },
        { id: '32', titre: 'Nouvelle commande', icon: 'bi bi-cart-plus', url: 'nouvellecommandeclt' },
      ],
    },
    { id: '4', titre: 'Livraisons', icon: 'bi bi-truck', sousMenu: [{ id: '41', titre: 'Commandes livrées', icon: 'bi bi-truck', url: 'commandeclient', queryParams: { etat: 'LIVREE' } }] },
    { id: '6', titre: 'Paramètres', icon: 'bi bi-gear', sousMenu: [{ id: '61', titre: 'Mon profil', icon: 'bi bi-person', url: 'profil' }] },
  ];

  private readonly fournisseurMenu: MenuItem[] = [
    { id: '1', titre: 'Vue d’ensemble', icon: 'bi bi-house', sousMenu: [{ id: '11', titre: 'Vue d’ensemble', icon: 'bi bi-house', url: 'ensemble' }] },
    { id: '2', titre: 'Catalogue', icon: 'bi bi-box', sousMenu: [{ id: '21', titre: 'Catalogue de l’entreprise', icon: 'bi bi-box', url: 'articles' }] },
    { id: '3', titre: 'Commandes reçues', icon: 'bi bi-truck-flatbed', sousMenu: [{ id: '31', titre: 'Commandes reçues', icon: 'bi bi-truck-flatbed', url: 'commandefournisseur' }] },
    { id: '6', titre: 'Paramètres', icon: 'bi bi-gear', sousMenu: [{ id: '61', titre: 'Mon profil', icon: 'bi bi-person', url: 'profil' }] },
  ];

  menuProperties: MenuItem[] = [];
  expandedMenuId: string | null = null;

  constructor(
    private router: Router,
    private readonly userService: User
  ) {}

  ngOnInit(): void {
    const user = this.userService.getConnectedUser();
    if (isClientUser(user)) {
      this.menuProperties = this.clientMenu;
    } else if (isFournisseurUser(user)) {
      this.menuProperties = this.fournisseurMenu;
    } else {
      this.menuProperties = this.equipeMenu
        .map(menu => ({ ...menu, sousMenu: (menu.sousMenu ?? []).filter(item => !item.permission || can(item.permission, user)) }))
        .filter(menu => menu.sousMenu.length > 0);
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

  /** Ouvre le groupe qui contient la page courante. */
  private expandActiveMenu(): void {
    const url = this.router.url;
    if (url.includes('etat=LIVREE')) {
      const livraisons = this.menuProperties.find(menu => menu.sousMenu?.some(item => item.queryParams?.['etat'] === 'LIVREE'));
      if (livraisons) {
        this.expandedMenuId = livraisons.id ?? null;
        return;
      }
    }
    const path = url.split('?')[0];
    const active = this.menuProperties.find(menu =>
      (menu.sousMenu ?? []).some(item => item.url && (path === `/dashboard/${item.url}` || path.startsWith(`/dashboard/${item.url}/`)))
    );
    this.expandedMenuId = active?.id ?? null;
  }
}
