import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchStore } from '../../store/search.store';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [],
    template: `
    <div class="relative w-full max-w-md">
      <label for="search-input" class="sr-only">Search artists, albums and tracks</label>

      <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg
          aria-hidden="true"
          class="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <input
        id="search-input"
        type="search"
        role="searchbox"
        aria-label="Search artists, albums and tracks"
        autocomplete="off"
        placeholder="Search artists, albums, tracks…"
        [value]="store.query()"
        (input)="onInput($event)"
        (keydown.enter)="onEnter()"
        (focus)="focused.emit()"
      />

      @if (store.query()) {
        <button
          aria-label="Clear search"
          (click)="store.clearSearch()"
          class="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
        >
          <svg aria-hidden="true" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchBarComponent {
    protected readonly store = inject(SearchStore);
    readonly focused = output<void>();

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.store.setQuery(value);
    }

    onEnter(): void {

    }
}