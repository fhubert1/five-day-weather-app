// Elements
let searchCityFormEl = $('#search-city-form');
let cityInputEl = $('#search-city-input');
let currentWeatherEl = $('#current-weather');
let forecastWeatherEl = $('#five-day-forecast');
let curentWeatherText = $('#curent-weather-text');
let fiveDayForecastText = $('#five-day-weather-text');
let errorText = $('#error-text');
let recentSearchList = $('#recent-searches');


// API Key
let myAPIKey = "cd21ba523fb739621b273673758c1457";
let q = "";
let now = dayjs().startOf('day');

//Date and time formate for header
let curDateTime = now.format('MMMM D YYYY');
$("#curDayTime").text(curDateTime);

// load window 
$(window).on('load', function () {

  curentWeatherText.hide();
  fiveDayForecastText.hide();
  errorText.hide();

  // Display of recent searches
  displayRecentSearches();  

  
});

// Functions

// fetch Weather and Forecast using OWM APIs
function fetchWeather(city) {

    let weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myAPIKey}&units=imperial`;
    const forecastAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myAPIKey}&units=imperial`;

    fetch(weatherAPIUrl)
      .then(response => response.json())
      .then(results => {
        errorText.hide();
        displayWeather(results);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        errorText.show();
        errorText.text('Error fetching weather data. Please try again later.')
      });

      fetch(forecastAPIUrl)
      .then(response => response.json())
      .then(results => {
        errorText.hide();
        displayForecast(results);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        errorText.show();
        errorText.text('Error fetching weather data. Please try again later.')        
      });      
  }

  // display current weather
  function displayWeather(results) {

    if (results.cod === '404') {
      weatherInfo.innerHTML = '<p class="text-danger">The city entered was not found. Please verify city name.</p>';
    } else {

          // clear element
      currentWeatherEl.empty();
      let cityName = results.city.name;

      // Current weather
      let currentWeather = results.list[0];
      let temperature = Math.round(currentWeather.main.temp);
      let weatherDescription = currentWeather.weather[0].description;
      let currIconImg = currentWeather.weather[0].icon;
      let humidity = currentWeather.main.humidity;
      let iconUrl = 'https://openweathermap.org/img/wn/' + currIconImg + '.png';

      // build card
      let divEl = $('<div>');
      divEl.addClass('col-md-4 offset-md-3 align-items-center');

      let divCardEl = $('<div>');
      divCardEl.addClass('card col-2');

      let divCardBodyEl = $('<div>');
      divCardBodyEl.addClass('card-body');

      let cardTitleEl = $('<h5>');
      cardTitleEl.text(cityName);

      // weather description
      let cardDescEl = $('<p>');
      cardDescEl.addClass('card-text');
      cardDescEl.text(weatherDescription);

      // temp
      let cardTempEl = $('<p>');
      cardTempEl.addClass('card-text');
      cardTempEl.text(temperature) + " °F";

      // humidity
      let cardHumidityEl = $('<p>');
      cardHumidityEl.addClass('card-text');
      cardHumidityEl.text('Humidity: ' + humidity);

      // weather icon
      let currWeatherIcon = $('<img>');
      currWeatherIcon.addClass('icon-img');
      currWeatherIcon.attr('src', iconUrl);

      // show current weather header
      curentWeatherText.show();
      divCardBodyEl.append(cardTitleEl, currWeatherIcon, cardDescEl, cardTempEl, cardHumidityEl);

      // append card to page
      divCardEl.append(divCardBodyEl);
      currentWeatherEl.append(divCardEl)

    }
}

// display the 5 day forecast data
function displayForecast(data) {

    // clear element
    forecastWeatherEl.empty();

    // loop to build cards
    // not sure why the jquery logic didn't work here....had punt and try another way to build the cards
    for (let x = 0; x < data.list.length; x += 8) {
      var item = data.list[x];

      let formattedDate = dayjs(item.dt_txt).format('ddd, MMM D, YYYY');

      // icon 
      let iconImg = item.weather[0].icon;
      let iconUrl = 'https://openweathermap.org/img/wn/' + iconImg + '.png';

      // temp
      let temperature = Math.round(item.main.temp);

      // show 5 day forecast header
      fiveDayForecastText.show();

      // build and append card to element
      forecastWeatherEl.append(`
        <div class="col-md-2">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${formattedDate}</h5>
              <img src="${iconUrl}" alt="Weather Icon">
              <p class="card-text">${item.weather[0].description}</p>
              <p class="card-text">${temperature} °F</p>
              <p class="card-text">Humidity: ${item.main.humidity}%</p>
            </div>
          </div>
        </div>
      `);

    }


}

// save city to local storage
function saveToLocalStorage(city) {

    let lastestSearches = JSON.parse(localStorage.getItem('recentSearches'));

    if (!lastestSearches) {
      lastestSearches = [];
      // add item
      lastestSearches.push(city);
      localStorage.setItem('recentSearches', JSON.stringify(lastestSearches));
    } else if (!lastestSearches.includes(city)) {
      // check if city exists and add or do not nothing
      lastestSearches.unshift(city);

      if (lastestSearches.length > 5) {
        lastestSearches.pop();
      }
      localStorage.setItem('recentSearches', JSON.stringify(lastestSearches));

    }

}

// display recent searches pulled from local storage
function displayRecentSearches() {

  let lastestSearches = JSON.parse(localStorage.getItem('recentSearches'));

  if (lastestSearches) {
    recentSearchList.empty();

    lastestSearches.forEach(function(search) {
      recentSearchList.append(`<button id='recent-city-searched'>${search}</button>`);
    });
  }

// event handler for recent city searches
  let recentSearchButtons = document.querySelectorAll("#recent-city-searched");
  recentSearchButtons.forEach(button => {
    button.addEventListener("click", () => {
        let city = button.textContent;
        fetchWeather(city); // Call getCityWeather with the city name
    });
  });  


}

// submit event handler for search button
searchCityFormEl.on("submit", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    q = cityInputEl.val();
    if (q === '') {
      errorText.show();
      errorText.text('Please Enter Valid City Name!')      
        return 
    }
    fetchWeather(q);
    saveToLocalStorage(q);
    displayRecentSearches();
});


