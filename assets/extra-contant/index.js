document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('map').setView([20, 0], 2);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Create custom marker icon for user location
    const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    // Add click event to map
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        // Add temporary marker at clicked location
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<b>Selected Location</b><br>Lat: ${lat}, Lng: ${lng}<br><a href="details.html?lat=${lat}&lng=${lng}" class="popup-link">View Details</a>`).openPopup();
        
        // Add a pulsing effect to the marker
        marker._icon.classList.add('pulse-marker');
        
        // Redirect to details page with coordinates after a short delay
        setTimeout(() => {
            window.location.href = `details.html?lat=${lat}&lng=${lng}`;
        }, 1000);
    });
    
    // Add a marker for current location if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // Set map view to user's location
            map.setView([userLat, userLng], 10);
            
            // Add marker for user's location
            L.marker([userLat, userLng], {icon: userIcon})
                .addTo(map)
                .bindPopup('Your Location')
                .openPopup();
                
            // Show an info message that appears and fades out
            showInfoMessage('Map centered on your current location. Click anywhere to get disaster information.', 5000);
            
            // Fetch recent earthquakes to display on the map
            fetchRecentEarthquakes(userLat, userLng, 500);
        }, function(error) {
            console.log('Error getting location:', error.message);
            showInfoMessage('Could not get your location. ' + error.message, 5000, 'error');
        });
    }
});

// Fetch recent major earthquakes to display on the map
async function fetchRecentEarthquakes(lat, lng, radiusKm) {
    try {
        // Get significant earthquakes in the last 30 days
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&latitude=${lat}&longitude=${lng}&maxradiuskm=${radiusKm}&minmagnitude=4.5`);
        const data = await response.json();
        
        if (response.ok && data.features && data.features.length > 0) {
            // Display earthquakes on map
            displayEarthquakesOnMap(data.features);
            
            if (data.features.length > 0) {
                showInfoMessage(`Found ${data.features.length} significant earthquakes in the last 30 days within ${radiusKm}km.`, 5000);
            }
        }
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
    }
}

// Display earthquakes on the map
function displayEarthquakesOnMap(earthquakes) {
    const map = L.map('map').getContainer()._leaflet_map;
    
    earthquakes.forEach(quake => {
        const magnitude = quake.properties.mag;
        const location = quake.properties.place;
        const time = new Date(quake.properties.time).toLocaleString();
        const coordinates = quake.geometry.coordinates;
        const lng = coordinates[0];
        const lat = coordinates[1];
        
        // Determine icon color based on magnitude
        let iconColor = 'green';
        if (magnitude >= 6) {
            iconColor = 'red';
        } else if (magnitude >= 5) {
            iconColor = 'orange';
        } else if (magnitude >= 4.5) {
            iconColor = 'yellow';
        }
        
        // Create custom icon for earthquake
        const quakeIcon = L.icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        // Add marker for earthquake
        const marker = L.marker([lat, lng], {icon: quakeIcon}).addTo(map);
        marker.bindPopup(`
            <div class="earthquake-popup">
                <h3>Magnitude ${magnitude}</h3>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Depth:</strong> ${coordinates[2]} km</p>
                <a href="details.html?lat=${lat}&lng=${lng}" class="popup-link">View Details for This Location</a>
            </div>
        `);
    });
}

// Helper function to show temporary info messages
function showInfoMessage(message, duration = 3000, type = 'info') {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('info-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'info-message';
        document.body.appendChild(messageElement);
    }
    
    // Set message content and class
    messageElement.textContent = message;
    messageElement.className = `info-message ${type}`;
    
    // Show the message
    messageElement.style.display = 'block';
    
    // Hide after duration
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.display = 'none';
            messageElement.style.opacity = '1';
        }, 500);
    }, duration);
}
