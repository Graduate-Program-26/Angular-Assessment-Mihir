import { Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RecentTrack } from "../models/home.models";
import { DeezerTrack } from "../../search/models/search.models";
import { AuthStore } from "../../../core/store/auth.store";
import { HomeStore } from "../store/home.store";
import { PlayerStore } from "../../../shared/stores/player.store";
import { RecentStore } from "../../../shared/stores/recent.store";
import { AlbumCardComponent } from "../../search/components/albumcard.component";
import { HorizontalScrollRowComponent } from "./horizontal-scroll-row.component";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        HorizontalScrollRowComponent,
        AlbumCardComponent,
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    private readonly http = inject(HttpClient);

    protected readonly homeStore = inject(HomeStore);
    protected readonly recentStore = inject(RecentStore);
    protected readonly playerStore = inject(PlayerStore);
    protected readonly authStore = inject(AuthStore);

    ngOnInit(): void {
        this.homeStore.load();
    }

    greeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    playChartTrack(track: DeezerTrack): void {
        const queue = this.homeStore.topTracks();
        const index = queue.findIndex(t => t.id === track.id);
        this.playerStore.play(track, queue, index);
    }

    playRecentTrack(track: RecentTrack): void {
        const audio = new Audio(track.preview);

        audio.addEventListener('error', () => {
            this.fetchAndPlayRecent(track);
        }, { once: true });

        audio.addEventListener('canplay', () => {
            this.playerStore.play({
                id: track.id,
                title: track.title,
                duration: 30,
                preview: track.preview,
                artist: { id: 0, name: track.artistName, picture_small: '' },
                album: { id: 0, title: '', cover_small: track.albumCover, cover_medium: track.albumCover },
                link: '',
                rank: 0,
                type: 'track',
            });
        }, { once: true });
    }

    private fetchAndPlayRecent(track: RecentTrack): void {
        const query = encodeURIComponent(track.title + ' ' + track.artistName);
        this.http.get<{ data: DeezerTrack[] }>(
            `/api/deezer/search?q=${query}`
        ).subscribe(results => {
            const match = results.data.find(t => t.id === track.id) ?? results.data[0];
            if (!match?.preview) return;

            this.recentStore.updatePreview(track.id, match.preview);

            this.playerStore.play({
                id: match.id,
                title: match.title,
                duration: match.duration,
                preview: match.preview,
                artist: match.artist,
                album: match.album,
                link: match.link,
                rank: match.rank,
                type: 'track',
            });
        });
    }
}