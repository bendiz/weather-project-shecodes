// Variables used across several functions
let apiKey = "58c0ef7fd7e74079efc9a68d7040f613";
let celsius = 0;
let fahrenheit = 0;
let cityNameText = document.querySelector("#current-city");
let units = "metric";
let temperatureLink = document.querySelector("#celsius-fahrenheit");
let form = document.querySelector("#search-form");
let geoButton = document.querySelector("#geo-button");
let bodyElement = document.querySelector("#body");

// Converts celsius into fahrenheit
let celsiusToFahrenheit = (celsius) => {
  fahrenheit = (celsius *= 1.8) + 32;
  return Math.round(fahrenheit);
};

// Converts fahrenheit to celsius
let fahrenheitToCelsius = (fahrenheit) => {
  celsius = ((fahrenheit - 32) * 5) / 9;
  return Math.round(celsius);
};

// Make first letter of city capitalized
let lowerToUpperCase = (words) => {
  let splitWords = words.toLowerCase().split(" ");
  for (let i = 0; i < splitWords.length; i++) {
    splitWords[i] =
      splitWords[i].charAt(0).toUpperCase() + splitWords[i].substring(1);
  }
  let city = splitWords.join(" ");
  return city;
};

// Gets current date and updates the text of the last updated section
let getCurrentDate = (response) => {
  let date = new Date(response.data.dt * 1000);
  let currentDayText = document.querySelector("#current-day");
  let numberOfDay = date.getDay();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDay = days[numberOfDay];

  currentDayText.innerHTML = currentDay;

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currentDate = date.getDate();
  let currentMonth = months[date.getMonth()];
  let currentYear = date.getFullYear();
  let currentHour = String(date.getHours()).padStart(2, "0");
  let currentMinute = String(date.getMinutes()).padStart(2, "0");
  let currentTimeText = document.querySelector("#current-date-time");
  currentTimeText.innerHTML = `Last updated: ${currentDate}.${currentMonth} ${currentYear} @ ${currentHour}:${currentMinute}`;
  return date;
};

// Gets current wind in m/s
let getWind = (response) => {
  let wind = Math.round(response.data.wind.speed);
  let windText = document.querySelector("#wind-speed");
  windText.innerHTML = ` <i class="fa-solid fa-wind" id="wind-icon"></i> ${wind}m/s`;
};

let getHumidity = (response) => {
  let humidity = response.data.main.humidity;
  let humidityText = document.querySelector("#humidity");
  humidityText.innerHTML = `<i class="fa-solid fa-droplet humidity"></i> ${humidity}%`;
};

// Gets the weather description and updates the description to uppercase letters in the beginning of every word.
let getWeatherDescription = (response) => {
  let weatherDescription = response.data.weather[0].description;
  let weatherDescriptionElement = document.getElementById(
    "weather-description"
  );
  weatherDescriptionElement.innerHTML = lowerToUpperCase(weatherDescription);
};

// Gets the coordinates for the apiUrl then calls the function that displays the forecast
let getForecast = (response) => {
  let longitude = response.lon;
  let latitude = response.lat;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
};

//  Finds the rounded number of temperature and updates the current wind, "last updated", weather description, weather icon and forecast.
let updateWeather = (response) => {
  let middleSectionElement = document.querySelector("#weather-section");
  let celsiusFahrenheitElements = document.querySelector(
    ".temperature-container"
  );
  let weatherIconElement = document.getElementById("weather-forecast-icon");
  let temperatureText = document.querySelector("#temperature");
  let weatherSectionElement = document.querySelector(
    ".current-weather-section"
  );
  celsius = Math.round(response.data.main.temp);
  temperatureText.innerHTML = celsius;
  getWind(response);
  getHumidity(response);
  currentDate = getCurrentDate(response);
  getWeatherDescription(response);
  middleSectionElement.classList.add("middle-section-search");
  middleSectionElement.classList.remove("middle-section");
  weatherIconElement.src = `img/weather-icons/png/${response.data.weather[0].icon}.png`;
  weatherIconElement.style.width = `60%`;
  weatherIconElement.style.opacity = `100%`;
  weatherSectionElement.style.justifyContent = `flex-start`;
  celsiusFahrenheitElements.style.display = "flex";
  getForecast(response.data.coord);
  console.log();
  return celsius;
};

// Updates the name of the city, turns it to lower cases, removes white spaces, then calls the function that updates the weather and checks if nightmode should be enabled.
let displayCity = (event) => {
  let cityInput = "";
  event.preventDefault();
  cityInput = document.getElementById("search").value.toLowerCase().trim();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
  cityNameText.innerHTML = `${lowerToUpperCase(cityInput)}`;
  axios.get(apiUrl).then(nightMode);
};

// Converts C to F and back
let temperatureConversion = () => {
  let temperatureElement = document.querySelector("#temperature");
  let celsiusIconElement = document.querySelector(".celsius");
  if (temperatureLink.innerHTML === "°F") {
    fahrenheit = celsiusToFahrenheit(celsius);
    temperatureLink.innerHTML = "°C";
    celsiusIconElement.innerHTML = "°F |";
    temperatureElement.innerHTML = fahrenheit;
    return fahrenheit;
  } else if (temperatureLink.innerHTML === "°C") {
    celsius = fahrenheitToCelsius(fahrenheit);
    temperatureLink.innerHTML = "°F";
    celsiusIconElement.innerHTML = "°C |";
    temperatureElement.innerHTML = celsius;
    return celsius;
  }
};

// Locking away the alert to ask for user's geolocation behind a function
let geoPosition = () => {
  navigator.geolocation.getCurrentPosition(positionCoordinates);
};

// Gets the users coordinates in order to find the name of the city
let positionCoordinates = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(geoLocation);
};

// Uses the users location to find the city name and update weather and forecast accordingly
let geoLocation = (response) => {
  let location = response.data.name;
  cityNameText.innerHTML = `${lowerToUpperCase(location)}`;
  nightMode(response);
  updateWeather(response);
  getForecast(response.data.coord);
  return location;
};

// Implements style changes if the weather icon is labeled with "n" and the ability to revert back to ligth mode upon new search
let nightMode = (response) => {
  bodyElement = document.querySelector("#body");
  let weatherCardElement = document.querySelector(".weather-card");
  let searchElement = document.querySelector("#search");
  let socialLinksElement = document.querySelector("#links");
  let weatherDescriptionElement = document.querySelector(
    ".weather-description"
  );
  let letter = response.data.weather[0].icon.charAt(2);
  if (letter == "n") {
    bodyElement.style.backgroundImage = "url('img/jpg/starrysky.jpg')";
    weatherCardElement.style.background =
      "radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.7) 0%, rgba(64, 64, 64, 0.7) 90.2%)";
    searchElement.style.backgroundColor = "#423e57";
    socialLinksElement.style.background =
      "radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.7) 0%, rgba(64, 64, 64, 0.7) 90.2%)";
  } else if (letter == "d") {
    bodyElement.style.backgroundImage = "url('img/jpg/clouds.jpg')";
    weatherCardElement.style.background =
      "linear-gradient(-225deg, #8dc8ff7d 0%, #c5dadb3f 48%, #a8ecff39 100%)";
    searchElement.style.backgroundColor = "#0064a0";
    socialLinksElement.style.background = "#0064a0";
  }
};

// Displays forecast elements by looping through the days and inserting HTML with every iteration
let displayForecast = (response) => {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ``;
  let currentDay = currentDate.getDay();
  let i = 0;
  while (i < 5) {
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let forecastDay = days[currentDay + i];
    let forecastIcon = `${response.data.current.weather[0].icon}`;
    let nightOrDayIcon = forecastIcon.charAt(2);
    let weatherIcon = `${response.data.daily[i].weather[0].icon.slice(0, -1)}`;
    weatherIcon += nightOrDayIcon;
    let weatherDescription = response.data.daily[i].weather[0].description;
    let minimumTemp = Math.round(response.data.daily[i].temp.min);
    let maximumTemp = Math.round(response.data.daily[i].temp.max);
    forecastHTML += `
            <div class="weather-forecast-one">
            <p class="forecast-text forecast">${forecastDay}</p>

            <img
              src="img/weather-icons/png/${weatherIcon}.png"
              class="weather-forecast-icon"
              alt="${weatherDescription} weather icon"
            />
            <p class="forecast-temperature forecast">
              <span class="min-temperature"> ${minimumTemp}°</span>
              <span class="max-temperature">${maximumTemp}°</span>
            </p>
          </div>`;
    i++;
  }
  forecastElement.innerHTML = forecastHTML;
};

// Buttons
form.addEventListener("submit", displayCity);
temperatureLink.addEventListener("click", temperatureConversion);
geoButton.addEventListener("click", geoPosition);
