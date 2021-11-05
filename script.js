let apiKey = "bd9db36f5d13b809001a47d45f105dd0";
let URL =
  "https://api.openweathermap.org/data/2.5/weather?q=Denver&units=metric&appid=" +
  apiKey;
let searchBtn = $("#search-btn");

let redirectURL = "index.html";
let today = moment();
let date = today.format("dddd, MMMM Do, YYYY");
let citiesArray = JSON.parse(localStorage.getItem("savedCities")) || [];

//Fetching City
searchBtn.on("click", function (event) {
  event.preventDefault();
  city = $("#input").val();
  console.log(city);
  city = city.toUpperCase();
  getCity(city);
});

// gets City by going to the first API

function getCity(city) {
  current =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric&appid=" +
    apiKey;
  
  fetch(current)
    .then(function (response) {
      if (response.status != 200) {
        console.log("Wrong City");
        alert("Please enter a valid city.");
        document.location.replace(redirectURL);
      } else return response.json();
    })
    .then(function (data) {
      citiesArray.push(city);
      let iconEl =
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      $("#rowContainer").css("border", "2px solid white");
      $("#ciDate").text(`${city} (${date})`);
      $("#icon").empty();
      $("#icon").append($("<img>").attr("src", iconEl));
      $("#weatherInfo").empty();
      $("#weatherInfo").css("style", "list-style: none;");
      $("#weatherInfo").append(`<li>Temperature: ${data.main.temp}°C</li>`);
      $("#weatherInfo").append(`<li>Wind: ${data.wind.speed} KM/H</li>`);
      $("#weatherInfo").append(`<li>Humidity: ${data.main.humidity}%</li>`);
      forecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${apiKey}`;

      // fetching 5 day forecast using the second API.

      fetch(forecast)
        .then(function (response) {
          if (response.status != 200) {
            document.location.replace(redirectURL);
          } else return response.json();
        })
        .then(function (data) {
          getForecast(data);
        });
    });
  }

function getForecast(data) {
  console.log("forecast");
   $("#forecast").empty();
  let newH = $("<h2>").text("5 Day Forecast:");
  $("#forecast").append(newH);

  let newCardContainerEl = $("<div>")
    .attr("id", "cardContainer")
    .attr("class", "row");
  for (i = 1; i <= 5; i++) {    
    let newCard = $("<div>").attr("class", "col bg-secondary");
    let forecastCard = $("<p>").text(`Temp: ${data.daily[i].temp.day}°C`);
    let forecastCardW = $("<p>").text(`Wind Speed: ${data.daily[i].wind_speed}KM/H`);
    let forecastCardH = $("<p>").text(`Humidity: ${data.daily[i].humidity}%`);
    console.log(data.daily[i]);
    newCard.append(forecastCard);
    newCard.append(forecastCardW);
    newCard.append(forecastCardH);
    newCardContainerEl.append(newCard);
  }
  $("#forecast").append(newCardContainerEl);
}
