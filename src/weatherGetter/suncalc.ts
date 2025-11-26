import SunCalc from 'suncalc';

const lon = 73.3686;
const lat = 54.9924;


export function sunPosition(now: Date): string {    
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

export function lightDayLenght(now: Date): string {
    const times = SunCalc.getTimes(now, lat, lon);
    
    const dayLengthHours = (times.sunset.getTime() - times.sunrise.getTime()) / (1000 * 60 * 60);

    const hours = Math.floor(dayLengthHours);
    const minutes = Math.round((dayLengthHours - hours) * 60);
    
    return `${hours.toString().padStart(2, '0')} ч ${minutes.toString().padStart(2, '0')} мин`
}

export function sunCycleTimes(now: Date): string[] {
    const times = SunCalc.getTimes(now, lat, lon);
    
    const sunriseHours = times.sunrise.getHours()
    const sunriseMinutes = times.sunrise.getMinutes()

    const sunsetHours = times.sunset.getHours()
    const sunsetMinutes = times.sunset.getMinutes()

    return [`${sunriseHours.toString().padStart(2, '0')}:${sunriseMinutes.toString().padStart(2, '0')}`, `${sunsetHours.toString().padStart(2, '0')}:${sunsetMinutes.toString().padStart(2, '0')}`]
}