import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { PageInscription } from './pages/page-inscription/page-inscription';
import { PageDashboard } from './pages/page-dashboard/page-dashboard';
import { PageStatistiques } from './pages/page-statistiques/page-statistiques';
import { PageArticle } from './pages/articles/page-article/page-article';
import { NouvelArticle } from './pages/articles/nouvel-article/nouvel-article';
import { PageMvtstk } from './pages/mvtstk/page-mvtstk/page-mvtstk';
import { PageClient } from './pages/client/page-client/page-client';
import { PageFournisseur } from './pages/fournisseur/page-fournisseur/page-fournisseur';
import { NouveauCltFrs } from './composants/nouveau-clt-frs/nouveau-clt-frs';
import { PageCmdCltFrs } from './pages/page-cmd-clt-frs/page-cmd-clt-frs';
import { NouvelleCmdCltFrs } from './composants/nouvelle-cmd-clt-frs/nouvelle-cmd-clt-frs';
import { PageCategories } from './pages/categories/page-categories/page-categories';
import { NouvelleCategory } from './pages/categories/nouvelle-category/nouvelle-category';
import { PageUtilisateur } from './pages/utilisateur/page-utilisateur/page-utilisateur';
import { NouvelUtilisateur } from './pages/utilisateur/nouvel-utilisateur/nouvel-utilisateur';
import { PageVueEnsemble } from './pages/page-vue-ensemble/page-vue-ensemble';
import { PageProfil } from './pages/profil/page-profil/page-profil';
import { ChangerMotDePasse } from './pages/profil/changer-mot-de-passe/changer-mot-de-passe';
import { MotDePasseOublie } from './pages/mot-de-passe-oublie/mot-de-passe-oublie';
import { ApplicationGuard } from './services/guard/application-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: PageLogin
  },
  {
    path: 'mot-de-passe-oublie',
    component: MotDePasseOublie
  },
  {
    path: 'inscription',
    component: PageInscription
  },
  {
    path: 'dashboard',
    component: PageDashboard,
    canActivate: [ApplicationGuard],
    children: [
      {
        path: '',
        redirectTo: 'ensemble',
        pathMatch: 'full'
      },
      {
        path: 'ensemble',
        component: PageVueEnsemble,
        canActivate: [ApplicationGuard]
      },
      {
        path: 'statistiques',
        component: PageStatistiques,
        canActivate: [ApplicationGuard],
        data: { permission: 'equipe' }
      },
      {
        path: 'articles',
        component: PageArticle,
        canActivate: [ApplicationGuard]
      },
      {
        path: 'nouvelarticle',
        component: NouvelArticle,
        canActivate: [ApplicationGuard],
        data: { permission: 'gererCatalogue' }
      },
      {
        path: 'mvtstk',
        component: PageMvtstk,
        canActivate: [ApplicationGuard],
        data: { permission: 'equipe' }
      },
      {
        path: 'clients',
        component: PageClient,
        canActivate: [ApplicationGuard],
        data: { permission: 'equipe' }
      },
      {
        path: 'nouveauclient',
        component: NouveauCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "client",
          permission: 'gererClients'
        }
      },
      {
        path: 'commandeclient',
        component: PageCmdCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "client",
          permission: 'voirCommandesClients'
        }
      },
      {
        path: 'nouvellecommandeclt',
        component: NouvelleCmdCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "client",
          permission: 'creerCommandeClient'
        }
      },
      {
        path: 'fournisseurs',
        component: PageFournisseur,
        canActivate: [ApplicationGuard],
        data: { permission: 'equipe' }
      },
      {
        path: 'nouveaufournisseur',
        component: NouveauCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "fournisseur",
          permission: 'gererFournisseurs'
        }
      },
      {
        path: 'commandefournisseur',
        component: PageCmdCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "fournisseur",
          permission: 'voirCommandesFournisseurs'
        }
      },
      {
        path: 'nouvellecommandefrs',
        component: NouvelleCmdCltFrs,
        canActivate: [ApplicationGuard],
        data : {
          origin: "fournisseur",
          permission: 'gererCommandesFournisseurs'
        }
      },
       {
        path: 'categories',
        component: PageCategories,
        canActivate: [ApplicationGuard],
        data: { permission: 'equipe' }
      },
       {
        path: 'nouvellecategorie',
        component: NouvelleCategory,
        canActivate: [ApplicationGuard],
        data: { permission: 'gererCatalogue' }
      },
      {
        path: 'nouvellecategorie/:id',
        component: NouvelleCategory,
        canActivate: [ApplicationGuard],
        data: { permission: 'gererCatalogue' }
      },
      {
        path: 'utilisateurs',
        component: PageUtilisateur,
        canActivate: [ApplicationGuard],
        data: { permission: 'gererUtilisateurs' }
      },
      {
        path: 'nouvelutilisateur',
        component: NouvelUtilisateur,
        canActivate: [ApplicationGuard],
        data: { permission: 'gererUtilisateurs' }
      },
      {
        path: 'profil',
        component: PageProfil,
        canActivate: [ApplicationGuard]
      },
      {
        path: 'changermotdepasse',
        component: ChangerMotDePasse,
        canActivate: [ApplicationGuard]
      },
    ]

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
