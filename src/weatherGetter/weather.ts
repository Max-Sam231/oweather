const axios = require('axios');

const lat = 54.9924;
const lon = 73.3686;

export interface WeatherInfo {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  time: string;
  precipitation: number;
}

interface HourlyInfo {
  temperature_2m: number;
  weather_code: number;
}

interface WeeklyInfo {
  temperature_2m_min: number;
  temperature_2m_max: number;
  weathercode: number;
  time: string;
}

export function getOmskTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Omsk' }));
}

export function getWeatherInfo(lat: number, lon:number): Promise<WeatherInfo | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,surface_pressure,wind_speed_10m,precipitation&windspeed_unit=ms&timezone=Asia%2FOmsk`;

  return axios.get(url)
    .then((response: any) => {
      return response.data.current;
    })
    .catch((error: any) => {
      return "error"
    })
}


export function getHourlyInfo(): Promise<HourlyInfo | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&timezone=Asia%2FOmsk`;

  return axios.get(url)
    .then((response: any) => {
      return response.data.hourly;
    })
    .catch((error: any) => {
      return "error"
    })
}

export function getWeeklyInfo(): Promise<WeeklyInfo | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=14&timezone=Asia%2FOmsk`

  return axios.get(url)
    .then((response: any) => {
      return response.data.daily;
    })
    .catch((error: any) => {
      return 'error';
    })
}

export function getMoonPhase(): Promise<number | string> {
  const url = `https://wttr.in/Omsk?format=j1`

  return axios.get(url)
    .then((response: any) => {
      const illumStr = response.data.weather[0].astronomy[0].moon_illumination;
      const phase = parseFloat(illumStr) / 100;
      return phase;
    })
    .catch((error: any) => {
      return 'error'
    })
}

export function getSunInfo(): Promise<number[] | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=shortwave_radiation,direct_radiation,diffuse_radiation,cloud_cover&forecast_days=1&timezone=auto`

   return axios.get(url)
    .then((response: any) => {
      return response.data
    })
    .catch((error: any) => {
      return 'error'
    })
}