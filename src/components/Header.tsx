import * as React from 'react';

export default class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <header className="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">{ this.props.title }</span>
              <div className="mdl-layout-spacer"></div>
              <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
                <i className="material-icons">more_vert</i>
              </button>
              <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
                <li className="mdl-menu__item">About</li>
                <li className="mdl-menu__item">Contact</li>
                <li className="mdl-menu__item">Legal information</li>
              </ul>
            </div>
          </header>;
  }
}
