import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DeezerChart } from "../models/home.models";

@Injectable({ providedIn: 'root' })
export class HomeService {
    private readonly http = inject(HttpClient);

    getChart(): Observable<DeezerChart> {
        return this.http.get<DeezerChart>(
            `/api/deezer/chart?`,
        );
    }
}