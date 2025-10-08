"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetWeatherQuery } from "@/state/api";
import type { WeatherDay } from "@/types/drizzleTypes";

export default function Weather({ lat, lon }: { lat: number; lon: number }) {
  const { t } = useLanguage();
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [showFull, setShowFull] = useState(false);
  const {
    data: weather,
    isLoading: loading,
    error,
  } = useGetWeatherQuery({ latitude: lat, longitude: lon });

  useEffect(() => {
    if (weather?.forecast && Array.isArray(weather.forecast)) {
      setForecast(weather.forecast);
    }
  }, [weather]);

  if (loading)
    return <div className="text-sm text-gray-500">{t("loading")}</div>;
  if (error || forecast.length === 0)
    return <div className="text-sm text-red-500">{t("weatherError")}</div>;

  const today = forecast[0];

  return (
    <div className="mb-6">
      <h4 className="text-sm uppercase text-gray-500 mb-2 tracking-wide">{t("weather")}</h4>

      <div
        onClick={() => setShowFull((s) => !s)}
        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
      >
        <img
          src={today.icon}
          alt={today.description}
          className="w-12 h-12 rounded-full bg-white/70 p-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-gray-800 text-base">
            {Math.round(today.temp_max)}° / {Math.round(today.temp_min)}°
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {today.description}
          </div>
        </div>
        <button className="text-blue-500 text-sm font-medium px-2 py-1 rounded hover:bg-blue-100 transition">
          {showFull ? t("hideForecast") : t("showForecast")}
        </button>
      </div>

      {showFull && (
        <div
          className="mt-3 grid gap-3 animate-fade-in"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          }}
        >
          {forecast.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:-translate-y-0.5 hover:shadow transition-transform"
            >
              <div className="text-xs font-medium text-gray-600 mb-1">
                {day.date}
              </div>
              <img
                src={day.icon}
                alt={day.description}
                className="w-9 h-9 my-2"
              />
              <div className="text-sm font-semibold text-gray-800">
                {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
