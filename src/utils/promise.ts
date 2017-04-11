/**
 * A result returned from Filter.
 */
export interface FilterResult<T> {
    /**
     * The results of the filter.
     */
    readonly result: T[];
    /**
     * True if the items were filtered or false if it's the same items.
     */
    readonly changed: boolean;
}

/**
 * Promise that will filter out items in a list.  If the filter is undefined, then the original list is returned.
 * If there are no items found, then the promise will be rejected.
 *
 * @returns
 *      A FilterResult with the appropriate results.
 */
export function filter<T>(items: T[], filter: (item: T, index: number) => boolean): Promise<FilterResult<T>> {
    return new Promise<FilterResult<T>>((resolve, reject) => {
        let resolvedItems: T[] = [];
        let changed: boolean = false;
        if (filter) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (filter(item, i)) {
                    resolvedItems.push(item);
                } else {
                    changed = true;
                }
            }
        } else {
            resolvedItems = items;
        }

        resolve({
            result: resolvedItems,
            changed: changed
        });
    });
}