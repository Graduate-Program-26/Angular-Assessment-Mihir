import { Component, inject, Injectable } from "@angular/core";
import { PlayerStore } from "../../store/player.store";

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [],
    templateUrl: './audio-player.component.html'
})
export class AudioPlayerComponent {
    protected readonly store = inject(PlayerStore);
    private previousVolume = 1;

    onVolume(event: Event): void {
        const value = Number((event.target as HTMLInputElement).value);
        this.store.setVolume(value);
    }

    toggleMute(): void {
        if (this.store.volume() > 0) {
            this.previousVolume = this.store.volume();
            this.store.setVolume(0);
        }
        else {
            this.store.setVolume(this.previousVolume);
        }
    }

    onSeek(event: Event): void {
        const value = Number((event.target as HTMLInputElement).value);
        this.store.seek(value);
    }

    hasAlbumCover(track: object): boolean {
        return 'album' in track && track.album !== null && typeof track.album === 'object' && 'cover_small' in track.album;
    }

    getAlbumCover(track: object): string {
        if (this.hasAlbumCover(track)) {
            return (track as { album: { cover_small: string } }).album.cover_small;
        }
        return '';
    }
}