import { Component, inject, output } from '@angular/core';
import { SearchStore } from '../store/search.store';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  template: `
  <div class="relative w-full max-w-md">
    <label for="search-input" class="sr-only">
      Search artists, albums and tracks
    </label>

    <input
      id="search-input"
      type="search"
      role="searchbox"
      aria-label="Search artists, albums and tracks"
      autocomplete="off"
      placeholder="Search artists, albums, tracks…"
      [value]="store.query()"
      (input)="onInput($event)"
      (focus)="focused.emit()"
      class="w-full h-11 pl-11 pr-10 bg-gray-200 rounded-full text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    />
  </div>
`
})
export class SearchBarComponent {
  protected readonly store = inject(SearchStore);
  readonly focused = output<void>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setQuery(value);
  }

}