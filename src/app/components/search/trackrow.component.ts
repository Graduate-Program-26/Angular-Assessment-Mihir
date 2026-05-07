import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeezerTrack } from '../../models/search.models';
import { TrackDurationPipe } from '../../pipes/track-duration.pipe';
import { PlayerStore } from '../../store/player.store';
import { PlaylistStore } from '../../store/playlist.store';

@Component({
  selector: 'app-track-row',
  standalone: true,
  imports: [RouterLink, TrackDurationPipe],
  template: `
    <div
      class="group relative flex items-center gap-4 rounded-lg px-3 py-2 transition hover:bg-muted"
      role="row"
    >

      <img
        [src]="track().album.cover_medium"
        [alt]="'Cover for ' + track().album.title"
        class="h-10 w-10 shrink-0 rounded object-cover"
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

      <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
        {{ track().duration | trackDuration }}
      </span>

      @if (track().preview) {
        <button
          [attr.aria-label]="'Play 30 second preview of ' + track().title"
          (click)="previewClicked.emit(track())"
          class="shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      }

      <!-- Context menu trigger -->
      <div class="relative shrink-0">
        <button
          [attr.aria-label]="'More options for ' + track().title"
          [attr.aria-expanded]="menuOpen()"
          (click)="toggleMenu()"
          class="rounded-full p-1.5 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          [class.opacity-100]="menuOpen()"
        >
          <svg aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
          </svg>
        </button>

        @if (menuOpen()) {
          <!-- Backdrop -->
          <div
            class="fixed inset-0 z-40"
            aria-hidden="true"
            (click)="closeMenu()"
          ></div>

          <!-- Dropdown -->
          <div
            role="menu"
            [attr.aria-label]="'Options for ' + track().title"
            class="absolute right-0 z-50 w-52 rounded-xl border border-border bg-background shadow-xl"
            [class.bottom-full]="openUpward()"
            [class.top-full]="!openUpward()"
            [class.mb-1]="openUpward()"
            [class.mt-1]="!openUpward()"
          >
            <div class="p-1.5">

              <!-- Add to queue -->
              <button
                role="menuitem"
                (click)="addToQueue()"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke-linecap="round" />
                </svg>
                Add to queue
              </button>

              <!-- New playlist -->
              <button
                role="menuitem"
                (click)="createAndAddToPlaylist()"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg aria-hidden="true" class="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke-linecap="round" />
                </svg>
                New playlist
              </button>

              <!-- Existing playlists -->
              @if (playlistStore.playlists().length > 0) {
                <div class="max-h-36 overflow-y-auto">
                  @for (playlist of playlistStore.playlists(); track playlist.id) {
                    <button
                      role="menuitem"
                      (click)="addToPlaylist(playlist.id)"
                      class="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span class="truncate">{{ playlist.name }}</span>
                      <span class="shrink-0 text-xs text-muted-foreground">
                        {{ playlist.tracks.length }}
                      </span>
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TrackRowComponent {
  readonly track = input.required<DeezerTrack>();
  readonly previewClicked = output<DeezerTrack>();

  readonly openUpward = input(false);

  protected readonly menuOpen = signal(false);
  protected readonly playerStore = inject(PlayerStore);
  protected readonly playlistStore = inject(PlaylistStore);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  playPreview(): void {
    this.previewClicked.emit(this.track());
    this.closeMenu();
  }

  addToQueue(): void {
    this.playerStore.addToQueue(this.track());
    this.closeMenu();
  }

  addToPlaylist(playlistId: string): void {
    this.playlistStore.addTrack(playlistId, {
      id: this.track().id,
      title: this.track().title,
      duration: this.track().duration,
      preview: this.track().preview,
      artistId: this.track().artist.id,
      artistName: this.track().artist.name,
      albumId: this.track().album.id,
      albumTitle: this.track().album.title,
      albumCover: this.track().album.cover_medium,
      addedAt: Date.now(),
    });
    this.closeMenu();
  }

  createAndAddToPlaylist(): void {
    const playlist = this.playlistStore.createPlaylist('New Playlist');
    this.addToPlaylist(playlist.id);
  }
}