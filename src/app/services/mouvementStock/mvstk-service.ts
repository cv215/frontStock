import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MvstkDto } from '../../api/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MvstkService {
  private readonly apiUrl = `${environment.apiUrl}/mvstk`;

  constructor(private readonly http: HttpClient) {}

  findByArticle(idArticle: number): Observable<MvstkDto[]> {
    return this.http.get<MvstkDto[]>(`${this.apiUrl}/filter/article/${idArticle}`);
  }

  stockReelArticle(idArticle: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stockreel/${idArticle}`);
  }

  entreeStock(mouvement: MvstkDto): Observable<MvstkDto> {
    return this.http.post<MvstkDto>(`${this.apiUrl}/entree`, mouvement);
  }

  sortieStock(mouvement: MvstkDto): Observable<MvstkDto> {
    return this.http.post<MvstkDto>(`${this.apiUrl}/sortie`, mouvement);
  }

  correctionStockPos(mouvement: MvstkDto): Observable<MvstkDto> {
    return this.http.post<MvstkDto>(`${this.apiUrl}/correctionpos`, mouvement);
  }

  correctionStockNeg(mouvement: MvstkDto): Observable<MvstkDto> {
    return this.http.post<MvstkDto>(`${this.apiUrl}/correctionneg`, mouvement);
  }
}
