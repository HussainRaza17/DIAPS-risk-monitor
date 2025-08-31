// Documentation Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    setupApiKeyGeneration();
    initializeScrollAnimations();
    setupEndpointCardInteractions();
    setupKeyboardShortcuts();
    initializeResponsiveNavigation();
});

// Animated background particles
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay and duration
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (4 + Math.random() * 4) + 's';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    container.appendChild(particle);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Active navigation highlighting
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// API Key Generation
function setupApiKeyGeneration() {
    // Add event listener for Enter key on email input
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateApiKey();
            }
        });
    }
}

function generateApiKey() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    button.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate API key
        const apiKey = generateRandomApiKey();
        
        // Show the generated key
        const generatedKeyDiv = document.getElementById('generated-key');
        const apiKeyDisplay = document.getElementById('api-key-display');
        
        apiKeyDisplay.textContent = apiKey;
        generatedKeyDiv.style.display = 'block';
        
        // Smooth scroll to show the key
        generatedKeyDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        showNotification('API key generated successfully!', 'success');
    }, 1500);
}

function generateRandomApiKey() {
    const prefix = 'diaps_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix;
    
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Copy API key to clipboard
function copyApiKey() {
    const apiKeyDisplay = document.getElementById('api-key-display');
    const apiKey = apiKeyDisplay.textContent;
    
    copyToClipboard(apiKey);
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy to clipboard', 'error');
        }
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Test Weather API function
function testWeatherAPI() {
    const lat = document.getElementById('weather-lat').value;
    const lng = document.getElementById('weather-lng').value;
    const units = document.getElementById('weather-units').value;
    
    if (!lat || !lng) {
        showNotification('Please enter latitude and longitude', 'error');
        return;
    }
    
    if (lat < -90 || lat > 90) {
        showNotification('Latitude must be between -90 and 90', 'error');
        return;
    }
    
    if (lng < -180 || lng > 180) {
        showNotification('Longitude must be between -180 and 180', 'error');
        return;
    }
    
    // Simulate API request
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Simulate successful response
        showNotification(`API test successful for coordinates (${lat}, ${lng})`, 'success');
        
        // Show example response in console (for demo purposes)
        console.log('Weather API Test Response:', {
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            current: {
                temperature: units === 'imperial' ? 72.5 : 22.5,
                feels_like: units === 'imperial' ? 75.4 : 24.1,
                humidity: 65,
                condition: 'partly_cloudy',
                units: units
            }
        });
        
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add notification animations if not already added
    addNotificationStyles();
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeInUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#22c55e';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#6366f1';
    }
}

// Enhanced scroll effects
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.15)';
        header.style.backdropFilter = 'blur(25px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
        header.style.backdropFilter = 'blur(20px)';
    }
});

// Endpoint card interactions
function setupEndpointCardInteractions() {
    const endpointCards = document.querySelectorAll('.endpoint-card');
    
    endpointCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px -5px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus email input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const emailInput = document.getElementById('email-input');
            if (emailInput) {
                emailInput.focus();
            }
        }
        
        // ESC to close notifications
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => notification.remove());
        }
        
        // Ctrl/Cmd + / to show keyboard shortcuts help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
}

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
    const shortcuts = [
        { keys: 'Ctrl/Cmd + K', description: 'Focus email input' },
        { keys: 'Escape', description: 'Close notifications' },
        { keys: 'Ctrl/Cmd + /', description: 'Show keyboard shortcuts' }
    ];
    
    let shortcutsList = shortcuts.map(shortcut => 
        `<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <kbd style="background: rgba(255,255,255,0.2); padding: 5px 8px; border-radius: 4px; font-family: monospace;">${shortcut.keys}</kbd>
            <span>${shortcut.description}</span>
        </div>`
    ).join('');
    
    showNotification(`<div><strong>Keyboard Shortcuts:</strong><div style="margin-top: 10px;">${shortcutsList}</div></div>`, 'info');
}

// Scroll animations with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const sections = document.querySelectorAll('section[id]');
    const cards = document.querySelectorAll('.endpoint-card, .try-it-section, .response-example');
    
    [...sections, ...cards].forEach(element => {
        observer.observe(element);
    });
}

// Responsive navigation for mobile
function initializeResponsiveNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    // Check if mobile view
    function checkMobileView() {
        return window.innerWidth <= 1024;
    }
    
    // Toggle sidebar on mobile
    function toggleSidebar() {
        if (checkMobileView()) {
            sidebar.classList.toggle('mobile-open');
        }
    }
    
    // Add mobile menu button if not exists
    if (checkMobileView() && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        `;
        menuBtn.onclick = toggleSidebar;
        document.body.appendChild(menuBtn);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (checkMobileView() && !menuBtn) {
            initializeResponsiveNavigation();
        } else if (!checkMobileView() && menuBtn) {
            menuBtn.remove();
            sidebar.classList.remove('mobile-open');
        }
    });
}

// Loading states and better UX
function addLoadingState(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    return originalContent;
}

function removeLoadingState(element, originalContent) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    element.innerHTML = originalContent;
}

// Form validation helpers
function validateCoordinates(lat, lng) {
    const errors = [];
    
    if (!lat || isNaN(lat)) {
        errors.push('Latitude is required and must be a number');
    } else if (lat < -90 || lat > 90) {
        errors.push('Latitude must be between -90 and 90');
    }
    
    if (!lng || isNaN(lng)) {
        errors.push('Longitude is required and must be a number');
    } else if (lng < -180 || lng > 180) {
        errors.push('Longitude must be between -180 and 180');
    }
    
    return errors;
}

// Enhanced API testing functions
function testEarthquakeAPI() {
    const lat = prompt('Enter latitude (-90 to 90):');
    const lng = prompt('Enter longitude (-180 to 180):');
    const radius = prompt('Enter search radius in km (optional):') || '100';
    
    const errors = validateCoordinates(lat, lng);
    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return;
    }
    
    console.log('Earthquake API Test:', {
        endpoint: '/earthquakes/recent',
        parameters: { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseInt(radius) },
        response: 'Simulated earthquake data would be returned here'
    });
    
    showNotification('Earthquake API test completed - check console for details', 'success');
}

function testRiskAssessmentAPI() {
    const lat = prompt('Enter latitude (-90 to 90):');
    const lng = prompt('Enter longitude (-180 to 180):');
    
    const errors = validateCoordinates(lat, lng);
    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return;
    }
    
    console.log('Risk Assessment API Test:', {
        endpoint: '/risk/assess',
        method: 'POST',
        body: {
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            assessment_types: ['earthquake', 'weather', 'flood', 'wildfire'],
            time_horizon: '30_days'
        },
        response: 'Simulated risk assessment would be returned here'
    });
    
    showNotification('Risk Assessment API test completed - check console for details', 'success');
}

// Initialize tooltips for complex elements
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
                top: ${e.pageY - 40}px;
                left: ${e.pageX}px;
            `;
            document.body.appendChild(tooltip);
            
            element._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
            });
        });
    }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    initializePerformanceMonitoring();
    
    // Add some demo tooltips
    const apiKeyInput = document.getElementById('email-input');
    if (apiKeyInput) {
        apiKeyInput.setAttribute('data-tooltip', 'Enter your email to generate a DIAPS API key');
    }
});

// Export functions for global access
window.generateApiKey = generateApiKey;
window.copyApiKey = copyApiKey;
window.copyToClipboard = copyToClipboard;
window.testWeatherAPI = testWeatherAPI;
window.testEarthquakeAPI = testEarthquakeAPI;
window.testRiskAssessmentAPI = testRiskAssessmentAPI;