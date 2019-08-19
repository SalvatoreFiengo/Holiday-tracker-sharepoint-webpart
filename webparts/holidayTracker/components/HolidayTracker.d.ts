import * as React from 'react';
import Iuser from '../../interfaces/Iusers';
import Idates from '../../interfaces/Idates';
import IHelloUserPart from '../../interfaces//IwebPart';
interface IProps {
    busyMessage: IHelloUserPart["busyMessage"];
}
export interface IState {
    webPartData: IHelloUserPart["data"];
    isWDataValid: IHelloUserPart["isValid"];
    user: [Iuser];
    dates: Idates;
    weeks: number[];
    selectedWeek: number[];
    weekIsSelected: boolean;
    selectedMonth: number;
    count: number;
}
declare class HolidayTracker extends React.Component<IProps, IState> {
    constructor(props: IProps);
    componentDidMount(): void;
    render(): JSX.Element;
}
export default HolidayTracker;
//# sourceMappingURL=HolidayTracker.d.ts.map