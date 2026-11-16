import { HttpErrorResponse } from '@angular/common/http';

/** Liste des messages lisibles d'une erreur de l'API (format ErrorDto : { message, errors[] }). */
export function getHttpErrorMessages(error: unknown, fallback: string): string[] {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return ['Le serveur est indisponible. Vérifiez que l’API est démarrée puis réessayez.'];
    }
    const body = error.error as { message?: unknown; errors?: unknown } | string | null;
    if (body && typeof body === 'object') {
      const errors = Array.isArray(body.errors)
        ? body.errors.filter((m): m is string => typeof m === 'string' && m.trim().length > 0)
        : [];
      if (errors.length) {
        return errors;
      }
      if (typeof body.message === 'string' && body.message.trim()) {
        return [body.message];
      }
    }
    if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<')) {
      return [body];
    }
    if (error.status === 401) {
      return ['Votre session a expiré. Veuillez vous reconnecter.'];
    }
    if (error.status === 403) {
      return ['Vous n’avez pas les droits nécessaires pour cette action.'];
    }
    if (error.status === 404) {
      return ['L’élément demandé est introuvable.'];
    }
    return [fallback];
  }
  if (error instanceof Error && error.message) {
    return [error.message];
  }
  return [fallback];
}

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  return getHttpErrorMessages(error, fallback).join(' ');
}
