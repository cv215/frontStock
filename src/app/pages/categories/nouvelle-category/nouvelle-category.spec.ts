import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CategoryService } from '../../../services/cathegory/category-service';
import { User } from '../../../services/user/user';
import { NouvelleCategory } from './nouvelle-category';

describe('NouvelleCategory', () => {
  let component: NouvelleCategory;
  let fixture: ComponentFixture<NouvelleCategory>;
  let categoryService: {
    findById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let route: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };
  let userService: { getConnectedUser: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    categoryService = {
      findById: vi.fn().mockReturnValue(of({})),
      save: vi.fn().mockReturnValue(of({}))
    };
    router = { navigate: vi.fn() };
    route = { snapshot: { paramMap: { get: vi.fn().mockReturnValue(null) } } };
    userService = { getConnectedUser: vi.fn().mockReturnValue({ idEntreprise: 7 }) };

    await TestBed.configureTestingModule({
      declarations: [NouvelleCategory],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: User, useValue: userService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelleCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads a category using the route id', () => {
    route.snapshot.paramMap.get.mockReturnValue('12');
    component.ngOnInit();

    expect(categoryService.findById).toHaveBeenCalledWith(12);
  });

  it('saves a category with its enterprise and trimmed fields', () => {
    component.categoryDto = { code: '  CAT-01 ', designation: '  Boissons  ' };
    component.enregistrerCategory();

    expect(categoryService.save).toHaveBeenCalledWith({
      code: 'CAT-01',
      designation: 'Boissons',
      idEntreprise: 7
    });
    expect(router.navigate).toHaveBeenCalledWith(['dashboard', 'categories']);
  });

  it('shows validation errors without sending an empty category', () => {
    component.enregistrerCategory();

    expect(categoryService.save).not.toHaveBeenCalled();
    expect(component.errorMsg).toEqual(['Le code et la désignation de la catégorie sont obligatoires.']);
  });

  it('does not save a category without an enterprise id', () => {
    userService.getConnectedUser.mockReturnValue({});
    component.categoryDto = { code: 'CAT-01', designation: 'Boissons' };

    component.enregistrerCategory();

    expect(categoryService.save).not.toHaveBeenCalled();
    expect(component.errorMsg).toEqual([
      'Impossible de déterminer l’entreprise associée à votre compte. Reconnectez-vous puis réessayez.'
    ]);
  });

  it('shows the API error when saving fails', () => {
    categoryService.save.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 400,
      error: { message: 'Code déjà utilisé' }
    })));
    component.categoryDto = { code: 'CAT-01', designation: 'Boissons' };

    component.enregistrerCategory();

    expect(component.errorMsg).toEqual(['Code déjà utilisé']);
  });
});
