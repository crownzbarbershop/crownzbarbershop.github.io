// ==========================================================================
// CROWNZ - LEVEL 500 MASTER SCRIPT (MOBILE OPTIMIZED & BUG-FREE)
// ==========================================================================

const isMobile = window.innerWidth < 768;

// ==========================================================================
// 1. AMBIENT PARTICLE ENGINE (HERO SECTION) - DISABLED ON MOBILE FOR SPEED
// ==========================================================================
if (document.getElementById('particles-js') && !isMobile) {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 70, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" }, 
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

// ==========================================================================
// 2. STUDIO-GRADE SMOOTH SCROLL (LENIS)
// ==========================================================================
let lenis;
if (!isMobile) {
    lenis = new Lenis({ 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smoothWheel: true,
        smoothTouch: false 
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);
}

// ==========================================================================
// 3. CINEMATIC PRELOADER & HERO ANIMATION
// ==========================================================================
const initAnimations = () => {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        const tl = gsap.timeline();
        
        tl.to('.preloader-brand .logo-preloader', { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
        .to('.preloader-progress', { width: '100%', duration: 1, ease: 'power3.inOut' }, "-=0.2")
        .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
        
        .to('.hero-section .gs-reveal-up, .hero-section .gs-reveal', { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power4.out' }, "-=0.8")
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
// 4. HIGH-PERFORMANCE MAGNETIC CURSOR
// ==========================================================================
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorText = document.querySelector('.cursor-text');
    
    if (cursorDot && cursorRing) {
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

        document.querySelectorAll('a, button, .hover-target, .accordion-header, .port-card, .floating-book-btn').forEach(el => {
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

// ==========================================================================
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
        gsap.set(baOver, { clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` });
        gsap.set(baHandle, { left: `${percentage}%` });
    };

    baSlider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
    
    baSlider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, {passive: true}); 
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, {passive: true});
}

// ==========================================================================
// 6. INTERACTIVE ACCORDION (CROSSFADE ENGINE)
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

// ==========================================================================
// 7. GSAP SCROLL REVEALS & PARALLAX
// ==========================================================================
gsap.registerPlugin(ScrollTrigger);

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

const revealElements = gsap.utils.toArray('.gs-reveal-up, .gs-reveal-left, .gs-reveal-right, .gs-reveal-scale, .gs-reveal');
revealElements.forEach(elem => {
    gsap.fromTo(elem, 
        { 
            y: isMobile ? 30 : 60, 
            x: 0, 
            scale: elem.classList.contains('gs-reveal-scale') ? 0.9 : 1,
            opacity: 0 
        }, 
        { 
            y: 0, 
            x: 0, 
            scale: 1,
            opacity: 1, 
            duration: isMobile ? 0.8 : 1.2, 
            ease: "power4.out", 
            scrollTrigger: { 
                trigger: elem, 
                start: isMobile ? "top 95%" : "top 85%" 
            } 
        }
    );
});

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

const floatingBadge = document.querySelector('.floating-book-btn');
if (floatingBadge) {
    gsap.set(floatingBadge, { scale: 0, opacity: 0 });
    ScrollTrigger.create({ 
        trigger: "#ethos", start: "top 80%", 
        onEnter: () => gsap.to(floatingBadge, { scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.8, ease: "elastic.out(1, 0.5)" }), 
        onLeaveBack: () => gsap.to(floatingBadge, { scale: 0, opacity: 0, pointerEvents: 'none', duration: 0.4, ease: "power3.in" }) 
    });
}

// ==========================================================================
// 8. DYNAMIC STATUS & MOBILE MENU
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
        statusDot.classList.remove('closed');
        statusText.innerText = 'Open Now';
    } else {
        statusDot.classList.add('closed');
        statusDot.classList.remove('open');
        statusText.innerText = 'Currently Closed';
    }
};

updateShopStatus();
setInterval(updateShopStatus, 60000);

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const closeBtn = document.querySelector('.mobile-close-btn'); 

if (menuToggle && mobileMenu) {
    let menuOpen = false;
    const toggleMenu = () => {
        menuOpen = !menuOpen; 
        mobileMenu.classList.toggle('active');
        const lines = menuToggle.querySelectorAll('.line');
        
        if (menuOpen) { 
            if(lines.length) {
                gsap.to(lines[0], { y: 4, rotation: 45, duration: 0.3 }); 
                gsap.to(lines[1], { y: -4, rotation: -45, duration: 0.3 }); 
            }
            document.body.style.overflow = 'hidden'; 
            if(!isMobile && lenis) lenis.stop(); 
        } else { 
            if(lines.length) {
                gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3 }); 
                gsap.to(lines[1], { y: 0, rotation: 0, duration: 0.3 }); 
            }
            document.body.style.overflow = ''; 
            if(!isMobile && lenis) lenis.start(); 
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu); 
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', () => { if (menuOpen) toggleMenu(); }));
}

// ==========================================================================
// 9. PREMIUM CLICK RIPPLE EFFECT
// ==========================================================================
document.addEventListener('click', function(e) {
    if (e.clientX > window.innerWidth - 30) return;

    const ripple = document.createElement('div');
    ripple.classList.add('premium-ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if(ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600); 
});

// ==========================================================================
// 10. ADVANCED OBSERVER FOR HORIZONTAL SCROLL FOCUS (SPOTLIGHT EFFECT)
// ==========================================================================

// 10.A - Vertical Page Observer (Normal sections like Map, Ethos images)
const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('color-active');
        } else {
            entry.target.classList.remove('color-active'); 
        }
    });
}, { 
    threshold: 0.3 // Item screen par 30% aaye tab color ho
});

// 10.B - Horizontal Carousel Observer (Lookbook, Reviews, Videos)
document.querySelectorAll('.horizontal-scroll-wrapper').forEach(wrapper => {
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('color-active');
            } else {
                // Jaise hi scroll hoke side me nikle, wapas black
                entry.target.classList.remove('color-active'); 
            }
        });
    }, { 
        root: wrapper, // SIRF is scroll box ke andar ki movement dekhega
        rootMargin: "0px -15%", // Side edges par 15% black rakhega, sirf middle me color karega
        threshold: 0.3 // Item thoda saamne aana chahiye
    });

    // Har original item ko observer me daalo
    wrapper.querySelectorAll('.monochrome-reveal').forEach(el => {
        carouselObserver.observe(el);
    });
    
    // Observer ko wrapper ke sath save kar lo taaki clones bhi observe ho sakein
    wrapper.carouselObserver = carouselObserver;
});

// Normal page elements ko observe karo jo kisi carousel me nahi hain
document.querySelectorAll('.monochrome-reveal').forEach(el => {
    if (!el.closest('.horizontal-scroll-wrapper')) {
        pageObserver.observe(el);
    }
});


// ==========================================================================
// 11. SEAMLESS INFINITE CAROUSEL ENGINE (NO JUMPS + FOCUS SPOTLIGHT)
// ==========================================================================
document.querySelectorAll('section').forEach(section => {
    const carousel = section.querySelector('.infinite-carousel');
    const wrapper = section.querySelector('.horizontal-scroll-wrapper');
    const track = section.querySelector('.portfolio-track');
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');

    if (carousel && wrapper && track) {
        const originalItems = Array.from(track.children);
        
        // Clone 1
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('carousel-clone');
            clone.classList.remove('color-active'); 
            track.appendChild(clone);
            
            // MAGIC: Clones ko bhi horizontal focus observer me daalo!
            if (clone.classList.contains('monochrome-reveal') && wrapper.carouselObserver) {
                wrapper.carouselObserver.observe(clone);
            }
        });
        
        // Clone 2
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('carousel-clone');
            clone.classList.remove('color-active');
            track.appendChild(clone);
            
            // MAGIC: Clones ko bhi horizontal focus observer me daalo!
            if (clone.classList.contains('monochrome-reveal') && wrapper.carouselObserver) {
                wrapper.carouselObserver.observe(clone);
            }
        });

        const getOriginalWidth = () => {
            if (originalItems.length === 0) return 0;
            const itemWidth = originalItems[0].offsetWidth;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            return (itemWidth + gap) * originalItems.length;
        };

        // Scroll listener for seamless teleporting
        wrapper.addEventListener('scroll', () => {
            const originalWidth = getOriginalWidth();
            if (originalWidth === 0) return;
            
            const scrollLeft = wrapper.scrollLeft;

            if (scrollLeft >= originalWidth * 2) {
                wrapper.style.scrollBehavior = 'auto'; 
                wrapper.scrollLeft = scrollLeft - originalWidth;
            } 
            else if (scrollLeft <= 0) {
                wrapper.style.scrollBehavior = 'auto'; 
                wrapper.scrollLeft = scrollLeft + originalWidth;
            }
        });

        // Navigation Buttons Logic
        if (prevBtn && nextBtn) {
            const getScrollAmount = () => window.innerWidth > 1024 ? 500 : window.innerWidth * 0.8;

            prevBtn.addEventListener('click', () => {
                wrapper.style.scrollBehavior = 'smooth';
                wrapper.scrollBy({ left: -getScrollAmount() });
            });

            nextBtn.addEventListener('click', () => {
                wrapper.style.scrollBehavior = 'smooth';
                wrapper.scrollBy({ left: getScrollAmount() });
            });
        }
        
        // Set initial position perfectly in the middle
        setTimeout(() => {
            wrapper.style.scrollBehavior = 'auto';
            wrapper.scrollLeft = getOriginalWidth();
        }, 500);
    }
});
