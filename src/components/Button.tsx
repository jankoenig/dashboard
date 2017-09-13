import * as classNames from "classnames";
import * as React from "react";

interface ButtonProps {
  fab?: boolean;
  ripple?: boolean;
  primary?: boolean;
  raised?: boolean;
  colored?: boolean;
  accent?: boolean;
  onClick?: () => void;
  type?: string;
  className?: string;
  id?: string;
  testid?: string;
  style?: React.CSSProperties;
  href?: string;
  to?: string;
  disabled?: boolean;
};

/**
 * Button Component
 *
 * For more information on the MDL Button, see https://getmdl.io/components/index.html#buttons-section
 */
class Button extends React.Component<ButtonProps, any> {
  classes() {
    return classNames("mdl-button mdl-js-button", {
      "mdl-button--fab": this.props.fab,
      "mdl-js-ripple-effect": this.props.ripple,
      "mdl-button--raised": this.props.raised,
      "mdl-button--colored": this.props.colored,
      "mdl-button--primary": this.props.primary,
      "mdl-button--accent": this.props.accent
    }, this.props.className);
  }

  render() {

    let component = this.props.href !== undefined ? "a" : "button";
    let properties = {...this.props, ...{className: this.classes(), href: this.props.href, target: "_blank" }};

    // Clean off properties that were used for setting classes
    // They are not real and should not be passed on
    delete properties.fab;
    delete properties.accent;
    delete properties.raised;
    delete properties.colored;
    delete properties.ripple;
    delete properties.primary;

    return React.createElement(component, properties);
  }
}

export default Button;
