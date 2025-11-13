const axios = require('axios');

const lat = 54.9924;
const lon = 73.3686;

interface WeatherData {
    temperature: number;
    time: string;
}

export function getWeather(): Promise<WeatherData | string> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    return axios.get(url)
      .then((response: any) => {
        const temperature: number = response.data.current_weather.temperature;
        const time: string = response.data.current_weather.time;
        return {temperature, time}
      })
      .catch((error: any) => {
        return "error"
      })
}