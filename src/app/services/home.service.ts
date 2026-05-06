import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DeezerChart } from "../models/home.models";

const DEEZER_API = 'https://api.deezer.com';

@Injectable({ providedIn: 'root' })
export class HomeService {
    private readonly http = inject(HttpClient);

    getChart(): Observable<DeezerChart> {
        return this.http.jsonp<DeezerChart>(
            `${DEEZER_API}/chart?output=jsonp`,
            'callback'
        );
    }
}