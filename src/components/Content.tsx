import * as React from 'react';
import * as classNames from 'classnames';

export default class Content extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    classes() {
      return classNames('mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50')
    }

    render() {
        return <div className={ this.classes() }>
                { this.props.title ? <header className="mdl-layout-title">{ this.props.title }</header> : null  }
                { this.props.children }
               </div>;
    }
}
