/**
 * A NoOperation function that does nothing.  It's better to have this exist and pass it around
 * than to create a new one throughout the entire life of the program.  Just import it and go.
 */
export default function noOp() {

}

/**
 * A Nooperation function that does nothing and return false.
 */
export function falseBoolNoop() {
    return false;
}