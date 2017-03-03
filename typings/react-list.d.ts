declare module "react-list" {
    export class ReactList extends React.Component<any, any> {
        axis?: string;
        initialIndex?: number;
        length: number;
        type: string;
        itemRenderer(index: number, key: string): JSX.Element
    }

    export default ReactList;
}