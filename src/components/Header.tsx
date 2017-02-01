import * as classNames from "classnames";
import * as React from "react";
import { IconButton } from "react-toolbox/lib/button";
import Dropdown from "react-toolbox/lib/dropdown";

import { Menu, MenuItem } from "../components/Menu";

import Noop from "../utils/NoOp";

const DropdownDarkTheme = require("../themes/dropdown-dark-nolabel.scss");
const IconButtonTheme = require("../themes/icon-button-primary.scss");

export interface Dropdownable {
  value: string;
  label: string;
}

export interface PageButton {
  name: string;
  icon: string | JSX.Element; // String or <svg/>
}

export interface HeaderProps {
  currentSourceId?: string;
  sources?: Dropdownable[];
  onHomeClicked?: () => void;
  onSourceSelected?: (source: Dropdownable) => void;
  pageButtons?: PageButton[];
  onPageSelected?: (button: PageButton) => void;
  displayHomeButton?: boolean;
  className?: string;
}

export interface HeaderState {
  selectedSourceId?: string;
}

/**
 * Header for the Dashboard frame
 *
 * TODO: We may want to consider renaming this since it is not a resuable header
 * component and is instead can only be used by the Dashboard frame.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {

  constructor(props: HeaderProps) {
    super(props);
    this.state = { selectedSourceId: this.props.currentSourceId };
  }

  componentWillReceiveProps(nextProps: HeaderProps, context: any) {
    this.state.selectedSourceId = nextProps.currentSourceId;
    this.setState(this.state);
  }

  classes() {
    return classNames("mdl-layout__header", this.props.className);
  }

  handleItemSelect = (value: string) => {
    this.state.selectedSourceId = value;

    // Now find the source and pass it back out
    for (let item of this.props.sources) {
      if (item.value === value && this.props.onSourceSelected) {
        this.props.onSourceSelected(item);
      }
    }
  }

  render() {
    return (
      <header className={this.classes()}>
        <div className="mdl-layout__header-row" style={{ paddingLeft: "0px" }}>

          <Home
            handleHomeClick={this.props.onHomeClicked}
            showHome={this.props.displayHomeButton} />

          <Title
            sources={this.props.sources}
            handleItemSelect={this.handleItemSelect}
            selectedSourceId={this.state.selectedSourceId} />

          <PageSwap
            pageButtons={this.props.pageButtons}
            onPageSelected={this.props.onPageSelected} />

          <div className="mdl-layout-spacer" />

          {this.props.children}

          <Menu
            icon="help_outline"
            position="topRight"
            menuRipple>

            <MenuItem
              to="https://github.com/bespoken/dashboard/issues/new?labels=bug"
              icon="bug_report"
              caption="File Bug" />

            <MenuItem
              to="https://github.com/bespoken/dashboard/issues/new?labels=feature%20request&body="
              icon="build"
              caption="Request Feature" />

            <MenuItem
              to="https://gitter.im/bespoken/bst?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
              icon="question_answer"
              caption="Talk to Us" />

            <MenuItem
              to="mailto:contact@bespoken.tools"
              icon="email"
              caption="Email" />

          </Menu>
        </div>
      </header>
    );
  }
}

export default Header;

interface HomeProps {
  handleHomeClick: () => void;
  showHome: boolean;
}

class Home extends React.Component<HomeProps, any> {
  render() {
    let home: JSX.Element = (<div />);
    if (this.props.showHome) {
      home = (
        <IconButton
          theme={IconButtonTheme}
          accent
          onClick={this.props.handleHomeClick}
          icon="home" />
      );
    }

    return home;
  }
}

interface TitleProps {
  handleItemSelect: (value: string) => void;
  sources: Dropdownable[];
  selectedSourceId: string;
}

class Title extends React.Component<TitleProps, any> {

  static defaultProps: TitleProps = {
    handleItemSelect: Noop,
    sources: [],
    selectedSourceId: ""
  };

  constructor(props: TitleProps) {
    super(props);

    this.state = {
      selectedSourceId: undefined
    };
  }

  render() {
    let title: JSX.Element = (<div />);
    if (this.props.sources.length > 0) {
      if (this.props.sources.length === 1) {
        title = (<span className="mdl-layout-title">{this.props.sources[0].label}</span>);
      } else {
        title = (
          <Dropdown
            theme={DropdownDarkTheme}
            auto
            onChange={this.props.handleItemSelect}
            source={this.props.sources}
            value={this.props.selectedSourceId}
          />
        );
      }
    }

    return title;
  }
}

interface PageSwapProps {
  pageButtons?: PageButton[];
  onPageSelected?: (button: PageButton) => void | undefined;
}

interface PageSwapState {
  buttons: JSX.Element[];
}

class PageSwap extends React.Component<PageSwapProps, PageSwapState> {

  static defaultProps: PageSwapProps = {
    pageButtons: [],
    onPageSelected: Noop
  };

  constructor(props: PageSwapProps) {
    super(props);

    this.state = { buttons: [] };
  }

  componentWillReceiveProps(props: PageSwapProps, context: any) {
    this.buildButtons(props);
  }

  componentWillMount() {
    this.buildButtons(this.props);
  }

  handleSelected(button: PageButton) {
    this.props.onPageSelected(button);
  }

  buildButtons(props: PageSwapProps) {
    const buttons = props.pageButtons;
    this.state.buttons = [];
    for (let button of buttons) {
      this.state.buttons.push(
        (
          <IconButton
            theme={IconButtonTheme}
            accent
            key={button.name}
            icon={button.icon}
            onClick={this.handleSelected.bind(this, button)} />
        )
      );
    };
  }

  render() {
    return (
      <div>
        {this.state.buttons}
      </div>
    );
  }
}