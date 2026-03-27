const apiKey = "2306febc766fd833528d7795ed1e8b07";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// UI elements
const cityName = document.getElementById("cityName");
const date = document.getElementById("date");
const temperature = document.getElementById("temperature");
const weatherDesc = document.getElementById("weatherDesc");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastContainer = document.getElementById("forecastContainer");

// Search button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city name");
    }
});

// Get current weather
async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        console.log("Weather Data:", data);

        // Handle API errors
        if (data.cod !== 200) {
            alert(` ${data.message}`);
            return;
        }

        // Update UI
        cityName.textContent = data.name;
        temperature.textContent = Math.round(data.main.temp) + "°C";
        weatherDesc.textContent = data.weather[0].description;
        humidity.textContent = data.main.humidity + "%";
        wind.textContent = data.wind.speed + " km/h";

        const today = new Date();
        date.textContent = today.toDateString();

        changeBackground(data.weather[0].main);

    } catch (error) {
        console.error("Weather Error:", error);
        alert("Something went wrong while fetching weather.");
    }
}

// Get 5-day forecast
async function getForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        console.log("Forecast Data:", data);

        // Handle API errors
        if (data.cod !== "200") {
            alert(` ${data.message}`);
            return;
        }

        forecastContainer.innerHTML = "";

        // Get one forecast per day 
        const dailyData = data.list.filter((item, index) => index % 8 === 0);

        dailyData.slice(0, 5).forEach(item => {
            const card = document.createElement("div");
            card.classList.add("forecast-card");

            const forecastDate = new Date(item.dt_txt);

            card.innerHTML = `
                <p>${forecastDate.toLocaleDateString("en-US", { weekday: "short" })}</p>
                <p>${Math.round(item.main.temp)}°C</p>
            `;

            forecastContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Forecast Error:", error);
        alert("Something went wrong while fetching forecast.");
    }
}

//  Change background based on weather
function changeBackground(weather) {
    const body = document.body;

    switch (weather) {
        case "Clear":
            body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
            break;
        case "Clouds":
            body.style.background = "linear-gradient(135deg, #d7d2cc, #304352)";
            break;
        case "Rain":
            body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
            break;
        case "Snow":
            body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
            break;
        default:
            body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
    }
}
