{
    // TODO: Minify when done developing
    'use strict';


    /**
     * Pollyfill for CustomEvent to work on InternetExplorer.
     * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
     */
    (function() {
        if (typeof window.CustomEvent === "function") return false;

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();

    window.addEventListener('load', function() {
        getmdlSelect.init('.getmdl-select');

        // Configuring observer to listen for additions and subtractions in entire tree.
        // We want to know when a ".getmdl-select" node has been added/remove so we can set/unset the event listeners.
        var config = { childList: true, subtree: true }

        // Observer instance will listen for adding the selector class.
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var dropdowns = mutation.target.querySelectorAll(".getmdl-select");
                [].forEach.call(dropdowns, function(i) {
                    getmdlSelect.addEventListeners(i);
                });
                componentHandler.upgradeDom();
            });
        });

        // pass in the target node, as well as the observer options
        observer.observe(document, config);
    });

    var getmdlSelect = {
        defaultValue: {
            width: 300
        },

        /**
         * Adds the event listeners for all events in a dropdown select menu.
         */
        addEventListeners: function(dropdown) {
            var input = dropdown.querySelector('input');
            var list = dropdown.querySelectorAll('li');
            var menu = dropdown.querySelector('.mdl-js-menu');

            //show menu on mouse down or mouse up
            input.onkeydown = function(event) {
                if (event.keyCode == 38 || event.keyCode == 40) {
                    menu['MaterialMenu'].show();
                }
            };

            //return focus to input
            menu.onkeydown = function(event) {
                if (event.keyCode == 13) {
                    input.focus();
                }
            };

            let index = 0;
            [].forEach.call(list, function(li) {
                li.onclick = getmdlSelect.clickFunction(dropdown, input, li, index);
                ++index;
            });
        },

        /**
         * On first load, sets up the listeners for all selectors that may already exist.
         */
        init: function(selector) {
            var dropdowns = document.querySelectorAll(selector);
            [].forEach.call(dropdowns, function(i) {
                getmdlSelect.addEventListeners(i);
            });
        },

        clickFunction: function(dropdown, input, li, index) {
            return function() {
                input.value = li.textContent;
                dropdown.MaterialTextfield.change(li.textContent); // handles css class changes
                setTimeout(function() {
                    dropdown.MaterialTextfield.updateClasses_(); //update css class
                }, 250);

                // update input with the "id" value
                input.dataset.val = li.dataset.val || '';

                var evtConfig = {
                    bubbles: false,
                    cancelable: false,
                    detail: {
                        index: index
                    }
                };

                var evt = new CustomEvent("onchange", evtConfig);
                input.dispatchEvent(evt);
            }
        }
    };
}