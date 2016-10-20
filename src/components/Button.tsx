import * as classNames from "classnames";
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
    return (
      <button
        data-testid={this.props.testid}
        id={this.props.id}
        type={this.props.type}
        className={this.classes()}
        onClick={this.props.onClick}
        style={this.props.style}
        >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
