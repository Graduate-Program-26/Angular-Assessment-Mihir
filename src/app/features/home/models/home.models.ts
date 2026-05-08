import { DeezerTrack, DeezerAlbum, DeezerArtist } from "../../search/models/search.models";


export interface DeezerChart {
    tracks: { data: DeezerTrack[] };
    albums: { data: DeezerAlbum[] };
    artists: { data: DeezerArtist[] };
}

export interface HomeState {
    chart: DeezerChart | null;
    loading: boolean;
    error: string | null;
}

export interface RecentTrack {
    id: number;
    title: string;
    artistName: string;
    albumCover: string;
    preview: string;
    playedAt: number;
}

export interface RecentArtist {
    id: number;
    name: string;
    picture_medium: string;
    searchedAt: number;
}