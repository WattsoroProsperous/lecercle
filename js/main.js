/* ===============================================
   CERCLE SPORTIF N'KREDJI - MAIN JAVASCRIPT
   Modern interactions and animations
   =============================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    // CUSTOM CURSOR
    // ===============================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Cursor follows immediately
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            // Follower has lag
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .menu-card, .faq-item__question');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // ===============================================
    // NAVIGATION
    // ===============================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===============================================
    // SMOOTH SCROLL
    // ===============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===============================================
    // ANIMATED COUNTERS
    // ===============================================
    const counters = document.querySelectorAll('.stat__number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // Intersection Observer for counters
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // ===============================================
    // TESTIMONIALS SLIDER
    // ===============================================
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonials__dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        testimonials.forEach((t, i) => {
            t.classList.remove('active');
            dots[i]?.classList.remove('active');
        });

        testimonials[index]?.classList.add('active');
        dots[index]?.classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % testimonials.length;
        showSlide(next);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    // Touch/swipe support
    const slider = document.querySelector('.testimonials__slider');
    if (slider) {
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide();
                } else {
                    const prev = (currentSlide - 1 + testimonials.length) % testimonials.length;
                    showSlide(prev);
                }
                startAutoSlide();
            }
        }
    }

    if (testimonials.length > 0) {
        startAutoSlide();
    }

    // ===============================================
    // BACK TO TOP
    // ===============================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===============================================
    // FAQ ACCORDION
    // ===============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');

        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===============================================
    // CONTACT FORM
    // ===============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            // Simulate submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                submitBtn.style.background = 'linear-gradient(135deg, #2E8B57, #00A8B5)';

                // Show notification
                showNotification('Message envoyé avec succès !', 'success');

                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ===============================================
    // NOTIFICATION SYSTEM
    // ===============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success'
                ? 'linear-gradient(135deg, #2E8B57, #00A8B5)'
                : 'linear-gradient(135deg, #E6A817, #E67E22)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: '10000',
            animation: 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);

    // ===============================================
    // SCROLL ANIMATIONS
    // ===============================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // ===============================================
    // PARALLAX EFFECT ON HERO FLOATS
    // ===============================================
    const floats = document.querySelectorAll('.hero__float');

    if (floats.length > 0 && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            floats.forEach((float, index) => {
                const speed = (index + 1) * 30;
                const x = mouseX * speed;
                const y = mouseY * speed;
                float.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ===============================================
    // LAZY LOADING IMAGES
    // ===============================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===============================================
    // SCROLL PROGRESS BAR
    // ===============================================
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3px',
        background: 'linear-gradient(90deg, #E6A817, #D63384, #7B2D8E)',
        zIndex: '10001',
        width: '0',
        transition: 'width 0.1s ease'
    });
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ===============================================
    // PAGE HERO PARALLAX
    // ===============================================
    const pageHeroBg = document.querySelector('.page-hero__bg');

    if (pageHeroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            pageHeroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // ===============================================
    // SERVICE CARDS TILT EFFECT
    // ===============================================
    const serviceCards = document.querySelectorAll('.service-card');

    if (window.matchMedia('(hover: hover)').matches) {
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===============================================
    // KEYBOARD NAVIGATION
    // ===============================================
    document.addEventListener('keydown', (e) => {
        // Escape closes mobile menu
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===============================================
    // PRELOAD CRITICAL IMAGES
    // ===============================================
    const criticalImages = document.querySelectorAll('.hero__video, .page-hero__bg');
    criticalImages.forEach(el => {
        const src = el.style.backgroundImage?.match(/url\(["']?(.+?)["']?\)/)?.[1];
        if (src) {
            const img = new Image();
            img.src = src;
        }
    });

    // ===============================================
    // CONSOLE WELCOME MESSAGE
    // ===============================================
    console.log(
        '%c🎾 Cercle Sportif N\'Kredji',
        'font-size: 24px; font-weight: bold; color: #E6A817;'
    );
    console.log(
        '%cSite web chargé avec succès !',
        'font-size: 14px; color: #2E8B57;'
    );
});
