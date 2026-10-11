# Atmos — Weather Portal

A responsive single-page weather application built with HTML, CSS, and Vanilla JavaScript. It uses `fetch()` and `async/await` to retrieve current weather from OpenWeatherMap.

## Features

- Search by city name
- Current temperature and “feels like” temperature
- Weather condition icon and description
- Humidity, wind speed, pressure, visibility
- Celsius/Fahrenheit switch
- Loading state and readable error messages
- Responsive layout for desktop, tablet, and mobile
- Custom Atmos weather logo and matching SVG favicon

## Project files

- `index.html` — page structure
- `style.css` — visual design and responsive layout
- `script.js` — API request, error handling, and UI updates
- `favicon.svg` — custom weather logo used in the browser tab and header

## Run it locally

1. Create a folder called `weather-portal`.
2. Save all three files into that folder.
3. Open `script.js` and replace `PASTE_YOUR_API_KEY_HERE` with your OpenWeatherMap API key.
4. Start a local server (recommended) using VS Code's Live Server extension, then open `index.html`.
5. Search for a city such as Lahore or London.

## Get an OpenWeatherMap API key

1. Create an account at https://openweathermap.org/
2. Open your API keys page and create/copy a key.
3. Paste it into the `API_KEY` constant in `script.js`.
4. Newly created keys may take some time to activate.

API endpoint used:

`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric`

## Important security note

This frontend-only version is suitable for learning and an internship demo. A key placed in browser JavaScript can be viewed by visitors. Before putting a public production application online, route API requests through a small backend/serverless function and keep the key in an environment variable.

## Troubleshooting

- `401`: key is incorrect or not active yet.
- `404`: city name was not found; check spelling.
- `429`: API request limit reached.
- Network error: check your internet connection and browser console.
