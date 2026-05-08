import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient(withJsonpSupport()), provideAuth0({
    domain: "dev-0aachqmr51vhi734.us.auth0.com",
    clientId: "M7eVSjBhOzF7eqY9y2lsGrUjI6v7ISOP",
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  }),],
};
