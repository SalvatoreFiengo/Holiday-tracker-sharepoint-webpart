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
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Card } from 'reactstrap';
import * as styles from '../../../../lib/webparts/holidayTracker/components/HolidayTracker.module.scss';
import HolidayTableComponent from '../components/holidayTableComponent';
import dates from '../../variables/dates';
import usersMock from '../../variables/usersMock';
;
var HolidayTracker = /** @class */ (function (_super) {
    __extends(HolidayTracker, _super);
    function HolidayTracker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            webPartData: "loading",
            isWDataValid: false,
            user: [usersMock],
            dates: dates,
            weeks: dates.weeksByMonth(dates.firstLastDayOfMonth(1), dates.firstLastDayOfMonth(0), true),
            selectedWeek: dates.weeksByMonth(dates.firstLastDayOfMonth(1, dates.now.getMonth()), dates.firstLastDayOfMonth(0, dates.now.getMonth()), true),
            weekIsSelected: false,
            selectedMonth: dates.now.getMonth(),
            count: dates.now.getMonth()
        };
        return _this;
    }
    ;
    HolidayTracker.prototype.componentDidMount = function () {
        var _this = this;
        fetch('../../_api/web/currentuser', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'accept': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
            _this.setState({ webPartData: json.Title, isWDataValid: true });
        }).catch(function (e) {
            console.log(e);
        });
    };
    HolidayTracker.prototype.render = function () {
        var _this = this;
        var prev = function (count) {
            var counter = count;
            counter--;
            console.log(counter);
            if (counter <= 0)
                counter = 0;
            _this.setState({
                count: counter,
                selectedMonth: counter
            }, function () { return updateWeeks(0, _this.state.selectedMonth); });
        };
        var next = function (count) {
            var counter = count;
            counter++;
            console.log(counter);
            if (counter >= 12)
                counter = 12;
            _this.setState({
                count: counter,
                selectedMonth: counter
            }, function () { return updateWeeks(0, counter); });
        };
        var updateWeeks = function (n, count) {
            var weeks = dates.weeksByMonth;
            var month = dates.firstLastDayOfMonth;
            console.log(month(1, _this.state.selectedMonth - 1) + " " + month(0, _this.state.selectedMonth));
            if (n !== 0 && count >= 0) {
                _this.setState({
                    selectedWeek: weeks(month(1, count - 1), month(0, count), false, n),
                    weekIsSelected: true
                });
            }
            else if (n === 0 && count >= 0) {
                _this.setState({
                    selectedWeek: weeks(month(1, count - 1), month(0, count), true),
                    weekIsSelected: false
                });
            }
            else {
                return;
            }
        };
        return (React.createElement("div", null,
            React.createElement("header", null,
                React.createElement(Navbar, { color: "light", light: true, expand: "md", className: "clearfix border-bottom border-secondary" },
                    React.createElement("div", { className: "mh-36 pr-2 float-left border-right border-secondary " },
                        React.createElement(NavbarBrand, { className: "mx-3 text-center ", href: "/" },
                            React.createElement("h1", null, "Holiday Tracker")),
                        React.createElement("blockquote", { className: "blockquote" },
                            React.createElement("footer", { className: "blockquote-footer text-center" },
                                " Today is ",
                                this.state.dates.now.toString().slice(0, 15)))),
                    React.createElement(Nav, { className: "w-50 mx-auto", navbar: true, pills: true },
                        React.createElement(NavItem, { className: "mx-auto" },
                            React.createElement(NavLink, { href: "#" },
                                React.createElement("h3", null, "HOME"))),
                        React.createElement(NavItem, { className: "mx-auto" },
                            React.createElement(NavLink, { href: "#" },
                                React.createElement("h3", null, "NEW"))),
                        React.createElement(NavItem, { className: "mx-auto" },
                            React.createElement(NavLink, { href: "#" },
                                React.createElement("h3", null, "CREDITS")))))),
            React.createElement("section", { className: "mt-5" },
                React.createElement(Row, null,
                    React.createElement(Col, { md: "4" },
                        React.createElement(HolidayTableComponent, { prev: function (count) { return prev(count); }, next: next, count: this.state.selectedMonth, month: dates.months[this.state.selectedMonth - 1], user: this.state.user, date: dates.firstLastDayOfMonth().toString() })),
                    React.createElement(Col, { md: "8" },
                        React.createElement(Row, null,
                            React.createElement(Col, { md: "12" },
                                React.createElement(Card, null,
                                    React.createElement(Row, null, this.state.selectedWeek.map(function (chose, i) {
                                        return (React.createElement(Card, { key: i, type: "button", className: styles.default.customCard }, chose));
                                    }))))))))));
    };
    return HolidayTracker;
}(React.Component));
export default HolidayTracker;
//# sourceMappingURL=HolidayTracker.js.map