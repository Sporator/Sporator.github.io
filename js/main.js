/*
 * Universal Roofing - Main JavaScript
 * Adding interactivity and functionality to the website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavContainer = document.getElementById('main-nav-container');

    if (menuToggle && mainNavContainer) {
        // Toggle menu visibility
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            mainNavContainer.classList.toggle('show');

            // Toggle icon
            const icon = menuToggle.querySelector('i');
            if (mainNavContainer.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Hide menu when a link is clicked
        const navLinks = mainNavContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 1024) { // Include iPad screens
                    mainNavContainer.classList.remove('show');
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });

        // Hide menu when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 1024 && // Include iPad screens
                !mainNavContainer.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                mainNavContainer.classList.remove('show');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 1024) {
                mainNavContainer.classList.remove('show');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active navigation item based on scroll position
    function highlightActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const serviceAreasSection = document.querySelector('.service-areas');
        const allNavLinks = document.querySelectorAll('.main-nav a'); // Get ALL nav links
        const homeLink = document.querySelector('.main-nav a[href="index.html"]');
        const scrollPosition = window.scrollY + 100; // Offset for header

        let activeSection = null;

        // Find which section is currently active
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Special handling for about section - extend it to include service-areas
            if (sectionId === 'about' && serviceAreasSection) {
                const serviceAreasTop = serviceAreasSection.offsetTop;
                const serviceAreasHeight = serviceAreasSection.offsetHeight;
                const extendedHeight = sectionHeight + (serviceAreasTop - (sectionTop + sectionHeight)) + serviceAreasHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + extendedHeight) {
                    activeSection = sectionId;
                }
            } else if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });

        // Remove active class from ALL nav links first
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (activeSection) {
            // Activate the section link
            const activeLink = document.querySelector(`.main-nav a[href="#${activeSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else if (scrollPosition < sections[0].offsetTop) {
            // Only activate home if we're above the first section
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }

    // Initialize scroll position highlight
    highlightActiveNavItem();

    // Update active link on scroll
    window.addEventListener('scroll', highlightActiveNavItem);

});
