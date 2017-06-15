export interface Query {
    id?: string | undefined;
    key?: string | undefined;
}

export interface Location {
    query: Query;
    pathname?: string;
}
