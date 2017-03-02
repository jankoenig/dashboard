/**
 * react-dates by airbnb
 * https://github.com/airbnb/react-dates
 *
 * Found some existing definitions that may be
 * helpful: https://raw.githubusercontent.com/Artur-A/react-dates/2a5f9876e986cd50707b090b49f2d18c0fc8833b/index.d.ts
 * from this PR https://github.com/airbnb/react-dates/pull/324
 */

declare module "react-dates" {
    import * as React from "react";
    import * as moment from "moment";

    export type FocusedInputShape = 'startDate' | 'endDate';

    export interface DateRangePickerProps {
        startDate: moment.Moment;
        endDate: moment.Moment;
        focusedInput?: FocusedInputShape;
        onDatesChange: (dates: {startDate: moment.Moment, endDate: moment.Moment}) => void;
        onFocusChange: (focusInput: FocusedInputShape) => void;
        startDateId?: string;
        endDateId?: string;
        startDatePlaceholderText?: string;
        endDatePlaceholderText?: string;
        disabled?: boolean;
    }

    export class DateRangePicker extends React.Component<DateRangePickerProps, any> {}

}