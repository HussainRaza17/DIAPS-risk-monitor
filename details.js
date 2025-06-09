// Create animated background particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat') || '28.6139'; // Default to Delhi
    const lng = urlParams.get('lng') || '77.2090';
    
    // Update location info
    document.getElementById('location-title').innerHTML = '🌍 Location Details';
    document.getElementById('coordinates').innerHTML = `📍 Coordinates: ${lat}, ${lng}`;
    
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
    document.getElementById('location-title').innerHTML = `🌍 ${data.location.name}, ${data.location.country}`;
    
    // Display forecast for 3 days
    data.forecast.forecastday.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayElement = document.createElement('div');
        dayElement.className = 'weather-day';
        dayElement.style.animationDelay = `${index * 0.2}s`;
        dayElement.innerHTML = `
            <h4>${dayName}, ${date.toLocaleDateString()}</h4>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p class="weather-condition">${day.day.condition.text}</p>
            <p><strong>Temp:</strong> ${day.day.avgtemp_c}°C (${day.day.avgtemp_f}°F)</p>
            <p><strong>High/Low:</strong> ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
            <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
            <p><strong>Wind:</strong> ${day.day.maxwind_kph} km/h</p>
            <p><strong>Precipitation:</strong> ${day.day.totalprecip_mm} mm</p>
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
            document.getElementById('elevation').innerHTML = `⛰️ Elevation: ${elevation} meters`;
        } else {
            throw new Error('Failed to get elevation data');
        }
    } catch (error) {
        console.error('Error fetching elevation data:', error);
        document.getElementById('elevation').innerHTML = '⛰️ Elevation: Data unavailable';
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
        data.features.forEach((quake, index) => {
            const magnitude = quake.properties.mag;
            const location = quake.properties.place;
            const time = new Date(quake.properties.time).toLocaleString();
            const depth = quake.geometry.coordinates[2];
            
            const quakeElement = document.createElement('div');
            quakeElement.className = 'earthquake-item';
            quakeElement.style.animationDelay = `${index * 0.1}s`;
            
            // Determine severity class based on magnitude
            let severityClass = '';
            if (magnitude >= 6) {
                severityClass = 'severe';
            } else if (magnitude >= 4.5) {
                severityClass = 'moderate';
            } else {
                severityClass = 'minor';
            }
            
            quakeElement.classList.add(severityClass);
            
            quakeElement.innerHTML = `
                <h4>🌍 Magnitude ${magnitude}</h4>
                <p><strong>📍 Location:</strong> ${location}</p>
                <p><strong>⏰ Time:</strong> ${time}</p>
                <p><strong>🏔️ Depth:</strong> ${depth} km</p>
                <button class="quake-details-btn" onclick="showQuakeDetails('${quake.properties.url}')">
                    View Details
                </button>
            `;
            
            earthquakeList.appendChild(quakeElement);
        });
    } else {
        // No earthquakes found
        earthquakeList.innerHTML = `
            <div class="no-data-message">
                <p><strong>Good news!</strong> No significant earthquakes detected in the past 30 days within 100km radius.</p>
                <p>🌿</p>
            </div>
        `;
    }
    
    // Hide loading, show data
    document.getElementById('earthquake-loading').classList.add('hidden');
    document.getElementById('earthquake-data').classList.remove('hidden');
}

// Show earthquake details
function showQuakeDetails(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// Calculate disaster risks based on various factors
async function calculateDisasterRisks(lat, lng) {
    try {
        // Simulate risk calculation based on location and weather data
        const risks = await computeRiskLevels(lat, lng);
        displayDisasterRisks(risks);
    } catch (error) {
        console.error('Error calculating disaster risks:', error);
        document.getElementById('disaster-loading').textContent = 'Failed to calculate disaster risks.';
        document.getElementById('disaster-loading').classList.add('error-message');
    }
}

// Compute risk levels based on location and weather patterns
async function computeRiskLevels(lat, lng) {
    // Simulate risk calculation - in real implementation, this would use ML models
    const elevation = await getElevationForRisk(lat, lng);
    const weatherRisk = await getWeatherRiskFactors(lat, lng);
    const geographicRisk = getGeographicRiskFactors(lat, lng);
    
    return {
        flood: calculateFloodRisk(elevation, weatherRisk, geographicRisk),
        rain: calculateRainRisk(weatherRisk),
        landslide: calculateLandslideRisk(elevation, weatherRisk, geographicRisk),
        tsunami: calculateTsunamiRisk(lat, lng, elevation)
    };
}

// Helper functions for risk calculation
async function getElevationForRisk(lat, lng) {
    try {
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0].elevation : 100;
    } catch (error) {
        return 100; // Default elevation
    }
}

async function getWeatherRiskFactors(lat, lng) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=3`);
        const data = await response.json();
        
        if (response.ok) {
            const avgPrecip = data.forecast.forecastday.reduce((sum, day) => sum + day.day.totalprecip_mm, 0) / 3;
            const avgWind = data.forecast.forecastday.reduce((sum, day) => sum + day.day.maxwind_kph, 0) / 3;
            const avgHumidity = data.forecast.forecastday.reduce((sum, day) => sum + day.day.avghumidity, 0) / 3;
            
            return { precipitation: avgPrecip, wind: avgWind, humidity: avgHumidity };
        }
    } catch (error) {
        console.error('Error getting weather risk factors:', error);
    }
    
    return { precipitation: 5, wind: 15, humidity: 60 }; // Default values
}

function getGeographicRiskFactors(lat, lng) {
    // Simulate geographic risk based on coordinates
    const isCoastal = Math.abs(lat) < 60 && (Math.abs(lng) % 10 < 3); // Simplified coastal detection
    const isMountainous = Math.abs(lat) > 20 && Math.abs(lat) < 60;
    const isFloodProne = Math.abs(lat) < 40;
    
    return { coastal: isCoastal, mountainous: isMountainous, floodProne: isFloodProne };
}

// Risk calculation functions
function calculateFloodRisk(elevation, weather, geographic) {
    let risk = 0;
    
    // Lower elevation increases flood risk
    if (elevation < 50) risk += 40;
    else if (elevation < 200) risk += 20;
    else if (elevation < 500) risk += 10;
    
    // High precipitation increases risk
    if (weather.precipitation > 50) risk += 30;
    else if (weather.precipitation > 20) risk += 20;
    else if (weather.precipitation > 10) risk += 10;
    
    // Geographic factors
    if (geographic.floodProne) risk += 15;
    if (geographic.coastal) risk += 10;
    
    return Math.min(risk, 100);
}

function calculateRainRisk(weather) {
    let risk = 0;
    
    if (weather.precipitation > 100) risk = 95;
    else if (weather.precipitation > 50) risk = 75;
    else if (weather.precipitation > 25) risk = 50;
    else if (weather.precipitation > 10) risk = 25;
    else risk = 10;
    
    // Adjust for humidity
    if (weather.humidity > 80) risk += 10;
    
    return Math.min(risk, 100);
}

function calculateLandslideRisk(elevation, weather, geographic) {
    let risk = 0;
    
    // Mountainous areas have higher landslide risk
    if (geographic.mountainous) risk += 30;
    if (elevation > 1000) risk += 25;
    else if (elevation > 500) risk += 15;
    
    // Heavy rain increases landslide risk
    if (weather.precipitation > 30) risk += 35;
    else if (weather.precipitation > 15) risk += 20;
    else if (weather.precipitation > 5) risk += 10;
    
    return Math.min(risk, 100);
}

function calculateTsunamiRisk(lat, lng, elevation) {
    let risk = 0;
    
    // Higher risk for coastal areas with low elevation
    const isCoastal = Math.abs(lat) < 60 && (Math.abs(lng) % 10 < 3);
    
    if (isCoastal && elevation < 10) risk = 70;
    else if (isCoastal && elevation < 50) risk = 40;
    else if (isCoastal && elevation < 100) risk = 20;
    else if (isCoastal) risk = 10;
    else risk = 2; // Inland areas have very low tsunami risk
    
    return Math.min(risk, 100);
}

// Display disaster risks
function displayDisasterRisks(risks) {
    const riskItems = ['flood', 'rain', 'landslide', 'tsunami'];
    const riskLabels = ['Flood Risk', 'Heavy Rain Risk', 'Landslide Risk', 'Tsunami Risk'];
    
    riskItems.forEach((riskType, index) => {
        const riskValue = risks[riskType];
        const riskLevel = getRiskLevel(riskValue);
        const riskElement = document.getElementById(`${riskType}-risk`);
        
        if (riskElement) {
            // Update risk text and level
            const riskText = riskElement.querySelector('div:nth-child(2)');
            if (riskText) {
                riskText.innerHTML = `<span class="${riskLevel.class}">${riskLevel.text} (${riskValue}%)</span>`;
            }
            
            // Update progress bar
            const progressFill = riskElement.querySelector('.risk-progress-fill');
            if (progressFill) {
                progressFill.className = `risk-progress-fill progress-${riskLevel.class}`;
                setTimeout(() => {
                    progressFill.style.width = `${riskValue}%`;
                }, 500 + index * 200);
            }
            
            // Add risk level class to item
            riskElement.className = `risk-item tooltip risk-${riskLevel.class}`;
        }
    });
    
    // Create risk chart
    createRiskChart(risks);
    
    // Hide loading, show data
    document.getElementById('disaster-loading').classList.add('hidden');
    document.getElementById('disaster-data').classList.remove('hidden');
}

// Get risk level classification
function getRiskLevel(value) {
    if (value >= 80) return { class: 'very-high', text: 'Very High' };
    if (value >= 60) return { class: 'high', text: 'High' };
    if (value >= 40) return { class: 'moderate', text: 'Moderate' };
    if (value >= 20) return { class: 'low', text: 'Low' };
    return { class: 'very-low', text: 'Very Low' };
}

// Create risk assessment chart
function createRiskChart(risks) {
    const ctx = document.getElementById('risk-chart');
    if (!ctx) return;
    
    const chartData = {
        labels: ['Flood', 'Heavy Rain', 'Landslide', 'Tsunami'],
        datasets: [{
            label: 'Risk Level (%)',
            data: [risks.flood, risks.rain, risks.landslide, risks.tsunami],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        }]
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    callback: function(value) {
                        return value + '%';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}