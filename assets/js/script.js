// ==========================================================================
// CROWNZ - ULTRA-PREMIUM JAVASCRIPT ENGINE
// DESIGN GOAL: High-performance, cinematic, smooth interactions.
// ==========================================================================

const isMobile = window.innerWidth < 768;

// ==========================================================================
// 1. STUDIO-GRADE SMOOTH SCROLL (LENIS)
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

// ==========================================================================
// 2. CINEMATIC PRELOADER & HERO ANIMATION 
// ==========================================================================
const initAnimations = () => {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        const tl = gsap.timeline();
        
        tl.to('.preloader-brand .char', { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'power4.out' })
        .to('.preloader-progress', { width: '100%', duration: 1.2, ease: 'power3.inOut' }, "-=0.4")
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.2 })
        
        .to('.hero-section .gs-reveal-up, .hero-section .gs-reveal', { 
            y: 0, 
            opacity: 1, 
            stagger: 0.15, 
            duration: 1.2, 
            ease: 'power4.out' 
        }, "-=0.6")
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

// ==========================================================================
// 3. HIGH-PERFORMANCE MAGNETIC CURSOR
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorText = document.querySelector('.cursor-text');
    
    if (cursorDot && cursorRing) {
        const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3.out" });
        const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3.out" });
        const ringX = gsap.quickTo(cursorRing, "x", { duration: 0.3, ease: "power3.out" });
        const ringY = gsap.quickTo(cursorRing, "y", { duration: 0.3, ease: "power3.out" });
        let textX, textY;
        
        if(cursorText) {
            textX = gsap.quickTo(cursorText, "x", { duration: 0.3 });
            textY = gsap.quickTo(cursorText, "y", { duration: 0.3 });
        }
        
        window.addEventListener('mousemove', (e) => { 
            dotX(e.clientX); dotY(e.clientY);
            ringX(e.clientX); ringY(e.clientY);
            if(cursorText) { textX(e.clientX); textY(e.clientY); }
        });

        document.querySelectorAll('a, button, .hover-target, .accordion-header, .port-card, .editorial-card, .floating-book-btn').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

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

        document.querySelectorAll('.primary-btn, .secondary-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power2.out" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    }
}

// ==========================================================================
// 4. BEFORE & AFTER TRANSFORMATION ENGINE (BULLETPROOF TOUCH FIX)
// ==========================================================================
const baSlider = document.getElementById('baSlider');
const baOver = document.querySelector('.ba-over');
const baHandle = document.querySelector('.ba-handle');

if (baSlider && baOver && baHandle) {
    let isDragging = false;
    
    const updateSlider = (clientX) => {
        const rect = baSlider.getBoundingClientRect();
        let percentage = ((clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage)); // Lock between 0 and 100
        
        // Polygon is the most reliable cross-browser clip-path
        gsap.set(baOver, { clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` });
        gsap.set(baHandle, { left: `${percentage}%` });
    };

    const startDrag = (e) => { 
        isDragging = true; 
        updateSlider(e.clientX || e.touches[0].clientX); 
    };
    
    const stopDrag = () => { isDragging = false; };
    
    const drag = (e) => { 
        if (isDragging) {
            // Prevent scrolling while interacting with the slider (Fixes mobile glitch)
            if (e.type === 'touchmove' && e.cancelable) e.preventDefault(); 
            updateSlider(e.clientX || e.touches[0].clientX); 
        }
    };

    // Desktop Events
    baSlider.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', drag);
    
    // Mobile Touch Events
    baSlider.addEventListener('touchstart', startDrag, {passive: true}); 
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', drag, {passive: false}); 
}

// ==========================================================================
// 5. INTERACTIVE ACCORDION 
// ==========================================================================
const accordions = document.querySelectorAll('.accordion-item');
const previewImg = document.getElementById('servicePreviewImg');

accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            const isActive = acc.classList.contains('active');
            accordions.forEach(item => item.classList.remove('active'));
            
            if (!isActive) {
                acc.classList.add('active'); 
                if (previewImg) {
                    const newSrc = acc.getAttribute('data-image');
                    if (newSrc && previewImg.getAttribute('src') !== newSrc) {
                        gsap.to(previewImg, { 
                            opacity: 0, scale: 1.05, duration: 0.3, ease: "power2.inOut",
                            onComplete: () => {
                                previewImg.src = newSrc;
                                previewImg.onload = () => gsap.to(previewImg, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
                            }
                        });
                    }
                }
            }
        });
    }
});

// ==========================================================================
// 6. GSAP SCROLL REVEALS, COLOR TRANSITIONS & PARALLAX 
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

// OPTIMIZED REVEAL
const revealElements = gsap.utils.toArray('.gs-reveal-up, .gs-reveal-left, .gs-reveal-right, .gs-reveal-scale, .gs-reveal');
revealElements.forEach(elem => {
    gsap.fromTo(elem, 
        { 
            y: isMobile ? 20 : 40, 
            x: 0, 
            scale: elem.classList.contains('gs-reveal-scale') ? 0.95 : 1,
            opacity: 0 
        }, 
        { 
            y: 0, 
            x: 0, 
            scale: 1,
            opacity: 1, 
            duration: isMobile ? 0.8 : 1.2, 
            ease: "power3.out", 
            scrollTrigger: { 
                trigger: elem, 
                start: isMobile ? "top 95%" : "top 85%" 
            } 
        }
    );
});

// COLOR REVEAL ON SCROLL
gsap.utils.toArray('.img-wrap img, .monochrome-img img, .ba-image').forEach(img => {
    ScrollTrigger.create({
        trigger: img,
        start: "top 75%", // Triggers when image is 75% down the viewport
        onEnter: () => gsap.to(img, { filter: 'grayscale(0%) contrast(1.05) brightness(1)', duration: 1.2, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(img, { filter: 'grayscale(100%) contrast(1.1) brightness(0.9)', duration: 1.2, ease: "power2.inOut" })
    });
});

// Deep Parallax 
if (!isMobile) {
    gsap.utils.toArray('[data-speed]').forEach(elem => {
        const speed = parseFloat(elem.getAttribute('data-speed'));
        gsap.to(elem, { 
            y: () => (ScrollTrigger.maxScroll(window) - elem.offsetTop) * (1 - speed) * 0.1, 
            ease: "none", 
            scrollTrigger: { trigger: elem.parentElement, start: "top bottom", end: "bottom top", scrub: true } 
        });
    });
}

// Horizontal Scrolljacking 
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
        onEnter: () => gsap.to(floatingBadge, { scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.8, ease: "elastic.out(1, 0.6)" }), 
        onLeaveBack: () => gsap.to(floatingBadge, { scale: 0, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: "power3.in" }) 
    });
}

// ==========================================================================
// 7. DYNAMIC STATUS & MOBILE MENU
// ==========================================================================
const updateShopStatus = () => {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-txt');
    if (!statusDot || !statusText) return;

    const torontoTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
    const day = torontoTime.getDay(); 
    const hours = torontoTime.getHours();

    const openTime = (day === 0) ? 10 : 9; 
    const closeTime = 19; 

    const isOpen = (hours >= openTime && hours < closeTime);

    if (isOpen) {
        statusDot.classList.add('open');
        statusText.innerText = 'Open Now';
    } else {
        statusDot.classList.remove('open');
        statusText.innerText = 'Currently Closed';
    }
};

updateShopStatus();
setInterval(updateShopStatus, 60000);

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
            document.body.style.overflow = 'hidden'; 
            if(!isMobile) lenis.stop(); 
        } else { 
            gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3 }); 
            gsap.to(lines[1], { y: 0, rotation: 0, duration: 0.3 }); 
            document.body.style.overflow = ''; 
            if(!isMobile) lenis.start(); 
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => { if (menuOpen) toggleMenu(); }));
}

// ==========================================================================
// 8. PREMIUM CLICK / TOUCH RIPPLE EFFECT
// ==========================================================================
const createRipple = (x, y) => {
    const ripple = document.createElement('div');
    ripple.classList.add('premium-ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    
    // Remove element smoothly after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
};

// Listen for mouse clicks
window.addEventListener('mousedown', (e) => {
    createRipple(e.clientX, e.clientY);
});

// Listen for screen taps on mobile
window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        createRipple(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });
