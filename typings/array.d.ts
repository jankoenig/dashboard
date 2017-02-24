interface Array<T> {
  findIndex(callback: (value: T, index: number, array: T[]) => boolean): number;
}

interface TooltipProps {
  tooltipPosition: "vertical" | "horizontal"
}

interface TooltippedComponentClass {
    tooltipPosition?: string;
}