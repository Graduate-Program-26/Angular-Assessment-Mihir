import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerTrack } from '../../models/search.models';
import { TrackDurationPipe } from '../../pipes/track-duration.pipe';

@Component({
    selector: 'app-track-row',
    standalone: true,
    imports: [RouterLink, TrackDurationPipe],
    template: `
    <div
      class="group flex items-center gap-4 rounded-lg px-3 py-2 transition hover:bg-muted"
      role="row"
    >
    
      <img
        [src]="track().album.cover_small"
        [alt]="'Cover for ' + track().album.title"
        class="h-10 w-10 flex-shrink-0 rounded object-cover"
        loading="lazy"
      />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ track().title }}</p>
        <a
          [routerLink]="['/artist', track().artist.id]"
          class="text-muted-foreground truncate text-xs hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {{ track().artist.name }}
        </a>
      </div>

      <span class="text-muted-foreground flex-shrink-0 text-xs tabular-nums">
        {{ track().duration | trackDuration }}
      </span>

      @if (track().preview) {
        <button
          [attr.aria-label]="'Play 30 second preview of ' + track().title"
          (click)="previewClicked.emit(track())"
          class="flex-shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition hover:bg-background hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class TrackRowComponent {
    readonly track = input.required<DeezerTrack>();
    readonly previewClicked = output<DeezerTrack>();
}