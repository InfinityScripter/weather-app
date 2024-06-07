"use client";
import React from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { clearSky, cloudy, drizzleIcon, rain, snow } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import moment from "moment";
import { kelvinToCelsius } from "@/app/utils/misc";

function DailyForecast() {
  const { forecast, fiveDayForecast } = useGlobalContext();

  // Проверка наличия данных перед использованием
  if (!fiveDayForecast || !fiveDayForecast.city || !fiveDayForecast.list) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  if (!forecast || !forecast.weather) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Фильтрация списка прогноза на сегодняшний день
  const todaysForecast = fiveDayForecast.list.filter(
      (forecast) => forecast.dt_txt.startsWith(todayString)
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
                    {todaysForecast.map((forecast) => {
                      return (
                          <CarouselItem key={forecast.dt_txt} className="flex flex-col gap-4 basis-[8.5rem] cursor-grab">
                            <p className=" text-gray-300">
                              {moment(forecast.dt_txt).format("HH:mm")}
                            </p>
                            <p>{getIcon()}</p>
                            <p className="mt-4">{kelvinToCelsius(forecast.main.temp)}°C</p>
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
