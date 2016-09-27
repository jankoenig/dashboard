import * as React from 'react';
import * as classNames from 'classnames';

export default class Layout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  classes() {
    return classNames('mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header');
  }

  render() {
    return <div className={ this.classes() }>
            { this.props.children }
           </div>;
  }
}
