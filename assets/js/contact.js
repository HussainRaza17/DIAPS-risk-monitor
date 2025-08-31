// Contact Form JavaScript for DIAPS
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize particles background
    initParticles();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize current day highlighting
    highlightCurrentDay();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize emergency alert functionality
    initEmergencyAlerts();
});

// Create animated particles background
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        // Random size variation
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

// Handle contact form submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        showLoadingState(submitBtn, true);
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide loading state
            showLoadingState(submitBtn, false);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
            // Log submission data (for development)
            console.log('Form submitted:', data);
            
            // Show notification
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
        }, 2000);
    });
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.category) errors.push('Inquiry type is required');
    if (!data.priority) errors.push('Priority level is required');
    if (!data.subject?.trim()) errors.push('Subject is required');
    if (!data.message?.trim()) errors.push('Message is required');
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Phone validation (if provided)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    // Message length validation
    if (data.message && data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7;
}

// Show loading state on submit button
function showLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show notification message
function showNotification(message, type = 'info') {
    const notification = document.getElementById('infoMessage');
    notification.textContent = message;
    notification.className = `info-message ${type} show`;
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Highlight current day in office hours
function highlightCurrentDay() {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hoursItems = document.querySelectorAll('.hours-item');
    
    // Remove existing 'today' class
    hoursItems.forEach(item => item.classList.remove('today'));
    
    // Add 'today' class to current day
    if (today >= 1 && today <= 5) { // Monday to Friday
        hoursItems[0]?.classList.add('today');
    } else if (today === 6) { // Saturday
        hoursItems[1]?.classList.add('today');
    } else if (today === 0) { // Sunday
        hoursItems[2]?.classList.add('today');
    }
}

// Initialize smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
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

// Initialize real-time form validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.background = 'rgba(239, 68, 68, 0.1)';
    
    // Create error message element if it doesn't exist
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.background = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Initialize emergency alert functionality
function initEmergencyAlerts() {
    const urgentPriority = document.getElementById('priority-urgent');
    const emergencyCategory = document.querySelector('select[name="category"] option[value="emergency"]');
    
    // Show alert when urgent priority is selected
    if (urgentPriority) {
        urgentPriority.addEventListener('change', function() {
            if (this.checked) {
                showEmergencyAlert();
            }
        });
    }
    
    // Auto-select urgent priority when emergency category is selected
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            if (this.value === 'emergency') {
                urgentPriority.checked = true;
                showEmergencyAlert();
            }
        });
    }
}

// Show emergency alert
function showEmergencyAlert() {
    const alertMessage = `
        ⚠️ EMERGENCY SELECTED ⚠️
        
        For immediate life-threatening emergencies:
        • Call 112 or 911
        • Call DIAPS Emergency: +1-800-SOS-DIAPS
        
        This form is for urgent but non-life-threatening matters.
    `;
    
    if (confirm(alertMessage + '\n\nClick OK to continue with the form, or Cancel to call emergency services.')) {
        // Continue with form
        showNotification('Emergency priority selected. We will respond immediately.', 'error');
    } else {
        // Redirect to emergency contacts
        window.location.href = 'tel:+1-800-SOS-DIAPS';
    }
}

// Auto-save form data (optional)
function initAutoSave() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            // Store in memory only (no localStorage as per requirements)
            window.tempFormData = data;
        });
    });
    
    // Restore saved data on page load
    if (window.tempFormData) {
        Object.keys(window.tempFormData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = window.tempFormData[key];
            }
        });
    }
}

// Initialize character counter for message field
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const maxLength = 1000;
    
    if (messageField) {
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.8rem';
        counter.style.color = 'rgba(255, 255, 255, 0.7)';
        counter.style.marginTop = '5px';
        
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        });
        
        // Set max length
        messageField.setAttribute('maxlength', maxLength);
        
        // Initialize counter
        messageField.dispatchEvent(new Event('input'));
    }
}

// Initialize phone number formatting
function initPhoneFormatting() {
    const phoneField = document.getElementById('phone');
    
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})/, '($1) ');
            }
            
            this.value = value;
        });
    }
}

// Initialize all additional features
document.addEventListener('DOMContentLoaded', function() {
    initAutoSave();
    initCharacterCounter();
    initPhoneFormatting();
});