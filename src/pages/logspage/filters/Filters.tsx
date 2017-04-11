export const TYPE_COMPOSITE: string = "Composite";

export interface Filter<T> {
    readonly type: string;
    readonly filter: (item: T) => boolean;
}

/**
 * Composite filter is an immutable object of Filters in which it will only return "true"
 * when all filters pass.
 *
 * It is designed with the assumption that there will only be one filter for each type.
 * This is not enforced in the constructor, but the other methods assume this so it is the user's
 * responsibility to ensure that it is true.
 */
export class CompositeFilter<T> implements Filter<T> {
    filters: Filter<T>[];
    type: string = TYPE_COMPOSITE;

    constructor(filters: Filter<T>[]) {
        this.filters = filters;
    }

    /**
     * creates a new CompositeFilter with the added filter.
     */
    copyAndAddOrReplace(filter: Filter<T>): CompositeFilter<T> {
        let copy = difference(this.filters.slice(), filter.type);
        copy.push(filter);
        return new CompositeFilter(copy);
    }

    /**
     * Creates a new CompositeFilter with the removed filter.
     */
    copyAndRemove(filterType: string): CompositeFilter<T> {
        let copy = difference(this.filters.slice(), filterType);
        return new CompositeFilter(copy);
    }

    getFilter(type: string): Filter<T> | undefined {
        for (let filterType of this.filters) {
            if (filterType.type === type) {
                return filterType;
            }
        }
        return undefined;
    }

    get filter(): (item: T) => boolean {
        let filters = this.filters;
        return function (item: T): boolean {
            for (let filter of filters) {
                if (!filter.filter(item)) {
                    return false;
                }
            }
            return true;
        };
    }
}

function difference(filters: Filter<any>[], filterType: string): Filter<any>[] {
    for (let i = 0; i < filters.length; ++i) {
        if (filters[i].type === filterType) {
            filters.splice(i, 1);
        }
    }
    return filters;
}
