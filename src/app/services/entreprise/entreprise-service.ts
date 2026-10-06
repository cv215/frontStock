import { Injectable } from '@angular/core';
import { Entreprise, EntrepriseDto } from '../../api/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private apiUrl = `${environment.apiUrl}/entreprises`;

  constructor(
    private http: HttpClient
  ) {}

  sinscrire(entreprise: EntrepriseDto): Observable<EntrepriseDto> {
    return this.http.post<EntrepriseDto>(`${this.apiUrl}/create`, entreprise);
  }

  findById(id: number): Observable<EntrepriseDto> {
    return this.http.get<EntrepriseDto>(`${this.apiUrl}/${id}`);
  }

  findAll(): Observable<EntrepriseDto[]> {
    return this.http.get<EntrepriseDto[]>(`${this.apiUrl}/all`);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
