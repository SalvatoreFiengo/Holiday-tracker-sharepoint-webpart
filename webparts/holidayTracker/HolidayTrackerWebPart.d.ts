import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import IHolidayTrackerProps from '../holidayTracker/components/IHolidayTrackerProps';
import 'bootstrap/dist/css/bootstrap.css';
export default class HolidayTrackerWebPart extends BaseClientSideWebPart<IHolidayTrackerProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=HolidayTrackerWebPart.d.ts.map