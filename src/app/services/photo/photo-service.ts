import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type PhotoContext = 'article' | 'utilisateur' | 'client' | 'fournisseur' | 'entreprise';

export const PHOTO_TYPES_ACCEPTES = 'image/jpeg,image/png,image/webp,image/gif';
export const PHOTO_TAILLE_MAX = 5 * 1024 * 1024;

/** URL affichable d'une photo : l'API renvoie un chemin relatif (/photos/12). */
export function photoUrl(photo: string | null | undefined): string | null {
  if (!photo) {
    return null;
  }
  return /^https?:\/\//i.test(photo) ? photo : `${environment.apiUrl}${photo.startsWith('/') ? '' : '/'}${photo}`;
}

/** Message d'erreur si le fichier choisi n'est pas une image acceptée, sinon null. */
export function verifierPhoto(fichier: File | null | undefined): string | null {
  if (!fichier) {
    return 'Choisissez une image.';
  }
  if (!PHOTO_TYPES_ACCEPTES.split(',').includes(fichier.type)) {
    return 'Format non accepté : utilisez une image JPEG, PNG, WebP ou GIF.';
  }
  if (fichier.size > PHOTO_TAILLE_MAX) {
    return 'La photo ne doit pas dépasser 5 Mo.';
  }
  return null;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly apiUrl = `${environment.apiUrl}/photos`;

  constructor(private readonly http: HttpClient) {}

  /** Envoie la photo et renvoie le chemin enregistré sur l'élément (ex. /photos/12). */
  envoyer(context: PhotoContext, id: number, fichier: File): Observable<{ photo: string }> {
    const formData = new FormData();
    formData.append('file', fichier, fichier.name);
    return this.http.post<{ photo: string }>(`${this.apiUrl}/${context}/${id}`, formData);
  }
}
