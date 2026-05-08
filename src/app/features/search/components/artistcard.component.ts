import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerArtist } from '../../../models/search.models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <a
      [routerLink]="['/artist', artist().id]"
      class="group flex flex-col items-center gap-3 rounded-xl p-4 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      [attr.aria-label]="artist().name + ', artist'"
    >
      <div class="relative h-24 w-24 overflow-hidden rounded-full ring-1 ring-border">
        <img
          [src]="artist().picture_medium"
          [alt]="artist().name"
          class="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div class="text-center">
        <p class="text-sm font-medium leading-tight">{{ artist().name }}</p>
        <p class="text-muted-foreground mt-0.5 text-xs">
          {{ artist().nb_fan | number }} fans
        </p>
      </div>
    </a>
  `,
})
export class ArtistCardComponent {
  readonly artist = input.required<DeezerArtist>();
}