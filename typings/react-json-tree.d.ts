declare namespace ReactJsonTree {

    interface JSONTreeProps{
        data: any;
        hideRoot?: boolean;
        invertTheme?: boolean;
        theme?: any | string;
    }

    class JSONTree extends React.Component<JSONTreeProps, any> {}
}

declare module "react-json-tree" {
    export default  ReactJsonTree.JSONTree;
}
