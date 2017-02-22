import Source from "../models/Source";

export namespace SourceUtil {
    export function equals(s1: Source, s2: Source) {
        if (s1 === s2) {
            return true;
        }
        if (s1) {
            if (!s2) {
                return false;
            } else {
                return s1.id === s2.id;
            }
        } else {
            // s1 is undefined but s2 is not (or else the first check would have passed.)
            return false;
        }
    }
}

export default SourceUtil;