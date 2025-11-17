const axios = require('axios');

const lat = 54.9924;
const lon = 73.3686;

export function getTemp(): Promise< | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  return axios.get(url)
    .then((response: any) => {
      const temperature: number = response.data.current_weather.temperature;
      const appTemperature: number = response.data.current_weather.apparent_temperature;
      return temperature;
    })
    .catch((error: any) => {
      return "error"
    })
}

export function getAppTemperature(): Promise< | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature,apparent_temperature,weather_code`;

  return axios.get(url)
    .then((response: any) => {
      const appTemperature: number = response.data.current.apparent_temperature;
      return appTemperature;
    })
    .catch((error: any) => {
      return "error"
    })
}

export function getWeatherCode(): Promise<number | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  
  return axios.get(url)
    .then((response: any) => {
      const weatherCode = response.data.current_weather.weathercode;
      return weatherCode;
    })
    .catch((error: any) => {
      return "error";
    })  
  }
