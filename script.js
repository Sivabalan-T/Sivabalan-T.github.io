(function() {
    'use strict';

    // Mobile Menu
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (toggle && menu) {
        function openMenu() {
            toggle.classList.add('active');
            menu.classList.add('open');
            document.body.classList.add('menu-open');
        }
        function closeMenu() {
            toggle.classList.remove('active');
            menu.classList.remove('open');
            document.body.classList.remove('menu-open');
        }
        toggle.addEventListener('click', () => {
            menu.classList.contains('open') ? closeMenu() : openMenu();
        });
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
        });
    }

    // Navbar scroll effect
    const topNav = document.getElementById('topNav');
    window.addEventListener('scroll', () => {
        topNav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Active nav highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (menu && menu.classList.contains('open')) closeMenu();
            }
        });
    });

    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Infinite ticker
    const tickerTrack = document.querySelector('.ticker-track');
    if (tickerTrack) {
        const clone = tickerTrack.cloneNode(true);
        tickerTrack.parentElement.appendChild(clone);
    }

    // Counter animation
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.innerHTML = Math.floor(target) + suffix;
                clearInterval(timer);
            } else {
                element.innerHTML = Math.floor(current) + suffix;
            }
        }, 20);
    }
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const text = entry.target.innerText;
                const match = text.match(/(\d+(?:\.\d+)?)([^0-9]*)/);
                if (match) {
                    const value = parseFloat(match[1]);
                    const suffix = match[2] || '';
                    if (!isNaN(value)) {
                        entry.target.innerText = '0' + suffix;
                        animateCounter(entry.target, value, suffix);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.metric-value').forEach(el => counterObserver.observe(el));

    // Project Carousel Data
    const projectsData = [
        { category: "electrical", title: "Commercial High-rise BIM", desc: "Complete electrical modeling for a 25-storey tower. Created SLDs, riser diagrams, and coordinated with HVAC/plumbing. Achieved 98% clash-free via Navisworks.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=Commercial+Tower" },
        { category: "bim", title: "Revit Family Library", desc: "Developed 50+ intelligent electrical families — panels, lighting fixtures, cable trays with shared parameters. Boosted modeling speed by 40%.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=Revit+Families" },
        { category: "automation", title: "Autonomous Robot Prototype", desc: "Built sensor-integrated power circuits and motor control for autonomous navigation. Used Arduino + energy-efficient power regulation.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=Autonomous+Robot" },
        { category: "electrical", title: "Lighting Design & Simulation", desc: "Complete indoor/outdoor lighting design using DIALux evo. Achieved optimal lux levels with 30% energy savings.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=Lighting+Design" },
        { category: "bim", title: "MEP Clash Coordination", desc: "Led clash detection for a hospital MEP project. Resolved 500+ clashes in Navisworks, reducing RFIs by 60%.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=Clash+Detection" },
        { category: "automation", title: "AI Energy Monitoring System", desc: "Developed IoT-based energy monitoring prototype with predictive analytics. Reduced energy waste by 25%.", img: "https://placehold.co/600x400/1E2A36/A0B4C8?text=AI+Energy" }
    ];

    const track = document.getElementById('carouselTrack');
    const leftBtn = document.getElementById('carouselLeft');
    const rightBtn = document.getElementById('carouselRight');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    let currentIndex = 0;
    let cardsPerView = 3;
    let filteredProjects = [...projectsData];

    function createCard(project) {
        const card = document.createElement('div');
        card.className = 'pricing-card';
        card.setAttribute('data-category', project.category);
        card.innerHTML = `
            <div class="pricing-tier">${project.title}</div>
            <div class="project-image"><img src="${project.img}" alt="${project.title}"></div>
            <p class="pricing-desc">${project.desc}</p>
        `;
        return card;
    }

    function updateCardsPerView() {
        cardsPerView = window.innerWidth <= 900 ? 1 : 3;
        renderCarousel();
    }

    function renderCarousel() {
        track.innerHTML = '';
        filteredProjects.forEach(project => {
            track.appendChild(createCard(project));
        });
        currentIndex = 0;
        updateCarouselTransform();
        updateArrowVisibility();
    }

    function updateCarouselTransform() {
        if (track.children.length === 0) return;
        const cardWidth = track.children[0].offsetWidth + 24;
        const maxIndex = Math.max(0, filteredProjects.length - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        updateArrowVisibility();
    }

    function updateArrowVisibility() {
        const maxIndex = Math.max(0, filteredProjects.length - cardsPerView);
        if (leftBtn && rightBtn) {
            leftBtn.style.opacity = currentIndex <= 0 ? '0.3' : '1';
            leftBtn.style.cursor = currentIndex <= 0 ? 'not-allowed' : 'pointer';
            rightBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            rightBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
        }
    }

    function filterProjects(category) {
        filteredProjects = category === 'all' 
            ? [...projectsData] 
            : projectsData.filter(p => p.category === category);
        renderCarousel();
    }

    if (leftBtn && rightBtn && track) {
        leftBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselTransform();
            }
        });
        rightBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, filteredProjects.length - cardsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselTransform();
            }
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects(btn.getAttribute('data-filter'));
        });
    });

    window.addEventListener('resize', () => {
        updateCardsPerView();
    });

    updateCardsPerView();

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
            const message = document.getElementById('message')?.value.trim();
            
            if (!name || !email || !message) {
                if (formStatus) {
                    formStatus.style.color = '#e74c3c';
                    formStatus.textContent = 'Please fill in all required fields.';
                }
                return;
            }
            
            if (!email.includes('@') || !email.includes('.')) {
                if (formStatus) {
                    formStatus.style.color = '#e74c3c';
                    formStatus.textContent = 'Please enter a valid email address.';
                }
                return;
            }
            
            if (formStatus) {
                formStatus.style.color = '#6C8DB0';
                formStatus.textContent = 'Sending message...';
            }
            
            try {
                const response = await fetch('https://formspree.io/f/xzdwlgoz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });
                if (response.ok) {
                    formStatus.style.color = '#2ecc71';
                    formStatus.textContent = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                formStatus.style.color = '#e74c3c';
                formStatus.textContent = 'Error sending message. Please try again.';
            }
        });
    }

    // Footer year
    const footerBrand = document.querySelector('.footer-brand');
    if (footerBrand) {
        footerBrand.innerHTML = `SIVABALAN TAMILMANI • ${new Date().getFullYear()}`;
    }

    console.log('Portfolio initialized');
})();