import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../services/user/user';
import { UtilisateurDto } from '../../api/models';

import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;
  let connectedUser: UtilisateurDto | null;

  beforeEach(async () => {
    connectedUser = null;
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [Menu],
      providers: [{
        provide: User,
        useValue: { getConnectedUser: () => connectedUser }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expands one menu at a time and allows collapsing it', () => {
    const articlesMenu = component.menuProperties.find(menu => menu.id === '2');
    const clientsMenu = component.menuProperties.find(menu => menu.id === '3');

    component.toggleMenu(articlesMenu!);
    expect(component.isExpanded(articlesMenu!)).toBe(true);

    component.toggleMenu(clientsMenu!);
    expect(component.isExpanded(articlesMenu!)).toBe(false);
    expect(component.isExpanded(clientsMenu!)).toBe(true);

    component.toggleMenu(clientsMenu!);
    expect(component.isExpanded(clientsMenu!)).toBe(false);
  });

  it('reveals working submenu links after clicking a menu heading', () => {
    fixture.detectChanges();
    const menuHeading = Array.from(
      fixture.nativeElement.querySelectorAll('.nav-group-toggle') as NodeListOf<HTMLButtonElement>
    ).find(button => button.textContent?.includes('Articles'));

    expect(fixture.nativeElement.querySelectorAll('.nav-link').length).toBe(0);
    menuHeading?.click();
    fixture.detectChanges();

    const submenuLinks = Array.from(
      fixture.nativeElement.querySelectorAll('.nav-link') as NodeListOf<HTMLAnchorElement>
    );
    expect(submenuLinks.map(link => link.textContent?.trim())).toEqual(['Articles', 'Mouvement de stock']);
    expect(submenuLinks.map(link => link.getAttribute('href'))).toEqual([
      '/dashboard/articles',
      '/dashboard/mvtstk'
    ]);
  });

  it('uses the customer navigation for a customer account', () => {
    connectedUser = { email: 'client@example.com', roles: { libelle: 'CLIENT' } };
    component.ngOnInit();

    expect(component.isClient).toBe(true);
    expect(component.menuProperties.map(menu => menu.titre)).toContain('Mes commandes');
    expect(component.menuProperties.map(menu => menu.titre)).not.toContain('Utilisateurs');
  });
});
