const axios = require('axios');

const lat = 54.9924;
const lon = 73.3686;

interface WeatherInfo {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  time: string;
}

export function getWeatherInfo(): Promise<WeatherInfo | string> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code`;

  return axios.get(url)
    .then((response: any) => {
      return response.data.current;
    })
    .catch((error: any) => {
      return "error"
    })
}
