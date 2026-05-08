import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { map, filter } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

export const authGuard: CanActivateFn = () => {
    const auth0 = inject(AuthService);
    const router = inject(Router);

    return auth0.isAuthenticated$.pipe(
        map(isAuthenticated => {
            if (isAuthenticated) return true;
            void router.navigate(['/login']);
            return false;
        })
    );
};