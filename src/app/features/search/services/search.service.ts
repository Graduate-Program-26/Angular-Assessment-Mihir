import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { DeezerAlbum, DeezerArtist, DeezerSearchResponse, DeezerTrack, SearchResults } from "../models/search.models";

const DEEZER_API = 'https://api.deezer.com';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private readonly http = inject(HttpClient);

    search(query: string): Observable<SearchResults> {
        const encoded = encodeURIComponent(query);

        return forkJoin({
            artists: this.http.jsonp<DeezerSearchResponse<DeezerArtist>>(
                `${DEEZER_API}/search/artist?q=${encoded}&output=jsonp`,
                'callback'
            ),
            albums: this.http.jsonp<DeezerSearchResponse<DeezerAlbum>>(
                `${DEEZER_API}/search/album?q=${encoded}&output=jsonp`,
                'callback'
            ),
            tracks: this.http.jsonp<DeezerSearchResponse<DeezerTrack>>(
                `${DEEZER_API}/search?q=${encoded}&output=jsonp`,
                'callback'
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