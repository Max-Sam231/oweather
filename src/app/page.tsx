'use client'

import { sunPosition } from '@/weatherGetter/suncalc';
import { getWeatherInfo, getHourlyInfo } from '@/weatherGetter/weather'
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

  const [hourlyInfo, setHourlyInfo] = useState<any>(null);
  
  useEffect(() => {

    const loadHourlyInfo = async () => {
      const hourlyTempData = await getHourlyInfo();
      setHourlyInfo(hourlyTempData);
    };

    loadHourlyInfo();
    const interval = setInterval(loadHourlyInfo, 10000);

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
      <div className='hourly-weather-block'>
        {now.getHours() + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours()], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours()]) + '° ': '⏳'}
        {now.getHours() + 1 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 1], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 1]) + '° ': '⏳'}
        {now.getHours() + 2 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 2], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 2]) + '° ': '⏳'}
        {now.getHours() + 3 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 3], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 3]) + '° ': '⏳'}
        {now.getHours() + 4 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 4], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 4]) + '° ': '⏳'}
        {now.getHours() + 5 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 5], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 5]) + '° ': '⏳'}
        {now.getHours() + 6 + ':00'}
        {hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 6], bgcolor)[0] : '⏳'}
        {hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 6]) + '°': '⏳'}

      </div>
      
    </div>
    </div>
  )
}