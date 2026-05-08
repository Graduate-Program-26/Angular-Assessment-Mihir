import { Injectable } from "@angular/core";
import { Playlist } from "../features/playlists/models/playlist.model";

const DB_NAME = 'music';
const DB_VERSION = 1;
const STORE_NAME = 'playlists';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        this.db = await this.openDb();
    }

    async getAll(): Promise<Playlist[]> {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).getAll();
            req.onsuccess = () => resolve(req.result as Playlist[]);
            req.onerror = () => reject(req.error);
        })
    }

    async save(playlist: Playlist): Promise<void> {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).put(playlist);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async delete(id: string): Promise<void> {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        })
    }

    private async getDb(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        this.db = await this.openDb();
        return this.db;
    }

    private openDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
}
