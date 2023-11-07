// Step 1: Get your API key from OpenWeatherMap
const apiKey = "870586eedbe4686803b790774d374cf9"; 

// Step 2: Create variables to store references to HTML elements
const cityInput = document.getElementById("cityInput");
const btn = document.getElementById("btn");
const weatherInfo = document.getElementById("weather-info");

// Step 3: Add an event listener to the button to detect when it is clicked
btn.addEventListener("click", () => {
  // Step 4: Get the value of the input field (city name)
  const city = cityInput.value;

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  // Step 5: Make an HTTP request to the OpenWeatherMap API
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Step 7: Parse the data and update the weather info div
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const windSpeed = data.wind.speed;

      const weatherHTML = `
        <p>The weather in ${city} is ${weatherDescription}</p>
        <p>The temperature is  ${temperature}°C with a wind speed of  ${windSpeed} m/s </p>
      `;

      weatherInfo.innerHTML = weatherHTML;
    })
    .catch((error) => {
      // Step 6: Error handling
      console.error("Error:", error);
      weatherInfo.innerHTML = "Error fetching weather data.";
    });
});
