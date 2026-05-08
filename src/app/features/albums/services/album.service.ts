import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DeezerAlbumDetail } from "../models/album.model";

@Injectable({ providedIn: 'root' })
export class AlbumService {
    private readonly http = inject(HttpClient);

    getAlbum(id: number): Observable<DeezerAlbumDetail> {
        return this.http.get<DeezerAlbumDetail>(
            `api/deezer/album/${id}?`,
        )
    }
}