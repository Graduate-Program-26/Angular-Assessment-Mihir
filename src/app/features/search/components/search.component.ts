import { Component, inject } from "@angular/core";
import { SearchTab, DeezerTrack } from "../models/search.models";
import { SearchStore } from "../store/search.store";
import { SearchBarComponent } from "./searchbar.component";
import { ArtistCardComponent } from "./artistcard.component";
import { AlbumCardComponent } from "./albumcard.component";
import { TrackRowComponent } from "./trackrow.component";
import { PlayerStore } from "../../../store/player.store";

@Component({
  selector: 'app-search',
  standalone: true,
  template: `<main class="mx-auto max-w-5xl px-4 py-8" aria-label="Search">
 
      <div class="mb-8 flex justify-center">
        <div class="w-full max-w-xl">
          <app-search-bar />
        </div>
      </div>
 
      @if (!store.query()) {
        <!-- Empty prompt -->
       <div class="flex flex-col items-center justify-center gap-3 py-24 text-center">

        <div class="grid h-16 w-16 place-items-center rounded-full bg-muted/40">
          <svg
            aria-hidden="true"
            class="h-8 w-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" stroke-linecap="round" />
          </svg>
        </div>

        <p class="text-muted-foreground text-sm">
          Search for artists, albums or tracks
        </p>

      </div>
 
      } @else if (store.loading()) {
        <!-- Loading state -->
        <div role="status" aria-live="polite" aria-label="Loading results" class="flex flex-col items-center gap-3 py-24">
          <svg aria-hidden="true" class="h-6 w-6 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-muted-foreground text-sm">Searching…</p>
        </div>
 
      } @else if (store.error()) {
        <!-- Error state -->
        <div role="alert" class="flex flex-col items-center gap-3 py-24 text-center">
          <p class="text-destructive text-sm">Something went wrong. Please try again.</p>
        </div>
 
      } @else if (store.isEmpty()) {
        <!-- No results -->
        <div aria-live="polite" class="flex flex-col items-center gap-2 py-24 text-center">
          <p class="text-sm font-medium">No results for "{{ store.query() }}"</p>
          <p class="text-muted-foreground text-xs">Try a different search term</p>
        </div>
 
      } @else {
        <!-- Tabs -->
        <div
          role="tablist"
          aria-label="Result categories"
          class="mb-6 flex flex-wrap gap-2"
        >
        @for (tab of tabs; track tab.key) {
          <button
            role="tab"
            [attr.aria-selected]="store.activeTab() === tab.key"
            (click)="store.setActiveTab(tab.key)"
            class="rounded-full px-4 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

            [class.bg-foreground]="store.activeTab() === tab.key"
            [class.text-background]="store.activeTab() === tab.key"

            [class.bg-muted]="store.activeTab() !== tab.key"
            [class.text-muted-foreground]="store.activeTab() !== tab.key"
            [class.hover:bg-muted/80]="store.activeTab() !== tab.key"
          >
            {{ tab.label }}

          </button>
        }
      </div>

        <!-- Artists panel -->
        @if (store.activeTab() === 'artists') {
          <section
            id="artists-panel"
            role="tabpanel"
            aria-label="Artist results"
            aria-live="polite"
            class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            @for (artist of store.results().artists; track artist.id) {
              <app-artist-card [artist]="artist" />
            }
          </section>
        }
 
        <!-- Albums panel -->
        @if (store.activeTab() === 'albums') {
          <section
            id="albums-panel"
            role="tabpanel"
            aria-label="Album results"
            aria-live="polite"
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            @for (album of store.results().albums; track album.id) {
              <app-album-card [album]="album" />
            }
          </section>
        }
 
        <!-- Tracks panel -->
        @if (store.activeTab() === 'tracks') {
          <section
            id="tracks-panel"
            role="tabpanel"
            aria-label="Track results"
            aria-live="polite"
            class="flex flex-col"
            role="grid"
          >
            @for (track of store.results().tracks; track track.id) {
              <app-track-row
                [track]="track"
                (previewClicked)="onPreview($event)"
              />
            }
          </section>
        }
      }
    </main>`,
  imports: [
    SearchBarComponent,
    ArtistCardComponent,
    AlbumCardComponent,
    TrackRowComponent,
  ]
})
export class SearchComponent {
  protected readonly store = inject(SearchStore);
  private readonly playerStore = inject(PlayerStore);

  protected readonly tabs: { key: SearchTab; label: string }[] = [
    { key: 'artists', label: 'Artists' },
    { key: 'albums', label: 'Albums' },
    { key: 'tracks', label: 'Tracks' },
  ];

  onPreview(track: DeezerTrack): void {
    const queue = this.store.results().tracks;
    const index = queue.findIndex(t => t.id === track.id);
    this.playerStore.play(track, queue, index);
  }
}