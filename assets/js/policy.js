// Privacy Policy Interactive JavaScript
// Advanced functionality for DIAPS Privacy Policy page

class PrivacyPolicyApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.setupParticleBackground();
        this.setupReadingProgress();
        this.setupSearchFunctionality();
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupAnimationOnScroll();
        this.setupKeyboardNavigation();
        this.setupPrintOptimization();
        this.setupTooltips();
        this.startPerformanceMonitoring();
    }

    // Animated particle background
    setupParticleBackground() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            // Random size variation
            const size = Math.random() * 4 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particlesContainer.appendChild(particle);
        }

        // Adjust particles on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768 && particlesContainer.children.length > 30) {
                // Remove excess particles on mobile
                while (particlesContainer.children.length > 30) {
                    particlesContainer.removeChild(particlesContainer.lastChild);
                }
            }
        });
    }

    // Reading progress indicator
    setupReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        if (!progressBar) return;

        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = Math.min(progress, 100) + '%';
        };

        // Throttled scroll event
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler);
        updateProgress(); // Initial call
    }

    // Advanced search functionality
    setupSearchFunctionality() {
        const searchToggle = document.getElementById('searchToggle');
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        if (!searchToggle || !searchContainer || !searchInput || !searchResults) return;

        // Toggle search overlay
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.add('active');
            searchInput.focus();
        });

        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                this.closeSearch();
            }
        });

        // Close search when clicking outside
        searchContainer.addEventListener('click', (e) => {
            if (e.target === searchContainer) {
                this.closeSearch();
            }
        });

        // Real-time search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Search on enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    }

    closeSearch() {
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults || !query.trim()) {
            searchResults.innerHTML = '';
            return;
        }

        // Get all searchable content
        const sections = document.querySelectorAll('.policy-section');
        const results = [];

        sections.forEach((section, index) => {
            const title = section.querySelector('.section-title')?.textContent.trim();
            const content = section.textContent.toLowerCase();
            const searchTerm = query.toLowerCase();

            if (content.includes(searchTerm)) {
                // Find the specific paragraph or element containing the search term
                const paragraphs = section.querySelectorAll('p, li, h3');
                paragraphs.forEach(p => {
                    if (p.textContent.toLowerCase().includes(searchTerm)) {
                        const snippet = this.createSearchSnippet(p.textContent, searchTerm);
                        results.push({
                            title: title || 'Section',
                            snippet: snippet,
                            element: section,
                            id: section.id
                        });
                    }
                });
            }
        });

        this.displaySearchResults(results, query);
    }

    createSearchSnippet(text, searchTerm) {
        const maxLength = 150;
        const lowerText = text.toLowerCase();
        const lowerTerm = searchTerm.toLowerCase();
        const index = lowerText.indexOf(lowerTerm);
        
        if (index === -1) return text.substring(0, maxLength) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + searchTerm.length + 50);
        
        let snippet = text.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        // Highlight search term
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return snippet.replace(regex, '<mark>$1</mark>');
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result">
                    <strong>No results found for "${query}"</strong>
                    <p>Try different keywords or check the table of contents.</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = results.slice(0, 8).map(result => `
            <div class="search-result" onclick="scrollToSection('${result.id}')">
                <strong>${result.title}</strong>
                <p>${result.snippet}</p>
            </div>
        `).join('');
    }

    // Smooth scrolling for navigation
    setupSmoothScrolling() {
        // Handle TOC links
        const tocLinks = document.querySelectorAll('.toc-item a');
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Handle footer links
        const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;

        // Close search if open
        this.closeSearch();

        // Calculate offset for fixed header
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Add temporary highlight effect
        target.style.transform = 'scale(1.02)';
        target.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            target.style.transform = '';
        }, 500);
    }

    // Back to top button functionality
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Throttled scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });

        toggleVisibility(); // Initial check
    }

    // Animation on scroll
    setupAnimationOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all policy sections
        const sections = document.querySelectorAll('.policy-section');
        sections.forEach((section, index) => {
            // Initial state
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(section);
        });
    }

    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchToggle = document.getElementById('searchToggle');
                if (searchToggle) searchToggle.click();
            }

            // Navigate sections with arrow keys (when not in input)
            if (!e.target.matches('input, textarea') && !e.ctrlKey && !e.metaKey) {
                const sections = Array.from(document.querySelectorAll('.policy-section'));
                const currentSection = this.getCurrentSection(sections);
                
                if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
                    e.preventDefault();
                    this.scrollToSection(sections[currentSection + 1].id);
                } else if (e.key === 'ArrowUp' && currentSection > 0) {
                    e.preventDefault();
                    this.scrollToSection(sections[currentSection - 1].id);
                }
            }
        });
    }

    getCurrentSection(sections) {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop <= scrollPos) {
                return i;
            }
        }
        return 0;
    }

    // Print optimization
    setupPrintOptimization() {
        window.addEventListener('beforeprint', () => {
            // Expand all collapsed content for printing
            const collapsibleElements = document.querySelectorAll('.collapsible');
            collapsibleElements.forEach(el => {
                el.style.display = 'block';
            });

            // Add print-specific styles
            document.body.classList.add('printing');
        });

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing');
        });
    }

    // Enhanced tooltips
    setupTooltips() {
        const tooltipTerms = document.querySelectorAll('.tooltip-term');
        
        tooltipTerms.forEach(term => {
            let tooltipTimeout;
            
            term.addEventListener('mouseenter', () => {
                clearTimeout(tooltipTimeout);
                term.setAttribute('aria-expanded', 'true');
            });
            
            term.addEventListener('mouseleave', () => {
                tooltipTimeout = setTimeout(() => {
                    term.setAttribute('aria-expanded', 'false');
                }, 100);
            });

            // Keyboard support
            term.addEventListener('focus', () => {
                term.setAttribute('aria-expanded', 'true');
            });
            
            term.addEventListener('blur', () => {
                term.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }
        });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                if (memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.9) {
                    console.warn('Memory usage is high, consider optimizing');
                }
            }, 30000); // Check every 30 seconds
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Global functions for HTML onclick handlers
function scrollToSection(sectionId) {
    if (window.privacyApp) {
        window.privacyApp.scrollToSection(sectionId);
    }
}

function closeSearch() {
    if (window.privacyApp) {
        window.privacyApp.closeSearch();
    }
}

// Initialize the application
window.privacyApp = new PrivacyPolicyApp();

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Additional utility functions
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    document.body.classList.add('images-loaded');
                }
            });
        }
    });

    // Preload critical resources
    const preloadLinks = [
        { href: '/favicon.png', as: 'image' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', as: 'style' }
    ];

    preloadLinks.forEach(link => {
        const preloadEl = document.createElement('link');
        preloadEl.rel = 'preload';
        preloadEl.href = link.href;
        preloadEl.as = link.as;
        document.head.appendChild(preloadEl);
    });

    // Add focus indicators for better accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to analytics service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send error reports to analytics service here
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyPolicyApp;
}