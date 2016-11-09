export namespace Numbers {

    /**
     * Return the minimum of the provided parameters
     *
     * Source: http://stackoverflow.com/a/1664186/1349766
     *
     * @export
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @returns
     */
    export function min(a: number, b: number, c: number) {
        return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
    }

    /**
     * Return the maximum of the provided parameters
     *
     * Source: http://stackoverflow.com/a/1664186/1349766
     *
     * @export
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @returns
     */
    export function max(a: number, b: number, c: number) {
        return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
    }

    /**
     * Similar to Math.round(), rounds a given number to the given
     * decimal precision.
     *
     * Source: http://stackoverflow.com/a/7343013/1349766
     *
     * @export
     * @param {number} value
     * @param {number} precision
     * @returns
     */
    export function round(value: number, precision: number) {
        let multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}

export default Numbers;