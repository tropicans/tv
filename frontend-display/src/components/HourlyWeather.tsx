import React, { useEffect, useState } from "react";
import { Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake, CloudRain, MapPin } from "lucide-react";

interface WeatherData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

interface Forecast {
  time: string;
  temp: number;
  code: number;
}

const getWeatherIcon = (code: number, size: number = 64, className: string = "") => {
  if (code === 0) return <Sun size={size} className={`text-yellow-500 ${className}`} strokeWidth={2.5} />;
  if (code === 1 || code === 2) return <CloudSun size={size} className={`text-sky-500 ${className}`} strokeWidth={2} />;
  if (code === 3) return <Cloud size={size} className={`text-slate-400 ${className}`} strokeWidth={2} />;
  if (code === 45 || code === 48) return <CloudFog size={size} className={`text-slate-400 ${className}`} strokeWidth={2} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle size={size} className={`text-blue-400 ${className}`} strokeWidth={2} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} className={`text-blue-500 ${className}`} strokeWidth={2} />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <Snowflake size={size} className={`text-sky-300 ${className}`} strokeWidth={2} />;
  if (code >= 95 && code <= 99) return <CloudLightning size={size} className={`text-amber-500 ${className}`} strokeWidth={2} />;
  return <CloudSun size={size} className={`text-sky-500 ${className}`} strokeWidth={2} />;
};

export const HourlyWeather = () => {
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = -6.2925;
        const lon = 106.7972;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&timezone=Asia%2FJakarta&forecast_days=2`;
        const res = await fetch(url);
        const data = await res.json();
        
        const hourly: WeatherData = data.hourly;
        const now = new Date();
        const currentMs = now.getTime();
        const futureForecasts: Forecast[] = [];
        
        for (let i = 0; i < hourly.time.length; i++) {
          const forecastTime = new Date(hourly.time[i]).getTime();
          // Include current hour
          if (forecastTime >= currentMs - 3600000) {
            futureForecasts.push({
              time: hourly.time[i],
              temp: Math.round(hourly.temperature_2m[i]),
              code: hourly.weather_code[i]
            });
            if (futureForecasts.length === 5) break;
          }
        }
        
        setForecast(futureForecasts);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 mins
    return () => clearInterval(interval);
  }, []);

  if (loading || forecast.length === 0) return null;

  const current = forecast[0];
  const nextHours = forecast.slice(1);

  return (
    <section className="col-span-5 row-span-1 bg-white/70 backdrop-blur-2xl rounded-[1.5rem] px-8 py-4 shadow-sm flex items-center justify-between gap-6 border border-white/60 h-full overflow-hidden">
      {/* Current Weather (Left Side) */}
      <div className="flex flex-col border-r border-slate-200/60 pr-8 shrink-0 justify-center">
        <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
          <MapPin size={16} className="text-primary" strokeWidth={2.5} />
          <span className="font-label text-[11px] font-bold text-slate-600 uppercase tracking-widest">Cilandak</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl font-headline font-black text-slate-800 tracking-tighter tabular-nums leading-none">
            {current.temp}°
          </span>
          <div className="drop-shadow-sm">
            {getWeatherIcon(current.code, 46)}
          </div>
        </div>
      </div>

      {/* Hourly Forecast (Right Side) */}
      <div className="flex-grow flex justify-between items-center pl-2">
        {nextHours.map((f, i) => {
          const timeStr = f.time.substring(11, 16);
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="font-label text-xs text-slate-500 font-bold tabular-nums tracking-wider">{timeStr}</span>
              <div className="drop-shadow-sm opacity-90 transition-transform duration-500 hover:scale-110">
                {getWeatherIcon(f.code, 28)}
              </div>
              <span className="font-headline font-black text-lg text-slate-700 tabular-nums">{f.temp}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
