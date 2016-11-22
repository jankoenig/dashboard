export namespace String {

    /**
     * Converts a string to camelCase
     *
     * From: http://stackoverflow.com/a/2970667/1349766
     *
     * @export
     * @param {string} str
     * @returns {string}
     */
    export function stringToCamelCase(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }


    /**
     * Converts a string to a slug for use in a URL path.
     *
     * From: http://stackoverflow.com/a/5782563/1349766
     *
     * @export
     * @param {string} str
     * @returns {string} A slug fit for a path
     */
    export function stringToSlug(str: string): string {

        str = str.replace(/^\s+|\s+$/g, ""); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        let from = "ãàáäâẽèéëêìíïîõòóöôùúüûñçß·/_,:;";
        let to   = "aaaaaeeeeeiiiiooooouuuuncs------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
            .replace(/\s+/g, "-") // collapse whitespace and replace by -
            .replace(/-+/g, "-"); // collapse dashes

        return str;
    }

    /**
     * Generates a random string of characters both upper and lowercase with numbers.
     *
     * @param {number} size Length of the string.  Can not be null.
     * @param {string} charset Optionally a subset of characters to pull from.
     */
    export function randomString(size: number): string {
        if (size < 0) {
            throw Error("Random string can not have a negative length.");
        }
        let useChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let full: string = "";
        for (let i = 0; i < size; ++i) {
            full += useChars.charAt(Math.floor(Math.random() * useChars.length));
        }
        return full;
    }
}

export default String;