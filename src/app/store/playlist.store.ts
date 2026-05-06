import { computed, inject, Injectable, signal } from "@angular/core";
import { PlaylistState, PlaylistTrack } from "../models/playlist.model";
import { IndexedDbService } from "../services/indexeddb.service";

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

    createPlaylist() {

    }

    renamePlaylist() {

    }

    deletePlaylist() {

    }

    addTrack() {

    }

    removeTrack() {

    }

    setActivePlaylist() {

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