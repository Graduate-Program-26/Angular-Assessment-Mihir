import { Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { RecentTrack } from "../../models/home.models";
import { DeezerTrack } from "../../models/search.models";
import { AuthStore } from "../../store/auth.store";
import { HomeStore } from "../../store/home.store";
import { PlayerStore } from "../../store/player.store";
import { RecentStore } from "../../store/recent.store";
import { AlbumCardComponent } from "../search/albumcard.component";
import { HorizontalScrollRowComponent } from "./horizontal-scroll-row.component";
import { DecimalPipe } from "@angular/common";

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
        this.playerStore.play({
            id: track.id,
            title: track.title,
            duration: 30,
            preview: track.preview,
            artist: { id: 0, name: track.artistName, picture_small: '' },
            album: { id: 0, title: '', cover_medium: track.albumCover },
            link: '',
            rank: 0,
            type: 'track',
        });
    }
}