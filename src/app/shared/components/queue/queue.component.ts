import { Component, inject } from "@angular/core";
import { TrackDurationPipe } from "../../pipes/track-duration.pipe";
import { PlayerStore } from "../../stores/player.store";

@Component({
    selector: 'app-queue',
    standalone: true,
    imports: [TrackDurationPipe],
    templateUrl: './queue.component.html'
})
export class QueueComponent {
    protected readonly store = inject(PlayerStore);
}