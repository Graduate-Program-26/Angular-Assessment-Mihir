import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

const DEEZER_APP_ID = 'YOUR_APP_ID';
const REDIRECT_URI = `${window.location.origin}/callback`;
const PERMS = 'basic_access,email,manage_library,manage_community,delete_library';

function buildDeezerAuthUrl(): string {
    const params = new URLSearchParams({
        app_id: DEEZER_APP_ID,
        redirect_uri: REDIRECT_URI,
        perms: PERMS,
        response_type: 'token',
    });
    return `https://connect.deezer.com/oauth/auth.php?${params.toString()}`;
}

@Component({
    selector: 'app-login',
    standalone: true,
    template: `
    <div class="flex min-h-screen items-center justify-center bg-background px-4">
      <div class="w-full max-w-sm space-y-8 text-center">

        <div class="space-y-2">
          <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p class="text-muted-foreground text-sm">
            Sign in with your Deezer account to continue.
          </p>
        </div>

        @if (error()) {
          <p class="text-destructive text-sm">
            Something went wrong. Please try again.
          </p>
        }

        <button
          (click)="login()"
          class="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95"
        >
          Continue with Deezer
        </button>

        <p class="text-muted-foreground text-xs">
          By signing in you agree to Deezer's terms of service.
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);

    readonly error = this.authStore.error;

    constructor() {
        if (this.authStore.isAuthenticated()) {
            void this.router.navigate(['/']);
        }
    }

    login(): void {
        window.location.href = buildDeezerAuthUrl();
    }
}