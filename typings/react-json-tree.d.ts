declare namespace ReactJsonTree {

    interface JSONTreeProps{
        data: any;
        shouldExpandNode: (keyName: string[], data: any, level: number) => boolean;
        hideRoot?: boolean;
        invertTheme?: boolean;
        theme?: any | string;
    }

    class JSONTree extends React.Component<JSONTreeProps, any> {}
}

declare module "react-json-tree" {
    export default  ReactJsonTree.JSONTree;
}
