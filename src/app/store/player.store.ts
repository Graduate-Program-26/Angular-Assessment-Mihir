import { computed, Injectable, signal } from "@angular/core";
import { DeezerTrack } from "../models/search.models";
import { DeezerAlbumTrack } from "../models/album.model";

export type PlayerTrack = DeezerTrack | DeezerAlbumTrack;

interface PlayerState {
    queue: PlayerTrack[];
    queueIndex: number;
    playing: boolean;
    progress: number;
    volume: number;
    duration: number;
}

@Injectable({ providedIn: 'root' })
export class PlayerStore {
    private readonly audio = new Audio();
    private progressInterval: ReturnType<typeof setInterval> | null = null;

    private readonly _state = signal<PlayerState>({
        queue: [],
        queueIndex: 0,
        playing: false,
        progress: 0,
        volume: 1,
        duration: 0,
    })

    readonly playing = computed(() => this._state().playing);
    readonly progress = computed(() => this._state().progress);
    readonly volume = computed(() => this._state().volume);
    readonly duration = computed(() => this._state().duration);

    readonly currentTrack = computed(() => {
        const { queue, queueIndex } = this._state();
        return queue[queueIndex] ?? null;
    })

    readonly hasNext = computed(() => {
        const { queue, queueIndex } = this._state();
        return queueIndex < queue.length - 1;
    })

    readonly hasPrevious = computed(() => this._state().queueIndex > 0);

    readonly progressTime = computed(() => {
        const elapsed = Math.floor((this._state().progress / 100) * this._state().duration);
        return this.formatTime(elapsed);
    })

    readonly durationTime = computed(() => this.formatTime(this._state().duration));

    private formatTime(seconds: number): string {
        const s = Math.floor(seconds);
        const m = Math.floor(s / 60);
        const rem = s % 60;
        return `${m}:${rem.toString().padStart(2, '0')}`;
    }
}