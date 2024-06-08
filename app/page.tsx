
"use client";
import Image from "next/image";
import Sidebar from "./Components/Sidebar/Sidebar";
import Temperature from "./Components/Temperature/Temperature";
import FiveDayForecast from "./Components/FiveDayForecast/FiveDayForecast";
import AirPollution from "./Components/AirPollution/AirPollution";
import Sunset from "./Components/Sunset/Sunset";
import Wind from "./Components/Wind/Wind";
import DailyForecast from "./Components/DailyForecast/DailyForecast";
import UvIndex from "./Components/UvIndex/UvIndex";
import FeelsLike from "./Components/FeelsLike/FeelsLike";
import Humidity from "./Components/Humidity/Humidity";
import Visibility from "./Components/Visibility/Visibility";
import Pressure from "./Components/Pressure/Pressure";
import Mapbox from "@/app/Components/Mapbox/Mapbox";

export default function Home() {
  return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 mx-4 md:mx-8 lg:mx-16 overflow-auto">
          <div className="pb-4 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-col gap-4 w-full min-w-[18rem] md:w-[35rem]">
              <Temperature />
              <FiveDayForecast />
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="instruments grid h-full gap-4 col-span-full sm-2:col-span-2 lg:grid-cols-3 xl:grid-cols-4">
                <AirPollution />
                <Sunset />
                <Wind />
                <DailyForecast />
                <UvIndex />
                <FeelsLike />
                <Humidity />
                <Visibility />
                <Pressure />
              </div>
              <Mapbox/>
            </div>
          </div>
        </main>
      </div>
  );
}
