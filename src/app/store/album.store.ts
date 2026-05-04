import { computed, inject, Injectable, signal } from "@angular/core";
import { AlbumService } from "../services/album.service";
import { DeezerAlbumDetail } from "../models/album.model";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { catchError, distinctUntilChanged, filter, of, switchMap, tap } from "rxjs";

interface AlbumState {
    albumId: number | null;
    album: DeezerAlbumDetail | null;
    loading: boolean;
    error: string | null;
}

@Injectable({ providedIn: 'root' })
export class AlbumStore {
    private readonly albumService = inject(AlbumService);

    private readonly _state = signal<AlbumState>({
        albumId: null,
        album: null,
        loading: false,
        error: null
    })

    readonly album = computed(() => this._state().album);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);

    readonly tracks = computed(() => this._state().album?.tracks.data ?? []);
    readonly genres = computed(() => this._state().album?.genres.data ?? []);

    readonly totalDuration = computed(() => {
        const total = this._state().album?.duration ?? 0;
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        return h > 0 ? `${h} hr ${m} min` : `${m} min`;
    });

    constructor() {
        toObservable(computed(() => this._state().albumId))
            .pipe(
                filter((id): id is number => id !== null),
                distinctUntilChanged(),
                tap(() =>
                    this._state.update(s => ({
                        ...s,
                        loading: true,
                        error: null,
                        album: null,
                    }))
                ),
                switchMap(id =>
                    this.albumService.getAlbum(id).pipe(
                        catchError(err => {
                            this._state.update(s => ({
                                ...s,
                                loading: false,
                                error: (err as Error).message ?? 'Failed to load album',
                            }));
                            return of(null);
                        })
                    )
                ),
                takeUntilDestroyed()
            )
            .subscribe(album => {
                if (album) {
                    if (album) {
                        this._state.update(s => ({ ...s, album, loading: false }));
                    }
                }
            });
    }

    loadAlbum(id: number): void {
        this._state.update(s => ({ ...s, albumId: id }));
    }
}