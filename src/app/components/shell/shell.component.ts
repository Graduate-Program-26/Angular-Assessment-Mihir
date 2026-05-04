import { Component, inject } from "@angular/core";
import { AuthStore } from "../../store/auth.store";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

interface NavLink {
    path: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './shell.component.html',
})
export class ShellComponent {
    protected readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);

    protected readonly navLinks: NavLink[] = [
        {
            path: '/',
            label: 'Home',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        },
        {
            path: '/search',
            label: 'Search',
            icon: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
        },
        {
            path: '/playlists',
            label: 'Playlists',
            icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
        },
    ]

    onSearchFocus(): void {
        void this.router.navigate(['/search']);
    }
}