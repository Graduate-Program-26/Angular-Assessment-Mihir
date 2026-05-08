import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { PlayerStore } from './player.store';
import { DeezerArtist } from '../../features/search/models/search.models';
import { RecentAlbum, RecentArtist, RecentTrack } from '../../features/home/models/home.models';
import { DeezerAlbumDetail } from '../../features/albums/models/album.model';


const STORAGE_KEY_TRACKS = 'melodify_recent_tracks';
const STORAGE_KEY_ARTISTS = 'melodify_recent_artists';
const MAX_RECENT = 10;

function loadFromStorage<T>(key: string): T[] {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
        return [];
    }
}

@Injectable({ providedIn: 'root' })
export class RecentStore {
    private readonly playerStore = inject(PlayerStore);
    private readonly _recentTracks = signal<RecentTrack[]>(
        loadFromStorage<RecentTrack>(STORAGE_KEY_TRACKS)
    );
    private readonly _recentArtists = signal<RecentArtist[]>(
        loadFromStorage<RecentArtist>(STORAGE_KEY_ARTISTS)
    );
    private readonly _recentAlbums = signal<RecentAlbum[]>(
        loadFromStorage<RecentAlbum>('melodify_recent_albums')
    );

    readonly recentTracks = this._recentTracks.asReadonly();
    readonly recentArtists = this._recentArtists.asReadonly();

    readonly hasRecentActivity = computed(
        () => this._recentTracks().length > 0 || this._recentArtists().length > 0
    );

    readonly recentAlbums = this._recentAlbums.asReadonly();

    constructor() {
        effect(() => {
            const track = this.playerStore.currentTrack();
            if (!track) return;
            if (!track.preview) return;

            const recent: RecentTrack = {
                id: track.id,
                title: track.title,
                artistName: track.artist.name,
                albumCover:
                    'album' in track && track.album && 'cover_medium' in track.album
                        ? (track.album as { cover_medium: string }).cover_medium
                        : '',
                preview: track.preview,
                playedAt: Date.now(),
            };

            this._recentTracks.update(tracks => {
                const filtered = tracks.filter(t => t.id !== track.id);
                const updated = [recent, ...filtered].slice(0, MAX_RECENT);
                localStorage.setItem(STORAGE_KEY_TRACKS, JSON.stringify(updated));
                return updated;
            });
        });
    }

    trackArtistView(artist: DeezerArtist): void {
        const recent: RecentArtist = {
            id: artist.id,
            name: artist.name,
            picture_medium: artist.picture_medium,
            searchedAt: Date.now(),
        };

        this._recentArtists.update(artists => {
            const filtered = artists.filter(a => a.id !== artist.id);
            const updated = [recent, ...filtered].slice(0, MAX_RECENT);
            localStorage.setItem(STORAGE_KEY_ARTISTS, JSON.stringify(updated));
            return updated;
        });
    }

    clearRecent(): void {
        this._recentTracks.set([]);
        this._recentArtists.set([]);
        localStorage.removeItem(STORAGE_KEY_TRACKS);
        localStorage.removeItem(STORAGE_KEY_ARTISTS);
    }

    trackAlbumView(album: DeezerAlbumDetail): void {
        const recent: RecentAlbum = {
            id: album.id,
            title: album.title,
            cover_medium: album.cover_medium,
            artistName: album.artist.name,
            viewedAt: Date.now(),
        };
        this._recentAlbums.update(albums => {
            const filtered = albums.filter(a => a.id !== album.id);
            const updated = [recent, ...filtered].slice(0, MAX_RECENT);
            localStorage.setItem('melodify_recent_albums', JSON.stringify(updated));
            return updated;
        });
    }

    updatePreview(trackId: number, preview: string): void {
        this._recentTracks.update(tracks => {
            const updated = tracks.map(t => t.id === trackId ? { ...t, preview } : t);
            localStorage.setItem(STORAGE_KEY_TRACKS, JSON.stringify(updated));
            return updated;
        });
    }
}