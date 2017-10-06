import * as classNames from "classnames";
import * as React from "react";
import { IconButton } from "react-toolbox/lib/button";
import Tooltip from "react-toolbox/lib/tooltip";

import { Menu, MenuItem } from "../components/Menu";

import Noop from "../utils/Noop";

const Autosuggest: any = require("react-autosuggest");
const IconButtonTheme = require("../themes/icon-button-primary-theme.scss");

export interface Dropdownable {
  value: string;
  label: string;
}

export interface PageButton {
  name: string;
  tooltip: string;
  icon: string | JSX.Element; // String or <svg/>
}

export interface HeaderProps {
  currentSourceId?: string;
  sources?: any[];
  onHomeClicked?: () => void;
  onSourceSelected?: (source: any) => void;
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
            style={{ marginLeft: 250 }}
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
              to="mailto:contact@bespoken.io"
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

export class Home extends React.Component<HomeProps, any> {
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
  sources: any[];
  selectedSourceId: string;
}

const getSuggestions = (value: string, sources: any[]) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? sources : sources.filter((source: any) =>
    source.label.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const renderSuggestion = (source: any) => {
  return (
    <div>
      {source.label}
    </div>
  );
};

const theme: any = {
  container: {
    position: "absolute",
    marginTop: 3,
    left: 50,
  },
  input: {
    width: 230,
    height: 30,
    padding: "0 0 0 10px",
    fontWeight: 300,
    fontSize: 16,
    border: "1px solid #aaa",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: "none"
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: "none"
  },
  suggestionsContainerOpen: {
    display: "block",
    position: "absolute",
    top: 31,
    width: 240,
    border: "1px solid #aaa",
    backgroundColor: "#fff",
    fontFamily: "Helvetica, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  suggestion: {
    cursor: "pointer",
    padding: "5px 10px",
  },
  suggestionHighlighted: {
    backgroundColor: "#ddd",
    padding: "5px 10px",
  }
};

export class Title extends React.Component<TitleProps, any> {

  static defaultProps: TitleProps = {
    handleItemSelect: Noop,
    sources: [],
    selectedSourceId: ""
  };

  constructor(props: TitleProps) {
    super(props);

    this.state = {
      selectedSourceId: undefined,
      value: "",
      suggestions: [],
    };
  }

  getSuggestionValue = (source: any) => {
    this.props.handleItemSelect(source.value);
    return "";
  }

  onChange = (event: any, { newValue }: any) => {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsFetchRequested = ({ value }: any) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.sources)
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      suggestions: nextProps.sources,
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const selectedSource = this.props.sources.filter(dropDownableSource => dropDownableSource.source.id === this.props.selectedSourceId);
    const selectedSourceName = selectedSource[0] ? selectedSource[0].label : "";
    const shouldRender = () => true;
    const inputProps = {
      placeholder: selectedSourceName,
      value,
      onChange: this.onChange
    };
    let title: JSX.Element = (<div />);
    if (this.props.sources.length > 0) {
      if (this.props.sources.length === 1) {
        title = (<span className="mdl-layout-title">{this.props.sources[0].label}</span>);
      } else {
        title = (
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={renderSuggestion}
            shouldRenderSuggestions={shouldRender}
            inputProps={inputProps}
            theme={theme}
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
  style?: any;
}

interface PageSwapState {
  buttons: JSX.Element[];
}

const TooltipButton = Tooltip(IconButton);

export class PageSwap extends React.Component<PageSwapProps, PageSwapState> {

  static defaultProps: PageSwapProps = {
    pageButtons: [],
    onPageSelected: Noop
  };

  constructor(props: PageSwapProps) {
    super(props);

    this.state = { buttons: [] };

    this.handleSelected = this.handleSelected.bind(this);
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
    let i = 0;
    for (let button of buttons) {
      this.state.buttons.push(
        (
          <HeaderButton
            key={++i}
            button={button}
            onClick={this.handleSelected} />
        )
      );
    };
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.state.buttons}
      </div>
    );
  }
}

interface HeaderButtonProps {
  button: PageButton;
  onClick: (button: PageButton) => void;
  style?: any;
}

export class HeaderButton extends React.Component<HeaderButtonProps, any> {

  constructor(props: HeaderButtonProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.button);
  }

  render() {
    const { button } = this.props;
    return (
      <TooltipButton
        style={this.props.style}
        theme={IconButtonTheme}
        accent
        tooltip={button.tooltip}
        icon={button.icon}
        onClick={this.handleClick} />
    );
  }
}
