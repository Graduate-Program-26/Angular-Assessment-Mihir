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
    currentTime: number;
    duration: number;
    queueOpen: boolean;
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
        currentTime: 0,
        duration: 0,
        queueOpen: false,
    })

    readonly playing = computed(() => this._state().playing);
    readonly progress = computed(() => this._state().progress);
    readonly volume = computed(() => this._state().volume);
    readonly duration = computed(() => this._state().duration);
    readonly currentTime = computed(() => this._state().currentTime);
    readonly queueOpen = computed(() => this._state().queueOpen);
    readonly queue = computed(() => this._state().queue);
    readonly queueIndex = computed(() => this._state().queueIndex);

    readonly currentTrack = computed(() => {
        const { queue, queueIndex } = this._state();
        return queue[queueIndex] ?? null;
    })

    readonly hasNext = computed(() => {
        const { queue, queueIndex } = this._state();
        return queueIndex < queue.length - 1;
    })

    readonly hasPrevious = computed(() => this._state().queueIndex > 0);

    readonly progressTime = computed(() => this.formatTime(this._state().currentTime));
    readonly durationTime = computed(() => this.formatTime(this._state().duration));

    constructor() {
        this.audio.volume = this._state().volume;

        this.audio.addEventListener('ended', () => {
            if (this.hasNext()) {
                this.skip();
            } else {
                this._state.update(s => ({ ...s, playing: false, progress: 0, currentTime: 0 }));
                this.stopProgressTracking();
            }
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this._state.update(s => ({ ...s, duration: this.audio.duration }));
        });

        this.audio.addEventListener('canplay', () => {
            if (this.audio.duration && !this._state().duration) {
                this._state.update(s => ({ ...s, duration: this.audio.duration }));
            }
        });
    }

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
            currentTime: 0,
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
        void this.audio.play();
        this._state.update(s => ({ ...s, playing: true }));
        this.startProgressTracking();
    }

    togglePlay(): void {
        if (this._state().playing) {
            this.pause();
        }
        else {
            this.resume();
        }
    }

    skip(): void {
        const { queueIndex } = this._state();
        if (!this.hasNext()) return;
        this.loadTrackAtIndex(queueIndex + 1);
    }

    setVolume(level: number): void {
        const clamped = Math.min(1, Math.max(0, level));
        this.audio.volume = clamped;
        this._state.update(s => ({ ...s, volume: clamped }));
    }

    previous(): void {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            this._state.update(s => ({ ...s, progress: 0, currentTime: 0 }));
            return;
        }
        const { queueIndex } = this._state();
        if (queueIndex <= 0) return;
        this.loadTrackAtIndex(queueIndex - 1);
    }

    seek(percent: number): void {
        if (!this.audio.duration) return;
        const time = (percent / 100) * this.audio.duration;
        this.audio.currentTime = time;
        this._state.update(s => ({ ...s, progress: percent, currentTime: time }));
    }

    addToQueue(track: PlayerTrack): void {
        const alreadyInQueue = this._state().queue.some(t => t.id === track.id);
        if (alreadyInQueue) return;
        this._state.update(s => ({ ...s, queue: [...s.queue, track] }));
    }

    removeFromQueue(index: number): void {
        const { queue, queueIndex } = this._state();
        if (index === queueIndex) return;
        const updated = queue.filter((_, i) => i !== index);
        const newIndex = index < queueIndex ? queueIndex - 1 : queueIndex;
        this._state.update(s => ({ ...s, queue: updated, queueIndex: newIndex }));
    }

    playFromQueue(index: number): void {
        this.loadTrackAtIndex(index);
    }

    toggleQueue(): void {
        this._state.update(s => ({ ...s, queueOpen: !s.queueOpen }));
    }

    closeQueue(): void {
        this._state.update(s => ({ ...s, queueOpen: false }));
    }

    clearQueue(): void {
        this.audio.pause();
        this.stopProgressTracking();
        this._state.update(s => ({
            ...s,
            queue: [],
            queueIndex: 0,
            playing: false,
            progress: 0,
            currentTime: 0,
            duration: 0,
        }));
    }

    private loadTrackAtIndex(index: number): void {
        const track = this._state().queue[index];
        if (!track) return;

        this._state.update(s => ({
            ...s,
            queueIndex: index,
            playing: true,
            progress: 0,
            currentTime: 0,
            duration: 0,
        }));

        this.audio.src = track.preview;
        this.audio.currentTime = 0;
        void this.audio.play();
        this.startProgressTracking();
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
