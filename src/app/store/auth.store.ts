import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AuthState, DeezerAuthToken, DeezerUser } from '../models/auth.models';

const STORAGE_KEY = 'deezer_auth';

function loadPersistedToken(): DeezerAuthToken | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as DeezerAuthToken;
        if (Date.now() > parsed.expiresAt) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly _state = signal<AuthState>({
        token: loadPersistedToken(),
        user: null,
        loading: false,
        error: null,
    });

    readonly token = computed(() => this._state().token);
    readonly user = computed(() => this._state().user);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);
    readonly isAuthenticated = computed(() => {
        const t = this._state().token;
        return t !== null && Date.now() < t.expiresAt;
    });

    constructor() {
        effect(() => {
            const t = this.token();
            if (t) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        });

        effect(() => {
            if (this.isAuthenticated() && !this.user()) {
                this.fetchUser();
            }
        });
    }

    handleCallback(accessToken: string, expiresIn: number): void {
        const token: DeezerAuthToken = {
            accessToken,
            expiresAt: Date.now() + expiresIn * 1000,
        };
        this._state.update(s => ({ ...s, token, error: null }));
    }

    logout(): void {
        this._state.update(s => ({ ...s, token: null, user: null, error: null }));
        void this.router.navigate(['/login']);
    }

    private fetchUser(): void {
        const accessToken = this.token()?.accessToken;
        if (!accessToken) return;

        this._state.update(s => ({ ...s, loading: true }));

        this.http
            .jsonp<DeezerUser>(
                `https://api.deezer.com/user/me?access_token=${accessToken}&output=jsonp`,
                'callback'
            )
            .pipe(
                catchError(err => {
                    this._state.update(s => ({
                        ...s,
                        loading: false,
                        error: (err as Error).message ?? 'Failed to load user',
                    }));
                    return of(null);
                })
            )
            .subscribe(user => {
                if (user) {
                    this._state.update(s => ({ ...s, user, loading: false }));
                }
            });
    }
}