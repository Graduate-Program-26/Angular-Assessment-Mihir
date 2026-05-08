import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { DeezerAlbum, DeezerArtist, DeezerSearchResponse, DeezerTrack, SearchResults } from "../models/search.models";

@Injectable({ providedIn: 'root' })
export class SearchService {
    private readonly http = inject(HttpClient);

    search(query: string): Observable<SearchResults> {
        const encoded = encodeURIComponent(query);

        return forkJoin({
            artists: this.http.get<DeezerSearchResponse<DeezerArtist>>(
                `/api/deezer/search/artist?q=${encoded}`,
            ),
            albums: this.http.get<DeezerSearchResponse<DeezerAlbum>>(
                `/api/deezer/search/album?q=${encoded}`,
            ),
            tracks: this.http.get<DeezerSearchResponse<DeezerTrack>>(
                `/api/deezer/search?q=${encoded}`,
            ),
        }).pipe(
            map(({ artists, albums, tracks }) => ({
                artists: artists.data,
                albums: albums.data,
                tracks: tracks.data,
            }))
        );
    }
}