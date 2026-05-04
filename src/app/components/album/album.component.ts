import { Component, inject, OnInit } from "@angular/core";
import { AlbumStore } from "../../store/album.store";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DeezerAlbumTrack } from "../../models/album.model";
import { DatePipe } from "@angular/common";
import { TrackDurationPipe } from "../../pipes/track-duration.pipe";

@Component({
    selector: 'app-album',
    standalone: true,
    templateUrl: 'album.component.html',
    imports: [RouterLink, DatePipe, TrackDurationPipe],
})
export class AlbumComponent implements OnInit {
    protected readonly store = inject(AlbumStore);
    protected readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.store.loadAlbum(id);
        }
    }

    onPreview(track: DeezerAlbumTrack): void {
        const audio = new Audio(track.preview);
        void audio.play();
    }
}