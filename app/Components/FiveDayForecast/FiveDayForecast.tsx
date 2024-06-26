"use client";
import React from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { Skeleton } from "@/components/ui/skeleton";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/app/utils/misc";

function FiveDayForecast() {
    const { fiveDayForecast, unit } = useGlobalContext();

    if (!fiveDayForecast || !fiveDayForecast.city || !fiveDayForecast.list) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    const { city, list } = fiveDayForecast;

    const processData = (
        dailyData: {
            main: { temp_min: number; temp_max: number };
            dt: number;
        }[]
    ) => {
        let minTemp = Number.MAX_VALUE;
        let maxTemp = Number.MIN_VALUE;

        dailyData.forEach((day) => {
            if (day.main.temp_min < minTemp) {
                minTemp = day.main.temp_min;
            }
            if (day.main.temp_max > maxTemp) {
                maxTemp = day.main.temp_max;
            }
        });

        // Преобразование температуры в выбранную единицу
        const minTempInUnit = unit === "C" ? kelvinToCelsius(minTemp) : kelvinToFahrenheit(minTemp);
        const maxTempInUnit = unit === "C" ? kelvinToCelsius(maxTemp) : kelvinToFahrenheit(maxTemp);

        return {
            day: getRussianDayOfWeek(dailyData[0].dt),
            minTemp: minTempInUnit,
            maxTemp: maxTempInUnit,
        };
    };

    const dailyForecasts = [];

    for (let i = 0; i < 40; i += 8) {
        const dailyData = list.slice(i, i + 8);
        dailyForecasts.push(processData(dailyData));
    }

    function getRussianDayOfWeek(timestamp: number) {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
    }

    return (
        <div className="pt-6 pb-5 px-4 flex-1 border rounded-lg flex flex-col justify-between dark:bg-dark-grey shadow-sm dark:shadow-none">
            <div>
                <h2 className="flex items-center gap-2 font-medium">
                 Прогноз на 5 дней:   {fiveDayForecast.city.country}, {city.name}
                </h2>

                <div className="forecast-list pt-3">
                    {dailyForecasts.map((day, i) => (
                        <div key={i} className="daily-forecast py-4 flex flex-col justify-evenly border-b-2">
                            <p className="text-xl min-w-[3.5rem]">{day.day}</p>
                            <p className="text-sm flex justify-between">
                                <span>(мин)</span>
                                <span>(макс)</span>
                            </p>

                            <div className="flex-1 flex items-center justify-between gap-4">
                                <p className="font-bold">{day.minTemp.toFixed(1)}°{unit}</p>
                                <div className="temperature flex-1 w-full h-2 rounded-lg"></div>
                                <p className="font-bold">{day.maxTemp.toFixed(1)}°{unit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FiveDayForecast;
