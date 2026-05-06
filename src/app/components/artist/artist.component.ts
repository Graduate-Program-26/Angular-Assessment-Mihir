import { Component, inject, OnInit } from "@angular/core";
import { AlbumCardComponent } from "../search/albumcard.component";
import { TrackRowComponent } from "../search/trackrow.component";
import { ActivatedRoute } from "@angular/router";
import { DeezerTrack } from "../../models/search.models";
import { ArtistStore } from "../../store/artist.store";
import { PlayerStore } from "../../store/player.store";
import { AddToPlaylistComponent } from "../playlists/add-to-playlist.component";

@Component({
    selector: 'app-artist',
    imports: [AlbumCardComponent, TrackRowComponent, AddToPlaylistComponent],
    templateUrl: 'artist.component.html',
})
export class ArtistComponent implements OnInit {
    protected readonly store = inject(ArtistStore);
    private readonly route = inject(ActivatedRoute);
    private readonly playerStore = inject(PlayerStore);

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