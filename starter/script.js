document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();

    var cityName = document.getElementById('search-input').value;
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

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
        displayFiveDayForecast(cityData); // Display 5-day forecast
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayCurrentWeather(cityData, cityName) {
    $(".city").text(cityName + " : " + dayjs().format('dddd, MMMM YYYY'));
    $(".wind").text("Wind Speed: " + cityData.list[0].wind.speed + " m/s");
    $(".humidity").text("Humidity: " + cityData.list[0].main.humidity + "%");
    const tempC = cityData.list[0].main.temp - 273.15;
    $(".temp").text("Temperature (C): " + tempC.toFixed(2) + '°C');
}

function displayFiveDayForecast(cityData) {
    $('#forecast-container').empty(); 
    const fiveDayForecastIndices = [8, 16, 24, 32, 39];
    $.each(fiveDayForecastIndices, function(i, index) {
        const forecast = cityData.list[index];
        const dateString = forecast.dt_txt.split(' ')[0];
        const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const tempCelsius = forecast.main.temp - 273.15;

        displayDayForecast(dateString, iconUrl, tempCelsius, forecast.wind.speed, forecast.main.humidity);

        // Log the forecast for each day
        console.log("Forecast for " + dateString + ":", forecast);
    });
}

function displayDayForecast(date, icon, temp, wind, humidity) {
    $("h2").text('5-Day Forecast');
    const forecastElement = `
    <div class="card">
        <div class="card-header">${date}</div>
        <div class="card-body">
            <img src="${icon}" alt="Weather Icon">
            <p>Temperature: ${temp.toFixed(2)} °C</p>
            <p>Wind: ${wind} m/s</p>
            <p>Humidity: ${humidity}%</p>
        </div>
    </div>
    `;    
    $('#forecast-container').append(forecastElement);
}


//function to show seached location as button
function renderButtons() {
    $("#history").empty();
 
    $.each(locations, function (i, location) {
      const a = $("<button>");
      a.addClass("location");
      a.attr("data-name", location);
      a.text(location);
      $("#history").append(a);
    })
  }

