import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CathegoryDto, EntrepriseDto } from '../../api/models';
import { Observable } from 'rxjs';

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
    return this.http.get<CathegoryDto[]>(`${this.apiUrl}/all`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
