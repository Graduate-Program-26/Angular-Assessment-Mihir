export interface PlaylistTrack {
    id: number;
    title: string;
    duration: number;
    preview: string;
    artistId: number;
    albumId?: number;
    albumTitle?: string;
    albumCover?: string;
    addedAt: number;
}

export interface Playlist {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    tracks: PlaylistTrack[];
}

export interface PlaylistState {
    playlists: Playlist[];
    activePlaylistId: string | null;
    loading: boolean;
    error: string | null;
}