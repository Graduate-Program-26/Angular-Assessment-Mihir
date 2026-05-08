import { Injectable, inject, signal, computed } from "@angular/core";
import { HomeState } from "../models/home.models";
import { HomeService } from "../../../services/home.service";

@Injectable({ providedIn: 'root' })
export class HomeStore {
    private readonly homeService = inject(HomeService);

    private readonly _state = signal<HomeState>({
        chart: null,
        loading: false,
        error: null,
    });

    readonly chart = computed(() => this._state().chart);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);

    readonly topTracks = computed(() => this._state().chart?.tracks.data ?? []);
    readonly topArtists = computed(() => this._state().chart?.artists.data ?? []);
    readonly topAlbums = computed(() => this._state().chart?.albums.data ?? []);

    load(): void {
        if (this._state().chart || this._state().loading) return;

        this._state.update(s => ({ ...s, loading: true, error: null }));

        this.homeService.getChart().subscribe({
            next: chart => this._state.update(s => ({ ...s, chart, loading: false })),
            error: err =>
                this._state.update(s => ({
                    ...s,
                    loading: false,
                    error: (err as Error).message ?? 'Failed to load charts',
                })),
        });
    }
}