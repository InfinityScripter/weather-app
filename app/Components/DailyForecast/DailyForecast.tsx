"use client";
import React from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { clearSky, cloudy, drizzleIcon, rain, snow } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import moment from "moment";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/app/utils/misc";

interface Forecast {
  dt_txt: string;
  main: {
    temp: number;
  };
}

function DailyForecast() {
  const { forecast, fiveDayForecast, unit } = useGlobalContext();

  if (!fiveDayForecast || !fiveDayForecast.city || !fiveDayForecast.list) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  if (!forecast || !forecast.weather) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const todaysForecast = fiveDayForecast.list.filter(
      (forecast: Forecast) => forecast.dt_txt.startsWith(todayString)
  );

  const { main: weatherMain } = forecast.weather[0];

  if (todaysForecast.length < 1) {
    return <Skeleton className="h-[12rem] w-full col-span-full sm-2:col-span-2 md:col-span-2 xl:col-span-2" />;
  }

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

  return (
      <div className="pt-6 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none col-span-full sm-2:col-span-2 md:col-span-2 xl:col-span-2">
        <div className="h-full flex gap-10 overflow-hidden">
          {todaysForecast.length < 1 ? (
              <div className="flex justify-center items-center">
                <h1 className="text-[3rem] line-through text-rose-500">No Data Available!</h1>
              </div>
          ) : (
              <div className="w-full">
                <Carousel>
                  <CarouselContent>
                    {todaysForecast.map((forecast: Forecast) => {
                      const tempInUnit = unit === "C" ? kelvinToCelsius(forecast.main.temp) : kelvinToFahrenheit(forecast.main.temp);
                      return (
                          <CarouselItem key={forecast.dt_txt} className="flex flex-col ml-4 gap-4 basis-[7rem] cursor-grab">
                            <p className="text-gray-300">{moment(forecast.dt_txt).format("HH:mm")}</p>
                            <p>{getIcon()}</p>
                            <p className="mt-4">{tempInUnit.toFixed(1)}°{unit}</p>
                          </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              </div>
          )}
        </div>
      </div>
  );
}

export default DailyForecast;
