import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    template: `
    <div class="flex items-center justify-center min-h-screen">
      <p class="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);

    ngOnInit(): void {
        const fragment = window.location.hash.slice(1);
        const params = new URLSearchParams(fragment);

        const accessToken = params.get('access_token');
        const expires = params.get('expires');

        if (!accessToken) {
            void this.router.navigate(['/login'], {
                queryParams: { error: 'missing_token' },
            });
            return;
        }

        const expiresIn = expires ? parseInt(expires, 10) : 3600;

        this.authStore.handleCallback(accessToken, expiresIn);
        void this.router.navigate(['/']);
    }
}