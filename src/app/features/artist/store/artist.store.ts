import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of, tap, filter, distinctUntilChanged } from 'rxjs';
import { ArtistService } from '../services/artist.service';
import { ArtistPageData, DeezerArtistDetail } from '../../../models/artist.model';
import { DeezerAlbum, DeezerTrack } from '../../../models/search.models';

interface ArtistState {
    artistId: number | null;
    artist: DeezerArtistDetail | null;
    albums: DeezerAlbum[];
    topTracks: DeezerTrack[];
    loading: boolean;
    error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ArtistStore {
    private readonly artistService = inject(ArtistService);

    private readonly _state = signal<ArtistState>({
        artistId: null,
        artist: null,
        albums: [],
        topTracks: [],
        loading: false,
        error: null,
    });

    private readonly pageSize = 15;
    readonly page = signal(1);

    readonly artist = computed(() => this._state().artist);
    readonly albums = computed(() => this._state().albums);
    readonly topTracks = computed(() => this._state().topTracks);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);

    readonly albumSort = signal<'newest' | 'oldest' | 'az' | 'za'>('newest');

    readonly fanCount = computed(() => {
        const fans = this._state().artist?.nb_fan ?? 0;
        if (fans >= 1_000_000) return `${(fans / 1_000_000).toFixed(1)}M`;
        if (fans >= 1_000) return `${(fans / 1_000).toFixed(0)}K`;
        return fans.toString();
    });

    readonly albumCount = computed(() => this._state().artist?.nb_album ?? 0);

    readonly sortedAlbums = computed(() => {
        const albums = this._state().albums;
        const sort = this.albumSort();

        const copy = [...albums];

        switch (sort) {
            case 'newest':
                return copy.sort(
                    (a, b) =>
                        new Date(b.release_date).getTime() -
                        new Date(a.release_date).getTime()
                );

            case 'oldest':
                return copy.sort(
                    (a, b) =>
                        new Date(a.release_date).getTime() -
                        new Date(b.release_date).getTime()
                );

            case 'az':
                return copy.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );

            case 'za':
                return copy.sort((a, b) =>
                    b.title.localeCompare(a.title)
                );
        }
    });

    readonly paginatedAlbums = computed(() => {
        const albums = this.sortedAlbums();
        return albums.slice(0, this.page() * this.pageSize);
    });

    constructor() {
        toObservable(computed(() => this._state().artistId))
            .pipe(
                filter((id): id is number => id !== null),
                distinctUntilChanged(),
                tap(() => {
                    this.page.set(1);

                    this._state.update(s => ({
                        ...s,
                        loading: true,
                        error: null,
                        artist: null,
                        albums: [],
                        topTracks: [],
                    }));
                }),
                switchMap(id =>
                    this.artistService.getArtistPageData(id).pipe(
                        catchError(err => {
                            this._state.update(s => ({
                                ...s,
                                loading: false,
                                error: (err as Error).message ?? 'Failed to load artist',
                            }));
                            return of(null);
                        })
                    )
                ),
                takeUntilDestroyed()
            )
            .subscribe(data => {
                if (data) {
                    this.setPageData(data);
                }
            });
    }

    loadArtist(id: number): void {
        this._state.update(s => ({ ...s, artistId: id }));
    }

    loadMoreAlbums(): void {
        const total = this._state().albums.length;
        const current = this.page() * this.pageSize;

        if (current >= total) return;

        this.page.update(p => p + 1);
    }

    setAlbumSort(sort: 'newest' | 'oldest' | 'az' | 'za'): void {
        this.albumSort.set(sort);
    }

    private setPageData(data: ArtistPageData): void {
        this._state.update(s => ({
            ...s,
            artist: data.artist,
            albums: data.albums,
            topTracks: data.topTracks.slice(5),
            loading: false,
            error: null,
        }));
    }
}