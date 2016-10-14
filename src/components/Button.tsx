import * as classNames from "classnames";
import * as React from "react";

interface ButtonProps {
  onClick?: () => void;
  type?: string;
  className?: string;
  id?: string;
  testid?: string;
  style?: React.CSSProperties;
};

class Button extends React.Component<ButtonProps, any> {
  classes() {
    return classNames("mdl-button", "mdl-js-button", this.props.className);
  }

  render() {
    return (
    <button
      data-testid={ this.props.testid }
      id={ this.props.id }
      type={ this.props.type }
      className={ this.classes() }
      onClick={ this.props.onClick }
      style={ this.props.style }
    >
      { this.props.children }
    </button>
    );
  }
}

export default Button;
