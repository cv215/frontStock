import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ArticleDto, LigneCommandeClientDto, LigneCommandeFournisseurDto, LigneVenteDto } from '../../api/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(
    private http: HttpClient
  ) {}

  save(article: ArticleDto): Observable<ArticleDto> {
    return this.http.post<ArticleDto>(`${this.apiUrl}/create`, article);
  }

  findAllArticleByIdCathegory(idCathegory: number): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/filter/cathegory/${idCathegory}`);
  }

  findByIdArticle(idArticle: number): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${idArticle}`);
  }

  findByCodeArticle(codeArticle: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/code/${encodeURIComponent(codeArticle)}`);
  }

  findByHistoireCommandeClient(idArticle: number): Observable<LigneCommandeClientDto[]> {
    return this.http.get<LigneCommandeClientDto[]>(`${this.apiUrl}/historique/commandeclient/${idArticle}`);
  }

  findByHistoireCommandeFournisseur(idArticle: number): Observable<LigneCommandeFournisseurDto[]> {
    return this.http.get<LigneCommandeFournisseurDto[]>(`${this.apiUrl}/historique/commandefournisseur/${idArticle}`);
  }

  findByHistoireVentes(idArticle: number): Observable<LigneVenteDto[]> {
    return this.http.get<LigneVenteDto[]>(`${this.apiUrl}/historique/ventes/${idArticle}`);
  }

  findAll(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/all`);
  }

  delete(idArticle: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idArticle}`);
  }
}
