module.exports = {
    formatDate(date) {
        date = date.toNumber() * 1000;
        var d = new Date(date);
        // month = '' + (d.getMonth() + 1),
        // day = '' + d.getDate(),
        // year = d.getUTCFullYear(),
        // hour = d.getHours(),
        // minute = d.getMinutes(),
        // seconds = d.getSeconds();

        // if (month.length < 2) month = '0' + month;
        // if (day.length < 2) day = '0' + day;

        // return [year, month, day].join('-') +" , "+ [hour, minute, seconds].join('-');
        d=d.toISOString().split('T')[0];
        return d;
    }

}