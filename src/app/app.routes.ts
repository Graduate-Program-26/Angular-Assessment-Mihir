import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./components/auth/login.component').then(
                m => m.LoginComponent
            ),
    },
    {
        path: 'callback',
        loadComponent: () =>
            import('./components/auth/auth-callback.component').then(
                m => m.AuthCallbackComponent
            ),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/shell/shell.component').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/home/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'search',
                loadComponent: () =>
                    import('./components/search/search.component').then(
                        m => m.SearchComponent
                    ),
            },
            {
                path: 'artist/:id',
                loadComponent: () =>
                    import('./components/artist/artist.component').then(
                        m => m.ArtistComponent
                    ),
            },
            {
                path: 'album/:id',
                loadComponent: () =>
                    import('./components/album/album.component').then(
                        m => m.AlbumComponent
                    ),
            },
            {
                path: 'playlists',
                loadComponent: () =>
                    import('./components/playlists/playlist.component').then(
                        m => m.PlaylistsComponent
                    ),
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
