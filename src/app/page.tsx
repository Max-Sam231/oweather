'use client'

import { sunPosition } from '@/weatherGetter/suncalc';
import { getWeatherInfo } from '@/weatherGetter/weather'
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
  
  let bgcolor: string | undefined = getBgColor(sunPos);
  let weatherIcon = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor) : '⏳';

  return (
    <div style={{
      backgroundColor: bgcolor,
      minHeight: '100vh',
    }}>
      <div className="main-weather-block">
        <div className="main-weather-content">
          <h1 className="main-weather-block__weather">{weatherInfo?.temperature_2m ? Math.round(weatherInfo.temperature_2m) + '°' : 'Loading...'}</h1>
          </div>
          <div className="main-weather-content">
            <h1 className="main-weather-block__code">{weatherIcon}</h1>
            <p className="main-weather-block__appTemp">{weatherInfo?.apparent_temperature ? 'Ощущается как ' + Math.round(weatherInfo.apparent_temperature) + '°' : 'Loading...'}</p>
          </div>
          <p className="main-weather-block__time">{now.toLocaleTimeString().slice(0, 5)}</p>
      </div>
    </div>
  )
}