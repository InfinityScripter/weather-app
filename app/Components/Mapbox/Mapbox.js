// /Users/kot/Downloads/weather-app-master/app/Components/Mapbox/Mapbox.js

"use client";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import {Placemark, YMaps, Map} from "@pbe/react-yandex-maps";
import {Skeleton} from "@/components/ui/skeleton";


function Mapbox() {
  const { forecast, activeCityCoords } = useGlobalContext();

  useEffect(() => {
    if (!forecast || !activeCityCoords) return;

    // Добавляем логику для обновления карты при изменении координат
  }, [forecast, activeCityCoords]);

  if (!forecast || !activeCityCoords) {
    return (
       <Skeleton className="h-[6rem] w-[8rem]" />
    );
  }

  return (
      <div className="flex-1 basis-[50%] border rounded-lg">
        <YMaps>
          <Map
              key={`${activeCityCoords[0]}-${activeCityCoords[1]}`} // ключ для перерендера при изменении координат
              defaultState={{ center: [activeCityCoords[0], activeCityCoords[1]], zoom: 10 }}
              style={{ width: "100%", height: "400px" }}
          >
            <Placemark geometry={[activeCityCoords[0], activeCityCoords[1]]} />
          </Map>
        </YMaps>
      </div>
  );
}

export default Mapbox;
