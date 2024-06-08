import React, { useEffect, useState } from "react";
import SearchDialog from "../SearchDialog/SearchDialog";
import { useGlobalContext } from "@/app/context/globalContext";
import ThemeChangeButton from "@/app/Components/theme-change-button/theme-change-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { clearSky, cloudy, drizzleIcon, rain, snow } from "@/app/utils/Icons";
import { MapPin, Menu, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/app/utils/misc";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";


interface City {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

interface WeatherData {
    name: string;
    main: {
        temp: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
}

function Sidebar() {
    const {
        geoCodedList,
        setActiveCityCoords,
        unit,
        toggleUnit,
        fetchUserLocation,
        favoriteCities,
        addFavoriteCity,
        removeFavoriteCity,
        recentlyViewedCities,
        addRecentlyViewedCity,
    } = useGlobalContext();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const requests = recentlyViewedCities.map((city: City) =>
                fetch(`/api/weather?lat=${city.lat}&lon=${city.lon}`)
            );
            try {
                const responses = await Promise.all(requests);
                const data = await Promise.all(responses.map((res) => res.json()));
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching weather data for cities:", error);
            }
        };

        fetchWeatherData();
    }, [recentlyViewedCities]);

    const handleCityClick = (city: City) => {
        setActiveCityCoords([city.lat, city.lon]);
        addRecentlyViewedCity(city);
        if (window.innerWidth < 1024) setIsSheetOpen(false); // Закрываем sheet после выбора города на мобильных устройствах
    };

    const handleAddFavorite = (city: City) => {
        addFavoriteCity(city);
    };

    const handleRemoveFavorite = (cityName: string) => {
        removeFavoriteCity(cityName);
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

    const renderCityList = (cities: City[], isFavorite = false) => (
        <ul>
            {cities.map((city: City, index: number) => {
                const isFavCity = favoriteCities.some((favCity: City) => favCity.name === city.name);
                const weather = weatherData.find((data: WeatherData) => data.name === city.name);

                return (
                    <li
                        key={index}
                        className="p-2 hover:bg-gray-700 cursor-pointer rounded-lg flex justify-between items-center"
                    >
                        <div onClick={() => handleCityClick(city)} className="flex justify-between items-center w-full">
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
                        {isFavorite ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-4 size-5 bg-transparent"
                                onClick={() => handleRemoveFavorite(city.name)}
                            >
                              <CloseIcon />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-4 text-yellow-500"
                                onClick={() => handleAddFavorite(city)}
                            >
                                <Star size={20} />
                            </Button>
                        )}
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
                </h1>
                <div className="flex items-center gap-1 pt-2 pb-2">
                    <ThemeChangeButton />
                    <Button
                        className="text-blue-900 dark:text-white"
                        variant="outline" size="icon" onClick={toggleUnit}>
                        {unit === "C" ? "°C" : "°F"}
                    </Button>
                    <Button className="
                   text-blue-900 dark:text-white
                    " variant="outline" size="icon" onClick={fetchUserLocation}>
                        <MapPin size={20} />
                    </Button>
                </div>
                <SearchDialog />
                <div className="favorites mt-6">
                    { favoriteCities.length > 0 && (
                        <h2 className="text-xl font-semibold mb-2">Избранные города</h2>
                    )}
                    {renderCityList(favoriteCities, true)}
                </div>
                <div className="recently-viewed mt-6">
                    { recentlyViewedCities.length > 0 && (
                        <h2 className="text-xl font-semibold mb-2">Недавно просмотренные</h2>
                    )
                    }
                    {renderCityList(recentlyViewedCities)}
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
                            <div className="flex items-center gap-1 pt-2 pb-2">
                                <ThemeChangeButton />
                                <Button
                                    className="text-blue-900 dark:text-white"
                                    variant="outline" size="icon" onClick={toggleUnit}>
                                    {unit === "C" ? "°C" : "°F"}
                                </Button>
                                <Button className="
                   text-blue-900 dark:text-white
                    " variant="outline" size="icon" onClick={fetchUserLocation}>
                                    <MapPin size={20} />
                                </Button>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                        { favoriteCities.length > 0 && (
                        <h2 className="text-xl font-semibold mb-2">Избранные города</h2>
                        )}
                        {renderCityList(favoriteCities, true)}
                        { recentlyViewedCities.length > 0 && (
                        <h2 className="text-xl font-semibold mt-6 mb-2">Недавно просмотренные</h2>
                        )}
                        {renderCityList(recentlyViewedCities)}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default Sidebar;
