import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientDto } from '../../api/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient){ }

  save(client: ClientDto): Observable<ClientDto>{
    return this.http.post<ClientDto>(`${this.apiUrl}/create`, client)
  }

  findById(id: number): Observable<ClientDto>{
    return this.http.get<ClientDto>(`${this.apiUrl}/${id}`)
    }

  findAll(): Observable<ClientDto[]>{
    return this.http.get<ClientDto[]>(`${this.apiUrl}/all`)
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`)
  }
}
