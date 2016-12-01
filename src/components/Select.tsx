import * as React from "react";

export interface SelectAdapter<T> {
    getCount(): number;
    getItem(index: number): T;
    getTitle(index: number): string;
}

export interface SelectListener<T> {
    onSelected(item: T, index: number): void;
}

export interface SelectProps<T> {
    hint: string;
    adapter: SelectAdapter<T>;
    selectListener: SelectListener<T>;
}

interface SelectState {
    list: React.ReactNode[];
}

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

        let maxCount = props.adapter.getCount();
        for (let count = 0; count < maxCount; ++count) {
            let title = props.adapter.getTitle(count);
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
        return title.replace(/\s/, "");
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
        let item = this.props.adapter.getItem(index);
        this.props.selectListener.onSelected(item, index);
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

    handleInputKeyDown(ev: any) {
        console.info("INPUT Key Down " + ev.charCode);
        if (ev.charCode === 38 || ev.charCode === 40) {
            console.info("INPUT KEY DOWN");
            (this.menuRef as any)["MaterialMenu"].show();
        }
    }

    handleMenuKeyDown(ev: any) {
        console.info("MENU KEY DOWN " + ev.charCode);
        if (ev.charCode === 38) {
            console.info("MENU KEY DOWN");
            this.inputRef.focus();
        }
    }

    clickFunction(index: number) {
            return (ev: React.SyntheticEvent) => {
                let li = this.liList[index];
                this.inputRef.nodeValue = li.textContent;
                (this.dropdownRef as any).MaterialTextfield.change(li.textContent); // handles css class changes
                setTimeout(() => {
                    (this.dropdownRef as any).MaterialTextfield.updateClasses_(); // update css class
                }, 250);

                // update input with the "id" value
                this.inputRef.id = li.id || "";

                // var evt = new CustomEvent("onchange", evtConfig);
                this.handleChange(index);
            };
        }

    render() {
        return (
            <div ref={this.handleDropdownBind.bind(this)} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select getmdl-select__fix-height getmdl-select__fullwidth">
                <input ref={this.handleRefBind.bind(this)} className="mdl-textfield__input" type="text" id={this.id} value="Select" readOnly tabIndex={-1} onKeyDown={this.handleInputKeyDown.bind(this)} />
                <label htmlFor={this.id}>
                    <i className="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>
                <label htmlFor={this.id} className="mdl-textfield__label">Country</label>
                <ul ref={this.handleMenuBind.bind(this)} onKeyDown={this.handleMenuKeyDown.bind(this)} htmlFor={this.id} className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    {this.state.list}
                </ul>
            </div>
        );
    }
}

export default Select;