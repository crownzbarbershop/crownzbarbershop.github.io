// ==========================================================================
// 1. STUDIO-GRADE SMOOTH SCROLL (LENIS)
// ==========================================================================
// Initialize smooth scrolling physics
const lenis = new Lenis({ 
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true,
    smoothTouch: false
});

// Sync Lenis with GSAP ScrollTrigger for flawless animations
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// ==========================================================================
// 2. CLINICAL PRELOADER & HERO ANIMATION
// ==========================================================================
const initAnimations = () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader && !preloader.classList.contains('hidden')) {
        const tl = gsap.timeline();
        
        // 1. Reveal "CROWNZ" letters
        tl.to('.p-char', { y: 0, stagger: 0.05, duration: 0.8, ease: "power4.out" })
          // 2. Slide preloader up
          .to(preloader, { y: '-100%', duration: 0.8, ease: "power4.inOut", delay: 0.4 })
          // 3. Cinematic Hero Image zoom & un-darken
          .to('.hero-img', { scale: 1, filter: "grayscale(100%) contrast(1.1) brightness(0.45)", duration: 1.5, ease: "power3.out" }, "-=0.4")
          // 4. Staggered text reveals
          .to('.hero-badge span', { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=1.2")
          .to('.ht-line span', { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }, "-=1")
          .to('.hero-description span', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.8")
          .to('.hero-meta > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.8")
          .to('.hero-info-bar .info-item', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.6")
          .call(() => {
              document.body.classList.remove('locked');
              preloader.classList.add('hidden');
              setTimeout(() => { preloader.style.display = 'none'; }, 1000);
          });
    } else {
        document.body.classList.remove('locked');
    }
};

// Trigger animations on window load
window.addEventListener('load', initAnimations);

// Failsafe: Force unlock the body if the internet is slow
setTimeout(initAnimations, 3500);

// ==========================================================================
// 3. DYNAMIC "OPEN NOW" STATUS LOGIC (TIMEZONE AWARE)
// ==========================================================================
const updateShopStatus = () => {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (!statusIndicator || !statusText) return;

    // Fetch current time specifically locked to Milton, ON (America/Toronto)
    const torontoTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
    const day = torontoTime.getDay(); // 0 = Sunday, 1 = Monday...
    const hours = torontoTime.getHours();

    // Opening Hours Logic
    const openTime = (day === 0) ? 10 : 9; // 10 AM Sun, 9 AM Mon-Sat
    const closeTime = 19; // 7 PM Every day

    let isOpen = false;
    if (hours >= openTime && hours < closeTime) {
        isOpen = true;
    }

    if (isOpen) {
        statusIndicator.className = 'status-indicator open';
        statusText.innerText = 'Open Now (Closes at 7 PM)';
    } else {
        statusIndicator.className = 'status-indicator closed';
        const nextDay = (day + 1) % 7;
        const nextOpenTime = (nextDay === 0) ? "10 AM" : "9 AM";
        const tomorrowStr = (hours >= closeTime) ? "tomorrow" : "today";
        statusText.innerText = `Closed (Opens at ${nextOpenTime} ${tomorrowStr})`;
    }
};

// Initialize and check every 60 seconds
updateShopStatus();
setInterval(updateShopStatus, 60000);

// ==========================================================================
// 4. BEFORE & AFTER TRANSFORMATION ENGINE (CLIP-PATH FIX)
// ==========================================================================
const baSlider = document.getElementById('baSlider');
const baBefore = document.querySelector('.ba-before');
const baHandle = document.getElementById('baHandle');

if (baSlider && baBefore && baHandle) {
    let isDragging = false;

    // Core calculation function
    const updateSlider = (clientX) => {
        const rect = baSlider.getBoundingClientRect();
        // Calculate raw percentage based on mouse/touch position
        let percentage = ((clientX - rect.left) / rect.width) * 100;
        
        // Clamp strictly between 0% and 100% so it doesn't break out of the frame
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Fix: Use clip-path instead of width to prevent the image from squishing
        gsap.set(baBefore, { clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` });
        gsap.set(baHandle, { left: `${percentage}%` });
    };

    // Mouse Events (Desktop)
    baSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        baSlider.classList.add('is-dragging');
        updateSlider(e.clientX); // Snap handle to click position
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        baSlider.classList.remove('is-dragging');
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    // Touch Events (Mobile)
    baSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        baSlider.classList.add('is-dragging');
        updateSlider(e.touches[0].clientX);
    }, {passive: true}); // passive: true ensures vertical scrolling isn't blocked
    
    window.addEventListener('touchend', () => {
        isDragging = false;
        baSlider.classList.remove('is-dragging');
    });
    
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    }, {passive: true});
}

// ==========================================================================
// 5. HIGH-PERFORMANCE INTELLIGENT CURSOR (GSAP QUICKTO)
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    // Enable custom cursor CSS
    document.body.classList.add('has-custom-cursor');
    
    const cursorWrap = document.querySelector('.cursor-wrapper');
    const cursorText = document.getElementById('cursorText');
    
    if (cursorWrap) {
        // GPU-accelerated quick setters for buttery smooth tracking
        const xTo = gsap.quickTo(cursorWrap, "x", { duration: 0.3, ease: "power3.out" });
        const yTo = gsap.quickTo(cursorWrap, "y", { duration: 0.3, ease: "power3.out" });
        
        window.addEventListener('mousemove', (e) => { 
            xTo(e.clientX);
            yTo(e.clientY);
        });

        // Hover states mapping
        const interactiveElements = document.querySelectorAll('a, button, .hover-btn, .accordion-header, .p-item, .floating-badge, .magnetic-wrap, .ba-handle-button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Drag state mapping (includes the new Before/After slider)
        document.querySelectorAll('.drag-zone, .ba-slider').forEach(el => {
            el.addEventListener('mouseenter', () => { 
                document.body.classList.add('cursor-drag'); 
                if (cursorText) cursorText.innerText = "DRAG"; 
            });
            el.addEventListener('mouseleave', () => { 
                document.body.classList.remove('cursor-drag'); 
                if (cursorText) cursorText.innerText = ""; 
            });
        });
    }
}

// ==========================================================================
// 6. PREMIUM LIVE ELEMENT (ROTATING KINETIC BADGE)
// ==========================================================================
const floatingBadge = document.querySelector('.floating-badge');
const badgeText = document.querySelector('.badge-text');

if (floatingBadge) {
    // Hide initially
    gsap.set(floatingBadge, { scale: 0, opacity: 0, y: 50, transformOrigin: "center center" });
    
    // Elastic pop-in after Hero Section
    ScrollTrigger.create({
        trigger: ".about-section",
        start: "top 75%", 
        onEnter: () => gsap.to(floatingBadge, { scale: 1, opacity: 1, y: 0, pointerEvents: 'all', duration: 1.2, ease: "elastic.out(1, 0.4)" }),
        onLeaveBack: () => gsap.to(floatingBadge, { scale: 0, opacity: 0, y: 50, pointerEvents: 'none', duration: 0.5, ease: "power3.in" })
    });

    if (badgeText) {
        let currentRotation = 0;
        let scrollVelocity = 0;

        lenis.on('scroll', (e) => { scrollVelocity = e.velocity; });

        gsap.ticker.add(() => {
            // Base idle rotation + aggressive scroll velocity multiplier
            currentRotation += 0.4 + (Math.abs(scrollVelocity) * 0.08);
            gsap.set(badgeText, { rotation: currentRotation });
            scrollVelocity *= 0.9; // Dampen velocity
        });
    }
}

// ==========================================================================
// 7. PARALLAX MAGNETIC BUTTONS
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
        const btn = wrap.querySelector('.btn-parallax');
        const btnText = wrap.querySelector('.btn-text');
        
        if (btn) {
            const xToBtn = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
            const yToBtn = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
            
            let xToText, yToText;
            if (btnText) {
                xToText = gsap.quickTo(btnText, "x", { duration: 0.3, ease: "power3.out" });
                yToText = gsap.quickTo(btnText, "y", { duration: 0.3, ease: "power3.out" });
            }
            
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                
                xToBtn(x * 0.3);
                yToBtn(y * 0.3);
                if (btnText) { xToText(x * 0.15); yToText(y * 0.15); }
            });
            
            wrap.addEventListener('mouseleave', () => {
                xToBtn(0); yToBtn(0);
                if (btnText) { xToText(0); yToText(0); }
                
                // Spring reset
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
                if (btnText) gsap.to(btnText, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        }
    });
}

// ==========================================================================
// 8. 3D PORTFOLIO TILT EFFECT
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    const portfolioItems = document.querySelectorAll('.p-item');
    
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            // Calculate mouse position relative to the center of the item
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation amount (max 5 degrees)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            gsap.to(img, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.4
            });
        });
        
        item.addEventListener('mouseleave', () => {
            // Snap back to 0
            gsap.to(img, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power2.out" });
        });
    });
}

// ==========================================================================
// 9. INTERACTIVE ACCORDION (CROSSFADE ENGINE)
// ==========================================================================
const accordions = document.querySelectorAll('.accordion-item');
const accordionImage = document.getElementById('accordionImage');

accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            const newImg = header.getAttribute('data-img');
            
            if (newImg && accordionImage && accordionImage.getAttribute('src') !== newImg) {
                // Smooth GSAP crossfade
                gsap.to(accordionImage, { 
                    opacity: 0, 
                    duration: 0.3, 
                    onComplete: () => {
                        accordionImage.src = newImg;
                        // Wait for new image to load before fading back in
                        accordionImage.onload = () => gsap.to(accordionImage, { opacity: 1, duration: 0.4 });
                    }
                });
            }

            // Close other accordions
            accordions.forEach(item => { if (item !== acc) item.classList.remove('active'); });
            acc.classList.toggle('active');
        });
    }
});

// ==========================================================================
// 10. GSAP SCROLL REVEALS & PARALLAX
// ==========================================================================
// Navbar blur state
ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (self.direction === 1) { navbar.classList.add('scrolled'); } 
            else { navbar.classList.remove('scrolled'); }
        }
    }
});

// Universal Fade Up Reveals
const revealElements = gsap.utils.toArray('.gs-reveal');
revealElements.forEach(elem => {
    gsap.fromTo(elem, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
    );
});

// HERO PARALLAX (THE BLACK VOID FIX)
if (document.querySelector('.hero-bg')) {
    gsap.to('.hero-bg', {
        yPercent: 15, // Smoothly pushes the image down without exposing the edges
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

// General Image Inner-Parallax Effect
gsap.utils.toArray('[data-speed]').forEach(elem => {
    const speed = elem.getAttribute('data-speed') || 0.2;
    gsap.to(elem, {
        y: () => (window.innerHeight * parseFloat(speed)) * 0.4,
        ease: "none",
        scrollTrigger: { trigger: elem.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
});

// Smooth Infinite Review Marquee
const marqueeContainer = document.querySelector('.marquee-container');
if (marqueeContainer) {
    gsap.to(marqueeContainer, {
        xPercent: -50,
        ease: "none",
        duration: 35,
        repeat: -1
    });
}

// ==========================================================================
// 11. MOBILE NAVIGATION & OBSERVERS
// ==========================================================================
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active') ? `<i class="fa-solid fa-xmark"></i>` : `<i class="fa-solid fa-bars"></i>`;
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        });
    });
}

// Mobile Portfolio Swipe Scroll Observer (Colors images as they enter center screen)
const pGallery = document.querySelector('.portfolio-gallery');
if (pGallery && window.innerWidth <= 768) {
    const pObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            } else {
                entry.target.classList.remove('is-active');
            }
        });
    }, {
        root: pGallery,
        threshold: 0.6 // Element must be 60% visible to colorize
    });
    
    document.querySelectorAll('.p-item').forEach(item => pObserver.observe(item));
}