document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 2500);
    
    // Interactive Background System for Game-like Menu
    const backgroundContainer = document.querySelector('.background-container');
    const menuItems = document.querySelectorAll('.sidebar ul li a');
    const overlay = document.querySelector('.overlay');
    
    // Background themes for each menu section (Enhanced Modern Pastels)
    const backgroundThemes = {
        '#home': {
            gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.05))',
            particles: 'blue'
        },
        '#game-ikigami': {
            gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(168, 85, 247, 0.05))',
            particles: 'cyan'
        },
        '#team': {
            gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.05))',
            particles: 'purple'
        },
        '#oss': {
            gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.05))',
            particles: 'green'
        },
        '#art': {
            gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(249, 115, 22, 0.05))',
            particles: 'pink'
        },
        '#robotics': {
            gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(245, 158, 11, 0.05))',
            particles: 'orange'
        },
        '#roadmap': {
            gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.05))',
            particles: 'violet'
        },
        '#about': {
            gradient: 'linear-gradient(135deg, rgba(110, 231, 183, 0.08), rgba(59, 130, 246, 0.05))',
            particles: 'emerald'
        },
        '#contact': {
            gradient: 'linear-gradient(135deg, rgba(248, 113, 113, 0.08), rgba(168, 85, 247, 0.05))',
            particles: 'red'
        }
    };
    
    // Dynamic background change function
    function changeBackground(theme) {
        if (overlay) {
            overlay.style.background = theme.gradient;
            overlay.style.transition = 'background 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        // Update particle system
        if (window.currentParticleSystem) {
            window.currentParticleSystem.updateTheme(theme.particles);
        }
    }
    
    // Add hover effects to menu items
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        const theme = backgroundThemes[href];
        
        if (theme) {
            // Mouse enter effect
            item.addEventListener('mouseenter', () => {
                changeBackground(theme);
                
                // Add screen scanning effect
                createScanEffect();
                
                // Add pulse effect to the menu item
                item.style.animation = 'menuPulse 1s ease-in-out';
            });
            
            // Mouse leave effect
            item.addEventListener('mouseleave', () => {
                // Reset to default theme or current active theme
                const activeItem = document.querySelector('.sidebar ul li a.active');
                if (activeItem && activeItem !== item) {
                    const activeHref = activeItem.getAttribute('href');
                    const activeTheme = backgroundThemes[activeHref];
                    if (activeTheme) {
                        changeBackground(activeTheme);
                    }
                } else if (!activeItem) {
                    // Default theme
                    changeBackground(backgroundThemes['#home']);
                }
                
                item.style.animation = '';
            });
        }
    });
    
    // Screen scanning effect
    function createScanEffect() {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00f0ff, transparent);
            z-index: 999;
            animation: scanAcrossScreen 1s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(scanLine);
        
        setTimeout(() => {
            document.body.removeChild(scanLine);
        }, 1000);
    }
    
    // Add scan animation keyframes
    const scanKeyframes = `
        @keyframes scanAcrossScreen {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(50vh); opacity: 0.8; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = scanKeyframes;
    document.head.appendChild(style);
    
    // Check if background video exists and can be played
    const bgVideo = document.getElementById('bg-video');
    const bgVideoSource = bgVideo.querySelector('source');
    
    const checkVideo = () => {
        fetch(bgVideoSource.src, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    bgVideo.style.display = 'block';
                    bgVideo.play().catch(err => {
                        console.log('Video autoplay failed:', err);
                    });
                } else {
                    // If video not found, initialize particles
                    initParticles();
                }
            })
            .catch(() => {
                console.log('Background video not found');
                // Initialize particles as fallback
                initParticles();
            });
    };
    
    // Enhanced particle animation with pastel colors
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create enhanced particle system with pastel colors
        window.currentParticleSystem = new Particle(canvas, {
            count: 80,
            color: 'rgba(160, 139, 250, 0.6)',
            maxSize: 5,
            speed: 0.5,
            connectDistance: 180,
            interactive: true
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Interactive highlight animation for IKIGAMI.DEV
    function setupInteractiveHighlight() {
        const interactiveElements = document.querySelectorAll('.interactive-highlight');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove any existing animation class
                this.classList.remove('highlight-active');
                
                // Force reflow
                void this.offsetWidth;
                
                // Add animation class
                this.classList.add('highlight-active');
                
                // Remove class after animation completes
                setTimeout(() => {
                    this.classList.remove('highlight-active');
                }, 600);
            });
            
            // Add hover effect
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // Initialize interactive highlight after DOM is ready
    setupInteractiveHighlight();
    
    checkVideo();

    // Navigation and section switching
    const navLinks = document.querySelectorAll('.sidebar ul li a');
    const contentSections = document.querySelectorAll('.content section');
    const sectionContents = document.querySelectorAll('.section-content');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    
    // Function to switch sections
    function switchSection(targetId) {
        // Hide all sections
        contentSections.forEach(section => {
            if (!section.classList.contains('section-hidden')) {
                section.classList.add('section-hidden');
            }
        });

        // Show the target section
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.remove('section-hidden');
            
            // Animate the target section content
            setTimeout(() => {
                const targetContent = targetSection.querySelector('.section-content');
                if (targetContent) {
                    targetContent.classList.add('visible');
                }
            }, 100);
        } else {
            // Fallback or error handling: if no target, show the first one
            if(contentSections.length > 0) {
                contentSections[0].classList.remove('section-hidden');
                const firstContent = contentSections[0].querySelector('.section-content');
                if (firstContent) {
                    firstContent.classList.add('visible');
                }
            }
        }
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = this.getAttribute('href');

            // Update active class for links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Hide all section contents (for animation)
            sectionContents.forEach(content => {
                content.classList.remove('visible');
            });

            // Switch to the target section after a small delay
            setTimeout(() => {
                switchSection(targetId);
            }, 300);

            // Scroll to top of content area when section changes
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // 初期表示：最初のnavリンクに対応するセクションを表示し、他は非表示
    if (navLinks.length > 0 && contentSections.length > 0) {
        navLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(section => section.classList.add('section-hidden'));
        // location.hashが有効ならそのセクションを表示
        let initialSectionId = navLinks[0].getAttribute('href');
        if (location.hash && document.querySelector(location.hash)) {
            initialSectionId = location.hash;
            const initialNav = Array.from(navLinks).find(l => l.getAttribute('href') === location.hash);
            if (initialNav) initialNav.classList.add('active');
        } else {
            navLinks[0].classList.add('active');
        }
        const initialSection = document.querySelector(initialSectionId);
        if (initialSection) {
            initialSection.classList.remove('section-hidden');
            setTimeout(() => {
                const firstContent = initialSection.querySelector('.section-content');
                if (firstContent) {
                    firstContent.classList.add('visible');
                }
            }, 500);
        }
    } else if (contentSections.length > 0) {
        contentSections.forEach(section => section.classList.add('section-hidden'));
        contentSections[0].classList.remove('section-hidden');
        setTimeout(() => {
            const firstContent = contentSections[0].querySelector('.section-content');
            if (firstContent) {
                firstContent.classList.add('visible');
            }
        }, 500);
    }
    
    // Scroll to Top Button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
      // Intersection Observer for scroll animations
    const animatedSections = document.querySelectorAll('.section-content[data-animation]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const animation = section.dataset.animation;
                section.classList.add('animate__' + animation);
                section.classList.add('visible');
                
                // アニメーション要素を順番に表示
                const animElements = section.querySelectorAll('.animate-item');
                if (animElements.length > 0) {
                    animElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('animate__animated', 'animate__fadeInUp', 'visible');
                        }, 300 + (index * 150));
                    });
                }
                
                sectionObserver.unobserve(section);
            }
        });
    }, {
        threshold: 0.2
    });
    
    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Form submission handling (prevent default for demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('お問い合わせありがとうございます。これはデモサイトのため、実際の送信は行われません。');
        });
    }
});
