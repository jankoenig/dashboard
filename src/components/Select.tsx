import * as React from "react";

export interface SelectAdapter<T> {
    getCount(): number;
    getItem(index: number): T;
    getTitle(index: number): string;
}

export interface SelectProps<T> {
    hint: string;
    adapter: SelectAdapter<T>;
    onSelected?(item: T, index: number): void;
    onUnselected?(): void;
}

interface SelectState {
    list: React.ReactNode[];
}

/**
 * A Select menu which can be used to select a single item in a list.  The list is taken from the
 * corresponding SelectAdapter provided.  As of writing this, the top item will be an "unselect" option which will be titled based
 * on the provided HINT.
 */
export class Select extends React.Component<SelectProps<any>, SelectState> {

    // This is checked and increased internally so there can always be a unique "ID" for the input.  Otherwise you get a lot of really frustrating errors in the DOM.
    static count: number = 0;

    id: string;
    dropdownRef: HTMLElement;
    inputRef: HTMLElement;
    menuRef: HTMLElement;
    liList: HTMLElement[];
    boundChangeListener: any;

    constructor(props: SelectProps<any>) {
        super(props);
        Select.count++;

        this.state = {
            list: []
        };
        this.setAdapter(props);

        this.id = "check-selection" + Select.count;
    }

    componentWillReceiveProps(nextProps: SelectProps<any>, nextContext: any): void {
        this.setAdapter(nextProps);
    }

    setAdapter(props: SelectProps<any>) {
        this.state.list = [];
        this.liList = [];

        let clickFunction = this.clickFunction(0).bind(this);
        this.state.list.push((
            <li ref={this.handleLiBind.bind(this)} className="mdl-menu__item" key={"unselectedItem0"} onClick={clickFunction}>{this.props.hint}</li>
        ));

        // Then fill in the rest.
        let maxCount = props.adapter.getCount() + 1;
        for (let count = 1; count < maxCount; ++count) {
            let title = props.adapter.getTitle(count - 1) || this.props.hint;
            let clickFunction = this.clickFunction(count).bind(this);
            let key = this.normalizeTitle(title) + count;
            this.state.list.push((
                <li ref={this.handleLiBind.bind(this)} className="mdl-menu__item" key={key} onClick={clickFunction}>{title}</li>
            ));
        }
    }

    /**
     * Normalizing the string so it can be put in a key field.
     */
    normalizeTitle(title: string): string {
        let useTitle = title || this.props.hint;
        return useTitle.replace(/\s/, "");
    }

    componentDidMount() {
        // The input dom of the getmdl-select dispatches an "onchange" event on each selection.
        this.boundChangeListener = this.handleChange.bind(this);
        this.inputRef.addEventListener("onchange", this.boundChangeListener);
    }

    componentWillUnmount() {
        this.inputRef.removeEventListener("onchange", this.boundChangeListener);
    }

    handleChange(index: number) {
        if (index === 0) {
            if (this.props.onUnselected) {
                this.props.onUnselected();
            }
        } else {
            let realIndex = index - 1;
            let item = this.props.adapter.getItem(realIndex);
            if (this.props.onSelected) {
                this.props.onSelected(item, realIndex);
            }
        }
    }

    handleRefBind(input: HTMLElement) {
        if (input) {
            this.inputRef = input;
        }
    }

    handleMenuBind(menu: HTMLElement) {
        if (menu) {
            this.menuRef = menu;
        }
    }

    handleDropdownBind(dropdown: HTMLElement) {
        if (dropdown) {
            this.dropdownRef = dropdown;
        }
    }

    handleLiBind(li: HTMLElement) {
        if (li) {
            this.liList.push(li);
        }
    }

    handleInputKeyDown(ev: KeyboardEvent) {
        if (ev.charCode === 38 || ev.charCode === 40) {
            (this.menuRef as any)["MaterialMenu"].show();
        }
    }

    handleMenuKeyDown(ev: KeyboardEvent) {
        if (ev.charCode === 38) {
            this.inputRef.focus();
        }
    }

    clickFunction(index: number) {
        return (ev: React.SyntheticEvent) => {
            let li = this.liList[index];
            let useValue = (index === 0) ? undefined : li.textContent; // First node is "unselected";
            this.inputRef.nodeValue = useValue;
            (this.dropdownRef as any).MaterialTextfield.change(useValue); // handles css class changes
            setTimeout(() => {
                (this.dropdownRef as any).MaterialTextfield.updateClasses_(); // update css class
            }, 250);

            // update input with the "id" value
            // TODO: This existed in the original code from where this was stolen, but seems to break things. Figure out why.
            // this.inputRef.id = li.id || "";
            this.handleChange(index);
        };
    }

    render() {
        return (
            <div ref={this.handleDropdownBind.bind(this)} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height getmdl-select__fullwidth">
                <input ref={this.handleRefBind.bind(this)} className="mdl-textfield__input" type="text" id={this.id} readOnly tabIndex={-1} onKeyDown={this.handleInputKeyDown.bind(this)} />
                <label htmlFor={this.id}>
                    <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>
                <label htmlFor={this.id} className="mdl-textfield__label">{this.props.hint}</label>
                <ul ref={this.handleMenuBind.bind(this)} onKeyDown={this.handleMenuKeyDown.bind(this)} htmlFor={this.id} className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    {this.state.list}
                </ul>
            </div>
        );
    }
}

export default Select;