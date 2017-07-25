export interface Query {
    id?: string | undefined;
    key?: string | undefined;
    transactions_before?: number;
    transactions_after?: number;
}

export interface Location {
    query: Query;
    pathname?: string;
}
