"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { thermometer } from "@/app/utils/Icons";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/app/utils/misc";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function FeelsLike() {
  const { forecast, unit } = useGlobalContext();

  if (!forecast || !forecast.main || forecast.main.feels_like === undefined) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const { feels_like, temp_min, temp_max } = forecast.main;

  // Преобразование температур в выбранную единицу
  const feelsLikeTemp = unit === "C" ? kelvinToCelsius(feels_like) : kelvinToFahrenheit(feels_like);
  const minTemp = unit === "C" ? kelvinToCelsius(temp_min) : kelvinToFahrenheit(temp_min);
  const maxTemp = unit === "C" ? kelvinToCelsius(temp_max) : kelvinToFahrenheit(temp_max);

  const feelsLikeText = (
      feelsLike: number,
      minTemp: number,
      maxTemp: number
  ) => {
    const avgTemp = (minTemp + maxTemp) / 2;

    if (feelsLike < avgTemp - 5) {
      return "Ощущается значительно холоднее, чем фактическая температура.";
    }
    if (feelsLike > avgTemp - 5 && feelsLike <= avgTemp + 5) {
      return "Ощущается близко к фактической температуре.";
    }
    if (feelsLike > avgTemp + 5) {
      return "Ощущается значительно теплее, чем фактическая температура.";
    }

    return "Ощущение температуры типично для этого диапазона.";
  };

  const feelsLikeDescription = feelsLikeText(feelsLikeTemp, minTemp, maxTemp);

  return (
      <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none">
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">
            {thermometer} Ощущается как
          </h2>
          <p className="pt-4 text-2xl">{feelsLikeTemp.toFixed(1)}°{unit}</p>
        </div>

        <p className="text-sm">{feelsLikeDescription}</p>
      </div>
  );
}

export default FeelsLike;
