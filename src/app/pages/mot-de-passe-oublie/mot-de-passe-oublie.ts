import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mot-de-passe-oublie',
  standalone: false,
  templateUrl: './mot-de-passe-oublie.html',
  styleUrl: './mot-de-passe-oublie.css',
})
export class MotDePasseOublie implements OnDestroy {
  email = '';
  requestSubmitted = false;
  remainingSeconds = 0;
  private countdown?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  get maskedEmail(): string {
    const [localPart, domain] = this.email.split('@');
    if (!localPart || !domain) {
      return this.email;
    }

    const visibleStart = localPart.slice(0, 1);
    return `${visibleStart}${'•'.repeat(5)}@${domain}`;
  }

  get countdownLabel(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  submitRequest(): void {
    this.email = this.email.trim();
    if (!this.email) {
      return;
    }

    this.requestSubmitted = true;
    this.startCountdown();
  }

  resendEmail(): void {
    if (this.remainingSeconds === 0) {
      this.startCountdown();
    }
  }

  openMailbox(): void {
    const domain = this.email.split('@')[1]?.toLowerCase();
    const mailboxUrls: Record<string, string> = {
      'gmail.com': 'https://mail.google.com/',
      'outlook.com': 'https://outlook.live.com/mail/',
      'hotmail.com': 'https://outlook.live.com/mail/',
      'live.com': 'https://outlook.live.com/mail/',
      'yahoo.com': 'https://mail.yahoo.com/',
    };

    const url = mailboxUrls[domain ?? ''] ?? 'https://outlook.office.com/mail/';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private startCountdown(): void {
    this.clearCountdown();
    this.remainingSeconds = 42;
    this.countdown = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds -= 1;
      } else {
        this.clearCountdown();
      }
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.countdown) {
      clearInterval(this.countdown);
      this.countdown = undefined;
    }
  }
}
