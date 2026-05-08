import { computed, inject, Injectable, signal } from "@angular/core";
import { Playlist, PlaylistState, PlaylistTrack } from "../models/playlist.model";
import { IndexedDbService } from "../../../shared/services/indexeddb.service";

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function totalDuration(tracks: PlaylistTrack[]): string {
    const total = tracks.reduce((acc, t) => acc + t.duration, 0);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h} hr ${m} min`;
    if (m > 0) return `${m} min ${s} sec`;
    return `${s} sec`;
}

@Injectable({ providedIn: 'root' })
export class PlaylistStore {
    private readonly db = inject(IndexedDbService);

    private readonly _state = signal<PlaylistState>({
        playlists: [],
        activePlaylistId: null,
        loading: true,
        error: null,
    })

    readonly playlists = computed(() => this._state().playlists);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);
    readonly activePlaylistId = computed(() => this._state().activePlaylistId)

    readonly activePlaylist = computed(() => {
        const id = this._state().activePlaylistId;
        return this._state().playlists.find(p => p.id === id) ?? null;
    })

    readonly playlistCount = computed(() => this._state().playlists.length);

    readonly activePlaylistDuration = computed(() => {
        const playlist = this.activePlaylist();
        if (!playlist) return '0 sec';
        return totalDuration(playlist.tracks);
    })

    readonly activePlaylistTrackCount = computed(() =>
        this.activePlaylist()?.tracks.length ?? 0
    );

    constructor() {
        void this.rehydrate();
    }

    createPlaylist(name: string): Playlist {
        const playlist: Playlist = {
            id: generateId(),
            name: name.trim() || 'New Playlist',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tracks: [],
        };
        this._state.update(s => ({ ...s, playlists: [...s.playlists, playlist] }));
        void this.db.save(playlist);
        return playlist;
    }

    renamePlaylist(id: string, name: string): void {
        const trimmed = name.trim();
        if (!trimmed) return;
        this._state.update(s => ({
            ...s,
            playlists: s.playlists.map(p =>
                p.id === id ? { ...p, name: trimmed, updatedAt: Date.now() } : p
            ),
        }));
        const updated = this._state().playlists.find(p => p.id === id);
        if (updated) void this.db.save(updated);
    }

    deletePlaylist(id: string): void {
        this._state.update(s => ({
            ...s,
            playlists: s.playlists.filter(p => p.id !== id),
            activePlaylistId: s.activePlaylistId === id ? null : s.activePlaylistId,
        }));
        void this.db.delete(id);
    }

    addTrack(playlistId: string, track: PlaylistTrack): void {
        const playlist = this._state().playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const alreadyAdded = playlist.tracks.some(t => t.id === track.id);
        if (alreadyAdded) return;

        const updated: Playlist = {
            ...playlist,
            tracks: [...playlist.tracks, { ...track, addedAt: Date.now() }],
            updatedAt: Date.now(),
        };

        this._state.update(s => ({
            ...s,
            playlists: s.playlists.map(p => (p.id === playlistId ? updated : p)),
        }));
        void this.db.save(updated);
    }

    removeTrack(playlistId: string, trackId: number): void {
        const playlist = this._state().playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const updated: Playlist = {
            ...playlist,
            tracks: playlist.tracks.filter(t => t.id !== trackId),
            updatedAt: Date.now(),
        };

        this._state.update(s => ({
            ...s,
            playlists: s.playlists.map(p => (p.id === playlistId ? updated : p)),
        }));
        void this.db.save(updated);
    }

    setActivePlaylist(id: string | null): void {
        this._state.update(s => ({ ...s, activePlaylistId: id }));
    }

    private async rehydrate(): Promise<void> {
        try {
            await this.db.init();
            const playlists = await this.db.getAll();
            this._state.update(s => ({ ...s, playlists, loading: false }));
        } catch (err) {
            this._state.update(s => ({
                ...s,
                loading: false,
                error: (err as Error).message ?? 'Failed to load playlists',
            }));
        }
    }
}