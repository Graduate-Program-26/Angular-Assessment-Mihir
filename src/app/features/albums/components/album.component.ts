import { Component, inject, OnInit, signal } from "@angular/core";
import { AlbumStore } from "../store/album.store";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DeezerAlbumTrack } from "../models/album.model";
import { DatePipe } from "@angular/common";
import { TrackDurationPipe } from "../../../shared/pipes/track-duration.pipe";
import { PlayerStore } from "../../../shared/stores/player.store";
import { PlaylistStore } from "../../playlists/store/playlist.store";
import {
    HlmBreadcrumb,
    HlmBreadcrumbList,
    HlmBreadcrumbItem,
    HlmBreadcrumbLink,
    HlmBreadcrumbSeparator,
    HlmBreadcrumbPage,
} from '@spartan-ng/helm/breadcrumb';

@Component({
    selector: 'app-album',
    standalone: true,
    templateUrl: './album.component.html',
    imports: [RouterLink, DatePipe, TrackDurationPipe, HlmBreadcrumb,
        HlmBreadcrumbList,
        HlmBreadcrumbItem,
        HlmBreadcrumbLink,
        HlmBreadcrumbSeparator,
        HlmBreadcrumbPage,],
})
export class AlbumComponent implements OnInit {
    protected readonly store = inject(AlbumStore);
    protected readonly route = inject(ActivatedRoute);
    protected readonly playerStore = inject(PlayerStore);
    protected readonly playlistStore = inject(PlaylistStore);
    protected readonly openMenuId = signal<number | null>(null);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.store.loadAlbum(id);
        }
    }

    onPreview(track: DeezerAlbumTrack): void {
        const queue = this.store.tracks();
        const index = queue.findIndex(t => t.id === track.id);
        this.playerStore.play(track, queue, index);
    }

    toggleMenu(trackId: number): void {
        this.openMenuId.update(id => (id === trackId ? null : trackId));
    }

    closeMenu(): void {
        this.openMenuId.set(null);
    }

    addToPlaylist(playlistId: string, track: DeezerAlbumTrack): void {
        this.playlistStore.addTrack(playlistId, {
            id: track.id,
            title: track.title,
            duration: track.duration,
            preview: track.preview,
            artistId: track.artist.id,
            artistName: track.artist.name,
            addedAt: Date.now(),
        });
    }

    createAndAdd(track: DeezerAlbumTrack): void {
        const playlist = this.playlistStore.createPlaylist('New Playlist');
        this.addToPlaylist(playlist.id, track);
    }
}