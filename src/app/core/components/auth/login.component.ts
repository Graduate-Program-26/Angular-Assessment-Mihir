import { Component, inject } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background px-4">
      <div class="w-full max-w-sm space-y-8 text-center">

        <div class="space-y-2">
          <h1 class="text-3xl font-bold tracking-tight">Welcome to the Better Deezer</h1>
          <p class="text-muted-foreground text-sm">
            Sign in to access your playlists and personalised content.
          </p>
        </div>

        @if (authStore.loading()) {
          <p class="text-muted-foreground text-sm">Loading...</p>
        } @else {
          <button
            (click)="authStore.login()"
            class="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Sign in
          </button>
        }
      </div>
    </div>
  `,
})
export class LoginComponent {
  protected readonly authStore = inject(AuthStore);
}