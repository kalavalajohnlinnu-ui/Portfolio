(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // 1. Age Calculator
        const dob = new Date(2009, 1, 11); // February 11, 2009
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        ['heroAge', 'ageInline'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = age;
        });
        
        const ageDisplay = document.getElementById('ageDisplay');
        if (ageDisplay) {
            ageDisplay.textContent = age;
            ageDisplay.setAttribute('data-count', age);
        }

        // 2. Year Display
        const yearDisplay = document.getElementById('yearDisplay');
        if (yearDisplay) {
            yearDisplay.textContent = today.getFullYear();
        }

        // 3. Navigation
        const nav = document.getElementById('nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
        }

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        const navToggle = document.getElementById('navToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileLinks = document.querySelectorAll('#mobileOverlay .nav-link');
        
        if (navToggle && mobileOverlay) {
            const toggleMenu = () => {
                navToggle.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
            };

            navToggle.addEventListener('click', toggleMenu);
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileOverlay.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });
        }

        // 4. Scroll Reveal Animations
        const revealElements = document.querySelectorAll('.anim-reveal, .anim-fade-up');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));

        // 5. Counter Animation
        const statsSection = document.querySelector('.about-stats');
        const counters = document.querySelectorAll('[data-count]');
        
        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;
            
            el.textContent = '0';
            const duration = 1600;
            let startTimestamp = null;
            
            const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
            
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const current = Math.floor(easeOutExpo(progress) * target);
                
                el.textContent = current;
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            
            window.requestAnimationFrame(step);
        }

        if (statsSection && counters.length > 0) {
            const statsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => animateCounter(counter));
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            statsObserver.observe(statsSection);
        }

        // 6. Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 7. Parallax Orbs
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        if (orbs.length > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;
            
            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 40; // max 20px shift each way
                mouseY = (e.clientY / window.innerHeight - 0.5) * 40;
            });
            
            const renderParallax = () => {
                currentX += (mouseX - currentX) * 0.1;
                currentY += (mouseY - currentY) * 0.1;
                
                orbs.forEach((orb, index) => {
                    const factor = index % 2 === 0 ? 1 : -1;
                    orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
                });
                
                requestAnimationFrame(renderParallax);
            };
            
            requestAnimationFrame(renderParallax);
        }

        // 8. Floating Cards
        const floatCards = document.querySelectorAll('.float-card');
        floatCards.forEach(card => {
            const delay = Math.random() * 2;
            card.style.animationDelay = `${delay}s`;
        });

        // 9. Service Cards Stagger Reveal
        const serviceCards = document.querySelectorAll('.service-card');
        const serviceObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
        serviceCards.forEach(card => serviceObserver.observe(card));

        // 10. Section Labels Underline Reveal
        const sectionLabels = document.querySelectorAll('.section-label');
        const labelObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        sectionLabels.forEach(label => labelObserver.observe(label));

        // 11. Smooth Number Counting for Stats 
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.1}s`;
        });

        // 12. Advanced 3D Spatial Tilt & Specular Glare (desktop only)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            const tiltElements = document.querySelectorAll('.company-project, .service-card, .stat-card');
            
            tiltElements.forEach(card => {
                // Ensure glare element exists
                let glare = card.querySelector('.card-glare');
                if (!glare) {
                    glare = document.createElement('div');
                    glare.className = 'card-glare';
                    card.appendChild(glare);
                }

                let isHovered = false;
                let currentRotateX = 0;
                let currentRotateY = 0;
                let targetRotateX = 0;
                let targetRotateY = 0;
                let rafId = null;

                const updateTilt = () => {
                    if (!isHovered) return;

                    // Spring lerp with smooth damping
                    currentRotateX += (targetRotateX - currentRotateX) * 0.12;
                    currentRotateY += (targetRotateY - currentRotateY) * 0.12;

                    card.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateZ(6px)`;

                    rafId = requestAnimationFrame(updateTilt);
                };

                card.addEventListener('mouseenter', () => {
                    isHovered = true;
                    card.style.transition = 'box-shadow 0.35s ease, border-color 0.3s ease';
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(updateTilt);
                });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Calibrated subtle max rotation angles
                    const maxTilt = card.classList.contains('stat-card') ? 6 : (card.classList.contains('service-card') ? 5 : 3.5);
                    targetRotateX = ((y - centerY) / centerY) * -maxTilt;
                    targetRotateY = ((x - centerX) / centerX) * maxTilt;

                    // Update specular glare position
                    const glareX = ((x / rect.width) * 100).toFixed(1);
                    const glareY = ((y / rect.height) * 100).toFixed(1);
                    card.style.setProperty('--glare-x', `${glareX}%`);
                    card.style.setProperty('--glare-y', `${glareY}%`);
                });

                card.addEventListener('mouseleave', () => {
                    isHovered = false;
                    targetRotateX = 0;
                    targetRotateY = 0;
                    currentRotateX = 0;
                    currentRotateY = 0;
                    if (rafId) cancelAnimationFrame(rafId);
                    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease';
                    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                });
            });
        }

        // 13. Smooth Scroll Progress Bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6);z-index:9999;transition:width 0.1s linear;width:0%;pointer-events:none;';
        document.body.appendChild(progressBar);
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });

        // 14. Hero Name Typing Animation
        const typingEl = document.getElementById('heroTypingText');
        const caretEl = document.getElementById('heroTypingCaret');
        if (typingEl) {
            const fullName = "JOHN LINNU KALAVALA";
            typingEl.textContent = "";
            let charIndex = 0;
            
            const typeNextChar = () => {
                if (charIndex < fullName.length) {
                    typingEl.textContent += fullName.charAt(charIndex);
                    charIndex++;
                    const delay = fullName.charAt(charIndex - 1) === ' ' ? 140 : 45 + Math.random() * 45;
                    setTimeout(typeNextChar, delay);
                } else if (caretEl) {
                    caretEl.classList.add('typing-done');
                }
            };
            setTimeout(typeNextChar, 280);
        }

        // 15. Luxury Magnetic Cursor (desktop only)
        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const cursorEl = document.getElementById('cursorCustom');

        if (isDesktop && cursorEl) {
            let cMouseX = window.innerWidth / 2;
            let cMouseY = window.innerHeight / 2;
            let cCursorX = cMouseX;
            let cCursorY = cMouseY;
            let isCursorVisible = false;

            window.addEventListener('mousemove', (e) => {
                cMouseX = e.clientX;
                cMouseY = e.clientY;
                if (!isCursorVisible) {
                    isCursorVisible = true;
                    cursorEl.style.opacity = '1';
                }
            });

            document.addEventListener('mouseleave', () => {
                isCursorVisible = false;
                cursorEl.style.opacity = '0';
            });

            document.addEventListener('mouseenter', () => {
                isCursorVisible = true;
                cursorEl.style.opacity = '1';
            });

            // Interactive magnetic expansion hover states
            const interactiveElements = document.querySelectorAll('a, button, .company-project, .service-card, .stat-card, .btn, .nav-link, .float-card, .theme-toggle, .hero-photo-wrap');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor-hover'));
            });

            function animateCursor() {
                cCursorX += (cMouseX - cCursorX) * 0.22;
                cCursorY += (cMouseY - cCursorY) * 0.22;
                cursorEl.style.left = cCursorX + 'px';
                cursorEl.style.top = cCursorY + 'px';
                requestAnimationFrame(animateCursor);
            }
            requestAnimationFrame(animateCursor);
        } else if (cursorEl) {
            cursorEl.style.display = 'none';
        }

        // 17. Clean Hero Stage Subtle Parallax (No 3D dragging, no rotating background)
        const heroStageClean = document.getElementById('heroStageClean');
        const heroPhotoWrap = document.getElementById('heroPhotoWrap');
        if (heroStageClean && heroPhotoWrap && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;

            window.addEventListener('mousemove', (e) => {
                const rect = heroStageClean.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                mouseX = ((e.clientX - centerX) / (window.innerWidth / 2)) * 8; // subtle max 8px
                mouseY = ((e.clientY - centerY) / (window.innerHeight / 2)) * 8;
            });

            const renderHeroParallax = () => {
                currentX += (mouseX - currentX) * 0.08;
                currentY += (mouseY - currentY) * 0.08;
                heroPhotoWrap.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
                requestAnimationFrame(renderHeroParallax);
            };
            requestAnimationFrame(renderHeroParallax);
        }

        // 18. JNTUK Campus Showcase Interaction
        const jntuCard = document.querySelector('.jntuk-showcase-card');
        if (jntuCard) {
            jntuCard.addEventListener('mouseenter', () => {
                jntuCard.classList.add('hovered');
            });
            jntuCard.addEventListener('mouseleave', () => {
                jntuCard.classList.remove('hovered');
            });
        }

        // 19. Interactive 3D MacBook Scroll-Turn & Device Showcase
        const macbookSection = document.getElementById('macbook-showcase');
        const macbookDevice = document.getElementById('macbookDevice');
        const macbookTabs = document.querySelectorAll('.macbook-tab');
        const macbookSlides = document.querySelectorAll('.macbook-slide');
        const macbookUrlText = document.getElementById('macbookUrlText');
        const macbookLiveBadge = document.getElementById('macbookLiveBadge');
        const macbookProjectName = document.getElementById('macbookProjectName');
        const macbookDemoBtn = document.getElementById('macbookDemoBtn');

        const projectMeta = {
            'tima': {
                url: 'tima.academy/studio-portal/app',
                badge: 'LIVE PWA',
                name: 'Thomas International Music Academy (TIMA)',
                demoUrl: 'tima-demo.html'
            },
            'kapl-quote': {
                url: 'kapl.solar/commercial-quotation',
                badge: 'GST & SUBSIDY',
                name: 'KAPL Enterprises — Solar Quotation Generator',
                demoUrl: 'demo.html'
            },
            'kapl-docs': {
                url: 'kapl.solar/document-generator-pro',
                badge: '6 DOCX BATCH',
                name: 'Solar Document Generator Pro (Batch Legal Agreements)',
                demoUrl: 'demo.html'
            },
            'bharat': {
                url: 'bharatprolifts.com/engineering-portal',
                badge: 'LOAD MATRICES',
                name: 'Bharat Pro Lifts — Elevator Technical Quotation Engine',
                demoUrl: 'demo.html'
            },
            'effisol': {
                url: 'effisol.energy/catalog-quotations',
                badge: 'TIER-1 MODULES',
                name: 'Effisol Energy Solutions — Commercial Quotation Platform',
                demoUrl: 'demo.html'
            },
            'techsummit': {
                url: 'techsummit.io/tickets/verify',
                badge: 'QR BADGE GEN',
                name: 'TechSummit — Digital QR Ticketing & Conference Registration',
                demoUrl: 'techsummit-demo.html'
            }
        };

        const switchMacbookProject = (projectId) => {
            const meta = projectMeta[projectId];
            if (!meta) return;

            macbookTabs.forEach(tab => {
                if (tab.getAttribute('data-project') === projectId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            macbookSlides.forEach(slide => {
                if (slide.getAttribute('data-slide') === projectId) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            if (macbookUrlText) macbookUrlText.textContent = meta.url;
            if (macbookLiveBadge) macbookLiveBadge.textContent = meta.badge;
            if (macbookProjectName) macbookProjectName.textContent = meta.name;
            if (macbookDemoBtn && meta.demoUrl) macbookDemoBtn.href = meta.demoUrl;
        };

        macbookTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const proj = tab.getAttribute('data-project');
                switchMacbookProject(proj);
            });
        });

        // 3D Scroll Rotation Engine ("turning towards us while scrolling")
        if (macbookSection && macbookDevice) {
            let targetRotY = -28;
            let targetRotX = 14;
            let targetRotZ = -2;
            let currentRotY = -28;
            let currentRotX = 14;
            let currentRotZ = -2;

            const updateMacbookScroll = () => {
                const rect = macbookSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate progress as section passes through viewport center
                const totalScrollable = windowHeight + rect.height;
                const currentPassed = windowHeight - rect.top;
                const progress = Math.max(0, Math.min(1, currentPassed / totalScrollable));

                if (progress < 0.2) {
                    // Initial box perspective angle
                    targetRotY = -28;
                    targetRotX = 14;
                    targetRotZ = -2;
                } else if (progress <= 0.65) {
                    // Smoothly turns towards user facing straight
                    const turnProgress = (progress - 0.2) / 0.45;
                    targetRotY = -28 * (1 - turnProgress);
                    targetRotX = 14 * (1 - turnProgress);
                    targetRotZ = -2 * (1 - turnProgress);
                } else {
                    // Subtle exit angle
                    const exitProgress = (progress - 0.65) / 0.35;
                    targetRotY = exitProgress * 8;
                    targetRotX = -exitProgress * 3;
                    targetRotZ = exitProgress * 1;
                }

                currentRotY += (targetRotY - currentRotY) * 0.12;
                currentRotX += (targetRotX - currentRotX) * 0.12;
                currentRotZ += (targetRotZ - currentRotZ) * 0.12;

                macbookDevice.style.transform = `perspective(1600px) rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg) rotateZ(${currentRotZ.toFixed(2)}deg)`;

                requestAnimationFrame(updateMacbookScroll);
            };

            requestAnimationFrame(updateMacbookScroll);
        }

        // 20. Scroll-Triggered Kinetic Text & Typing Labels
        const typingLabels = document.querySelectorAll('.scroll-typing-label');
        if (typingLabels.length > 0) {
            const typeLabelObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const fullText = el.getAttribute('data-type-label') || el.textContent;
                        el.textContent = '';
                        let charIdx = 0;
                        const typeChar = () => {
                            if (charIdx < fullText.length) {
                                el.textContent += fullText.charAt(charIdx);
                                charIdx++;
                                setTimeout(typeChar, 35);
                            }
                        };
                        typeChar();
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.2 });

            typingLabels.forEach(label => typeLabelObserver.observe(label));
        }

        // 21. Kinetic Heading Reveals
        const kineticHeadings = document.querySelectorAll('.scroll-kinetic-heading');
        if (kineticHeadings.length > 0) {
            const headingObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            kineticHeadings.forEach(h => headingObserver.observe(h));
        }
    });
})();
