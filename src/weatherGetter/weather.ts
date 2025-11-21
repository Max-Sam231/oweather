const axios = require('axios');

const lat = 54.9924;
const lon = 73.3686;

interface WeatherInfo {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  relative_humidity_2m: number;
  surface_pressure: number;
  wind_speed_10m: number;
  time: string;
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

export function getWeatherInfo(): Promise<WeatherInfo | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,surface_pressure,wind_speed_10m&windspeed_unit=ms&timezone=Asia%2FOmsk`;

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