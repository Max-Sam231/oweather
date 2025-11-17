export const getWeatherDescription = (code: number, bgcolor: string) => {
    
    const bgcolorsNight: string[] = ["#1a1a1a", "#2d3847" , "#3a4a5d" , "#4a5c72", "#1a2332", "#1e1e2d", "#2d2d2d"];
    const nightFlag = bgcolorsNight.includes(bgcolor);
    
    const weatherMap: { [key: number]: string } = {
      0: nightFlag ? '🌙' : '☀️',
      1: nightFlag ? '☁️🌙' : '🌤️', 
      2: nightFlag ? '🌙☁️' : '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌧️',
      53: '🌧️', 
      55: '🌧️',
      56: '🌧️',
      57: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      66: '🌧️',
      67: '🌧️', 
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: nightFlag ? '🌙🌧️' : '🌦️',
      81: nightFlag ? '🌙🌧️' : '🌦️',
      82: nightFlag ? '🌙🌧️' : '🌦️',
      85: '❄️',
      86: '❄️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️'
    };
    
    return weatherMap[code] || `Неизвестно (${code})`;
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
    return bgcolor
  }