export function filter<T>(items: T[], filter: (item: T, index: number) => boolean): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
            console.info("YAY " + items.length);

            let resolvedItems: T[] = [];
            let index = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                console.info("Checking " + item);
                if (filter(item, index)) {
                    console.info("Filtered");
                    resolvedItems.push(item);
                } else {
                    console.info("Not filtered");
                }
                ++index;
            }

            if (resolvedItems.length > 0) {
                resolve(resolvedItems);
            } else {
                reject(Error("No items found in the collection."));
            }
        });
}