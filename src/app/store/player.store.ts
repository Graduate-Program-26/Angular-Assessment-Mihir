import { computed, Injectable, OnDestroy, signal } from "@angular/core";
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
export class PlayerStore implements OnDestroy {
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

    play(track: PlayerTrack, queue: PlayerTrack[] = [], queueIndex = 0): void {
        const resolvedQueue = queue.length > 0 ? queue : [track];
        const resolvedIndex = queue.length > 0 ? queueIndex : 0;

        this._state.update(s => ({
            ...s,
            queue: resolvedQueue,
            queueIndex: resolvedIndex,
            playing: true,
            progress: 0,
            duration: 0,
        }));

        this.audio.src = track.preview;
        this.audio.currentTime = 0;
        void this.audio.play();
        this.startProgressTracking();
    }

    pause(): void {
        this.audio.pause();
        this._state.update(s => ({ ...s, playing: false }));
        this.stopProgressTracking();
    }

    resume(): void {
        this.audio.play();
        this._state.update(s => ({ ...s, playing: true }));
        this.startProgressTracking;
    }

    togglePlay(): void {
        if (this._state().playing) {
            this.pause();
        }
        else {
            this.resume();
        }
    }

    private startProgressTracking(): void {
        this.stopProgressTracking();
        this.progressInterval = setInterval(() => {
            if (!this.audio.duration) return;
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this._state.update(s => ({ ...s, progress }));
        }, 500);
    }

    private stopProgressTracking(): void {
        if (this.progressInterval !== null) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    ngOnDestroy(): void {
        this.stopProgressTracking();
        this.audio.pause();
        this.audio.src = '';
    }
}
