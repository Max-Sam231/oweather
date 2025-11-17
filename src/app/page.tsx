'use client'

import { sunPosition } from '@/weatherGetter/suncalc';
import { getTemp, getWeatherCode } from '@/weatherGetter/weather'
import { useState, useEffect } from 'react';
import { getBgColor, getWeatherDescription } from '@/visual/visualFunctions';

export default function Home() {
  const [now, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  
  const [weather, setWeather] = useState<any>(null);
  useEffect(() => {
    const loadWeather = async () => {
      const weatherData = await getTemp();
      setWeather(weatherData);
    };
    
    loadWeather();

    const interval = setInterval(loadWeather, 1800000);

    return () => clearInterval(interval)
  }, [])


  const [sunPos, setSunPos] = useState<any>(null);
  useEffect(() => {
    const loadSunPos = async () => {
      const sunPosData = await sunPosition(new Date());
      setSunPos(sunPosData);
    };

    loadSunPos();
    const interval = setInterval(loadSunPos, 60000);

    return () => clearInterval(interval)
  }, [])
  

  const [weatherCode, setWeatherCode] = useState<any>(null);
  useEffect(() => {
    const loadWeatherCode = async () => {
      const weatherCodeData = await getWeatherCode();
      setWeatherCode(weatherCodeData);
    };

    loadWeatherCode();
    const interval = setInterval(loadWeatherCode, 900000);

    return () => clearInterval(interval)
  }, [])

  let weatherIcon = getWeatherDescription(weatherCode);
  let bgcolor = getBgColor(sunPos);

  return (
    <div style={{
      backgroundColor: bgcolor,
      minHeight: '100vh',
    }}>
      <div className="main-weather-block">
        <h1 className="main-weather-block__weather">{weather ? Math.round(weather) + '°' + " " + weatherIcon: 'Loading...'}</h1>
        <p className="main-weather-block__time">{now.toLocaleTimeString()}</p>
      </div>
    </div>
  )
}