import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlaylistStore } from '../../store/playlist.store';
import { PlayerStore } from '../../store/player.store';
import { TrackDurationPipe } from '../../pipes/track-duration.pipe';
import { PlaylistTrack } from '../../models/playlist.model';
import { HlmBreadcrumb, HlmBreadcrumbList, HlmBreadcrumbItem, HlmBreadcrumbLink, HlmBreadcrumbSeparator, HlmBreadcrumbPage } from '@spartan-ng/helm/breadcrumb';


@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [RouterLink, TrackDurationPipe, HlmBreadcrumb,
    HlmBreadcrumbList,
    HlmBreadcrumbItem,
    HlmBreadcrumbLink,
    HlmBreadcrumbSeparator,
    HlmBreadcrumbPage,],
  template: `
    <main aria-label="Playlist detail" class="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <nav class="mb-6" aria-label="Breadcrumb" hlmBreadcrumb>
        <ol hlmBreadcrumbList>

          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink link="/">Home</a>
          </li>

          <li hlmBreadcrumbSeparator></li>

          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink link="/playlists">Playlists</a>
          </li>

          <li hlmBreadcrumbSeparator></li>

          <li hlmBreadcrumbItem>
            <span hlmBreadcrumbPage>
              {{ playlist()?.name ?? 'Playlist' }}
            </span>
          </li>

        </ol>
  </nav>
      @if (store.loading()) {
        <div role="status" aria-label="Loading playlist" class="animate-pulse space-y-4">
          <div class="bg-muted h-8 w-48 rounded"></div>
          <div class="bg-muted h-4 w-24 rounded"></div>
        </div>

      } @else if (!playlist()) {
        <div role="alert" class="flex flex-col items-center gap-3 py-24 text-center">
          <p class="text-destructive text-sm">Playlist not found.</p>
          <a routerLink="/playlists" class="text-muted-foreground text-xs underline hover:text-foreground">
            Back to playlists
          </a>
        </div>

      } @else {
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        
          <!-- Cover -->
          <div class="h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border">
            @if (covers().length > 0) {
              <div class="grid h-full w-full" [class]="covers().length > 1 ? 'grid-cols-2' : 'grid-cols-1'">
                @for (cover of covers(); track cover) {
                  <img [src]="cover" alt="" class="h-full w-full object-cover" aria-hidden="true" />
                }
              </div>
            } @else {
              <div class="flex h-full w-full items-center justify-center">
                <svg aria-hidden="true" class="h-10 w-10 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
            }
          </div>

          <!-- Meta -->
          <div class="space-y-2">
            <p class="text-muted-foreground text-xs uppercase tracking-widest">Playlist</p>

            @if (renaming()) {
              <input
                #renameInput
                [value]="playlist()!.name"
                (keydown.enter)="submitRename(renameInput.value)"
                (keydown.escape)="renaming.set(false)"
                (blur)="submitRename(renameInput.value)"
                class="rounded border border-border bg-background px-2 py-1 text-2xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Rename playlist"
               
              />
            } @else {
              <h1
                class="text-2xl font-bold leading-tight md:text-3xl cursor-pointer hover:underline"
                tabindex="0"
                role="button"
                (click)="renaming.set(true)"
                (keydown.enter)="renaming.set(true)"
                (keydown.space)="renaming.set(true)"
                title="Click to rename"
              >
              {{ playlist()!.name }}
            </h1>
            }

            <div class="text-muted-foreground flex items-center gap-2 text-sm">
              <span>{{ store.activePlaylistTrackCount() }} tracks</span>
              <span aria-hidden="true">·</span>
              <span>{{ store.activePlaylistDuration() }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 pt-1">
              @if (playlist()!.tracks.length > 0) {
                <button
                  (click)="playAll()"
                  class="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play all
                </button>
              }
              <button
                (click)="confirmDelete()"
                class="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-destructive hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Delete playlist
              </button>
            </div>
          </div>
        </div>

        <!-- Tracklist -->
        @if (playlist()!.tracks.length === 0) {
          <div class="flex flex-col items-center gap-3 py-16 text-center">
            <p class="text-muted-foreground text-sm">No tracks yet — add some from search or artist pages.</p>
          </div>
        } @else {
          <div role="grid" aria-label="Playlist tracks" class="flex flex-col">

            <!-- Header -->
            <div role="row" aria-hidden="true"
              class="text-muted-foreground mb-2 grid grid-cols-[2rem_1fr_auto_2rem] gap-4 border-b border-border px-3 pb-2 text-xs uppercase tracking-wider">
              <span>#</span>
              <span>Title</span>
              <span>Duration</span>
              <span></span>
            </div>

            @for (track of playlist()!.tracks; track track.id; let i = $index) {
              <div
                role="row"
                class="group grid grid-cols-[2rem_1fr_auto_2rem] items-center gap-4 rounded-lg px-3 py-2 transition hover:bg-muted"
                [attr.aria-label]="track.title + ', track ' + (i + 1)"
              >
                <!-- Index / play -->
                <div class="relative flex items-center justify-center">
                  <span class="text-muted-foreground tabular-nums text-sm transition"
                    [class.opacity-0]="!!track.preview"
                    aria-hidden="true">
                    {{ $index + 1 }}
                  </span>
                  @if (track.preview) {
                    <button
                      class="absolute inset-0 flex items-center justify-center text-foreground opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                      [attr.aria-label]="'Play ' + track.title"
                      (click)="playTrack(track, i)"
                    >
                      <svg aria-hidden="true" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  }
                </div>

                <!-- Title + artist -->
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium">{{ track.title }}</p>
                  <a
                    [routerLink]="['/artist', track.artistId]"
                    class="text-muted-foreground truncate text-xs hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {{ track.artistName }}
                  </a>
                </div>

                <!-- Duration -->
                <span class="text-muted-foreground text-xs tabular-nums">
                  {{ track.duration | trackDuration }}
                </span>

                <!-- Remove -->
                <button
                  (click)="removeTrack(track.id)"
                  [attr.aria-label]="'Remove ' + track.title + ' from playlist'"
                  class="rounded-full p-1 text-muted-foreground transition hover:text-destructive
                         opacity-100 md:opacity-0 md:group-hover:opacity-100
                         focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg aria-hidden="true" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            }
          </div>
        }
      }
    </main>
  `,
})
export class PlaylistDetailComponent implements OnInit {
  protected readonly store = inject(PlaylistStore);
  private readonly playerStore = inject(PlayerStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly renaming = signal(false);
  protected readonly playlist = this.store.activePlaylist;

  protected readonly covers = (): string[] => {
    const p = this.playlist();
    if (!p) return [];
    return p.tracks
      .filter(t => t.albumCover)
      .slice(0, 4)
      .map(t => t.albumCover!);
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.store.setActivePlaylist(id);
  }

  submitRename(name: string): void {
    const id = this.playlist()?.id;
    if (id) this.store.renamePlaylist(id, name);
    this.renaming.set(false);
  }

  removeTrack(trackId: number): void {
    const id = this.playlist()?.id;
    if (id) this.store.removeTrack(id, trackId);
  }

  playAll(): void {
    const tracks = this.playlist()?.tracks ?? [];
    if (tracks.length === 0) return;
    const playerTracks = tracks.map(t => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      preview: t.preview,
      artist: { id: t.artistId, name: t.artistName, picture_small: '' },
      album: { id: t.albumId ?? 0, title: t.albumTitle ?? '', cover_medium: t.albumCover ?? '' },
      link: '',
      rank: 0,
      type: 'track' as const,
    }));
    this.playerStore.play(playerTracks[0], playerTracks, 0);
  }

  playTrack(track: PlaylistTrack, index: number): void {
    const tracks = this.playlist()?.tracks ?? [];
    const playerTracks = tracks.map(t => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      preview: t.preview,
      artist: { id: t.artistId, name: t.artistName, picture_small: '' },
      album: { id: t.albumId ?? 0, title: t.albumTitle ?? '', cover_medium: t.albumCover ?? '' },
      link: '',
      rank: 0,
      type: 'track' as const,
    }));
    this.playerStore.play(playerTracks[index], playerTracks, index);
  }

  confirmDelete(): void {
    const name = this.playlist()?.name;
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    this.store.deletePlaylist(this.playlist()!.id);
    void this.router.navigate(['/playlists']);
  }
}