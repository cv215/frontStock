import { NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { PageLogin } from './pages/page-login/page-login';
import { PageInscription } from './pages/page-inscription/page-inscription';
import { PageDashboard } from './pages/page-dashboard/page-dashboard';
import { PageStatistiques } from './pages/page-statistiques/page-statistiques';
import { RouterModule } from '@angular/router';
import { Menu } from './composants/menu/menu';
import { Header } from './composants/header/header';
import { PageArticle } from './pages/articles/page-article/page-article';
import { DetailArticle } from './composants/detail-article/detail-article';
import { Pagination } from './composants/pagination/pagination';
import { BouttonAction } from './composants/boutton-action/boutton-action';
import { NouvelArticle } from './pages/articles/nouvel-article/nouvel-article';
import { PageMvtstk } from './pages/mvtstk/page-mvtstk/page-mvtstk';
import { DetailMvtStkArticle } from './composants/detail-mvt-stk-article/detail-mvt-stk-article';
import { DetailMvtStk } from './composants/detail-mvt-stk/detail-mvt-stk';
import { DetailCltFrs } from './composants/detail-clt-frs/detail-clt-frs';
import { PageClient } from './pages/client/page-client/page-client';
import { PageFournisseur } from './pages/fournisseur/page-fournisseur/page-fournisseur';
import { NouveauCltFrs } from './composants/nouveau-clt-frs/nouveau-clt-frs';
import { DetailCmdCltFrs } from './composants/detail-cmd-clt-frs/detail-cmd-clt-frs';
import { DetailCmd } from './composants/detail-cmd/detail-cmd';
import { PageCmdCltFrs } from './pages/page-cmd-clt-frs/page-cmd-clt-frs';
import { NouvelleCmdCltFrs } from './composants/nouvelle-cmd-clt-frs/nouvelle-cmd-clt-frs';
import { PageCategories } from './pages/categories/page-categories/page-categories';
import { NouvelleCategory } from './pages/categories/nouvelle-category/nouvelle-category';
import { PageUtilisateur } from './pages/utilisateur/page-utilisateur/page-utilisateur';
import { DetailUtilisateur } from './composants/detail-utilisateur/detail-utilisateur';
import { NouvelUtilisateur } from './pages/utilisateur/nouvel-utilisateur/nouvel-utilisateur';
import { PageVueEnsemble } from './pages/page-vue-ensemble/page-vue-ensemble';
import { PageProfil } from './pages/profil/page-profil/page-profil';
import { ChangerMotDePasse } from './pages/profil/changer-mot-de-passe/changer-mot-de-passe';
import { MotDePasseOublie } from './pages/mot-de-passe-oublie/mot-de-passe-oublie';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpIntercepterService } from './services/intercepter/http-intercepter-service';
import { Deconnexion } from './composants/deconnexion/deconnexion';

@NgModule({
  declarations: [
    App,
    PageLogin,
    PageInscription,
    PageDashboard,
    PageStatistiques,
    Menu,
    Header,
    PageArticle,
    DetailArticle,
    Pagination,
    BouttonAction,
    NouvelArticle,
    PageMvtstk,
    DetailMvtStkArticle,
    DetailMvtStk,
    DetailCltFrs,
    PageClient,
    PageFournisseur,
    NouveauCltFrs,
    DetailCmdCltFrs,
    DetailCmd,
    PageCmdCltFrs,
    NouvelleCmdCltFrs,
    PageCategories,
    NouvelleCategory,
    PageUtilisateur,
    DetailUtilisateur,
    NouvelUtilisateur,
    PageVueEnsemble,
    PageProfil,
    ChangerMotDePasse,
    MotDePasseOublie,
    Deconnexion,
  ],
  imports: [BrowserModule, AppRoutingModule, RouterModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
