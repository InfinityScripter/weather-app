"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { eye } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Visibility() {
  const { forecast } = useGlobalContext();

  // Проверка наличия данных перед использованием
  if (!forecast || forecast.visibility == null) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const { visibility } = forecast;

  const getVisibilityDescription = (visibility: number) => {
    const visibilityInKm = Math.round(visibility / 1000);

    if (visibilityInKm > 10) return "Отлично: Четкий и обширный обзор";
    if (visibilityInKm > 5) return "Хорошо: Легко ориентироваться";
    if (visibilityInKm > 2) return "Умеренно: Некоторые ограничения";
    if (visibilityInKm <= 2) return "Плохо: Ограниченный и нечеткий обзор";
    return "Недоступно: Данные о видимости недоступны";
  };

  return (
      <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-8 dark:bg-dark-grey shadow-sm dark:shadow-none">
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">
            {eye} Видимость
          </h2>
          <p className="pt-4 text-2xl">{Math.round(visibility / 1000)} км</p>
        </div>

        <p className="text-sm">{getVisibilityDescription(visibility)}</p>
      </div>
  );
}

export default Visibility;
