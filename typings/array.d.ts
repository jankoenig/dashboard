declare namespace global {
  interface Array<T> {
      findIndex(callback: (value: T, index: number, array: T[]) => boolean): number;
  }
}
