var dates = {
    now: new Date(),
    yearStart: new Date(),
    yearEnd: new Date(),
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    firstLastDayOfMonth: function () { return new Date(); },
    weeksByMonth: function () { return []; },
    getDateObj: function (date, user, arr) {
        arr.push([date, user]);
    }
};
dates.yearStart = new Date(dates.now.getFullYear(), 0, 1);
dates.yearEnd = new Date(dates.now.getFullYear(), 12, 0);
dates.firstLastDayOfMonth = function (choice, month, year) {
    var chosenYear = year === undefined ? dates.now.getFullYear() : year;
    var day = choice === undefined ? 0 : choice;
    var chosenMonth = month === undefined ? dates.now.getMonth() : month;
    var result;
    result = new Date(chosenYear, chosenMonth, day);
    return result;
};
dates.weeksByMonth = function (dateFirst, dateSecond, all, n) {
    if (all === void 0) { all = false; }
    var start = dateFirst.getDate();
    var end = dateSecond.getDate();
    var month = [];
    var week = [];
    var weeks = [[]];
    for (var i = start; i <= end; i++) {
        month.push(i);
        if (i % 7 !== 0) {
            week.push(i);
        }
        else {
            weeks.push(week);
            week.push(i);
            week = [];
        }
    }
    if (all) {
        return month;
    }
    else if (typeof (n) === "number" && n > 0) {
        return weeks[n];
    }
    else {
        n = 1;
        console.log(month);
        return weeks[n];
    }
};
export default dates;
//# sourceMappingURL=dates.js.map