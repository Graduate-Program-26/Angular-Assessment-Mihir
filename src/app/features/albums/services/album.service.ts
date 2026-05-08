import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DeezerAlbumDetail } from "../models/album.model";

const DEEZER_API = 'https://api.deezer.com';

@Injectable({ providedIn: 'root' })
export class AlbumService {
    private readonly http = inject(HttpClient);

    getAlbum(id: number): Observable<DeezerAlbumDetail> {
        return this.http.jsonp<DeezerAlbumDetail>(
            `${DEEZER_API}/album/${id}?output=jsonp`,
            'callback'
        )
    }
}