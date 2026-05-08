import { computed, inject, Injectable, signal } from "@angular/core";
import { toObservable, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, filter, tap, switchMap, catchError, of } from "rxjs";
import { SearchResults, SearchTab } from "../models/search.models";
import { SearchService } from "../services/search.service";

const MIN_QUERY_LENGTH = 2;

@Injectable({ providedIn: 'root' })
export class SearchStore {
    private readonly searchService = inject(SearchService);

    private readonly _query = signal('');
    private readonly _results = signal<SearchResults>({ artists: [], albums: [], tracks: [] });
    private readonly _loading = signal(false);
    private readonly _error = signal<string | null>(null);
    private readonly _activeTab = signal<SearchTab>('artists');

    readonly query = this._query.asReadonly();
    readonly results = this._results.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly activeTab = this._activeTab.asReadonly();

    readonly hasResults = computed(() => {
        const r = this._results();
        return r.artists.length > 0 || r.albums.length > 0 || r.tracks.length > 0;
    });

    readonly isEmpty = computed(() =>
        !this._loading() && this._query().length >= MIN_QUERY_LENGTH && !this.hasResults()
    );

    readonly resultCounts = computed(() => ({
        artists: this._results().artists.length,
        albums: this._results().albums.length,
        tracks: this._results().tracks.length,
    }));

    constructor() {
        toObservable(this._query)
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                filter(q => q.length >= MIN_QUERY_LENGTH),
                tap(() => {
                    this._loading.set(true);
                    this._error.set(null);
                }),
                switchMap(q =>
                    this.searchService.search(q).pipe(
                        catchError(err => {
                            this._error.set((err as Error).message ?? 'Search failed');
                            this._loading.set(false);
                            return of({ artists: [], albums: [], tracks: [] });
                        })
                    )
                ),
                takeUntilDestroyed()
            )
            .subscribe(results => {
                this._results.set(results);
                this._loading.set(false);
            });
    }

    setQuery(query: string): void {
        this._query.set(query);
        if (query.length < MIN_QUERY_LENGTH) {
            this._results.set({ artists: [], albums: [], tracks: [] });
            this._loading.set(false);
        }
    }

    setActiveTab(tab: SearchTab): void {
        this._activeTab.set(tab);
    }

    clearSearch(): void {
        this._query.set('');
        this._results.set({ artists: [], albums: [], tracks: [] });
        this._error.set(null);
        this._loading.set(false);
    }
}