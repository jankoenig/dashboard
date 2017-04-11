// tslint:disable:no-null-keyword
// tslint:disable:readonly-interface
// tslint:disable:readonly-indexer
// localStorage from the browser returns "null" for all it's stuff rather than "undefined".
/**
 * An interface for the standard localStorage that can be mocked or implemented in different varieties.
 */
export interface LocalStorage {
    readonly length: number;
    clear(): void;
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    key(index: number): string | null;
    removeItem(key: string): void;
}

/**
 * A browser localStorage wrapper that works in most modern browsers.  The memory saved in this object are
 * persistable among browser sessions.
 */
export class BrowserStorage implements LocalStorage {
    get length(): number {
        return localStorage.length;
    }

    clear() {
        localStorage.clear();
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    key(index: number): string | null {
        return localStorage.key(index);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}

/**
 * A memory cache storage that only saves the items in the cache. This can be useful for mocking unit tests that
 * don't want memory saved to the browser or if LocalStorage is unavailable.
 */
export class MemoryCacheStorage implements LocalStorage {
    [key: string]: any;
    [index: number]: string;

    get length() {
        return Object.keys(this).length;
    }

    clear() {
        let keys = Object.keys(this);
        for (let key of keys) {
            this.removeItem(key);
        }
    }

    setItem(key: string, value: string): void {
        this[key] = value;
    }

    getItem(key: string): string | null {
        let obj: any = this[key];
        return (obj) ? obj : null;
    }

    key(index: number): string | null {
        return index < this.length ? this[Object.keys(this)[index]] : null;
    }

    removeItem(key: string): void {
        delete this[key];
    }
}
// tslint:enable:no-null-keyword
// tslint:enable:readonly-interface
// tslint:disable:readonly-indexer