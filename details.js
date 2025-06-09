document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    
    // Update location info
    document.getElementById('location-title').textContent = 'Location Details';
    document.getElementById('coordinates').textContent = `Coordinates: ${lat}, ${lng}`;
    
    // Fetch all data
    fetchWeatherData(lat, lng);
    fetchElevationData(lat, lng);
    fetchEarthquakeData(lat, lng);
    calculateDisasterRisks(lat, lng);
});

// Replace with your actual API key
const WEATHER_API_KEY = 'b1fab2921c2a4edaa6f80559232412';

// Fetch weather data
async function fetchWeatherData(lat, lng) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=3&aqi=no&alerts=yes`);
        const data = await response.json();
        
        if (response.ok) {
            displayWeatherData(data);
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-loading').textContent = 'Failed to load weather data. ' + error.message;
        document.getElementById('weather-loading').classList.add('error-message');
    }
}

// Display weather data
function displayWeatherData(data) {
    const weatherContainer = document.getElementById('weather-days');
    weatherContainer.innerHTML = '';
    
    // Update location title
    document.getElementById('location-title').textContent = `${data.location.name}, ${data.location.country}`;
    
    // Display forecast for 3 days
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayElement = document.createElement('div');
        dayElement.className = 'weather-day';
        dayElement.innerHTML = `
            <h4>${dayName}, ${date.toLocaleDateString()}</h4>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p class="weather-condition">${day.day.condition.text}</p>
            <p>Temp: ${day.day.avgtemp_c}°C (${day.day.avgtemp_f}°F)</p>
            <p>Max: ${day.day.maxtemp_c}°C | Min: ${day.day.mintemp_c}°C</p>
            <p>Humidity: ${day.day.avghumidity}%</p>
            <p>Wind: ${day.day.maxwind_kph} km/h</p>
            <p>Rain: ${day.day.totalprecip_mm} mm</p>
        `;
        weatherContainer.appendChild(dayElement);
    });
    
    // Hide loading, show data
    document.getElementById('weather-loading').classList.add('hidden');
    document.getElementById('weather-data').classList.remove('hidden');
}

// Fetch elevation data
async function fetchElevationData(lat, lng) {
    try {
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
        const data = await response.json();
        
        if (response.ok && data.results && data.results.length > 0) {
            const elevation = data.results[0].elevation;
            document.getElementById('elevation').textContent = `Elevation: ${elevation} meters`;
        } else {
            throw new Error('Failed to get elevation data');
        }
    } catch (error) {
        console.error('Error fetching elevation data:', error);
        document.getElementById('elevation').textContent = 'Elevation: Data unavailable';
        document.getElementById('elevation').classList.add('error-text');
    }
}

// Fetch earthquake data
async function fetchEarthquakeData(lat, lng) {
    try {
        // Get earthquakes in the last 30 days within 100km radius
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&latitude=${lat}&longitude=${lng}&maxradiuskm=100`);
        const data = await response.json();
        
        if (response.ok) {
            displayEarthquakeData(data);
        } else {
            throw new Error('Failed to get earthquake data');
        }
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        document.getElementById('earthquake-loading').textContent = 'Failed to load earthquake data. ' + error.message;
        document.getElementById('earthquake-loading').classList.add('error-message');
    }
}

// Display earthquake data
function displayEarthquakeData(data) {
    const earthquakeList = document.getElementById('earthquake-list');
    earthquakeList.innerHTML = '';
    
    if (data.features && data.features.length > 0) {
        // Sort earthquakes by time (most recent first)
        data.features.sort((a, b) => b.properties.time - a.properties.time);
        
        // Create list of earthquakes
        data.features.forEach(quake => {
            const magnitude = quake.properties.mag;
            const location = quake.properties.place;
            const time = new Date(quake.properties.time).toLocaleString();
            const depth = quake.geometry.coordinates[2];
            
            const quakeElement = document.createElement('div');
            quakeElement.className = 'earthquake-item';
            
            // Determine severity class based on magnitude
            let severityClass = '';
            if (magnitude >= 6) {
                severityClass = 'severe';
            } else if (magnitude >= 4.5) {
                severityClass = 'moderate';
            } else {
                severityClass = 'minor';
            }
            
            quakeElement.innerHTML = `
                <h4 class="${severityClass}">Magnitude ${magnitude}</h4>
                <p>Location: ${location}</p>
                <p>Time: ${time}</p>
                <p>Depth: ${depth} km</p>
                <div class="quake-details-btn">Details</div>
            `;
            earthquakeList.appendChild(quakeElement);
            
            // Add click event for details button
            const detailsBtn = quakeElement.querySelector('.quake-details-btn');
            detailsBtn.addEventListener('click', function() {
                alert(`Earthquake Details\n\nMagnitude: ${magnitude}\nLocation: ${location}\nTime: ${time}\nDepth: ${depth} km\nFelt Reports: ${quake.properties.felt || 'None'}\nSignificance: ${quake.properties.sig}`);
            });
        });
    } else {
        // No earthquakes found
        earthquakeList.innerHTML = '<div class="no-data-message"><p>No recent earthquakes found within <strong>100 km</strong>.</p><p>This is good news! 🎉</p></div>';
    }
    
    // Hide loading, show data
    document.getElementById('earthquake-loading').classList.add('hidden');
    document.getElementById('earthquake-data').classList.remove('hidden');
}

// Calculate disaster risks
function calculateDisasterRisks(lat, lng) {
    // This is a simplified risk calculation based on weather data
    // In a real app, you'd use more sophisticated models and additional data sources
    
    // Simulating a delay for calculation
    setTimeout(() => {
        // These risk values would normally be calculated based on actual data
        // For demo purposes, we're generating semi-random values
        
        // For more realistic demo, use the coordinates to adjust risks
        // Coastal areas might have higher tsunami risk, etc.
        
        const isCoastal = isCoastalLocation(lat, lng);
        const elevation = parseFloat(document.getElementById('elevation').textContent.split(' ')[1]) || 0;
        
        // Get weather data from displayed weather (if available)
        let rainAmount = 0;
        const weatherData = document.getElementById('weather-data');
        if (!weatherData.classList.contains('hidden')) {
            const weatherDays = document.querySelectorAll('.weather-day');
            if (weatherDays.length > 0) {
                const rainText = weatherDays[0].querySelector('p:nth-child(8)').textContent;
                rainAmount = parseFloat(rainText.split(' ')[1]) || 0;
            }
        }
        
        // Calculate risks based on data
        let floodRisk = Math.min(5, Math.max(1, Math.round((rainAmount / 10) * 5)));
        if (elevation < 10) floodRisk += 1;
        if (floodRisk > 5) floodRisk = 5;
        
        let rainRisk = Math.min(5, Math.max(1, Math.round((rainAmount / 15) * 5)));
        
        let landslideRisk = 1;
        if (elevation > 100) {
            landslideRisk = Math.min(5, Math.max(1, Math.round((rainAmount / 8) * 3)));
        }
        
        let tsunamiRisk = 1;
        if (isCoastal && elevation < 20) {
            tsunamiRisk = Math.min(5, Math.max(1, 2 + Math.random() * 2));
        }
        
        // Update risk text with classes for color coding
        document.getElementById('flood-risk').innerHTML = `Flood Risk: <span class="${getRiskClass(floodRisk)}">${getRiskText(floodRisk)}</span>`;
        document.getElementById('rain-risk').innerHTML = `Heavy Rain Risk: <span class="${getRiskClass(rainRisk)}">${getRiskText(rainRisk)}</span>`;
        document.getElementById('landslide-risk').innerHTML = `Landslide Risk: <span class="${getRiskClass(landslideRisk)}">${getRiskText(landslideRisk)}</span>`;
        document.getElementById('tsunami-risk').innerHTML = `Tsunami Risk: <span class="${getRiskClass(tsunamiRisk)}">${getRiskText(tsunamiRisk)}</span>`;
        
        // Apply risk-level classes to parent elements
        document.getElementById('flood-risk').className = `tooltip risk-${getRiskClass(floodRisk)}`;
        document.getElementById('rain-risk').className = `tooltip risk-${getRiskClass(rainRisk)}`;
        document.getElementById('landslide-risk').className = `tooltip risk-${getRiskClass(landslideRisk)}`;
        document.getElementById('tsunami-risk').className = `tooltip risk-${getRiskClass(tsunamiRisk)}`;
        
        // Create the risk chart
        createRiskChart([floodRisk, rainRisk, landslideRisk, tsunamiRisk]);
        
        // Hide loading, show data
        document.getElementById('disaster-loading').classList.add('hidden');
        document.getElementById('disaster-data').classList.remove('hidden');
    }, 1500);
}

// Helper function to determine if location is coastal (simplified)
function isCoastalLocation(lat, lng) {
    // This is a very simplified check
    // In a real app, you'd use coastline data or proximity to oceans
    // For demo, we'll just check if the location is near certain known oceans
    
    // Check if near Pacific
    if ((lng > 120 || lng < -120) && (lat < 60 && lat > -60)) return true;
    
    // Check if near Atlantic
    if ((lng > -80 && lng < 0) && (lat < 60 && lat > -40)) return true;
    
    // Check if near Indian Ocean
    if ((lng > 40 && lng < 120) && (lat < 20 && lat > -40)) return true;
    
    return false;
}

// Helper function to convert risk level to text
function getRiskText(riskLevel) {
    switch(riskLevel) {
        case 1: return "Very Low";
        case 2: return "Low";
        case 3: return "Moderate";
        case 4: return "High";
        case 5: return "Very High";
        default: return "Unknown";
    }
}

// Helper function to get CSS class for risk level
function getRiskClass(riskLevel) {
    switch(riskLevel) {
        case 1: return "very-low";
        case 2: return "low";
        case 3: return "moderate";
        case 4: return "high";
        case 5: return "very-high";
        default: return "";
    }
}

// Create risk chart
function createRiskChart(riskLevels) {
    const ctx = document.getElementById('risk-chart').getContext('2d');
    
    // Determine if we need to adjust the y-axis
    // If all risks are at minimum (1), set min to 0 for better visualization
    const minY = riskLevels.every(level => level === 1) ? 0 : 1;
    
    // Colors for risk levels
    const backgroundColors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 99, 132, 0.7)'
    ];
    
    const borderColors = [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 99, 132, 1)'
    ];
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Flood', 'Heavy Rain', 'Landslide', 'Tsunami'],
            datasets: [{
                label: 'Risk Level (1-5)',
                data: riskLevels,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: minY === 0,
                    min: minY,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (value === 1) return "Very Low";
                            if (value === 2) return "Low";
                            if (value === 3) return "Moderate";
                            if (value === 4) return "High";
                            if (value === 5) return "Very High";
                            return value;
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            let riskText = "";
                            switch(value) {
                                case 1: riskText = "Very Low"; break;
                                case 2: riskText = "Low"; break;
                                case 3: riskText = "Moderate"; break;
                                case 4: riskText = "High"; break;
                                case 5: riskText = "Very High"; break;
                            }
                            return `Risk: ${riskText} (${value}/5)`;
                        }
                    }
                }
            }
        }
    });
}
