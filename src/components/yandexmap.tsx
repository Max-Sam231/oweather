import { useEffect, useRef } from "react";
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
  currentWeatherInfo?: WeatherInfo | null;
}

export default function YandexMap({ bgcolor, currentWeatherInfo }: YandexMapProps) {
  const mapInitialized = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const precObjects = useRef<any>([]);

  const omRegionBounds: [[number, number], [number, number]] = [
    [53.5, 72.0], 
    [57.5, 75.5], 
  ];

  const clearPrecs = () => {
    if (mapRef.current && precObjects.current.length > 0) {
      precObjects.current.forEach((obj: any) => mapRef.current.geoObjects.remove(obj));
      precObjects.current = [];
    }
  };

  const generateGrid = (bounds: [[number, number], [number, number]], squareKm = 2500) => {
    const [[south, west], [north, east]] = bounds;
    const latDistance = 111;
    const centerLat = (south + north) / 2;
    const lonDistance = 111 * Math.cos((centerLat * Math.PI) / 180); 

    const latStep = Math.sqrt(squareKm) / latDistance;
    const lonStep = Math.sqrt(squareKm) / lonDistance; 

    const rows = Math.ceil((north - south) / latStep);
    const cols = Math.ceil((east - west) / lonStep);

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellSouth = south + r * latStep;
        const cellWest = west + c * lonStep;
        const cellNorth = Math.min(cellSouth + latStep, north);
        const cellEast = Math.min(cellWest + lonStep, east);

        cells.push({
          bounds: [
            [cellSouth, cellWest],
            [cellNorth, cellEast],
          ],
          center: [cellSouth + (cellNorth - cellSouth) / 2, cellWest + (cellEast - cellWest) / 2],
        });
      }
    }

    return cells;
  };

  const detectWeatherType = (code: number): "rain" | "snow" | "cloudy" | "none" => {
    const rainCodes = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82];
    const snowCodes = [71, 73, 75, 77, 85, 86];
    const cloudyCodes = [2, 3, 45, 48];

    if (snowCodes.includes(code)) return "snow";
    if (rainCodes.includes(code)) return "rain";
    if (cloudyCodes.includes(code)) return "cloudy";
    return "none";
  };

  const fetchGridWeather = async () => {
    const grid = generateGrid(omRegionBounds, 2500);

    const promises = grid.map(async (cell) => {
      try {
        const weather = await getWeatherInfo(cell.center[0], cell.center[1]);
        const type =
          weather && typeof weather === "object"
            ? detectWeatherType(weather.weather_code)
            : "none";
        return { ...cell, type };
      } catch {
        return { ...cell, type: "none" };
      }
    });

    return await Promise.all(promises);
  };

  const drawGrid = (map: any, grid: any[]) => {
    clearPrecs();
    grid.forEach((cell) => {
      if (!cell.type || cell.type === "none") return;

      let fillColor = "rgba(128,128,128,0.3)";
      let strokeColor = "rgba(128,128,128,0.6)";
      let icon;

      if (cell.type === "rain") {
        fillColor = "rgba(0,100,255,0.35)";
        strokeColor = "rgba(0,100,255,0.6)";
        icon = '🌧️';
      } else if (cell.type === "snow") {
        fillColor = "rgba(255,255,255,0.4)";
        strokeColor = "rgba(255,255,255,0.6)";
        icon = '❄️';
      } else if (cell.type === "cloudy") {
        fillColor = "rgba(160,160,160,0.25)";
        strokeColor = "rgba(160,160,160,0.55)";
        icon = '☁️';
      }

      const rectCoords = [
        [cell.bounds[0][0], cell.bounds[0][1]], 
        [cell.bounds[1][0], cell.bounds[0][1]], 
        [cell.bounds[1][0], cell.bounds[1][1]], 
        [cell.bounds[0][0], cell.bounds[1][1]], 
        [cell.bounds[0][0], cell.bounds[0][1]], 
      ];

      const polygon = new window.ymaps.Polygon(
        [rectCoords],
        {},
        {
          fillColor,
          strokeColor,
          strokeWidth: 0,
          opacity: 0.8,
          interactiveZIndex: false,
          hasBalloon: false,
          hasHint: false,
        }
      );

      map.geoObjects.add(polygon);
      precObjects.current.push(polygon);
    
      if (icon) {
      const placemark = new window.ymaps.Placemark(
        cell.center,
        {
          iconContent: icon,
        },
        {
          preset: "islands#icon",
          iconColor: "#000000",
          iconLayout: "default#imageWithContent",
          iconImageSize: [0, 0],
          iconContentOffset: [0, 0],
          hasBalloon: false,
        }
      );

      map.geoObjects.add(placemark);
      precObjects.current.push(placemark);
      }  
    });
  };

  const updateGrid = async () => {
    if (!mapRef.current) return;
    const grid = await fetchGridWeather();
    drawGrid(mapRef.current, grid);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const interval = setInterval(updateGrid, 600000);
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
        const wait = setInterval(() => {
          if (window.ymaps) {
            clearInterval(wait);
            initMap();
          }
        }, 100);
        return;
      }

      window.ymapsScriptLoaded = true;
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      document.head.appendChild(script);
      script.onload = initMap;
      script.onerror = () => (window.ymapsScriptLoaded = false);
    };

    const initMap = () => {
      if (window.ymaps && !mapInitialized.current && mapContainerRef.current) {
        window.ymaps.ready(() => {
          try {
            const map = new window.ymaps.Map(
              mapContainerRef.current,
              {
                center: [55.0, 73.8],
                zoom: 7,
                controls: [],
              },
              {
                restrictMapArea: omRegionBounds,
              }
            );

            mapRef.current = map;

            const bgNight = [
              "#1a1a1a",
              "#2d3847",
              "#3a4a5d",
              "#4a5c72",
              "#1a2332",
              "#1e1e2d",
              "#2d2d2d",
            ];
            const theme = bgNight.includes(bgcolor || "#ffffff") ? "dark" : "light";

            map.layers.add(
              new window.ymaps.Layer(
                `https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=${theme}&lang=ru_RU&%c&%l&scale={{ scale }}`
              )
            );

            updateGrid();
            mapInitialized.current = true;
          } catch (e) {
            console.error("error", e);
          }
        });
      }
    };

    loadYandexMap();
  }, [bgcolor]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        marginTop: "20px",
        marginLeft: "210px",
        padding: "20px",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <div
        ref={mapContainerRef}
        style={{
          width: "600px",
          height: "450px",
          borderRadius: "40px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
