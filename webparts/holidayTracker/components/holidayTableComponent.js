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
import { Table, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
var HolidayTableComponent = /** @class */ (function (_super) {
    __extends(HolidayTableComponent, _super);
    function HolidayTableComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HolidayTableComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement(Table, { className: "text-center" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null,
                        React.createElement(Button, { onClick: function () {
                                _this.props.prev(_this.props.count);
                            } }, "Prev")),
                    React.createElement("th", null,
                        "Holidays in ",
                        this.props.month),
                    React.createElement("th", null,
                        React.createElement(Button, { onClick: function () {
                                _this.props.next(_this.props.count);
                            } }, "next")))),
            React.createElement("tbody", null, this.props.user.map(function (user) {
                return (React.createElement("tr", { key: user.id },
                    React.createElement("td", { colSpan: 3 },
                        React.createElement("p", null, user.name),
                        React.createElement("p", null, _this.props.date.slice(0, 15)))));
            }))));
    };
    return HolidayTableComponent;
}(React.Component));
export default HolidayTableComponent;
//# sourceMappingURL=holidayTableComponent.js.map