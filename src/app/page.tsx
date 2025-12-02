'use client'

import { sunPosition, lightDayLenght, sunCycleTimes } from '@/weatherGetter/suncalc';
import { getWeatherInfo, getHourlyInfo, getWeeklyInfo, getOmskTime, getMoonPhase } from '@/weatherGetter/weather'
import { useState, useEffect } from 'react';
import { getBgColor, getWeatherDescription, translateMoonPhase } from '@/visual/visualFunctions';

import YandexMap from '@/components/yandexmap';


export default function Home() {

  const [weatherInfo, setWeatherInfo] = useState<any | null>(null);
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

  const [weeklyInfo, setWeeklyInfo] = useState<any>(null);
  useEffect(() => {
    const loadWeeklyInfo = async () => {
      const weeklyWeatherData = await getWeeklyInfo();
      setWeeklyInfo(weeklyWeatherData);
    };

    loadWeeklyInfo();
    const interval = setInterval(loadWeeklyInfo, 1800000);

    return () => clearInterval(interval);
  }, [])

  const [now, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(getOmskTime()), 1000);
  }, []);

  const [sunPos, setSunPos] = useState<any>(null);
  useEffect(() => {
    const loadSunPos = async () => {
      const sunPosData = await sunPosition(now);
      setSunPos(sunPosData);
    };

    loadSunPos();
    const interval = setInterval(loadSunPos, 10000);

    return () => clearInterval(interval)
  }, [])

  const [moonPhase, setMoonPhase] = useState<any>(null);
  useEffect(() => {
    const loadMoonPhase = async () => {
      const moonPhaseData = await getMoonPhase();
      setMoonPhase(moonPhaseData);
    }
    loadMoonPhase();
    const interval = setInterval(loadMoonPhase, 10000);

    return () => clearInterval(interval)
  }, [])
  
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  useEffect(() => {
    if (weatherInfo && hourlyInfo && sunPos) {
      setAllDataLoaded(true);
    }
  }, [weatherInfo, hourlyInfo, sunPos, weeklyInfo]);

  let bgcolor: string | undefined = getBgColor(sunPos);
  let weatherIcon = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[0] : '⏳';
  let weatherDesc = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[1] : '⏳';
  let moonPhaseDesc = moonPhase ? translateMoonPhase(moonPhase) : '⏳';

  if (!allDataLoaded) {
    return (
      <div style={{ 
        backgroundColor: bgcolor, 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'whitesmoke',
        fontFamily: 'Manrope, sans-serif'
      }}>
        <div style={{
          fontSize: 100,
        }}>⏳</div>
      </div>
    );
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
      <div className='hourly-weather-block'>
        <div className='hourly-item'>
          <div className='hourly-time'>{now.getHours() % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours()], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours()]) + '° ': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 1) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 1], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 1]) + '° ': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 2) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 2], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 2]) + '° ': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 3) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 3], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 3]) + '° ': '⏳'}</div>
        </div>
        <div className='hourly-item'> 
          <div className='hourly-time'>{(now.getHours() + 4) % 24 + ':00'}</div> 
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 4], bgcolor)[0] : '⏳'}</div> 
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 4]) + '° ': '⏳'}</div> 
        </div> 
        <div className='hourly-item'>  
          <div className='hourly-time'>{(now.getHours() + 5) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 5], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 5]) + '° ': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 6) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 6], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 6]) + '°': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 7) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 7], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 7]) + '°': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 8) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 8], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 8]) + '°': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 9) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 9], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 9]) + '°': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 10) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 10], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 10]) + '°': '⏳'}</div>
        </div>
        <div className='hourly-item'>
          <div className='hourly-time'>{(now.getHours() + 11) % 24 + ':00'}</div>
          <div className='hourly-icon'>{hourlyInfo?.weather_code ? getWeatherDescription(hourlyInfo.weather_code[now.getHours() + 11], bgcolor)[0] : '⏳'}</div>
          <div className='hourly-temp'>{hourlyInfo?.temperature_2m ? Math.round(hourlyInfo.temperature_2m[now.getHours() + 11]) + '°': '⏳'}</div>
        </div>
      </div>
    </div>
    <div className='weekly-weather-block'>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[0] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[0]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[0]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[0], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[1] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[1]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[1]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[1], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[2] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[2]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[2]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[2], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[3] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[3]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[3]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[3], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[4] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[4]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[4]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[4], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[5] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[5]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[5]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[5], bgcolor)[0] : '⏳'}</div>
      </div>
      <div className='weekly-weather-item'>
        <div className='weekly-weather-data'>{weeklyInfo?.time ? weeklyInfo.time[6] : '⏳'}</div>
        <div className='weekly-weather-temp'>{weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_min[6]) + '°' : '⏳'} / {weeklyInfo?.temperature_2m_max ? Math.round(weeklyInfo.temperature_2m_max[6]) + '°' : '⏳'}</div>
        <div className='weekly-weather-icon'>{weeklyInfo?.weathercode ? getWeatherDescription(weeklyInfo.weathercode[6], bgcolor)[0] : '⏳'}</div>
      </div>
    </div>
    <div className="info-block">
      <div style={{ borderRadius: '20px' }}>
        <YandexMap bgcolor={bgcolor || '#ffffff'} currentWeatherInfo={weatherInfo}/>
      </div>
      <div className="info-block-right">
        <div className='info-block-item'>
          <p style={{ textAlign: 'center', color: '#cecdcdff', fontSize: '18px' }}>Сегодня</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>🌅{sunCycleTimes(now)[0]} - рассвет, 🌇{sunCycleTimes(now)[1]} - закат</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>☀️{lightDayLenght(now)} - длина светового дня</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>{moonPhaseDesc} - текущая фаза луны</p>
        </div>
        <div className="info-block-item"></div>
      </div>  
    </div>
  </div>
  )
}