import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./core/components/auth/login.component').then(
                m => m.LoginComponent
            ),
    },
    {
        path: 'callback',
        loadComponent: () =>
            import('./core/components/auth/auth-callback.component').then(
                m => m.AuthCallbackComponent
            ),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./shared/components/shell/shell.component').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./features/home/components/home.component').then(m => m.HomeComponent),
            },
            {
                path: 'search',
                loadComponent: () =>
                    import('./features/search/components/search.component').then(
                        m => m.SearchComponent
                    ),
            },
            {
                path: 'artist/:id',
                loadComponent: () =>
                    import('./features/artist/components/artist.component').then(
                        m => m.ArtistComponent
                    ),
            },
            {
                path: 'album/:id',
                loadComponent: () =>
                    import('./features/albums/components/album.component').then(
                        m => m.AlbumComponent
                    ),
            },
            {
                path: 'playlists',
                loadComponent: () =>
                    import('./features/playlists/components/playlist.component').then(
                        m => m.PlaylistsComponent
                    ),
            },
            {
                path: 'playlists/:id',
                loadComponent: () =>
                    import('./features/playlists/components/playlist-detail.component').then(
                        m => m.PlaylistDetailComponent
                    )
            }
        ],
    },
    { path: '**', redirectTo: '' },
];
