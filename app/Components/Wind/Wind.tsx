"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { wind } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";

function Wind() {
    const { forecast } = useGlobalContext();

    // Проверка наличия данных перед использованием
    if (!forecast || !forecast.wind || forecast.wind.speed == null || forecast.wind.deg == null) {
        return <Skeleton className="h-[12rem] w-full" />;
    }

    const windSpeed = forecast.wind.speed;
    const windDir = forecast.wind.deg;

    return (
        <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-3 dark:bg-dark-grey shadow-sm dark:shadow-none">
            <h2 className="flex items-center gap-2 font-medium">{wind} Ветер</h2>

            <div className="compass relative flex items-center justify-center">
                <div className="image relative">
                    <Image src="/compass_body.svg" alt="compass" width={110} height={110} />
                    <Image
                        src="/compass_arrow.svg"
                        alt="compass arrow"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out dark:invert"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${windDir}deg)`,
                            width: "100%",
                            height: "100%",
                        }}
                        width={110}
                        height={110}
                    />
                </div>
                <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-xs dark:text-white font-medium">
                    {Math.round(windSpeed)} м/с
                </p>
            </div>
        </div>
    );
}

export default Wind;
