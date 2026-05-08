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

const TOP_TRACKS_LIMIT = 10;

@Injectable({ providedIn: 'root' })
export class ArtistService {
    private readonly http = inject(HttpClient);

    getArtistPageData(id: number): Observable<ArtistPageData> {
        return forkJoin({
            artist: this.http.get<DeezerArtistDetail>(
                `/api/deezer/artist/${id}?`,
            ),
            albums: this.http.get<ArtistAlbumsResponse>(
                `/api/deezer/artist/${id}/albums?`,
            ),
            topTracks: this.http.get<ArtistTopTracksResponse>(
                `/api/deezer/artist/${id}/top?limit=${TOP_TRACKS_LIMIT}`,
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