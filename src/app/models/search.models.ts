export interface DeezerSearchResponse<T> {
    data: T[];
    total: number;
    next?: string;
}

export interface DeezerArtist {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    nb_album: number;
    nb_fan: number;
    tracklist: string;
    type: 'artist';
}

export interface DeezerAlbum {
    id: number;
    title: string;
    link: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    release_date: string;
    tracklist: string;
    artist: Pick<DeezerArtist, 'id' | 'name' | 'picture_small'>;
    type: 'album';
}

export interface DeezerTrack {
    id: number;
    title: string;
    link: string;
    duration: number;
    rank: number;
    preview: string;
    artist: Pick<DeezerArtist, 'id' | 'name' | 'picture_small'>;
    album: Pick<DeezerAlbum, 'id' | 'title' | 'cover_small'>;
    type: 'track';
}

export interface SearchResults {
    artists: DeezerArtist[];
    albums: DeezerAlbum[];
    tracks: DeezerTrack[];
}

export type SearchTab = 'artists' | 'albums' | 'tracks';