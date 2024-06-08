"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { sun } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { UvProgress } from "../UvProgress/UvProgress";

function UvIndex() {
  const { uvIndex } = useGlobalContext();

  // Проверка наличия данных перед использованием
  if (!uvIndex || !uvIndex.daily) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  const { daily } = uvIndex;
  const { uv_index_clear_sky_max, uv_index_max } = daily;

  const uvIndexMax = uv_index_max[0].toFixed(0);

  const uvIndexCategory = (uvIndex: number) => {
    if (uvIndex <= 2) {
      return {
        text: "Низкий",
        protection: "Защита не требуется",
      };
    } else if (uvIndex <= 5) {
      return {
        text: "Умеренный",
        protection: "Оставайтесь в тени в полдень.",
      };
    } else if (uvIndex <= 7) {
      return {
        text: "Высокий",
        protection: "Носите шляпу и солнечные очки.",
      };
    } else if (uvIndex <= 10) {
      return {
        text: "Очень высокий",
        protection: "Наносите солнцезащитный крем SPF 30+ каждые 2 часа.",
      };
    } else if (uvIndex > 10) {
      return {
        text: "Экстремальный",
        protection: "Избегайте нахождения на улице.",
      };
    } else {
      return {
        text: "Экстремальный",
        protection: "Избегайте нахождения на улице.",
      };
    }
  };

  const marginLeftPercentage = (uvIndexMax / 14) * 100;

  return (
      <div className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex flex-col gap-5 dark:bg-dark-grey shadow-sm dark:shadow-none">
        <div className="top">
          <h2 className="flex items-center gap-2 font-medium">{sun} УФ-индекс</h2>
          <div className="pt-4 flex flex-col gap-1">
            <p className="text-2xl gap-1">
              {uvIndexMax}
              <span className="text-sm">
              ({uvIndexCategory(uvIndexMax).text})
            </span>
            </p>

            <UvProgress value={marginLeftPercentage} max={14} className="progress" />
          </div>
        </div>

        <p className="text-sm">{uvIndexCategory(uvIndexMax).protection}</p>
      </div>
  );
}

export default UvIndex;
