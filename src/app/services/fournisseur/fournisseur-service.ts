import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FournisseurDto } from '../../api/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private readonly apiUrl = `${environment.apiUrl}/fournisseurs`;

  constructor(private readonly http: HttpClient) {}

  save(fournisseur: FournisseurDto): Observable<FournisseurDto> {
    return this.http.post<FournisseurDto>(`${this.apiUrl}/create`, fournisseur);
  }

  findById(id: number): Observable<FournisseurDto> {
    return this.http.get<FournisseurDto>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<FournisseurDto[]> {
    return this.http.get<FournisseurDto[]>(`${this.apiUrl}/all`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
