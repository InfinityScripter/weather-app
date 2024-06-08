import React, { useEffect, useState } from "react";
import SearchDialog from "../SearchDialog/SearchDialog";
import { useGlobalContext } from "@/app/context/globalContext";
import ThemeChangeButton from "@/app/Components/theme-change-button/theme-change-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import { clearSky, cloudy, drizzleIcon, rain, snow } from "@/app/utils/Icons";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/app/utils/misc";

interface City {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

interface WeatherData {
    main: {
        temp: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
}

function Sidebar() {
    const { geoCodedList, setActiveCityCoords, unit, toggleUnit } = useGlobalContext();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);

    // Получаем данные о погоде для каждого города
    useEffect(() => {
        const fetchWeatherData = async () => {
            const requests = geoCodedList.map((city: City) =>
                axios.get(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
            );
            try {
                const responses = await Promise.all(requests);
                const data = responses.map((res) => res.data);
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching weather data for cities:", error);
            }
        };

        fetchWeatherData();
    }, [geoCodedList]);

    const handleCityClick = (lat: number, lon: number) => {
        setActiveCityCoords([lat, lon]);
        if (window.innerWidth < 1024) setIsSheetOpen(false); // Закрываем sheet после выбора города на мобильных устройствах
    };

    const getWeatherIcon = (weatherMain: string) => {
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

    const renderCityList = () => (
        <ul>
            {geoCodedList.map((city: City, index: number) => {
                const weather = weatherData[index];
                return (
                    <li
                        key={index}
                        className="p-2 hover:bg-gray-700 cursor-pointer rounded-lg"
                        onClick={() => handleCityClick(city.lat, city.lon)}
                    >
                        <div className="flex justify-between items-center">
                            <span>{city.name}</span>
                            {weather ? (
                                <div className="flex items-center space-x-4 ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="w-7 h-7">{getWeatherIcon(weather.weather[0].main)}</span>
                                    <span>
                                        {unit === "C"
                                            ? `${kelvinToCelsius(weather.main.temp).toFixed(1)}°C`
                                            : `${kelvinToFahrenheit(weather.main.temp).toFixed(1)}°F`}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">Загрузка...</span>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsScrolling(false), 200);
        };

        let timeoutId: NodeJS.Timeout;

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="relative">
            {/* Веб-версия боковой панели */}
            <div className="sidebar hidden lg:block w-64 bg-gray-800 text-white h-screen p-4">
                <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
                    Погода
                    <div className="flex items-center gap-2">
                        <ThemeChangeButton />
                        <Button variant="outline" size="icon" onClick={toggleUnit}>
                            {unit === "C" ? "°C" : "°F"}
                        </Button>
                    </div>
                </h1>

                <SearchDialog />
                <div className="favorites mt-6">
                    <h2 className="text-xl font-semibold mb-2">Избранные города</h2>
                    {renderCityList()}
                </div>
            </div>

            {/* Мобильная версия - Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <button
                        className={`fixed top-4 right-4 z-10 bg-gray-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-200 lg:hidden dark:bg-gray-800 ${
                            isScrolling ? "opacity-30" : "opacity-100"
                        }`}
                    >
                        <Menu size={20} />
                    </button>
                </SheetTrigger>
                <SheetContent className="bg-gray-800 text-white">
                    <SheetHeader>
                        <SheetTitle className="flex justify-between items-center gap-x-1">
                            <SearchDialog />
                            <ThemeChangeButton />
                            <Button variant="outline" size="icon" onClick={toggleUnit}>
                                {unit === "C" ? "°C" : "°F"}
                            </Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                        {renderCityList()}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default Sidebar;
