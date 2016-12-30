
export namespace Browser {
    export interface WrappedEvent {
        register(): void;
        unregister(): void;
    }

    /**
     * Check if the browser is mobile or not
     * From: http://stackoverflow.com/a/11381730/1349766
     *
     * @returns {boolean}
     */
    export function isMobileOrTablet(): boolean {
        return isMobileOrTabletImpl(navigator.userAgent, navigator.vendor);
    }

    export function isMobileOrTabletImpl(userAgent: string, vendor: string): boolean {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(userAgent || vendor);
        return check;
    }

    /**
     * The threshold where greater than or equal is not mobile, everything less than is considered mobile.
     */
    export const mobileWidthThreshold = 480;

    /**
     * Determine if the current window inner width is less than the mobile width threshold.
     *
     * @export
     * @param {Window} [_window] Optional window paramter, only used when unit testing
     * @returns {boolean} True if the
     */
    export function isMobileWidth(_window?: Window): boolean {
        // if a window is passed in, use that otherwise set it to the global window object
        _window = _window ? _window : window;

        let isMobileWidth = false;

        if (_window.innerWidth < mobileWidthThreshold) {
            isMobileWidth = true;
        }

        return isMobileWidth;
    }

    /**
     * Register a callback to listen for browser resize events.
     *
     * @export
     * @param {(event: UIEvent) => void} callback
     * @param {Window} [_window]
     *
     * @return A wrapped event in which you can register it or unregister it when the time comes.
    * */
    export function onResize(callback: (event: UIEvent) => void, _window?: Window): WrappedEvent {
        return onEvent("resize", callback);
    }

    export function onScroll(callback: (event: UIEvent) => void, _window?: Window): WrappedEvent {
        return onEvent("scroll", callback);
    }

    export function onEvent(event: "resize" | "scroll", callback: (event: UIEvent) => void, _window?: Window): WrappedEvent {
        return {
            register() {
                _window = _window ? _window : window;
                _window.addEventListener(event, callback);
            },

            unregister() {
                _window = _window ? _window : window;
                _window.removeEventListener(event, callback);
            }
        };
    }

    export function onMutation(node: Node, callback: MutationCallback, _window?: Window): MutationObserver {
        let observer = new MutationObserver(callback);
        observer.observe(node, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
        return observer;
    }

    /**
     * Get the current size of the browser window.
     *
     * Returns window.innerWidth and window.innerHeight.
     *
     * @export
     * @param {Window} [_window] Optional window object, only used when testing.
     * @returns {{ width: number, height: number }}
     */
    export function size(_window?: Window): { width: number, height: number } {
        _window = _window ? _window : window;
        return { width: _window.innerWidth, height: _window.innerHeight };
    }
}

export default Browser;