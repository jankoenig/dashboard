

namespace skill {

    export function getSkills(callback: (success: boolean) => void) {
        setTimeout(function() {
            callback(true);
        }, 320);
    }


}