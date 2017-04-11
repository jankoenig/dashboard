import * as React from "react";
import { findDOMNode } from "react-dom";

/**
 * Extend the Window object, on a browser it is the global window object, so TypeScript knows
 * about the MDL componentHandler object.
 */
interface MDLWindow extends Window {
    readonly componentHandler: {
        readonly upgradeElement: (any);
        readonly downgradeElements: (any);
        readonly upgradeDom: () => void;
    };
}

declare let window: MDLWindow;

/**
 * MDLComponent is an extention of the React.Component that handles registering the
 * dynamically generated component with the MDL JavaScript.
 *
 * The need for this class is outlined at https://getmdl.io/started/index.html#dynamic
 * and the implementation follows react-mdl https://github.com/react-mdl/react-mdl/blob/master/src/utils/MDLComponent.js
 */
export default class MDLComponent<P, S> extends React.Component<P, S> {
    componentDidMount() {
        if (window.componentHandler) {
            window.componentHandler.upgradeElement(findDOMNode(this));
        }
    }

    componentWillUnmount() {
        if (window.componentHandler) {
            window.componentHandler.downgradeElements(findDOMNode(this));
        }
    }
}