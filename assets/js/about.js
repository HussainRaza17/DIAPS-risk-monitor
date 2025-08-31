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

        // Initialize particles
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();

            // Smooth scrolling for navigation links
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

            // Back to top button functionality
            const backToTopBtn = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Add parallax effect to hero section
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.about-hero');
                if (hero) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            });

            // Animate stats on scroll
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = entry.target.style.animation || 'fadeInUp 0.8s ease-out';
                    }
                });
            }, observerOptions);

            // Observe all animated elements
            document.querySelectorAll('.stat-card, .team-card, .value-card').forEach(el => {
                observer.observe(el);
            });
        });

        // Navigation hover effects
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (this.style.color !== 'rgb(245, 158, 11)') {
                    this.style.color = 'var(--warning)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                if (this.getAttribute('href') !== 'about.html') {
                    this.style.color = 'white';
                }
            });
        });

        // Add loading animation to CTA buttons
        document.querySelectorAll('.cta-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (this.getAttribute('href').includes('mailto:')) {
                    return; // Allow email links to work normally
                }
                
                e.preventDefault();
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    window.location.href = this.getAttribute('href');
                }, 1000);
            });
        });