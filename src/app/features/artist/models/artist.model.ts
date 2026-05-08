import { DeezerAlbum, DeezerTrack, DeezerSearchResponse } from "../../search/models/search.models";


export interface DeezerArtistDetail {
    id: number;
    name: string;
    link: string;
    share: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    nb_album: number;
    nb_fan: number;
    radio: boolean;
    tracklist: string;
    type: 'artist';
}

export interface ArtistPageData {
    artist: DeezerArtistDetail;
    albums: DeezerAlbum[];
    topTracks: DeezerTrack[];
}

export type ArtistAlbumsResponse = DeezerSearchResponse<DeezerAlbum>;
export type ArtistTopTracksResponse = DeezerSearchResponse<DeezerTrack>;