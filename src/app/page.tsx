'use client'

import { sunPosition, lightDayLenght, sunCycleTimes } from '@/weatherGetter/suncalc';
import { getWeatherInfo, getHourlyInfo, getWeeklyInfo, getOmskTime, getMoonPhase, getSunInfo } from '@/weatherGetter/weather'
import { useState, useEffect } from 'react';
import { getBgColor, getDayNameByNumber, getWeatherDescription, translateMoonPhase } from '@/visual/visualFunctions';

import YandexMap from '@/components/yandexmap';
import WeatherEffects from '@/components/WeatherEffects';


export default function Home() {
  const isMobile = typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  const [weatherInfo, setWeatherInfo] = useState<any | null>(null);
  useEffect(() => {
    const loadWeather = async () => {
      const weatherData = await getWeatherInfo(54.9924, 73.3686);
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
    const interval = setInterval(loadMoonPhase, 6000000);

    return () => clearInterval(interval)
  }, [])
  
  const [sunRadData, setSunRadData] = useState<any>(null);
  useEffect(() => {
    const loadSunRadData = async () => {
      const sunRadData = await getSunInfo();
      setSunRadData(sunRadData);
    }
    loadSunRadData();
    const interval = setInterval(loadSunRadData, 10000);

    return () => clearInterval(interval)
  }, [])

  const [allDataLoaded, setAllDataLoaded] = useState(false);
  useEffect(() => {
    if (weatherInfo && hourlyInfo && sunPos) {
      setAllDataLoaded(true);
    }
  }, [weatherInfo, hourlyInfo, sunPos, weeklyInfo]);

  const [weekOffset, setWeekOffset] = useState(0);
  const visible_days = 7;
  const maxOffset = weeklyInfo ? weeklyInfo.time.length - visible_days : 0;
  const nextWeek = () => {
    setWeekOffset(o => Math.min(o + visible_days, maxOffset));
  };

  const prevWeek = () => {
    setWeekOffset(o => Math.max(o - visible_days, 0));
  };

  let bgcolor: string | undefined = getBgColor(sunPos);
  let weatherIcon = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[0] : '⏳';
  let weatherDesc = weatherInfo ? getWeatherDescription(weatherInfo.weather_code, bgcolor)[1] : '⏳';
  let moonPhaseDesc = moonPhase ? translateMoonPhase(moonPhase) : '⏳';
  let weatherCode = weatherInfo?.weather_code;

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
      <WeatherEffects weatherCode={weatherCode} />
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
    <div className="weekly-weather-wrapper">
      <button className="weekly-arrow" onClick={prevWeek} disabled={weekOffset === 0}>
        {'<'}
      </button>
      <div className="weekly-weather-block">
        {weeklyInfo?.time?.slice(isMobile ? 0 : weekOffset, isMobile ? weeklyInfo.time.length : weekOffset + visible_days).map((day: string, i: number) => (
          <div className="weekly-weather-item" key={i}>
            <div className="weekly-weather-data">{day}</div>
            <div className="weekly-weather-temp">
              {Math.round(weeklyInfo.temperature_2m_min[weekOffset + i])}° /
              {Math.round(weeklyInfo.temperature_2m_max[weekOffset + i])}°
            </div>
            <div className="weekly-weather-icon">
              {getWeatherDescription(weeklyInfo.weathercode[weekOffset + i], bgcolor)[0]}
            </div>
            <div className="weekly-weather-data">
              {getDayNameByNumber(weeklyInfo.time[i])}
            </div>
          </div>
        ))}
      </div>
        <button
          className="weekly-arrow" onClick={nextWeek} disabled={weekOffset >= maxOffset}>
          {'>'}
        </button>
    </div>
    <div className="info-block">
      <div style={{ borderRadius: '20px' }}>
        <YandexMap bgcolor={bgcolor || '#ffffff'} currentWeatherInfo={weatherInfo}/>
      </div>
      <div className="info-block-right">
        <div className='info-block-item'>
          <p style={{ textAlign: 'center', color: '#dbd8d8', fontSize: '18px' }}>Сегодня</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>🌅{sunCycleTimes(now)[0]} - рассвет, 🌇{sunCycleTimes(now)[1]} - закат</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>☀️{lightDayLenght(now)} - длина светового дня</p>
          <p style={{ marginLeft: '20px', fontSize: '14px' }}>{moonPhaseDesc}</p>
        </div>
        <div className="info-block-item" style={{ background: '#c348d333' }}>
          <p style={{ textAlign: 'center', color: '#dbd8d8', fontSize: '18px' }}>Сейчас</p>
          <p style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '0.8' }}>Облачность: {sunRadData?.hourly?.cloud_cover ? sunRadData.hourly.cloud_cover[now.getHours()] + '%' : '⏳'}</p>
          <p style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '0.8' }}>Кратковолновая радиация:  {sunRadData?.hourly?.shortwave_radiation ? sunRadData.hourly.shortwave_radiation[now.getHours()] + ' W/m²' : '⏳'}</p>
          <p style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '0.8' }}>Прямая радиация: {sunRadData?.hourly?.direct_radiation ? sunRadData.hourly.direct_radiation[now.getHours()] + ' W/m²' : '⏳'}</p>
          <p style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '0.8' }}>Рассеянная радиация: {sunRadData?.hourly?.diffuse_radiation ? sunRadData.hourly.diffuse_radiation[now.getHours()] + ' W/m²' : '⏳'}</p>
        </div>
      </div>  
    </div>
  </div>
  )
}