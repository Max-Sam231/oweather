'use client'

import { sunPosition } from '@/weatherGetter/suncalc';
import { getWeatherInfo, getHourlyTemp } from '@/weatherGetter/weather'
import { useState, useEffect } from 'react';
import { getBgColor, getWeatherDescription } from '@/visual/visualFunctions';

export default function Home() {
  const [now, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  useEffect(() => {
    const loadWeather = async () => {
      const weatherData = await getWeatherInfo();
      setWeatherInfo(weatherData);
    };
    
    loadWeather();

    const interval = setInterval(loadWeather, 10000);

    return () => clearInterval(interval)
  }, [])

  const [hourlyTemp, setHourlyTemp] = useState<any>(null);
  
  useEffect(() => {

    const loadHourlyTemp = async () => {
      const hourlyTempData = await getHourlyTemp();
      setHourlyTemp(hourlyTempData);
    };

    loadHourlyTemp();
    const interval = setInterval(loadHourlyTemp, 10000);

    return () => clearInterval(interval)
  }, [])

  const [sunPos, setSunPos] = useState<any>(null);
  useEffect(() => {
    const loadSunPos = async () => {
      const sunPosData = await sunPosition(new Date());
      setSunPos(sunPosData);
    };

    loadSunPos();
    const interval = setInterval(loadSunPos, 10000);

    return () => clearInterval(interval)
  }, [])
  
  let bgcolor: string | undefined = getBgColor(sunPos);
  let weatherIcon = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[0] : '⏳';
  let weatherDesc = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[1] : '⏳';
  
  let hourlyTempPredict: number[] = [];
  if (hourlyTemp && hourlyTemp.temperature_2m) {
    const currentHour = now.getHours();
    for (let i = 0; i < 8; i++) {
      const hourIndex = (currentHour + i) % 24;
      if (hourlyTemp.temperature_2m[hourIndex] !== undefined) {
        hourlyTempPredict.push(hourlyTemp.temperature_2m[hourIndex]);
      }
    }
  }
  
  return (
    <div style={{
      backgroundColor: bgcolor,
      minHeight: '100vh',
    }}>
    <div>
      <div className="main-weather-block">
        <p className="main-weather-block__time">{now.toLocaleTimeString().slice(0, 5)}</p>
        <div className="main-weather-content">
          <h1 className="main-weather-block__weather">{weatherInfo?.temperature_2m ? Math.round(weatherInfo.temperature_2m) + '°' : '⏳'}</h1>
          <div className="main-weather-block-side">
            <p className="main-weather-block__Info">{weatherInfo?.apparent_temperature ? '👤 ' + Math.round(weatherInfo.apparent_temperature) + '°': '⏳'}</p>
            <p className="main-weather-block__Info">{weatherInfo?.relative_humidity_2m ? '💧 ' + Math.round(weatherInfo.relative_humidity_2m) + '%': '⏳'}</p>
            <p className="main-weather-block__Info">{weatherInfo?.wind_speed_10m ? '💨 ' + Math.round(weatherInfo.wind_speed_10m) + ' м/c': '⏳'}</p>
            <p className="main-weather-block__Info">{weatherInfo?.surface_pressure ? '⏱️ ' + Math.round(weatherInfo.surface_pressure * 0.750062): '⏳'}</p>
          </div>
        </div>
        <div className="main-weather-content">
          <h1 className="main-weather-block__code-icon">{weatherIcon}</h1>
          <p className="main-weather-block__code-description">{weatherDesc}</p>
        </div>
      </div>
      <p className='main-weather-block'>
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[0]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[1]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[3]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[4]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[5]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[6]) + ' ': '⏳'}
        {hourlyTemp?.temperature_2m ? Math.round(hourlyTempPredict[7]) : '⏳'}

        </p>
      
    </div>
    </div>
  )
}