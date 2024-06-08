"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import {
  clearSky,
  cloudy,
  drizzleIcon,
  navigation,
  rain,
  snow,
} from "@/app/utils/Icons";
import { kelvinToCelsius } from "@/app/utils/misc";
import moment from "moment";
import 'moment/locale/ru';
import {Skeleton} from "@/components/ui/skeleton"; // Импортируем локаль для moment

function Temperature() {
  const { forecast, unit } = useGlobalContext();

  if (!forecast || !forecast.main || !forecast.weather) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const { main, timezone, name, weather } = forecast;

  // Конвертация температуры в выбранную единицу измерения
  const temp = unit === "C" ? kelvinToCelsius(main.temp) : kelvinToCelsius(main.temp) * 9/5 + 32;
  const minTemp = unit === "C" ? kelvinToCelsius(main.temp_min) : kelvinToCelsius(main.temp_min) * 9/5 + 32;
  const maxTemp = unit === "C" ? kelvinToCelsius(main.temp_max) : kelvinToCelsius(main.temp_max) * 9/5 + 32;

  const [localTime, setLocalTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");

  const { main: weatherMain, description } = weather[0];

  const getIcon = () => {
    switch (weatherMain) {
      case "Drizzle":
        return drizzleIcon;
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      case "Clear":
        return clearSky;
      case "Clouds":
        return cloudy;
      default:
        return clearSky;
    }
  };

  useEffect(() => {
    moment.locale('ru');
    const interval = setInterval(() => {
      const localMoment = moment().utcOffset(timezone / 60);
      const formattedTime = localMoment.format("HH:mm:ss");
      const day = localMoment.format("dddd");

      setLocalTime(formattedTime);
      setCurrentDay(day);
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
      <div
          className="pt-6 pb-5 px-4 border rounded-lg flex flex-col
        justify-between dark:bg-dark-grey shadow-sm dark:shadow-none"
      >
        <p className="flex justify-between items-center">
          <span className="font-medium">{currentDay}</span>
          <span className="font-medium">{localTime}</span>
        </p>
        <p className="pt-2 font-bold flex gap-1">
          <span>{name}</span>
          <span>{navigation}</span>
        </p>
        <p className="py-10 text-7xl font-bold self-center">{temp.toFixed(1)}°{unit}</p>

        <div>
          <div>
            <span>{getIcon()}</span>
            <p className="pt-2 capitalize text-lg font-medium">{description}</p>
          </div>
          <p className="flex items-center gap-2">
            <span>мин: {minTemp.toFixed(1)}°{unit}</span>
            <span>макс: {maxTemp.toFixed(1)}°{unit}</span>
          </p>
        </div>
      </div>
  );
}

export default Temperature;
