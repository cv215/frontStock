import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CathegoryDto, EntrepriseDto } from '../../api/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
   private apiUrl = `${environment.apiUrl}/cathegory`;

  constructor(
    private http: HttpClient
  ) {}

  save(cathegory: CathegoryDto): Observable<CathegoryDto> {
    return this.http.post<CathegoryDto>(`${this.apiUrl}/create`, cathegory);
  }

  findById(id: number): Observable<CathegoryDto> {
    return this.http.get<CathegoryDto>(`${this.apiUrl}/${id}`);
  }

  findByCode(codeCathegory: string): Observable<CathegoryDto> {
    return this.http.get<CathegoryDto>(`${this.apiUrl}/code/${codeCathegory}`);
  }

  findAll(): Observable<CathegoryDto[]> {
    return this.http.get<CathegoryDto | CathegoryDto[]>(`${this.apiUrl}/all`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === 'object') {
          return [response];
        }
        throw new Error('La réponse de l’API des catégories est invalide.');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
