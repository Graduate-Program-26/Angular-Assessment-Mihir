import { Component, inject, OnInit } from "@angular/core";
import { AlbumCardComponent } from "../search/albumcard.component";
import { TrackRowComponent } from "../search/trackrow.component";
import { ActivatedRoute } from "@angular/router";
import { DeezerTrack } from "../../models/search.models";
import { ArtistStore } from "../../store/artist.store";

@Component({
    selector: 'app-artist',
    imports: [AlbumCardComponent, TrackRowComponent],
    templateUrl: 'artist.component.html',
})
export class ArtistComponent implements OnInit {
    protected readonly store = inject(ArtistStore);
    private readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.store.loadArtist(id);
        }
    }

    onPreview(track: DeezerTrack): void {
        // TODO: wire to audio player store when built
        const audio = new Audio(track.preview);
        void audio.play();
    }
}