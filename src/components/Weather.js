import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search from '../assets/search.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidity from '../assets/humidity.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';

const Weather = () => {
  const inputRef=useRef()
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const API_KEY = process.env.REACT_APP_API_KEY || 'c5ae1ff2926fb1fdee4bcf8f0344f81d';
  console.log("API Key:", API_KEY); 

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow
  };

  const fetchWeather = async (cityName) => {
    if (cityName === "") {
      alert("No city provided for fetchWeather!");
      return;
    }

    console.log("Fetching weather for:", cityName);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      console.log("API URL:", url);

      const response = await fetch(url);
      const data = await response.json();

  
      if (!response.ok) {
        alert("City not found:", data.message);
        return;
      }

      console.log("API Response:", data);
      
      const icon = allIcons[data.weather[0].icon] || clear;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });

    } catch (error) {
      setWeatherData(false);
      alert("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, calling fetchWeather...");
    fetchWeather("Bengaluru");
  }, []);

  const handleSearch = () => {
    if (!city.trim()) {
      alert("No city entered!");
      return;
    }
    console.log("Searching for:", city);
    fetchWeather(city);
  };

  return (
    <div className='weather'>
      <div className='search'> 
        <input ref={inputRef} type='text' placeholder='Search city...' value={city} onChange={(e) => setCity(e.target.value)}/>
        <img src={search} alt="Search" onClick={handleSearch} />
      </div>

      {weatherData?<>
          <img src={weatherData.icon} alt="Weather icon" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={humidity} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>  
            <div className='col'>
              <img src={wind} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind</span>
              </div>
            </div>  
          </div>
        </>:<></>}
    </div>
  );
};

export default Weather;
