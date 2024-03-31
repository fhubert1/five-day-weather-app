let searchCityFormEl = $('#search-city-form');
let cityInputEl = $('#search-city-input');
let currentWeatherEl = $('#current-weather');

// API Key
let myAPIKey = "cd21ba523fb739621b273673758c1457";
let q = "";
let now = dayjs().startOf('day');

//Date and time formate for header
let curDateTime = now.format('MMMM D YYYY');
$("#curDayTime").text(curDateTime);

// load window 
$(window).on('load', function () {
//    currentLocation();
//    checkLocalStorage();
});

// Functions
function fetchWeather(city) {

    let weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myAPIKey}&units=imperial`;

    fetch(weatherAPIUrl)
      .then(response => response.json())
      .then(results => {
        displayWeather(results);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        // change to error page but for now use alert
        alert('Error fetching weather data. Please try again later.');
      });
  }

  function displayWeather(results) {
    //let weatherInfo = document.getElementById('weatherInfo');
    //let forecastInfo = document.getElementById('forecast');

    if (results.cod === '404') {
      weatherInfo.innerHTML = '<p class="text-danger">The city entered was not found. Please verify city name.</p>';
    } else {
      let cityName = results.city.name;

      // Current weather
      let currentWeather = results.list[0];
      let temperature = Math.round(currentWeather.main.temp);
      let weatherDescription = currentWeather.weather[0].description;
      let weatherId = currentWeather.weather[0].id;
      let currIconImg = currentWeather.weather[0].icon;
      let iconUrl = 'https://openweathermap.org/img/wn/' + currIconImg + '@2x.png';


      //let cardEl = $('<div class="task-card card mb-2">');
      //let divEl = $('<div>');



      //let curH2El = $('<h2>').text("Current weather conditions");
      let curH3El = $('<h3 class="mb-3">').text(cityName);
      let curTempEl = $('<p>').text(temperature + ' °F');
      let curWeatherDescEl = $('<p>').text(weatherDescription);
      let currWeatherIcon = $('<img>');
      currWeatherIcon.attr('src', iconUrl);


    //  currentWeatherEl.html(currentOutput);
    currentWeatherEl.append(curH3El, curTempEl, curWeatherDescEl, currWeatherIcon);

      // forecast information goes here

    }
}

function getWeatherIcon(weatherId) {
    // Define mapping of weather condition codes to icon URLs
    var iconMap = {
        '01d': 'http://openweathermap.org/img/wn/01d.png', // clear sky (day)
        '01n': 'http://openweathermap.org/img/wn/01n.png', // clear sky (night)
        '02d': 'http://openweathermap.org/img/wn/02d.png', // few clouds (day)
        '02n': 'http://openweathermap.org/img/wn/02n.png', // few clouds (night)
        // Add more mappings as needed
    };

    // Default icon URL if no match found
    var defaultIconUrl = 'http://openweathermap.org/img/wn/01d.png'; // Default to clear sky (day) icon

    // Get icon URL from map, default to defaultIconUrl if no match found
    return iconMap[weatherCode] || defaultIconUrl;
}


//Setting the click function at ID search button
searchCityFormEl.on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    q = cityInputEl.val();
    if (q === '') {
        return alert('Please Enter Valid City Name ! ');
    }
    fetchWeather(q);

//    saveToLocalStorage(q);
});

