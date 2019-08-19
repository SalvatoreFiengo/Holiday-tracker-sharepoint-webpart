var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'HolidayTrackerWebPartStrings';
import HolidayTracker from './components/HolidayTracker';
import 'bootstrap/dist/css/bootstrap.css';
var HolidayTrackerWebPart = /** @class */ (function (_super) {
    __extends(HolidayTrackerWebPart, _super);
    function HolidayTrackerWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HolidayTrackerWebPart.prototype.render = function () {
        var element = React.createElement(HolidayTracker, {
            busyMessage: this.properties.busyMessage,
        });
        ReactDom.render(element, this.domElement);
    };
    HolidayTrackerWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(HolidayTrackerWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    HolidayTrackerWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    };
    return HolidayTrackerWebPart;
}(BaseClientSideWebPart));
export default HolidayTrackerWebPart;
//# sourceMappingURL=HolidayTrackerWebPart.js.map