document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();

    const cityName = document.getElementById('search-input').value;
    const APIKey = '3fecceee176414dfceab5fb4dd83902e';

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data)
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
        console.log(cityData)

        // Now you can use cityData here
        $(".city").text(cityData.city.name + " Weather Details");
        $(".today").text(dayjs().format('dddd, MMMM D'));
        $(".wind").text("Wind Speed: " + cityData.list[0].wind.speed);
        $(".humidity").text("Humidity: " + cityData.list[0].main.humidity);

        // Convert the temp to Celsius
        const tempC = cityData.list[0].main.temp - 273.15;

        // Add temp content to html
        $(".temp").text("Temperature (K) " + cityData.list[0].main.temp);
        $(".tempC").text("Temperature (C) " + tempC.toFixed(2));

        // Log the data in the console
        console.log("Wind Speed: " + cityData.list[0].wind.speed);
        console.log("Humidity: " + cityData.list[0].main.humidity);
        console.log("Temperature (C): " + tempC);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});