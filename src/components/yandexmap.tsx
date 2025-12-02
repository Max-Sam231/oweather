import { useState, useEffect, useRef } from "react";
import { getWeatherInfo, WeatherInfo } from "@/weatherGetter/weather";

const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

declare global {
  interface Window {
    ymaps: any;
    ymapsScriptLoaded?: boolean;
  }
}

interface YandexMapProps {
  bgcolor?: string; 
  currentWeatherInfo?: WeatherInfo;
}

interface Precipitation {
  lat: number;
  lon: number;
  type: 'rain' | 'snow' | 'cloudy';
  name?: string;
}

export default function YandexMap({ bgcolor, currentWeatherInfo }: YandexMapProps) {
  const mapInitialized = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null); 
  const mapRef = useRef<any>(null);
  const precObjects = useRef<any>([]);
  
  const fetchPrecData = async (): Promise<Precipitation[]> => {
    if (currentWeatherInfo) {
      const hasPrecipitation = [51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(currentWeatherInfo.weather_code);
      const isCloudy = [2, 3, 45, 48].includes(currentWeatherInfo.weather_code);

      if (hasPrecipitation || isCloudy) {
        const mainType = hasPrecipitation ? ([71,73,75,77,85,86].includes(currentWeatherInfo.weather_code) ? 'snow' : 'rain') : 'cloudy';
        const districts = [
          { name: "Советский", lat: 55.041983, lon: 73.294514 },
          { name: "Кировский", lat: 54.968711, lon: 73.284615 },
          { name: "Центральный", lat: 55.004804, lon: 73.418599 },
          { name: "Октябрьский", lat: 54.954481, lon: 73.498719 },
          { name: "Ленинский", lat: 54.92032, lon: 73.366101 }
        ];

        return districts.map(district => ({
          lat: district.lat,
          lon: district.lon,
          type: mainType,
          name: district.name
        }));
      }
    }
    return [];
  }

  const clearPrecs = () => {
     if (mapRef.current && precObjects.current.length > 0) {
      precObjects.current.forEach((obj: any) => {
        mapRef.current.geoObjects.remove(obj);
      });
      
      precObjects.current = [];
     }
  }

  const drawPrecs = (map: any, precData: Precipitation[]) => {
    clearPrecs();
    
    if (precData.length === 0) return;
    
    precData.forEach((zone) => {
      const coordinates = [];
      const radius = 0.04; 
      
      for (let i = 0; i <= 36; i++) {
        const angle = (i / 36) * 2 * Math.PI;
        const lat = zone.lat + radius * Math.cos(angle); 
        const lon = zone.lon + radius * Math.sin(angle);
        coordinates.push([lat, lon]);
      }
      coordinates.push(coordinates[0]);

      let fillColor, strokeColor, balloonText;
    
      if (zone.type === 'snow') {
        fillColor = 'rgba(255, 255, 255, 0.4)';
        strokeColor = 'rgba(255, 255, 255, 0.8)';
        balloonText = 'Снег';
      } else if (zone.type === 'rain') {
        fillColor = 'rgba(0, 100, 255, 0.4)';
        strokeColor = 'rgba(0, 100, 255, 0.8)';
        balloonText = 'Дождь';
      } else {
        fillColor = 'rgba(128, 128, 128, 0.3)';
        strokeColor = 'rgba(128, 128, 128, 0.6)';
        balloonText = 'Облачно';
      }

      const polygon = new window.ymaps.Circle(
        [
          [zone.lat, zone.lon],
          3000
        ],
        {
          balloonContent: `${balloonText} - ${zone.name}`
        },
        {
          fillColor: fillColor,
          strokeColor: strokeColor,
          strokeWidth: 2,
          strokeOpacity: 0.8,
          balloonCloseButton: false,
          hideIconOnBalloonOpen: false, 
          openEmptyBalloon: false,
          openBalloonOnClick: false,
          hasBalloon: false,
          hasHint: false,
        }
      );

      map.geoObjects.add(polygon);
      precObjects.current.push(polygon);
    });

  }


  const updatePrecs = async () => {
    if (!mapRef.current) return;
    const precData = await fetchPrecData();
    if (precData.length > 0) {
      drawPrecs(mapRef.current, precData);
    }
  }
  
  useEffect(() => {
    if (!mapRef.current) return;

    const interval = setInterval(() => {
      updatePrecs();
    }, 600000); 

    return () => clearInterval(interval);
  }, [mapRef.current]);
  
  useEffect(() => {
    if (mapInitialized.current) return;

    const loadYandexMap = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      if (window.ymapsScriptLoaded) {
        const waitForScript = setInterval(() => {
          if (window.ymaps) {
            clearInterval(waitForScript);
            initMap();
          }
        }, 100);
        return;
      }

      window.ymapsScriptLoaded = true;

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      document.head.appendChild(script);
      
      script.onload = initMap;

      script.onerror = () => {
        window.ymapsScriptLoaded = false;
      };
    };

    const initMap = () => {
      if (window.ymaps && !mapInitialized.current && mapContainerRef.current) {
        window.ymaps.ready(() => {
          if (!mapContainerRef.current || mapContainerRef.current.children.length > 0) {
            return;
          }

          try {
            const map = new window.ymaps.Map(mapContainerRef.current, { 
                center: [54.982084, 73.3686],
                zoom: 11,
                controls: [], 
            }, {
                suppressMapOpenBlock: true,
                suppressObsoleteBrowserNotifier: true,
                suppressMovable: true,        
                suppressZoomScroll: true,     
                suppressDblClickZoom: true,   
                drag: false,                 
                scrollZoom: false,            
                dblClickZoom: false,          
                multiTouch: false,            
            });
            
            map.behaviors.disable([
            'drag',           
            'scrollZoom',    
            'dblClickZoom',   
            'multiTouch',    
            'rightMouseButtonMagnifier', 
            'leftMouseButtonMagnifier', 
            'ruler'         
          ]);

            mapRef.current = map;
            
            const bgcolorsNight: string[] = ["#1a1a1a", "#2d3847" , "#3a4a5d" , "#4a5c72", "#1a2332", "#1e1e2d", "#2d2d2d"];
            let theme = bgcolorsNight.includes(bgcolor ? bgcolor : '#ffffff') ? 'dark' : 'light';
            
            map.layers.add(new window.ymaps.Layer(`https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=${theme}&lang=ru_RU&%c&%l&scale={{ scale }}`));

            updatePrecs();

            mapInitialized.current = true;
          } catch (error) {
            console.error('error');
          }
        });
      }
    };

    loadYandexMap();

    return () => {
    };
    
  }, []);

  return (
    <div style={{
        display: 'flex', 
        justifyContent: 'left', 
        marginTop: '20px',
        marginLeft: '210px',
        padding: '20px',
        flexDirection: 'column',
        alignItems: 'left'
    }}>
      <div 
        ref={mapContainerRef} 
        style={{
          width: '600px', 
          height: '450px', 
          borderRadius: '40px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      ></div>
    </div>
  );
}