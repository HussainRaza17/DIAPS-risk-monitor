// Enhanced JavaScript with modern features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated background
    createParticles();
    
    // Initialize map with enhanced features
    initializeMap();
    
    // Initialize UI interactions
    initializeUI();
    
    // Update stats periodically
    updateStats();
    setInterval(updateStats, 30000);
});

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
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Enhanced map initialization
function initializeMap() {
    const map = L.map('map', {
        zoomControl: false // We'll use custom controls
    }).setView([20, 0], 2);
    
    // Add enhanced tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Custom marker icons
    const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    // Enhanced map interactions
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        // Add animated marker
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b;">📍 Selected Location</h3>
                <p style="margin: 5px 0; color: #64748b;">Lat: ${lat}, Lng: ${lng}</p>
                <a href="details.html?lat=${lat}&lng=${lng}" 
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); 
                          color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; 
                          font-weight: 600; margin-top: 10px; transition: transform 0.2s;"
                   onmouseover="this.style.transform='scale(1.05)'"
                   onmouseout="this.style.transform='scale(1)'">
                    🔍 View Details
                </a>
            </div>
        `).openPopup();
        
        // Add pulse animation
        marker._icon.classList.add('pulse-marker');
        
        // Show loading message
        showInfoMessage('Preparing detailed analysis...', 2000);
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = `details.html?lat=${lat}&lng=${lng}`;
        }, 2500);
    });
    
    // Add user location if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            map.setView([userLat, userLng], 10);
            
            L.marker([userLat, userLng], {icon: userIcon})
                .addTo(map)
                .bindPopup(`
                    <div style="text-align: center; padding: 10px;">
                        <h3 style="color: #1e293b;">📍 Your Location</h3>
                        <p style="color: #64748b;">Click anywhere else to explore other locations</p>
                    </div>
                `)
                .openPopup();
            
            showInfoMessage('🎯 Map centered on your location. Click anywhere to explore!', 4000);
            
            // Load nearby earthquakes
            fetchRecentEarthquakes(userLat, userLng, 500, map);
        }, function(error) {
            showInfoMessage('📍 Could not get your location: ' + error.message, 5000, 'error');
        });
    }
    
    // Custom map controls
    setupMapControls(map);
    
    // Store map reference globally
    window.diapsMap = map;
}

// Setup custom map controls
function setupMapControls(map) {
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
    document.getElementById('reset-view').addEventListener('click', () => map.setView([20, 0], 2));
    
    document.getElementById('locate-btn').addEventListener('click', function() {
        if (navigator.geolocation) {
            this.innerHTML = '⏳ Locating...';
            navigator.geolocation.getCurrentPosition(position => {
                map.setView([position.coords.latitude, position.coords.longitude], 12);
                this.innerHTML = '📍 My Location';
                showInfoMessage('📍 Location updated!', 2000);
            }, error => {
                this.innerHTML = '📍 My Location';
                showInfoMessage('❌ Could not get location', 3000, 'error');
            });
        }
    });
    
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        const mapElement = document.getElementById('map');
        if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
        }
    });
}

// Initialize UI interactions
function initializeUI() {
    // Status panel toggle
    setTimeout(() => {
        document.getElementById('status-panel').classList.add('active');
        setTimeout(() => {
            document.getElementById('status-panel').classList.remove('active');
        }, 3000);
    }, 2000);
    
    document.getElementById('close-status').addEventListener('click', function() {
        document.getElementById('status-panel').classList.remove('active');
    });
    
    // Update last update time
    setInterval(() => {
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
    }, 60000);
}

// Fetch and display earthquakes
async function fetchRecentEarthquakes(lat, lng, radiusKm, map) {
    try {
        const endTime = new Date().toISOString();
        const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&latitude=${lat}&longitude=${lng}&maxradiuskm=${radiusKm}&minmagnitude=4.5`);
        const data = await response.json();
        
        if (response.ok && data.features && data.features.length > 0) {
            displayEarthquakesOnMap(data.features, map);
            showInfoMessage(`🌍 Found ${data.features.length} significant earthquakes nearby`, 4000);
        }
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        showInfoMessage('❌ Failed to load earthquake data', 3000, 'error');
    }
}

// Display earthquakes on the map
function displayEarthquakesOnMap(earthquakes, map) {
    earthquakes.forEach(quake => {
        const magnitude = quake.properties.mag;
        const location = quake.properties.place;
        const time = new Date(quake.properties.time).toLocaleString();
        const coordinates = quake.geometry.coordinates;
        const lng = coordinates[0];
        const lat = coordinates[1];
        const depth = coordinates[2];
        
        // Determine icon color based on magnitude
        let iconColor = 'green';
        let riskLevel = 'Low';
        if (magnitude >= 7) {
            iconColor = 'red';
            riskLevel = 'Very High';
        } else if (magnitude >= 6) {
            iconColor = 'red';
            riskLevel = 'High';
        } else if (magnitude >= 5) {
            iconColor = 'orange';
            riskLevel = 'Moderate';
        } else if (magnitude >= 4.5) {
            iconColor = 'yellow';
            riskLevel = 'Low-Moderate';
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
            <div class="earthquake-popup" style="text-align: center; padding: 15px; max-width: 300px;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b;">🌍 Magnitude ${magnitude}</h3>
                <div style="background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: #dc2626;">Risk Level: ${riskLevel}</strong>
                </div>
                <p style="margin: 5px 0; color: #64748b;"><strong>📍 Location:</strong> ${location}</p>
                <p style="margin: 5px 0; color: #64748b;"><strong>⏰ Time:</strong> ${time}</p>
                <p style="margin: 5px 0; color: #64748b;"><strong>🏔️ Depth:</strong> ${depth} km</p>
                <a href="details.html?lat=${lat}&lng=${lng}" 
                   style="display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626); 
                          color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; 
                          font-weight: 600; margin-top: 15px; transition: transform 0.2s;"
                   onmouseover="this.style.transform='scale(1.05)'"
                   onmouseout="this.style.transform='scale(1)'">
                    🔍 Analyze This Location
                </a>
            </div>
        `);
        
        // Add pulsing effect for high magnitude earthquakes
        if (magnitude >= 6) {
            marker._icon.classList.add('pulse-marker');
        }
    });
}

// Update statistics in header
function updateStats() {
    const stats = {
        activeUsers: Math.floor(Math.random() * 5000) + 10000,
        locationsMonitored: (Math.random() * 0.5 + 2.0).toFixed(1) + 'M',
        alertsSent: Math.floor(Math.random() * 50000) + 100000
    };
    
    // Animate number changes
    animateValue('active-users', parseInt(document.getElementById('active-users').textContent.replace(/,/g, '')), stats.activeUsers, 2000);
    document.getElementById('locations-monitored').textContent = stats.locationsMonitored;
    animateValue('alerts-sent', parseInt(document.getElementById('alerts-sent').textContent.replace(/K/g, '')) * 1000, stats.alertsSent, 2000);
}

// Animate number values
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        // Format numbers appropriately
        if (elementId === 'alerts-sent') {
            element.textContent = Math.floor(current / 1000) + 'K';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Enhanced info message function
function showInfoMessage(message, duration = 3000, type = 'info') {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('info-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'info-message';
        messageElement.className = 'info-message';
        document.body.appendChild(messageElement);
    }
    
    // Set message content and class
    messageElement.textContent = message;
    messageElement.className = `info-message ${type}`;
    
    // Show the message with animation
    messageElement.style.display = 'block';
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(-50%) translateY(-20px)';
    
    // Animate in
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Hide after duration
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 300);
    }, duration);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (window.diapsMap) {
        switch(e.key) {
            case '+':
            case '=':
                window.diapsMap.zoomIn();
                break;
            case '-':
            case '_':
                window.diapsMap.zoomOut();
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.diapsMap.setView([20, 0], 2);
                    showInfoMessage('🌍 Map view reset', 2000);
                }
                break;
            case 'l':
            case 'L':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    document.getElementById('locate-btn').click();
                }
                break;
        }
    }
});

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showInfoMessage('⚠️ An error occurred. Please refresh the page.', 5000, 'error');
});

// Service worker registration for offline capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // You can add a service worker here for offline functionality
        console.log('Service worker support detected');
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`DIAPS loaded in ${loadTime}ms`);
    
    if (loadTime > 3000) {
        showInfoMessage('⚡ For better performance, try refreshing the page', 4000);
    }
});

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('skeleton');
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('skeleton');
    }
}

// Network status monitoring
window.addEventListener('online', function() {
    showInfoMessage('🌐 Connection restored', 2000);
});

window.addEventListener('offline', function() {
    showInfoMessage('📡 Connection lost - some features may be limited', 5000, 'error');
});

// Initialize tooltips for better accessibility
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-popup';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                document.body.removeChild(this._tooltip);
                this._tooltip = null;
            }
        });
    });
}

// Initialize tooltips when DOM is ready
setTimeout(initializeTooltips, 1000);

