import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CathegoryDto } from '../../../api/models';
import { CategoryService } from '../../../services/cathegory/category-service';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-nouvelle-category',
  standalone: false,
  templateUrl: './nouvelle-category.html',
  styleUrl: './nouvelle-category.css',
})
export class NouvelleCategory implements OnInit {
  categoryDto: CathegoryDto = {};
  errorMsg: string[] = [];
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private userService: User
  ) { }

  ngOnInit(): void {
    const idCategory = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(idCategory) && idCategory > 0) {
      this.categoryService.findById(idCategory).subscribe({
        next: (category) => {
          this.categoryDto = category;
        },
        error: (error) => {
          this.errorMsg = this.getErrorMessages(error);
        }
      });
    }
  }
  cancel(): void {
    this.router.navigate(['dashboard','categories']);
  }

  enregistrerCategory(): void {
    this.errorMsg = [];
    const code = this.categoryDto.code?.trim() ?? '';
    const designation = this.categoryDto.designation?.trim() ?? '';

    if (!code || !designation) {
      this.errorMsg = ['Le code et la désignation de la catégorie sont obligatoires.'];
      return;
    }

    const utilisateur = this.userService.getConnectedUser();
    console.log('Utilisateur connecté :', utilisateur);
    const idEntreprise = [
      utilisateur?.idEntreprise,
      utilisateur?.entreprise?.id
    ].find((id): id is number =>
      typeof id === 'number' && Number.isInteger(id) && id > 0
    );
    if (idEntreprise == null) {
      this.errorMsg = ['Impossible de déterminer l’entreprise associée à votre compte. Reconnectez-vous puis réessayez.'];
      return;
    }

    const categoryToSave: CathegoryDto = {
      ...this.categoryDto,
      code,
      designation,
      idEntreprise
    };

    this.isSaving = true;
    this.categoryService.save(categoryToSave).subscribe({
       next: () => {
        this.isSaving = false;
        this.router.navigate(['dashboard','categories']);
      },
       error: (error) => {
        this.isSaving = false;
        this.errorMsg = this.getErrorMessages(error);
       }
      });
  }

  private getErrorMessages(error: unknown): string[] {
    if (error instanceof HttpErrorResponse) {
      const response = error.error as { errors?: unknown; message?: unknown } | string | null;
      if (response && typeof response === 'object' && Array.isArray(response.errors)) {
        const messages = response.errors.filter((message): message is string => typeof message === 'string');
        if (messages.length > 0) {
          return messages;
        }
      }
      if (response && typeof response === 'object' && typeof response.message === 'string') {
        return [response.message];
      }
      if (typeof response === 'string' && response.trim()) {
        return [response];
      }
      if (error.status === 0) {
        return ['Impossible de joindre le serveur. Vérifiez que l’API est démarrée.'];
      }
    }

    return ['Une erreur est survenue lors de l’enregistrement de la catégorie.'];
  }
}
