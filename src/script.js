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

// Variables used across several functions
let apiKey = "58c0ef7fd7e74079efc9a68d7040f613";
let celsius = 0;
let fahrenheit = 0;
let cityNameText = document.querySelector("#current-city");
let units = "metric";
let temperatureLink = document.querySelector("#celsius-fahrenheit");
let cityInput = "";
let form = document.querySelector("#search-form");
let geoButton = document.querySelector("#geo-button");
let fakeTemperature = document.querySelector("#fake-temperature");
let fakeCelsius = document.querySelector("#fake-temperature").innerHTML;
let celsiusIcon = document.querySelector(".celsius");
let fakeFahrenheit = 0;

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
  let currentHour = date.getHours();
  let currentMinute = String(date.getMinutes()).padStart(2, "0");
  let currentTimeText = document.querySelector("#current-date-time");
  currentTimeText.innerHTML = `Last updated: ${currentDate}.${currentMonth} ${currentYear} @ ${currentHour}:${currentMinute}`;
};
let getWind = (response) => {
  let wind = Math.round(response.data.wind.speed);
  let windText = document.querySelector("#wind-speed");
  windText.innerHTML = `${wind}m/s`;
};

let updateWeather = (response) => {
  console.log(response);
  celsius = Math.round(response.data.main.temp);
  let temperatureText = document.querySelector("#fake-temperature");
  temperatureText.innerHTML = celsius;
  getWind(response);
  getCurrentDate(response);
  let weatherIconElement = document.getElementById("weather-forecast-icon");
  weatherIconElement.src = `img/weather-icons/png/${response.data.weather[0].icon}.png`;
  return celsius;
};

let displayCity = (event) => {
  event.preventDefault();
  cityInput = document.getElementById("search").value.toLowerCase().trim();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
  cityNameText.innerHTML = `${lowerToUpperCase(cityInput)}`;
  axios.get(apiUrl).then(nightMode);
};

form.addEventListener("submit", displayCity);

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

let geoLocation = (response) => {
  let cityNameText = "";
  let location = response.data.name;
  cityNameText.innerHTML = `${lowerToUpperCase(location)}`;
  updateWeather(response);
  getWind(response);
  return location;
};

let positionCoordinates = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(geoLocation);
};
geoButton.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition(positionCoordinates)
);

let nightMode = (response) => {
  let bodyElement = document.querySelector("#body");
  let weatherCardElement = document.querySelector(".weather-card");
  let searchElement = document.querySelector("#search");
  let socialLinksElement = document.querySelector("#links");
  let socialLinksAnchorElement = document.querySelector(
    ".social-link-1 .social-link-2 .social-link-3"
  );
  console.log(response.data.weather[0].icon.charAt(2));
  let letter = response.data.weather[0].icon.charAt(2);
  console.log(letter);
  if (letter == "n") {
    bodyElement.style.backgroundImage = "url('img/jpg/starrysky.jpg')";
    weatherCardElement.style.background =
      "radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.7) 0%, rgba(64, 64, 64, 0.7) 90.2%)";
    searchElement.style.backgroundColor = "#423e57";
    cityNameText.style.color = "#423e57";
    socialLinksElement.style.backgroundColor = "#423e57";
  }
};
