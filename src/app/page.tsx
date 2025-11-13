import { getWeather } from '@/weatherGetter/weather'
import { getWaitUntilPromiseFromEvent } from 'next/dist/server/web/spec-extension/fetch-event'

export default async function Home() {
  const weather = await getWeather() as any;

  return <div className="main-weather-block">
    <h1>{weather.temperature}°</h1>
  </div>
}