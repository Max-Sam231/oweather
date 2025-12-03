export const getWeatherDescription = (code: number, bgcolor: string) => {
    
    const bgcolorsNight: string[] = ["#1a1a1a", "#2d3847" , "#3a4a5d" , "#4a5c72", "#1a2332", "#1e1e2d", "#2d2d2d"];
    const nightFlag = bgcolorsNight.includes(bgcolor);
    
    const weatherMapIcons: { [key: number]: string } = {
      0: nightFlag ? '🌙' : '☀️',
      1: nightFlag ? '☁️' : '🌤️', 
      2: nightFlag ? '☁️' : '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌧️',
      53: '🌧️', 
      55: '🌧️',
      56: '🌨️',
      57: '🌨️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      66: '🌨️',
      67: '🌨️', 
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: nightFlag ? '🌧️' : '🌦️',
      81: nightFlag ? '🌧️' : '🌦️',
      82: nightFlag ? '🌧️' : '🌦️',
      85: '❄️',
      86: '❄️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    };

    const weatherMapDescs: { [key: number]: string } = {
      0: 'Ясно',
      1: 'Преимущественно ясно', 
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Туман c инеем',
      51: 'Слабая морось',
      53: 'Умеренная морось', 
      55: 'Сильная морось',
      56: 'Слабая ледяная морось',
      57: 'Сильная ледяная морось',
      61: 'Небольшой дождь',
      63: 'Умеренный дождь',
      65: 'Ливень',
      66: 'Слабый ледяной дождь',
      67: 'Сильный ледяной дождь', 
      71: 'Слабый снегопад',
      73: 'Умеренный снегопад',
      75: 'Сильный снегопад',
      77: 'Очень мелкий снег',
      80: 'Кратковременный ливень',
      81: 'Ливень',
      82: 'Ливень',
      85: 'Кратковременные снегопад',
      86: 'Кратковременные снегопад',
      95: 'Гроза',
      96: 'Гроза c небольшим градом',
      99: 'Гроза c крупным градом'
    };
    
  return [weatherMapIcons[code] || `Неизвестно (${code})`, weatherMapDescs[code] || `Неизвестно (${code})`];
};

export function getBgColor(sunPos: string): string {
    let bgcolor: string = "";
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
        bgcolor = "#BA9DCB"
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
  return bgcolor
}

export function translateMoonPhase(phase: number): string {
  if (phase === 1 || phase === 0) {
    return '🌑 Новолуние'
  }
  if (phase < 0.25 && phase > 0) {
    return '🌘 Убывающий серп'
  }
  if (phase === 0.25) {
    return '🌗 Последняя четверть'
  }
  if (phase < 0.5 && phase > 0.25) {
    return '🌖 Убывающая луна'
  }
  if (phase === 0.5) {
    return '🌕 Полнолуние'
  }
  if (phase < 0.75 && phase > 0.5) {
    return '🌔 Растущая луна'
  }
  if (phase === 0.75) {
    return '🌓 Первая четверть'
  }
  if (phase < 1 && phase > 0.75) {
    return '🌒 Растущий серп'
  }
  return String(phase)
}