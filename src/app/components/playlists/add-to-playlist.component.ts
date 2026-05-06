import { Component, inject, input, output, signal } from '@angular/core';
import { PlaylistStore } from '../../store/playlist.store';
import { PlaylistTrack } from '../../models/playlist.model';
import { PlayerTrack } from '../../store/player.store';
import { DeezerTrack } from '../../models/search.models';

function toPlaylistTrack(track: PlayerTrack): PlaylistTrack {
    const base = {
        id: track.id,
        title: track.title,
        duration: track.duration,
        preview: track.preview,
        artistId: track.artist.id,
        artistName: track.artist.name,
        addedAt: Date.now(),
    };

    if ('album' in track && track.album && 'cover_medium' in track.album) {
        const t = track as DeezerTrack;
        return {
            ...base,
            albumId: t.album.id,
            albumTitle: t.album.title,
            albumCover: t.album.cover_medium,
        };
    }

    return base;
}

@Component({
    selector: 'app-add-to-playlist',
    standalone: true,
    template: `
    <div class="relative">

      <!-- Trigger button -->
      <button
        (click)="toggleOpen()"
        [attr.aria-label]="'Add ' + track().title + ' to playlist'"
        [attr.aria-expanded]="open()"
        class="rounded-full p-1.5 text-muted-foreground transition hover:text-foreground
               opacity-100 md:opacity-0 md:group-hover:opacity-100
               focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg aria-hidden="true" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      </button>

      <!-- Popover -->
      @if (open()) {
        <!-- Backdrop -->
        <div
          class="fixed inset-0 z-40"
          aria-hidden="true"
          (click)="close()"
        ></div>

        <div
          role="dialog"
          aria-label="Add to playlist"
          class="absolute right-0 z-50 mt-1 w-52 rounded-xl border border-border bg-background shadow-xl"
          [class.bottom-full]="openUpward()"
          [class.top-full]="!openUpward()"
        >
          <div class="p-2">
            <p class="text-muted-foreground px-2 py-1 text-xs font-medium uppercase tracking-wider">
              Add to playlist
            </p>

            <!-- Create new -->
            <button
              (click)="createAndAdd()"
              class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg aria-hidden="true" class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke-linecap="round" />
              </svg>
              New playlist
            </button>

            @if (playlistStore.playlists().length > 0) {
              <div class="my-1 border-t border-border"></div>
              <div class="max-h-40 overflow-y-auto">
                @for (playlist of playlistStore.playlists(); track playlist.id) {
                  <button
                    (click)="addToPlaylist(playlist.id)"
                    class="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span class="truncate">{{ playlist.name }}</span>
                    <span class="text-muted-foreground shrink-0 text-xs">
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
  `,
})
export class AddToPlaylistComponent {
    readonly track = input.required<PlayerTrack>();
    readonly openUpward = input(false);

    readonly added = output<string>(); // emits playlist id

    protected readonly playlistStore = inject(PlaylistStore);
    protected readonly open = signal(false);

    toggleOpen(): void {
        this.open.update(v => !v);
    }

    close(): void {
        this.open.set(false);
    }

    addToPlaylist(playlistId: string): void {
        this.playlistStore.addTrack(playlistId, toPlaylistTrack(this.track()));
        this.added.emit(playlistId);
        this.close();
    }

    createAndAdd(): void {
        const playlist = this.playlistStore.createPlaylist('New Playlist');
        this.playlistStore.addTrack(playlist.id, toPlaylistTrack(this.track()));
        this.added.emit(playlist.id);
        this.close();
    }
}