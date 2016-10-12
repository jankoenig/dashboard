import * as React from "react";

interface HeaderProps {
  title?: string;
}

export default class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <header className="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          {this.props.title ? (
            <span className="mdl-layout-title">{this.props.title}</span>
          ) : (
              null
            )}
          <div className="mdl-layout-spacer"></div>
          {/** Commenting this out for now, might introduce later
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
                <i className="material-icons">more_vert</i>
              </button>
              <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
                <li className="mdl-menu__item">Logout</li>
              </ul> 
            */}
        </div>
      </header>);
  }
}