// declare namespace reactlist {

declare module "react-list" {
    export class ReactList extends React.Component<any, any> {
        axis?: string
        initialIndex?: number
        length: number
        type: string
        itemRenderer(index: number, key: string): JSX.Element
    }

    // enum Axis {
        // x, y
    // }
// }

    export default ReactList;
}