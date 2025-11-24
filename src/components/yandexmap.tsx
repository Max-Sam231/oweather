import { useState, useEffect, useRef } from "react";

const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

declare global {
  interface Window {
    ymaps: any;
    ymapsScriptLoaded?: boolean;
  }
}

interface YandexMapProps {
  bgcolor?: string; 
}

export default function YandexMap({ bgcolor }: YandexMapProps) {
  const mapInitialized = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null); 

  
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
        console.error('Не удалось загрузить Яндекс Карты');
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
                center: [54.9924, 73.3686],
                zoom: 10,
                controls: [], 
            }, {
                suppressMapOpenBlock: true,
                suppressObsoleteBrowserNotifier: true,
            });
            const bgcolorsNight: string[] = ["#1a1a1a", "#2d3847" , "#3a4a5d" , "#4a5c72", "#1a2332", "#1e1e2d", "#2d2d2d"];
            let theme = bgcolorsNight.includes(bgcolor ? bgcolor : '#ffffff') ? 'dark' : 'light';
            
            map.layers.add(new window.ymaps.Layer(`https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=${theme}&lang=ru_RU&%c&%l&scale={{ scale }}`));

            mapInitialized.current = true;
            console.log('Карта успешно инициализирована');
          } catch (error) {
            console.error('Ошибка создания карты:', error);
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
        justifyContent: 'center', 
        marginTop: '20px',
        padding: '20px',
        flexDirection: 'column',
        alignItems: 'center'
    }}>
      <div 
        ref={mapContainerRef} 
        style={{
            width: '80%', 
            height: '400px', 
            borderRadius: '40px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
        }}
      ></div>
    </div>
  );
}