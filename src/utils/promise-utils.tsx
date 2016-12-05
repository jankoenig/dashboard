/**
 * Promise that will filter out items in a list.  If the filter is undefined, then the original list is returned.
 * If there are no items found, then the promise will be rejected.
 */
export function filter<T>(items: T[], filter: (item: T, index: number) => boolean): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
            let resolvedItems: T[] = [];
            if (filter) {
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (filter(item, i)) {
                        resolvedItems.push(item);
                    }
                }
            } else {
                resolvedItems = items;
            }

            if (resolvedItems.length > 0) {
                resolve(resolvedItems);
            } else {
                reject(Error("No items found in the collection."));
            }
        });
}