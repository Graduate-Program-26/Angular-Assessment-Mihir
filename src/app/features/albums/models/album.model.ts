import { DeezerArtist } from "../../search/models/search.models";

export interface DeezerGenre {
    id: number;
    name: string;
    picture: string;
    type: 'genre';
}

export interface DeezerAlbumTrack {
    id: number;
    readable: boolean;
    title: string;
    title_short: string;
    link: string;
    duration: number;
    track_position: number;
    disk_number: number;
    rank: number;
    preview: string;
    artist: Pick<DeezerArtist, 'id' | 'name' | 'picture_small'>;
    type: 'track';
}

export interface DeezerAlbumDetail {
    id: number;
    title: string;
    upc: string;
    link: string;
    share: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    label: string;
    nb_tracks: number;
    duration: number;
    release_date: string;
    record_type: string;
    genres: { data: DeezerGenre[] };
    artist: Pick<DeezerArtist, 'id' | 'name' | 'picture_small'>;
    tracks: { data: DeezerAlbumTrack[] };
    type: 'album';
}