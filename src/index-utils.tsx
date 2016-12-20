import { getLogs } from "./actions/log";
import { setCurrentSource } from "./actions/source";
import Source from "./models/source";
import source from "./services/source";

/**
 * There is a lot of imports and scripts in the top-level `index` file that makes is frustratingly hard
 * to unit test.  This file contains a set of methods that the `index` file can use which have been
 * separated out so they can be tested individually.
 */
export namespace IndexUtils {

    /**
     * This will return a promise which will retrieve the Sources from the store.  If there are
     * no stores from the Store, then it will attempt to retrieve them from the remote database.
     *
     * @param {Source[]} Collection of sources.  If they are empty, then the returning promise will retrieve
     *                      new sources from the web.
     */
    export function getAndSaveSources(root: Source[]): Promise<Source[]> {
        console.log("getAndSaveSources ");
        console.log(root);
        let realRoot = (root) ? root : [];
        return Promise.all(realRoot)
            .then(function (sources: Source[]) {
                if (sources && sources.length > 0) {
                    return sources;
                } else {
                    return source.getSourcesObj();
                }
            });
    }

    /**
     * Returns a promise that will search for a specific Source with the specified id.
     *
     * @param {Source[]} Collection of sources to filter through.
     * @param {string} SourceId to of the source to look for.
     */
    export function findSource(sources: Source[], sourceId: string): Promise<Source> {
        return getAndSaveSources(sources)
            .then(function (foundSources: Source[]) {
                let returnSource: Source;
                for (let source of foundSources) {
                    if (source.id === sourceId) {
                        returnSource = source;
                        break;
                    }
                }

                if (!returnSource) {
                    throw Error("Unable to find source with name.");
                }
                return returnSource;
            });
    }

    /**
     * Finds and stores all available sources than selects the one that has the selected sourceId.
     *
     * @param {Redux.Dispatch} The dispatch object ot send the new state.
     * @param {string} The source ID to search for.
     * @param {Source} The sources to search through. Can be undefined in which case they will be pulled form the server.
     */
    export function dispatchSelectedSourceSource(dispatch: Redux.Dispatch<any>,  sourceId: string, sources?: Source[]): Promise<Source> {
        return findSource(sources, sourceId)
                .then(function (source: Source) {
                    console.log("setting selected source " + source.name);
                    dispatch(getLogs(source));
                    dispatch(setCurrentSource(source));
                    return source;
                });
    }

    /**
     * Dispatches the current selected source as "undefined".
     */
    export function removeSelectedSource(dispatch: Redux.Dispatch<any>) {
        dispatch(setCurrentSource(undefined));
    };
}

export default IndexUtils;