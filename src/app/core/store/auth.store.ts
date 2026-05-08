import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private readonly auth0 = inject(AuthService);
    private readonly router = inject(Router);

    readonly isAuthenticated = toSignal(this.auth0.isAuthenticated$, { initialValue: false });
    readonly user = toSignal(this.auth0.user$, { initialValue: null });
    readonly loading = toSignal(this.auth0.isLoading$, { initialValue: true });

    login(): void {
        this.auth0.loginWithRedirect();
    }

    logout(): void {
        this.auth0.logout({
            logoutParams: { returnTo: window.location.origin }
        });
    }
}