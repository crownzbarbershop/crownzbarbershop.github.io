// ==========================================================================
// CROWNZ - LEVEL 500 MASTER SCRIPT
// ==========================================================================

// 1. AMBIENT PARTICLE ENGINE (HERO SECTION)
// ==========================================================================
if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 70, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#00c2ff" }, // Electric Cyan
            "shape": { "type": "circle" },
            "opacity": { "value": 0.3, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.05, "width": 1 },
            "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.4 } } }
        },
        "retina_detect": true
    });
}

// 2. STUDIO-GRADE SMOOTH SCROLL (LENIS)
// ==========================================================================
const lenis = new Lenis({ 
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true,
    smoothTouch: false 
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// 3. CINEMATIC PRELOADER & HERO ANIMATION
// ==========================================================================
// ==========================================================================
// 2. CLINICAL PRELOADER & HERO ANIMATION (FIXED BLUR BUG)
// ==========================================================================
const initAnimations = () => {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        const tl = gsap.timeline();
        
        tl.to('.preloader-brand .char', { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'power4.out' })
        .to('.preloader-progress', { width: '100%', duration: 1, ease: 'power3.inOut' }, "-=0.4")
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        
        // Hero Image ka scale animation delete kar diya hai taaki browser blur na kare
        
        .to('.hero-section .gs-reveal', { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power4.out' }, "-=0.8")
        .call(() => {
            document.body.classList.remove('loading');
            setTimeout(() => { preloader.style.display = 'none'; }, 1000);
        });
    } else {
        document.body.classList.remove('loading');
    }
};

window.addEventListener('load', initAnimations);
setTimeout(() => { if(document.body.classList.contains('loading')) initAnimations(); }, 3500);

// 4. HIGH-PERFORMANCE MAGNETIC CURSOR
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorText = document.querySelector('.cursor-text');
    
    if (cursorDot && cursorRing) {
        // quickTo is highly optimized for mouse tracking
        const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3.out" });
        const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3.out" });
        const ringX = gsap.quickTo(cursorRing, "x", { duration: 0.4, ease: "power3.out" });
        const ringY = gsap.quickTo(cursorRing, "y", { duration: 0.4, ease: "power3.out" });
        let textX, textY;
        
        if(cursorText) {
            textX = gsap.quickTo(cursorText, "x", { duration: 0.4 });
            textY = gsap.quickTo(cursorText, "y", { duration: 0.4 });
        }
        
        window.addEventListener('mousemove', (e) => { 
            dotX(e.clientX); dotY(e.clientY);
            ringX(e.clientX); ringY(e.clientY);
            if(cursorText) { textX(e.clientX); textY(e.clientY); }
        });

        // Hover Targets (Buttons, Links)
        document.querySelectorAll('a, button, .hover-target, .accordion-header, .port-card, .floating-book-btn').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Drag/Swipe Targets (Sliders, Carousels)
        document.querySelectorAll('.drag-target').forEach(el => {
            el.addEventListener('mouseenter', () => { 
                document.body.classList.add('cursor-drag'); 
                if (cursorText) cursorText.innerText = el.classList.contains('horizontal-scroll-wrapper') ? "SWIPE" : "DRAG"; 
            });
            el.addEventListener('mouseleave', () => { 
                document.body.classList.remove('cursor-drag'); 
                if (cursorText) cursorText.innerText = ""; 
            });
        });

        // Magnetic Physics for Primary Buttons
        document.querySelectorAll('.primary-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    }
}

// 5. BEFORE & AFTER TRANSFORMATION ENGINE
// ==========================================================================
const baSlider = document.getElementById('baSlider');
const baOver = document.querySelector('.ba-over');
const baHandle = document.querySelector('.ba-handle');

if (baSlider && baOver && baHandle) {
    let isDragging = false;
    
    const updateSlider = (clientX) => {
        const rect = baSlider.getBoundingClientRect();
        let percentage = ((clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        
        // Direct DOM manipulation for zero-latency dragging
        gsap.set(baOver, { clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` });
        gsap.set(baHandle, { left: `${percentage}%` });
    };

    baSlider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
    
    // Mobile Touch Support
    baSlider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, {passive: true}); 
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, {passive: true});
}

// 6. INTERACTIVE ACCORDION (CROSSFADE ENGINE)
// ==========================================================================
const accordions = document.querySelectorAll('.accordion-item');
const previewImg = document.getElementById('servicePreviewImg');

accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            
            // Close all
            accordions.forEach(item => item.classList.remove('active'));
            
            if (!isActive) {
                acc.classList.add('active'); // Open clicked
                
                // Crossfade Image Logic
                if (previewImg) {
                    const newSrc = acc.getAttribute('data-image');
                    if (newSrc && previewImg.getAttribute('src') !== newSrc) {
                        gsap.to(previewImg, { 
                            opacity: 0, filter: 'grayscale(100%) blur(5px)', scale: 1.1, duration: 0.3, 
                            onComplete: () => {
                                previewImg.src = newSrc;
                                previewImg.onload = () => gsap.to(previewImg, { opacity: 1, filter: 'grayscale(100%) blur(0px)', scale: 1, duration: 0.5 });
                            }
                        });
                    }
                }
            }
        });
    }
});

// 7. SCROLLTRIGGER: HORIZONTAL SCROLLING & REVEALS
// ==========================================================================
gsap.registerPlugin(ScrollTrigger);

// Navbar Blur on Scroll
const header = document.querySelector('.site-header');
if(header){ 
    ScrollTrigger.create({ 
        start: 'top -50', 
        onUpdate: (self) => { 
            if (self.direction === 1 || window.scrollY > 50) { header.classList.add('scrolled'); } 
            else { header.classList.remove('scrolled'); } 
        } 
    }); 
}

// Reveal Animations (Up, Left, Right, Scale)
gsap.utils.toArray('.gs-reveal-up').forEach(elem => { gsap.to(elem, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: elem, start: "top 85%" } }); });
gsap.utils.toArray('.gs-reveal-left').forEach(elem => { gsap.to(elem, { x: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: elem, start: "top 85%" } }); });
gsap.utils.toArray('.gs-reveal-right').forEach(elem => { gsap.to(elem, { x: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: elem, start: "top 85%" } }); });
gsap.utils.toArray('.gs-reveal-scale').forEach(elem => { gsap.to(elem, { scale: 1, opacity: 1, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: elem, start: "top 85%" } }); });

// Deep Parallax (Floating Shapes)
gsap.utils.toArray('[data-speed]').forEach(elem => {
    const speed = parseFloat(elem.getAttribute('data-speed'));
    gsap.to(elem, { 
        y: () => (ScrollTrigger.maxScroll(window) - elem.offsetTop) * (1 - speed) * 0.1, 
        ease: "none", 
        scrollTrigger: { trigger: elem.parentElement, start: "top bottom", end: "bottom top", scrub: true } 
    });
});

// Horizontal Scrolljacking (Lookbook & Reviews)
document.querySelectorAll('.horizontal-scroll-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.portfolio-track');
    if (track && window.innerWidth > 900) {
        let scrollAmount = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
        gsap.to(track, { 
            x: -scrollAmount, ease: "none", 
            scrollTrigger: { trigger: wrapper, start: "top center", end: () => `+=${scrollAmount}`, scrub: 1 } 
        });
    }
});

// Floating Book Button Reveal
const floatingBadge = document.querySelector('.floating-book-btn');
if (floatingBadge) {
    gsap.set(floatingBadge, { scale: 0, opacity: 0 });
    ScrollTrigger.create({ 
        trigger: "#ethos", start: "top 80%", 
        onEnter: () => gsap.to(floatingBadge, { scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.8, ease: "elastic.out(1, 0.5)" }), 
        onLeaveBack: () => gsap.to(floatingBadge, { scale: 0, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: "power3.in" }) 
    });
}

// 8. DYNAMIC STATUS & MOBILE MENU
// ==========================================================================
// Dynamic Open/Closed Status
const updateShopStatus = () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-txt');
    if (!statusDot || !statusText) return;

    // Convert local time to Toronto/Milton time
    const torontoTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
    const day = torontoTime.getDay(); 
    const hours = torontoTime.getHours();

    const openTime = (day === 0) ? 10 : 9; // 10 AM Sundays, 9 AM otherwise
    const closeTime = 19; // 7 PM

    const isOpen = (hours >= openTime && hours < closeTime);

    if (isOpen) {
        statusDot.classList.add('open');
        statusDot.classList.remove('closed');
        statusText.innerText = 'Open Now';
    } else {
        statusDot.classList.add('closed');
        statusDot.classList.remove('open');
        statusText.innerText = 'Currently Closed';
    }
};

updateShopStatus();
setInterval(updateShopStatus, 60000); // Check every minute

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu-overlay');

if (menuToggle && mobileMenu) {
    let menuOpen = false;
    const toggleMenu = () => {
        menuOpen = !menuOpen; 
        mobileMenu.classList.toggle('active');
        const lines = menuToggle.querySelectorAll('.line');
        
        if (menuOpen) { 
            gsap.to(lines[0], { y: 4, rotation: 45, duration: 0.3 }); 
            gsap.to(lines[1], { y: -4, rotation: -45, duration: 0.3 }); 
            document.body.style.overflow = 'hidden'; lenis.stop(); 
        } else { 
            gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3 }); 
            gsap.to(lines[1], { y: 0, rotation: 0, duration: 0.3 }); 
            document.body.style.overflow = ''; lenis.start(); 
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => { if (menuOpen) toggleMenu(); }));
}
