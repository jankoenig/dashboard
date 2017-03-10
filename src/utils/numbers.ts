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

    /**
     * Converts a string to a hash code
     *
     * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
     * @param str String
     */
    export function hashCode(str: string): number {
        let hash = 0;
        if (this.length === 0) return hash;
        for (let i = 0; i < this.length; i++) {
            let char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}

export default Numbers;