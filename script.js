document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Cinematic Preloader & Entrance Animation
       ========================================= */
    const preloader = document.getElementById('preloader');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const body = document.body;

    // Prevent scrolling during load
    body.classList.add('no-scroll');

    let progress = 0;
    const duration = 2000; // 2 seconds minimum loading time
    const intervalTime = 30;
    const increment = (100 / (duration / intervalTime));

    const loadingInterval = setInterval(() => {
        progress += increment;
        
        // Add some random stutter for realism
        if (Math.random() > 0.8) progress -= increment * 0.5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            finishLoading();
        }

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `${Math.floor(progress)}%`;

    }, intervalTime);

    function finishLoading() {
        setTimeout(() => {
            preloader.classList.add('loaded');
            body.classList.remove('no-scroll');
            
            // Trigger entrance animations
            triggerEntranceAnimations();
            
            // Start Canvas
            initParticles();
        }, 500);
    }

    function triggerEntranceAnimations() {
        const initHiddenElements = document.querySelectorAll('.init-hidden');
        initHiddenElements.forEach((el, index) => {
            // Remove the init-hidden class which just hides opacity initially
            el.classList.remove('init-hidden');
            
            // If it doesn't already have 'reveal', give it an active state manually or let reveal handle it
            // We'll give hero items an explicit slideUp animation
            el.style.animation = `slideUpFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        });
        
        // Trigger the initial scroll reveal
        setTimeout(revealElements, 100);
    }

    /* =========================================
       2. Theme Toggle (Dark/Light Mode)
       ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    /* =========================================
       3. Navbar & Mobile Menu
       ========================================= */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Prevent scroll when menu open
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Sticky Navbar & Active Links & Back to Top
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to Top Button
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });

        // Scroll Reveal
        revealElements();
    });

    // Back to top click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* =========================================
       4. Scroll Reveal Animations
       ========================================= */
    function revealElements() {
        const reveals = document.querySelectorAll('.reveal:not(.active)');
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // pixel offset

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                // If it's part of a grid, stagger it based on sibling index
                const parent = reveal.parentElement;
                if (parent && (parent.classList.contains('projects-grid') || 
                               parent.classList.contains('skills-grid') || 
                               parent.classList.contains('about-stats') ||
                               parent.classList.contains('grid-2-col'))) {
                    
                    const siblings = Array.from(parent.querySelectorAll('.reveal'));
                    const index = siblings.indexOf(reveal);
                    reveal.style.transitionDelay = `${index * 0.15}s`;
                }
                reveal.classList.add('active');
            }
        });
    }

    /* =========================================
       5. Typed.js Initialization
       ========================================= */
    if (document.getElementById('typed')) {
        new Typed('#typed', {
            strings: ['Web Applications.', 'AI Solutions.', 'Modern UIs.', 'Scalable Systems.'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    /* =========================================
       6. Number Counter Animation
       ========================================= */
    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (!target.classList.contains('counted')) {
                    target.classList.add('counted');
                    
                    const finalValueStr = target.innerText;
                    const finalValue = parseFloat(finalValueStr.replace(/[^0-9.]/g, ''));
                    const suffix = finalValueStr.replace(/[0-9.]/g, '');
                    const isDecimal = finalValueStr.includes('.');
                    
                    let startValue = 0;
                    const duration = 2000;
                    let startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        
                        // Ease out quad
                        const easeProgress = progress * (2 - progress);
                        const currentValue = startValue + (finalValue - startValue) * easeProgress;

                        if (isDecimal) {
                            target.innerText = currentValue.toFixed(2) + suffix;
                        } else {
                            target.innerText = Math.floor(currentValue) + suffix;
                        }

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            target.innerText = finalValueStr; // Ensure exact final string
                        }
                    }
                    window.requestAnimationFrame(step);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number, .hstat-num').forEach(num => {
        statObserver.observe(num);
    });

    /* =========================================
       7. Toast Notifications
       ========================================= */
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow to animate
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for transition
        }, 4000);
    }

    /* =========================================
       8. Contact Form Handling & EmailJS
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Initialize EmailJS (replace with your actual public key)
        // emailjs.init("YOUR_PUBLIC_KEY");

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Simple Validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            if (!name.value.trim()) {
                name.parentElement.classList.add('error');
                isValid = false;
            } else {
                name.parentElement.classList.remove('error');
            }
            
            if (!email.value.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
                email.parentElement.classList.add('error');
                isValid = false;
            } else {
                email.parentElement.classList.remove('error');
            }

            if (!subject.value.trim()) {
                subject.parentElement.classList.add('error');
                isValid = false;
            } else {
                subject.parentElement.classList.remove('error');
            }
            
            if (!message.value.trim()) {
                message.parentElement.classList.add('error');
                isValid = false;
            } else {
                message.parentElement.classList.remove('error');
            }
            
            if (isValid) {
                const btn = document.getElementById('submitBtn');
                const btnText = btn.querySelector('.btn-text');
                const btnLoading = btn.querySelector('.btn-loading');
                
                // Show loading state and prevent duplicate clicks
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
                btn.disabled = true;
                
                // Prepare Template Params
                const templateParams = {
                    from_name: name.value.trim(),
                    reply_to: email.value.trim(),
                    phone_number: phone.value.trim() || 'Not provided',
                    subject: subject.value.trim(),
                    message: message.value.trim(),
                    to_name: 'Umang'
                };

                // Create promises for sending email and timeout (4 seconds for faster UX)
                const sendEmailPromise = emailjs.send('service_pg2uiqk', 'template_o18tv0d', templateParams);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timed out. Network might be slow.')), 4000)
                );

                try {
                    // Wait for either the email to send or the timeout
                    await Promise.race([sendEmailPromise, timeoutPromise]);
                    
                    // Success Handle
                    contactForm.reset();
                    
                    btnLoading.style.display = 'none';
                    btnText.style.display = 'inline-flex';
                    btnText.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                    btn.style.background = 'var(--accent)';
                    
                    showToast('Message sent successfully! I will get back to you soon.', 'success');
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                    
                } catch (error) {
                    // Error Handle
                    console.error('EmailJS Error:', error);
                    
                    btnLoading.style.display = 'none';
                    btnText.style.display = 'inline-flex';
                    btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    btn.style.background = ''; // reset in case
                    btn.disabled = false;
                    
                    showToast('Failed to send message. Please check your connection or try again later.', 'error');
                }
            }
        });
        
        // Remove error on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.parentElement.classList.remove('error');
            });
        });
    }

    /* =========================================
       9. Particles Background Canvas
       ========================================= */
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        }

        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                
                // Check theme for particle color
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                this.color = isLight ? `rgba(37, 99, 235, ${Math.random() * 0.3})` : `rgba(59, 130, 246, ${Math.random() * 0.4})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
                
                // Re-check color on update in case theme changed
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                this.color = isLight ? `rgba(37, 99, 235, ${this.size * 0.15})` : `rgba(59, 130, 246, ${this.size * 0.2})`;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            // Calculate number based on screen size
            const count = Math.floor((canvas.width * canvas.height) / 10000);
            const particleCount = Math.min(count, 150); // Cap at 150 for performance
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        resize();
        animate();
    }
});
