'use client'

import { sunPosition } from '@/weatherGetter/suncalc';
import { getWeather } from '@/weatherGetter/weather'
import { getWaitUntilPromiseFromEvent } from 'next/dist/server/web/spec-extension/fetch-event'
import { useState, useEffect } from 'react';

export default function Home() {
  const [now, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  const [weather, setWeather] = useState<any>(null);
  useEffect(() => {
    const loadWeather = async () => {
      const weatherData = await getWeather();
      setInterval(() => setWeather(weatherData), 1000);
    };
    
    loadWeather();
  }, [])

  /*const [sunPos, setSunPos] = useState<any>(null);
  useEffect(() => {
    const load
  })*/
  const sunPos = sunPosition(now);
  let bgcolor;

  switch (sunPos) {
    case 'night':
      bgcolor = "#1a1a1a" 
      break;
    case 'morning0d':
      bgcolor = "#2d3847"  
      break;
    case 'morning1d':
      bgcolor = "#3a4a5d"  
      break;
    case 'morning2d':
      bgcolor = "#4a5c72"  
      break;
    case 'sunrise':
      bgcolor = "#fff9db"  
      break;
    case 'morning0l':
      bgcolor = "#a8c6e0"  
      break;
    case 'morning1l':
      bgcolor = "#87b3d9" 
      break;
    case 'day':
      bgcolor = "#69abec"
      break;
    case 'evening0l':
      bgcolor = "#f7bd96ff"
      break;
    case 'sunset':
      bgcolor = "#f8b776f6"
      break;
    case 'evening0d':
      bgcolor = "#1a2332"
      break;
    case 'evening1d':
      bgcolor = "#1e1e2d"
      break;
    case 'evening2d':
      bgcolor = "#2d2d2d" 
      break;
  }

  return (
    <div style={{
      backgroundColor: bgcolor,
      minHeight: '100vh',
    }}>
      <div className="main-weather-block">
        <h1>{weather ? Math.round(weather.temperature) + '°' : 'Loading...'}</h1>
        <p>{now.toLocaleTimeString()}</p>
      </div>
    </div>
  )
}