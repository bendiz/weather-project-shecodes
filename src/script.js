let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

// Variables
let message = "";
let celsius = 0;
let fahrenheit = 0;
let humidity = 0;
let upperCaseLetter = "";
let lowerCaseLetters = "";
let city = "";

// Converts celsius into fahrenheit
function celsiusToFahrenheit(celsius) {
  fahrenheit = (celsius *= 1.8) + 32;
  return Math.round(fahrenheit);
}

// Converts fahrenheit to celsius
function fahrenheitToCelsius(fahrenheit) {
  celsius = ((fahrenheit - 32) * 5) / 9;
  return Math.round(celsius);
}

// If the city exists in the object - display a rounded number of temp and humidity in both celsius and fahrenheit.
// Else redirect the user to search for the user inputted city in google.
function weatherMessage(citySelection) {
  if (weather[citySelection] !== undefined) {
    celsius = Math.round(weather[citySelection].temp);
    celsiusToFahrenheit(celsius);
    humidity = weather[citySelection].humidity;
    message = `It´s currently ${celsius}°C (${fahrenheit}°F) in ${lowerToUpperCase(
      citySelection
    )} with a humidity of ${humidity}%`;
    alert(message);
  } else
    alert(
      `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${citySelection}`
    );
}

// Make first letter of city capitalized
function lowerToUpperCase(words) {
  let splitWords = words.toLowerCase().split(" ");
  for (let i = 0; i < splitWords.length; i++) {
    splitWords[i] =
      splitWords[i].charAt(0).toUpperCase() + splitWords[i].substring(1);
  }
  city = splitWords.join(" ");
  return city;
}

let date = new Date();

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
let cityInput = "";
currentDayText.innerHTML = currentDay.toUpperCase();

// Current Time
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
let currentHour = date.getHours();
let currentMinute = String(date.getMinutes()).padStart(2, "0");
let currentTimeText = document.querySelector("#current-date-time");
currentTimeText.innerHTML = `${currentDate}.${currentMonth} ${currentYear} - ${currentHour}:${currentMinute}`;

// Add search engine  - real time/date/cityname/temp
let cityNameText = document.querySelector("#current-city");
let form = document.querySelector("#search-form");
let units = "metric";
let apiKey = "58c0ef7fd7e74079efc9a68d7040f613";

let getTemperature = (response) => {
  celsius = Math.round(response.data.main.temp);
  let temperatureText = document.querySelector("#fake-temperature");
  temperatureText.innerHTML = celsius;
  getWind(response);
  return celsius;
};

let wind = 0;

let getWind = (response) => {
  wind = Math.round(response.data.wind.speed);
  let windText = document.querySelector("#wind-speed");
  windText.innerHTML = `${wind}m/s`;
};

let displayCity = (event) => {
  event.preventDefault();
  cityInput = document.getElementById("search").value.toLowerCase().trim();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getTemperature);
  cityNameText.innerHTML = `${lowerToUpperCase(cityInput)}`;
};

form.addEventListener("submit", displayCity);

// Bonus Feature
let temperatureLink = document.querySelector("#celsius-fahrenheit");
let fakeTemperature = document.querySelector("#fake-temperature");
let fakeFahrenheit = 0;
let fakeCelsius = document.querySelector("#fake-temperature").innerHTML;
let celsiusIcon = document.querySelector(".celsius");

let temperatureConversion = () => {
  if (temperatureLink.innerHTML !== "°C") {
    fakeFahrenheit = celsiusToFahrenheit(celsius);
    temperatureLink.innerHTML = "°C";
    celsiusIcon.innerHTML = "°F |";
    fakeTemperature.innerHTML = fakeFahrenheit;
    return fakeFahrenheit;
  } else if (temperatureLink.innerHTML !== "°F") {
    fakeCelsius = fahrenheitToCelsius(fakeFahrenheit);
    temperatureLink.innerHTML = "°F";
    celsiusIcon.innerHTML = "°C |";
    fakeTemperature.innerHTML = fakeCelsius;
    return fakeCelsius;
  }
};
temperatureLink.addEventListener("click", temperatureConversion);

// Bonus week 5

let geoLocation = (response) => {
  let location = response.data.name;
  cityNameText.innerHTML = `${lowerToUpperCase(location)}`;
  getTemperature(response);
  getWind(response);
  return location;
};

let positionCoordinates = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(geoLocation);
};

let geoButton = document.querySelector("#geo-button");
geoButton.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition(positionCoordinates)
);

// dark mode
if (currentHour >= 1900) {
}
