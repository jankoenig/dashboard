{
    // TODO: Minify when done developing
    'use strict';

    window.addEventListener('load', function() {
        // getmdlSelect.init('.getmdl-select');

        // Configuring observer to listen for additions and subtractions in entire tree.
        // We want to know when a ".getmdl-select" node has been added/remove so we can set/unset the event listeners.
        var config = { childList: true, subtree: true }

        // Observer instance will listen for adding the selector class.
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var dropdowns = mutation.target.querySelectorAll(".getmdl-select");
                if (dropdowns.length > 0) {
                    componentHandler.upgradeDom();
                }
            });
        });

        // pass in the target node, as well as the observer options
        observer.observe(document, config);
    });
}