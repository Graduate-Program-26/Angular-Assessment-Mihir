import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ArtistAlbumsResponse,
    ArtistPageData,
    ArtistTopTracksResponse,
    DeezerArtistDetail,
} from '../models/artist.model';

const DEEZER_API = 'https://api.deezer.com';
const TOP_TRACKS_LIMIT = 10;

@Injectable({ providedIn: 'root' })
export class ArtistService {
    private readonly http = inject(HttpClient);

    getArtistPageData(id: number): Observable<ArtistPageData> {
        return forkJoin({
            artist: this.http.jsonp<DeezerArtistDetail>(
                `${DEEZER_API}/artist/${id}?output=jsonp`,
                'callback'
            ),
            albums: this.http.jsonp<ArtistAlbumsResponse>(
                `${DEEZER_API}/artist/${id}/albums?output=jsonp`,
                'callback'
            ),
            topTracks: this.http.jsonp<ArtistTopTracksResponse>(
                `${DEEZER_API}/artist/${id}/top?limit=${TOP_TRACKS_LIMIT}&output=jsonp`,
                'callback'
            ),
        }).pipe(
            map(({ artist, albums, topTracks }) => ({
                artist,
                albums: albums.data,
                topTracks: topTracks.data,
            }))
        );
    }
}