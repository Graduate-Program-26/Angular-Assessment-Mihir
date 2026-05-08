import { Component, effect, inject, OnInit } from "@angular/core";
import { AlbumCardComponent } from "../../../components/search/albumcard.component";
import { TrackRowComponent } from "../../../components/search/trackrow.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DeezerTrack } from "../../../models/search.models";
import { ArtistStore } from "../store/artist.store";
import { PlayerStore } from "../../../store/player.store";
import { AddToPlaylistComponent } from "../../../components/playlists/add-to-playlist.component";
import { RecentStore } from "../../../store/recent.store";
import {
    HlmBreadcrumb,
    HlmBreadcrumbList,
    HlmBreadcrumbItem,
    HlmBreadcrumbLink,
    HlmBreadcrumbSeparator,
    HlmBreadcrumbPage,
} from '@spartan-ng/helm/breadcrumb';


@Component({
    selector: 'app-artist',
    standalone: true,
    imports: [AlbumCardComponent, TrackRowComponent, AddToPlaylistComponent, HlmBreadcrumb,
        HlmBreadcrumbList,
        HlmBreadcrumbItem,
        HlmBreadcrumbLink,
        HlmBreadcrumbSeparator,
        HlmBreadcrumbPage, RouterLink],
    templateUrl: 'artist.component.html',
})
export class ArtistComponent implements OnInit {
    protected readonly store = inject(ArtistStore);
    private readonly route = inject(ActivatedRoute);
    private readonly playerStore = inject(PlayerStore);
    private readonly recentStore = inject(RecentStore);

    constructor() {
        effect(() => {
            const artist = this.store.artist();
            if (artist) this.recentStore.trackArtistView(artist);
        });
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.store.loadArtist(id);
        }
    }

    onPreview(track: DeezerTrack): void {
        const queue = this.store.topTracks();
        const index = queue.findIndex(t => t.id === track.id);
        this.playerStore.play(track, queue, index);
    }
}