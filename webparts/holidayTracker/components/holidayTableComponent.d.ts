import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Iuser from '../../interfaces/Iusers';
declare type Props = {
    user: [Iuser];
    date: string;
    month: string;
    prev: (count: number) => void;
    next: (count: number) => void;
    count: number;
};
declare class HolidayTableComponent extends React.Component<Props> {
    render(): JSX.Element;
}
export default HolidayTableComponent;
//# sourceMappingURL=holidayTableComponent.d.ts.map