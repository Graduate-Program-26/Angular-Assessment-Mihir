import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
    selector: 'app-playlists',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './playlist.component.html',
})
export class PlaylistsComponent {
    protected readonly store = inject(PlaylistStore);
    protected readonly editingId = signal<string | null>(null);

    createPlaylist(): void {
        this.store.createPlaylist('New Playlist');
    }

    startEdit(id: string): void {
        this.editingId.set(id);
    }

    cancelEdit(): void {
        this.editingId.set(null);
    }

    submitRename(id: string, name: string): void {
        this.store.renamePlaylist(id, name);
        this.editingId.set(null);
    }

    deletePlaylist(id: string, name: string): void {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        this.store.deletePlaylist(id);
    }

    getCovers(playlistId: string): string[] {
        const playlist = this.store.playlists().find(p => p.id === playlistId);
        if (!playlist) return [];
        return playlist.tracks
            .filter(t => t.albumCover)
            .slice(0, 4)
            .map(t => t.albumCover!);
    }
}