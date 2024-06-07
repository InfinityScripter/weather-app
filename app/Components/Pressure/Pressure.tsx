"use client";
import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { Skeleton } from "@/components/ui/skeleton";
import PressureGaugeSVG from "./PressureGaugeSVG";
import {gauge} from "@/app/utils/Icons"; // Импортируем SVG компонент

function Pressure() {
    const { forecast } = useGlobalContext();

    // Проверка наличия данных перед использованием
    if (!forecast || !forecast.main || forecast.main.pressure == null) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    const { pressure } = forecast.main;
    const previousPressureRef = useRef<number>(pressure);

    useEffect(() => {
        // Обновляем ref на предыдущую величину давления
        previousPressureRef.current = pressure;
    }, [pressure]);

    const calculateRotation = (pressure: number) => {
        const minPressure = 950;
        const maxPressure = 1050;
        const minAngle = -90;
        const maxAngle = 90;

        return ((pressure - minPressure) / (maxPressure - minPressure)) * (maxAngle - minAngle) + minAngle;
    };

    return (
        <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-4 dark:bg-dark-grey shadow-sm dark:shadow-none">
            <div className="top">
                <h2 className="flex items-center gap-2 font-medium">
                    {gauge}
                    Pressure
                </h2>
            </div>

            <div className="flex justify-center items-center">
                <PressureGaugeSVG rotation={calculateRotation(pressure)} pressure={pressure} />
            </div>
        </div>
    );
}

export default Pressure;
