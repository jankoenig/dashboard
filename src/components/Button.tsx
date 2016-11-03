import * as classNames from "classnames";
import * as objectAssign from "object-assign";
import * as React from "react";

interface ButtonProps {
  ripple?: boolean;
  primary?: boolean;
  raised?: boolean;
  colored?: boolean;
  accent?: boolean;
  icon?: string;
  onClick?: () => void;
  type?: string;
  className?: string;
  id?: string;
  testid?: string;
  style?: React.CSSProperties;
  href?: string;
};

/**
 * Button Component
 *
 * For more information on the MDL Button, see https://getmdl.io/components/index.html#buttons-section
 */
class Button extends React.Component<ButtonProps, any> {
  classes() {
    return classNames("mdl-button mdl-js-button", {
      "mdl-js-ripple-effect": this.props.ripple,
      "mdl-button--raised": this.props.raised,
      "mdl-button--colored": this.props.colored,
      "mdl-button--primary": this.props.primary,
      "mdl-button--accent": this.props.accent
    }, this.props.className);
  }

  render() {

    let component = this.props.href !== undefined ? "a" : "button";
    let properties = objectAssign({}, this.props, {
      className: this.classes(),
      href: this.props.href,
      target: "_blank"
    });

    // Clean off the unknown properties
    delete properties.accent;
    delete properties.raised;
    delete properties.colored;
    delete properties.ripple;

    return React.createElement(component, properties);
  }
}

export default Button;
