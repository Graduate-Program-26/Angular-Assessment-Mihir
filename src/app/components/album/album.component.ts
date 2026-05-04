import { Component, inject, OnInit } from "@angular/core";
import { AlbumStore } from "../../store/album.store";
import { ActivatedRoute } from "@angular/router";
import { DeezerAlbumTrack } from "../../models/album.model";

@Component({
    selector: 'app-album',
    standalone: true,
    templateUrl: 'album.component.html',
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