import SunCalc from 'suncalc';

export function sunPosition(now: Date) {    
    const lat = 54.9924;
    const lon = 73.3686;

    const times = SunCalc.getTimes(now, lat, lon);

    if (now < times.nightEnd || now >= times.night) {
        return 'night';
    } else if (now < times.nauticalDawn) {
        return 'morning0d';
    } else if (now < times.dawn) {
        return 'morning1d';
    } else if (now < times.sunrise) {
        return 'morning2d';
    } else if (now < times.sunriseEnd) {
        return 'sunrise';
    } else if (now < times.goldenHourEnd) {
        return 'morning0l';
    } else if (now < times.solarNoon) {
        return 'morning1l';
    } else if (now < times.goldenHour) {
        return 'day';
    } else if (now < times.sunsetStart) {
        return 'evening0l';
    } else if (now < times.sunset) {
        return 'sunset';
    } else if (now < times.dusk) {
        return 'evening0d';
    } else if (now < times.nauticalDusk) {
        return 'evening1d';
    } else {
        return 'evening2d';
    }
}

const now = new Date();
console.log(sunPosition(now));
