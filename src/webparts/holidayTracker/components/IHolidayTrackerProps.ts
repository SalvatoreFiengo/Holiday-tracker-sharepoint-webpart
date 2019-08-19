import { SPHttpClient } from '@microsoft/sp-http';

export interface IHolidayTrackerProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

