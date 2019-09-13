import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'HolidayTrackerWebPartStrings';
import {IHolidayTrackerProps} from '../holidayTracker/components/IHolidayTrackerProps';
import HolidayTracker from './components/HolidayTracker';


import 'bootstrap/dist/css/bootstrap.css';



export default class HolidayTrackerWebPart extends BaseClientSideWebPart<IHolidayTrackerProps> {

  public render(): void {
    const element: React.ReactElement<IHolidayTrackerProps> = React.createElement(HolidayTracker,      {
      siteUrl: this.context.pageContext.web.absoluteUrl,
      listName: this.properties.listName,
      context: this.context
    });
   
  
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

 
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
