(function () {
    var method = null;

    if (typeof dayjs === 'function') {
        method = dayjs;
    } else if (typeof moment === 'function') {
        method = moment;
    }

    if (method === null) {
        // no available module, just ignore it
        return;
    }

    var FORMATS = {
        datetime: 'MMM D, YYYY, h:mm:ss a',
        millisecond: 'h:mm:ss.SSS a',
        second: 'h:mm:ss a',
        minute: 'h:mm a',
        hour: 'hA',
        day: 'MMM D',
        week: 'll',
        month: 'MMM YYYY',
        quarter: '[Q]Q - YYYY',
        year: 'YYYY'
    };

    Chart._adapters._date.override({
        /**
         * Returns a map of time formats for the supported formatting units defined
         * in Unit as well as 'datetime' representing a detailed date/time string.
         * @returns {{string: string}}
         */
        formats: function () {
            return FORMATS;
        },

        /**
         * Parses the given `value` and return the associated timestamp.
         * @param {any} value - the value to parse (usually comes from the data)
         * @param {string} [format] - the expected data format
         * @returns {(number|null)}
         */
        parse: function (value, format) {
            if (typeof value === 'string' &&
                typeof format === 'string') {
                value = method(value, format);
            } else if (!(value instanceof method)) {
                value = method(value);
            }
            return value.isValid() ? value.valueOf() : null;
        },

        /**
         * Returns the formatted date in the specified `format` for a given `timestamp`.
         * @param {number} timestamp - the timestamp to format
         * @param {string} format - the date/time token
         * @return {string}
         */
        format: function (time, format) {
            return method(time).format(format);
        },

        /**
         * Adds the specified `amount` of `unit` to the given `timestamp`.
         * @param {number} timestamp - the input timestamp
         * @param {number} amount - the amount to add
         * @param {Unit} unit - the unit as string
         * @return {number}
         */
        add: function (time, amount, unit) {
            return method(time).add(amount, unit).valueOf();
        },

        /**
         * Returns the number of `unit` between the given timestamps.
         * @param {number} a - the input timestamp (reference)
         * @param {number} b - the timestamp to subtract
         * @param {Unit} unit - the unit as string
         * @return {number}
         */
        diff: function (max, min, unit) {
            return method(max).diff(moment(min), unit);
        },

        /**
         * Returns start of `unit` for the given `timestamp`.
         * @param {number} timestamp - the input timestamp
         * @param {Unit|'isoWeek'} unit - the unit as string
         * @param {number} [weekday] - the ISO day of the week with 1 being Monday
         * and 7 being Sunday (only needed if param *unit* is `isoWeek`).
         * @return {number}
         */
        startOf: function (time, unit, weekday) {
            time = method(time);
            if (unit === 'isoWeek') {
                return time.isoWeekday(weekday).valueOf();
            }
            return time.startOf(unit).valueOf();
        },

        /**
         * Returns end of `unit` for the given `timestamp`.
         * @param {number} timestamp - the input timestamp
         * @param {Unit|'isoWeek'} unit - the unit as string
         * @return {number}
         */
        endOf: function (time, unit) {
            return method(time).endOf(unit).valueOf();
        }
    });
})();
