"use client";
import React, { useContext, createContext, useState, useEffect } from "react";
import defaultStates from "../utils/defaultStates";
import { debounce } from "lodash";

const GlobalContext = createContext();
const GlobalContextUpdate = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [forecast, setForecast] = useState(null);
  const [geoCodedList, setGeoCodedList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeCityCoords, setActiveCityCoords] = useState([59.9343, 30.3351]);
  const [airQuality, setAirQuality] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [uvIndex, seUvIndex] = useState(null);
  const [unit, setUnit] = useState("C");
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [recentlyViewedCities, setRecentlyViewedCities] = useState([]);

  useEffect(() => {
    const savedFavoriteCities = JSON.parse(localStorage.getItem("favoriteCities") || "[]");
    setFavoriteCities(savedFavoriteCities);

    const savedRecentlyViewedCities = JSON.parse(localStorage.getItem("recentlyViewedCities") || "[]");
    setRecentlyViewedCities(savedRecentlyViewedCities);
  }, []);

  const fetchForecast = async (lat, lon) => {
    try {
      const res = await fetch(`api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setForecast(data);
    } catch (error) {
      console.log("Error fetching forecast data: ", error.message);
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    try {
      const res = await fetch(`api/pollution?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setAirQuality(data);
    } catch (error) {
      console.log("Error fetching air quality data: ", error.message);
    }
  };

  const fetchFiveDayForecast = async (lat, lon) => {
    try {
      const res = await fetch(`api/fiveday?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setFiveDayForecast(data);
    } catch (error) {
      console.log("Error fetching five day forecast data: ", error.message);
    }
  };

  const fetchGeoCodedList = async (search) => {
    try {
      const res = await fetch(`/api/geocoded?search=${search}`);
      const data = await res.json();
      setGeoCodedList(data);
    } catch (error) {
      console.log("Error fetching geocoded list: ", error.message);
    }
  };

  const fetchUvIndex = async (lat, lon) => {
    try {
      const res = await fetch(`/api/uv?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      seUvIndex(data);
    } catch (error) {
      console.error("Error fetching the forecast:", error);
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      setGeoCodedList([]);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce((search) => {
      fetchGeoCodedList(search);
    }, 500);

    if (inputValue) {
      debouncedFetch(inputValue);
    }

    return () => debouncedFetch.cancel();
  }, [inputValue]);

  useEffect(() => {
    fetchForecast(activeCityCoords[0], activeCityCoords[1]);
    fetchAirQuality(activeCityCoords[0], activeCityCoords[1]);
    fetchFiveDayForecast(activeCityCoords[0], activeCityCoords[1]);
    fetchUvIndex(activeCityCoords[0], activeCityCoords[1]);
  }, [activeCityCoords]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setActiveCityCoords([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const addFavoriteCity = (city) => {
    if (!favoriteCities.some(favCity => favCity.name === city.name)) {
      const updatedFavorites = [...favoriteCities, city];
      setFavoriteCities(updatedFavorites);
      localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
    }
  };

  const removeFavoriteCity = (cityName) => {
    const updatedFavorites = favoriteCities.filter(city => city.name !== cityName);
    setFavoriteCities(updatedFavorites);
    localStorage.setItem("favoriteCities", JSON.stringify(updatedFavorites));
  };

  const addRecentlyViewedCity = (city) => {
    console.log("Adding to recently viewed:", city);
    // Проверяем, что город еще не добавлен в список недавно просмотренных
    const existingCityIndex = recentlyViewedCities.findIndex(viewedCity => viewedCity.name === city.name);
    if (existingCityIndex !== -1) {
      // Если город уже существует, перемещаем его в начало списка
      const updatedRecentlyViewed = [city, ...recentlyViewedCities.filter((_, i) => i !== existingCityIndex)];
      setRecentlyViewedCities(updatedRecentlyViewed);
      localStorage.setItem("recentlyViewedCities", JSON.stringify(updatedRecentlyViewed));
    } else {
      // Если город не существует, добавляем его в начало списка и ограничиваем до 10 элементов
      const updatedRecentlyViewed = [city, ...recentlyViewedCities].slice(0, 10);
      setRecentlyViewedCities(updatedRecentlyViewed);
      localStorage.setItem("recentlyViewedCities", JSON.stringify(updatedRecentlyViewed));
    }
  };

  return (
      <GlobalContext.Provider
          value={{
            forecast,
            airQuality,
            fiveDayForecast,
            uvIndex,
            geoCodedList,
            inputValue,
            handleInput,
            setActiveCityCoords,
            activeCityCoords,
            unit,
            toggleUnit,
            fetchUserLocation,
            favoriteCities,
            addFavoriteCity,
            removeFavoriteCity,
            recentlyViewedCities,
            addRecentlyViewedCity,
          }}
      >
        <GlobalContextUpdate.Provider value={{ setActiveCityCoords }}>
          {children}
        </GlobalContextUpdate.Provider>
      </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
export const useGlobalContextUpdate = () => useContext(GlobalContextUpdate);
