declare namespace ReactJsonTree {

    interface JSONTreeProps{
        data: any;
        hideRoot?: boolean;
        invertTheme?: boolean;
        theme?: any | string;
        shouldExpandNode?: (keyName: string[], data: any, level: number) => boolean;
    }

    class JSONTree extends React.Component<JSONTreeProps, any> {}
}

declare module "react-json-tree" {
    export default  ReactJsonTree.JSONTree;
}
