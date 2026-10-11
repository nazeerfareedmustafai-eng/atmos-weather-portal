/*
  Atmos Weather Portal
  1) Create an API key at https://openweathermap.org/api
  2) Replace PASTE_YOUR_API_KEY_HERE with your key.
  Note: For a public production website, do not expose a private API key in frontend code.
*/
const API_KEY = "555870ed296a584bb3d744622d18a157";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const statusMessage = document.querySelector("#statusMessage");
const weatherPanel = document.querySelector("#weatherPanel");
const emptyState = document.querySelector("#emptyState");
const unitToggle = document.querySelector("#unitToggle");

let currentUnit = "metric";
let latestWeather = null;

document.querySelector("#year").textContent = new Date().getFullYear();

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    showStatus("Please enter a city name first.", "error");
    cityInput.focus();
    return;
  }
  getWeather(city);
});

document.querySelectorAll(".city-chip").forEach((button) => {
  button.addEventListener("click", () => {
    cityInput.value = button.dataset.city;
    getWeather(button.dataset.city);
  });
});

unitToggle.addEventListener("click", () => {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  unitToggle.innerHTML = currentUnit === "metric" ? "°C <span>/</span> °F" : "°F <span>/</span> °C";
  if (latestWeather) renderWeather(latestWeather);
});

async function getWeather(city) {
  if (!API_KEY || API_KEY === "PASTE_YOUR_API_KEY_HERE") {
    showStatus("Add your OpenWeatherMap API key in script.js before searching. See README for setup steps.", "error");
    return;
  }

  setLoading(true);
  showStatus(`Getting current weather for ${city}…`, "loading");

  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.set("q", city);
    url.searchParams.set("appid", API_KEY);
    url.searchParams.set("units", currentUnit);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error("We couldn't find that city. Check the spelling and try again.");
      if (response.status === 401) throw new Error("The API key is invalid or not active yet. Check your key and try again.");
      if (response.status === 429) throw new Error("The API request limit has been reached. Please wait a little and try again.");
      throw new Error(`Weather service error (${response.status}). Please try again in a moment.`);
    }

    const data = await response.json();
    latestWeather = data;
    renderWeather(data);
    hideStatus();
  } catch (error) {
    showStatus(error.message || "Something went wrong. Check your internet connection and try again.", "error");
  } finally {
    setLoading(false);
  }
}

function renderWeather(data) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const high = Math.round(data.main.temp_max);
  const low = Math.round(data.main.temp_min);
  const degree = currentUnit === "metric" ? "°C" : "°F";
  const iconCode = data.weather?.[0]?.icon || "01d";
  const description = data.weather?.[0]?.description || "Weather unavailable";

  document.querySelector("#cityName").textContent = `${data.name}, ${data.sys?.country || ""}`.trim();
  document.querySelector("#localDate").textContent = `Local time zone · ${formatLocalTime(data.dt, data.timezone)}`;
  document.querySelector("#temperature").textContent = temp;
  document.querySelector("#degreeSymbol").textContent = degree;
  document.querySelector("#weatherDescription").textContent = capitalize(description);
  document.querySelector("#feelsLike").textContent = `${feels}${degree}`;
  document.querySelector("#tempHigh").textContent = `${high}${degree}`;
  document.querySelector("#tempLow").textContent = `${low}${degree}`;
  document.querySelector("#humidity").textContent = `${data.main.humidity}%`;
  document.querySelector("#windSpeed").innerHTML = `${Number(data.wind.speed).toFixed(1)} <small>${currentUnit === "metric" ? "m/s" : "mph"}</small>`;
  document.querySelector("#pressure").innerHTML = `${data.main.pressure} <small>hPa</small>`;
  document.querySelector("#visibility").innerHTML = `${(data.visibility / 1000).toFixed(1)} <small>km</small>`;
  document.querySelector("#weatherArt").innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="" width="120" height="120">`;
  document.querySelector("#weatherBadge").textContent = "LIVE DATA";

  weatherPanel.hidden = false;
  emptyState.hidden = true;
}

function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
  // OpenWeatherMap's timezone is a UTC offset in seconds.
  const localDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return new Intl.DateTimeFormat("en", {
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC"
  }).format(localDate);
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.hidden = false;
}

function hideStatus() {
  statusMessage.hidden = true;
  statusMessage.textContent = "";
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.innerHTML = isLoading ? "<span>Loading…</span><span aria-hidden=\"true\">⟳</span>" : "<span>Search</span><span aria-hidden=\"true\">↗</span>";
  cityInput.disabled = isLoading;
}
