document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();

    const cityName = document.getElementById('search-input').value;
    const APIKey = '3fecceee176414dfceab5fb4dd83902e';

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            throw new Error('City not found');
        }

        const cityLon = data[0].lon;
        const cityLat = data[0].lat;
        const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}`;

        return fetch(queryURL);
    })
    .then(response => response.json())
    .then(cityData => {
        displayCurrentWeather(cityData, cityName); // Display current weather

        //5 day forecast display
        displayFiveDayForecast(cityData); // Display 5-day forecast
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayCurrentWeather(cityData, cityName) {
    $(".city").text(cityName + " " + dayjs().format('dddd, MMMM D'));
    $(".wind").text("Wind Speed: " + cityData.list[0].wind.speed + " m/s");
    $(".humidity").text("Humidity: " + cityData.list[0].main.humidity + "%");
    const tempC = cityData.list[0].main.temp - 273.15;
    $(".temp").text("Temperature (C): " + tempC.toFixed(2));
}

function displayFiveDayForecast(cityData) {
    $('#forecast-container').empty(); // Clear previous forecast
    const fiveDayForecast = [8, 16, 24, 32, 39];
    $.each(fiveDayForecast, function(i, index) {
        const forecast = cityData.list[index];
        const dateString = forecast.dt_txt.split(' ')[0];
        const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const tempCelsius = forecast.main.temp - 273.15;
        displayDayForecast(dateString, iconUrl, tempCelsius, forecast.wind.speed, forecast.main.humidity);
    });
}

function displayDayForecast(date, icon, temp, wind, humidity) {
    const forecastElement = `
        <div class="weather-card">
            <h3>${date}</h3>
            <img src="${icon}" alt="Weather Icon">
            <p>Temperature: ${temp.toFixed(2)} °C</p>
            <p>Wind: ${wind} m/s</p>
            <p>Humidity: ${humidity}%</p>
        </div>
    `;
    $('#forecast-container').append(forecastElement);
}
