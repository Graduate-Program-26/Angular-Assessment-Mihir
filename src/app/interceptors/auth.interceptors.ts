import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

const DEEZER_API = 'https://api.deezer.com';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req);
    // const authStore = inject(AuthStore);
    // const token = authStore.token();

    // if (!req.url.startsWith(DEEZER_API) || !token) {
    //     return next(req);
    // }

    // const authedReq = req.clone({
    //     setParams: { access_token: token.accessToken },
    // });

    // return next(authedReq);
};