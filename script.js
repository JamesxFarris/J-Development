/* ========================================
   J² Development - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initTheme();
    initNavigation();
    initMobileMenu();
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandling();
    initHeroParallax();
    initPhysicsShapes();
});

/* ========================================
   Theme Toggle
   ======================================== */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');

    // Check for saved theme preference, default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    // Dark mode is the default (no attribute needed since :root styles are dark)

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   FAQ Accordion
   ======================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
}

/* ========================================
   Scroll Animations
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal class and observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.section-header, .about-text, .about-stats, .project-card, .service-category, .contact-info, .contact-form'
    );

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Form Handling
   ======================================== */
function initFormHandling() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const message = formData.get('message') || '';

        // Build mailto link
        const subject = encodeURIComponent(`Website Inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:j2webdevsolutions@gmail.com?subject=${subject}&body=${body}`;

        // Open default email client
        window.location.href = mailtoLink;

        // Show feedback
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Opening Email...';
        submitBtn.style.backgroundColor = '#22c55e';

        // Reset form and button after delay
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 2000);
    });
}

/* ========================================
   Utility: Debounce
   ======================================== */
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/* ========================================
   Hero Parallax / Mouse Interaction
   ======================================== */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.hero-shapes .shape');
    const gridPattern = document.querySelector('.grid-pattern');
    const logoWatermark = document.querySelector('.hero-logo-bg');

    if (!hero || shapes.length === 0) return;

    // Different movement multipliers for each shape (parallax depth effect)
    const multipliers = [40, 60, 50, 35, 45, 30, 55, 25, 40, 50, 35, 42];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track mouse position across the entire hero section
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        // Normalize mouse position to -1 to 1 range
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // Smooth animation loop
    function animate() {
        // Smooth easing towards target
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        shapes.forEach((shape, index) => {
            const multiplier = multipliers[index] || 30;
            const x = currentX * multiplier;
            const y = currentY * multiplier;

            // Special handling for centered shape-1
            if (shape.classList.contains('shape-1')) {
                shape.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            } else {
                shape.style.transform = `translate(${x}px, ${y}px)`;
            }
        });

        // Move J² logo with the blobs (slower for depth effect)
        if (logoWatermark) {
            const logoX = currentX * 25;
            const logoY = currentY * 25;
            logoWatermark.style.transform = `translate(calc(-50% + ${logoX}px), calc(-50% + ${logoY}px))`;
        }

        // Move grid pattern subtly
        if (gridPattern) {
            const gridX = currentX * 15;
            const gridY = currentY * 15;
            gridPattern.style.transform = `translate(calc(-50% + ${gridX}px), calc(-50% + ${gridY}px))`;
        }

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}

/* ========================================
   Physics Interactive Shapes
   ======================================== */
function initPhysicsShapes() {
    const container = document.getElementById('physicsContainer');
    if (!container) return;

    const shapes = container.querySelectorAll('.physics-shape');
    if (shapes.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const floatSpeed = 1.2;

    // Initialize physics bodies
    const bodies = [];
    // Sizes: circle, square, triangle, circle, square, triangle
    const sizes = [90, 85, 80, 75, 95, 70];

    shapes.forEach((shape, index) => {
        const size = sizes[index] || 90;
        const x = 50 + Math.random() * (containerRect.width - size - 100);
        const y = 50 + Math.random() * (containerRect.height - size - 100);

        // Random float direction
        const angle = Math.random() * Math.PI * 2;
        const speed = floatSpeed + Math.random() * 0.3;

        // Random initial rotation and rotation speed
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 2;

        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.left = x + 'px';
        shape.style.top = y + 'px';

        bodies.push({
            el: shape,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            isDragging: false,
            canDrag: true,
            rotation: rotation,
            rotationSpeed: rotationSpeed
        });
    });

    // Drag functionality
    let draggedBody = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    shapes.forEach((shape, index) => {
        shape.addEventListener('mousedown', (e) => {
            if (!bodies[index].canDrag) return;
            e.preventDefault();
            draggedBody = bodies[index];
            draggedBody.isDragging = true;
            const rect = shape.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            shape.style.cursor = 'grabbing';
        });

        shape.addEventListener('touchstart', (e) => {
            if (!bodies[index].canDrag) return;
            e.preventDefault();
            const touch = e.touches[0];
            draggedBody = bodies[index];
            draggedBody.isDragging = true;
            const rect = shape.getBoundingClientRect();
            dragOffsetX = touch.clientX - rect.left;
            dragOffsetY = touch.clientY - rect.top;
            lastMouseX = touch.clientX;
            lastMouseY = touch.clientY;
        }, { passive: false });
    });

    document.addEventListener('mousemove', (e) => {
        if (draggedBody) {
            const containerRect = container.getBoundingClientRect();
            const newX = e.clientX - containerRect.left - dragOffsetX;
            const newY = e.clientY - containerRect.top - dragOffsetY;

            draggedBody.vx = (e.clientX - lastMouseX) * 0.5;
            draggedBody.vy = (e.clientY - lastMouseY) * 0.5;

            draggedBody.x = newX;
            draggedBody.y = newY;

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (draggedBody) {
            const touch = e.touches[0];
            const containerRect = container.getBoundingClientRect();
            const newX = touch.clientX - containerRect.left - dragOffsetX;
            const newY = touch.clientY - containerRect.top - dragOffsetY;

            draggedBody.vx = (touch.clientX - lastMouseX) * 0.5;
            draggedBody.vy = (touch.clientY - lastMouseY) * 0.5;

            draggedBody.x = newX;
            draggedBody.y = newY;

            lastMouseX = touch.clientX;
            lastMouseY = touch.clientY;
        }
    }, { passive: false });

    document.addEventListener('mouseup', () => {
        if (draggedBody) {
            draggedBody.isDragging = false;
            // Add spin based on throw velocity
            draggedBody.rotationSpeed = (draggedBody.vx + draggedBody.vy) * 0.3;

            // Normalize velocity to maintain consistent speed like DVD logo
            const speed = Math.sqrt(draggedBody.vx * draggedBody.vx + draggedBody.vy * draggedBody.vy);
            if (speed > 0) {
                draggedBody.vx = (draggedBody.vx / speed) * floatSpeed;
                draggedBody.vy = (draggedBody.vy / speed) * floatSpeed;
            }

            draggedBody.el.style.cursor = 'grab';
            draggedBody = null;
        }
    });

    document.addEventListener('touchend', () => {
        if (draggedBody) {
            draggedBody.isDragging = false;
            // Add spin based on throw velocity
            draggedBody.rotationSpeed = (draggedBody.vx + draggedBody.vy) * 0.3;

            // Normalize velocity to maintain consistent speed like DVD logo
            const speed = Math.sqrt(draggedBody.vx * draggedBody.vx + draggedBody.vy * draggedBody.vy);
            if (speed > 0) {
                draggedBody.vx = (draggedBody.vx / speed) * floatSpeed;
                draggedBody.vy = (draggedBody.vy / speed) * floatSpeed;
            }

            draggedBody = null;
        }
    });

    // Collision detection between two circles
    function checkCollision(a, b) {
        const dx = b.x + b.size/2 - (a.x + a.size/2);
        const dy = b.y + b.size/2 - (a.y + a.size/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.size + b.size) / 2;
        return distance < minDist;
    }

    // Resolve collision - perfect elastic collision
    function resolveCollision(a, b) {
        const dx = b.x + b.size/2 - (a.x + a.size/2);
        const dy = b.y + b.size/2 - (a.y + a.size/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.size + b.size) / 2;

        if (distance < minDist && distance > 0) {
            const overlap = minDist - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            // Separate the bodies
            a.x -= nx * overlap / 2;
            a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2;
            b.y += ny * overlap / 2;

            // Calculate relative velocity
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dvn = dvx * nx + dvy * ny;

            // Don't resolve if velocities are separating
            if (dvn > 0) return;

            // Perfect elastic collision (swap velocity components along collision normal)
            a.vx -= dvn * nx;
            a.vy -= dvn * ny;
            b.vx += dvn * nx;
            b.vy += dvn * ny;

            // Reverse rotation on collision
            a.rotationSpeed *= -0.8;
            b.rotationSpeed *= -0.8;
        }
    }

    // Physics loop - DVD logo style (constant velocity, perfect bounces)
    function updatePhysics() {
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        bodies.forEach(body => {
            if (body.isDragging) return;

            // Update position (constant velocity, no gravity)
            body.x += body.vx;
            body.y += body.vy;

            // Perfect bounce off left/right walls
            if (body.x <= 0) {
                body.x = 0;
                body.vx *= -1;
                body.rotationSpeed *= -1;
            }
            if (body.x + body.size >= width) {
                body.x = width - body.size;
                body.vx *= -1;
                body.rotationSpeed *= -1;
            }

            // Perfect bounce off top/bottom walls
            if (body.y <= 0) {
                body.y = 0;
                body.vy *= -1;
                body.rotationSpeed *= -1;
            }
            if (body.y + body.size >= height) {
                body.y = height - body.size;
                body.vy *= -1;
                body.rotationSpeed *= -1;
            }
        });

        // Check collisions between all pairs (skip logo)
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                // Skip collisions involving the logo
                if (bodies[i].isLogo || bodies[j].isLogo) continue;
                if (checkCollision(bodies[i], bodies[j])) {
                    resolveCollision(bodies[i], bodies[j]);
                }
            }
        }

        // Update DOM
        bodies.forEach(body => {
            // Update rotation
            body.rotation += body.rotationSpeed;

            body.el.style.left = body.x + 'px';
            body.el.style.top = body.y + 'px';
            body.el.style.transform = `rotate(${body.rotation}deg)`;
        });

        requestAnimationFrame(updatePhysics);
    }

    updatePhysics();
}
