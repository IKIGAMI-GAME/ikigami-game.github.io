document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 2500);
    
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
    
    // Initialize particle animation
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create different colored particles
        new Particle(canvas, {
            count: 50,
            color: 'rgba(108, 99, 255, 0.5)', // Primary color
            maxSize: 4,
            speed: 0.3,
            connectDistance: 150
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
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
