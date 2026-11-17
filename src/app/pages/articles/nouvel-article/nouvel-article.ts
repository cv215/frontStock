import { catchError, map, of, switchMap } from 'rxjs';
import { PhotoService, PHOTO_TYPES_ACCEPTES, verifierPhoto } from '../../../services/photo/photo-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto, CathegoryDto } from '../../../api/models';
import { ArticleService } from '../../../services/article/article-service';
import { CategoryService } from '../../../services/cathegory/category-service';
import { User } from '../../../services/user/user';
import { getHttpErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-nouvel-article',
  standalone: false,
  templateUrl: './nouvel-article.html',
  styleUrl: './nouvel-article.css',
})
export class NouvelArticle implements OnInit {
  articleDto: ArticleDto = { tauxTva: 0 };
  categories: CathegoryDto[] = [];
  categoryId: number | null = null;
  errorMessage = '';
  isLoadingCategories = true;
  isSaving = false;

  readonly photoTypes = PHOTO_TYPES_ACCEPTES;
  photo: File | null = null;
  photoPreview: string | null = null;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private photoService: PhotoService,
    private categoryService: CategoryService,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe({
      next: categories => {
        this.categories = categories ?? [];
        this.isLoadingCategories = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible de charger les catégories.');
        this.isLoadingCategories = false;
      }
    });
  }

  choisirPhoto(event: Event): void {
    const fichier = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.errorMessage = '';
    if (this.photoPreview) {
      URL.revokeObjectURL(this.photoPreview);
    }
    this.photo = null;
    this.photoPreview = null;
    if (!fichier) {
      return;
    }
    const erreur = verifierPhoto(fichier);
    if (erreur) {
      this.errorMessage = erreur;
      (event.target as HTMLInputElement).value = '';
      return;
    }
    this.photo = fichier;
    this.photoPreview = URL.createObjectURL(fichier);
  }

  cancel(): void {
    this.router.navigate(['dashboard','articles']);
  }

  updatePrixTtc(): void {
    const prixHt = Number(this.articleDto.prixUnitaireHt ?? 0);
    const tauxTva = Number(this.articleDto.tauxTva ?? 0);
    this.articleDto.prixUnitaireTtc = Number((prixHt * (1 + tauxTva / 100)).toFixed(2));
  }

  enregistrerArticle(): void {
    this.errorMessage = '';
    const codeArticle = this.articleDto.codeArticle?.trim() ?? '';
    const designation = this.articleDto.designation?.trim() ?? '';
    const prixHt = Number(this.articleDto.prixUnitaireHt);
    const tauxTva = Number(this.articleDto.tauxTva);
    const category = this.categories.find(item => item.id === this.categoryId);

    if (!codeArticle || !designation || !category) {
      this.errorMessage = 'Le code, la désignation et la catégorie sont obligatoires.';
      return;
    }
    if (!Number.isFinite(prixHt) || prixHt < 0 || !Number.isFinite(tauxTva) || tauxTva < 0 || tauxTva > 100) {
      this.errorMessage = 'Saisissez un prix positif et un taux de TVA compris entre 0 et 100 %.';
      return;
    }

    const user = this.userService.getConnectedUser();
    const idEntreprise = user?.idEntreprise ?? user?.entreprise?.id;
    const articleToSave: ArticleDto = {
      ...this.articleDto,
      codeArticle,
      designation,
      prixUnitaireHt: prixHt,
      tauxTva,
      prixUnitaireTtc: Number((prixHt * (1 + tauxTva / 100)).toFixed(2)),
      cathegory: category,
      ...(idEntreprise != null ? { idEntreprise } : {})
    };

    this.isSaving = true;
    this.articleService.save(articleToSave).pipe(
      // Photo envoyée une fois l'article créé (il faut son identifiant).
      switchMap(article => this.photo && article.id != null
        ? this.photoService.envoyer('article', article.id, this.photo).pipe(
            map(() => true),
            catchError(() => of(false))
          )
        : of(true))
    ).subscribe({
      next: photoOk => {
        this.router.navigate(['dashboard', 'articles'], photoOk ? {} : { state: { avertissement: 'L’article a été créé mais la photo n’a pas pu être envoyée.' } });
      },
      error: error => {
        this.isSaving = false;
        this.errorMessage = this.getErrorMessage(error, 'L’enregistrement de l’article a échoué.');
      }
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return getHttpErrorMessage(error, fallback);
  }
}
