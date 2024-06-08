"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/app/context/globalContext";
import { Placemark, YMaps, Map } from "@pbe/react-yandex-maps";
import { Skeleton } from "@/components/ui/skeleton";

function Mapbox() {
  const { activeCityCoords } = useGlobalContext();
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (activeCityCoords) {
      setMapCenter(activeCityCoords);
    }
  }, [activeCityCoords]);

  if (!mapCenter) {
    return <Skeleton className="h-[12rem] w-full" />;
  }

  return (
      <div className="flex-1 basis-[50%] border rounded-lg">
        <YMaps>
          <Map
              key={`${mapCenter[0]}-${mapCenter[1]}`}
              defaultState={{ center: mapCenter, zoom: 10 }}
              style={{ width: "100%", height: "400px" }}
          >
            <Placemark geometry={mapCenter} />
          </Map>
        </YMaps>
      </div>
  );
}

export default Mapbox;
