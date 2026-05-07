import { Component, inject, output } from '@angular/core';
import { SearchStore } from '../../store/search.store';

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
      class="w-full h-11 pl-11 pr-10 rounded-full text-muted-foreground bg-gray-200 text-sm placeholder:text-gray-400 border border-transparent backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 focus:bg-neutral-300 hover:bg-neutral-400
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