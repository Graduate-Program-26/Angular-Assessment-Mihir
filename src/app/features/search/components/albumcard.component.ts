import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerAlbum } from '../../../models/search.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <a
      [routerLink]="['/album', album().id]"
      class="group flex flex-col gap-3 rounded-xl p-3 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      [attr.aria-label]="album().artist ? album().title + ' by ' + album().artist!.name : album().title"
    >
      <div class="relative aspect-square w-full overflow-hidden rounded-lg ring-1 ring-border">
        <img
          [src]="album().cover_medium"
          [alt]="'Cover art for ' + album().title"
          class="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div class="min-w-0">
        <p class="truncate text-sm font-medium">{{ album().title }}</p>
        @if (album().artist) {
          <p class="text-muted-foreground truncate text-xs">{{ album().artist!.name }}</p>
        }
        <p class="text-muted-foreground mt-0.5 text-xs">
          {{ album().release_date | date: 'yyyy' }}
        </p>
      </div>
    </a>
  `,
})
export class AlbumCardComponent {
  readonly album = input.required<DeezerAlbum>();
}