/*
 * Universal Roofing - Main JavaScript
 * Adding interactivity and functionality to the website
 */

// Configuration for Google Reviews Widget
const GOOGLE_PLACES_CONFIG = {
    placeId: 'ChIJjXXGUDsjPIcR_YLI2Pw8o9E', // Your Place ID
    reviewsToShow: 5, // Maximum number of reviews to display
    sortBy: 'recent' // Options: 'recent', 'relevant', 'rating'
};

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

    // Load Google Reviews
    loadGoogleReviews();

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

// Loads Google reviews and updates the testimonial section
function loadGoogleReviews() {
    const reviewsContainer = document.getElementById('google-reviews');
    if (!reviewsContainer) return;

    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || !google.maps) {
        displayErrorMessage(reviewsContainer);
        return;
    }

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
        placeId: GOOGLE_PLACES_CONFIG.placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url']
    };

    service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            displayPlaceReviews(place, reviewsContainer);
        } else {
            displayErrorMessage(reviewsContainer);
        }
    });
}

// Displays place details and reviews
function displayPlaceReviews(place, container) {
    const reviewsToShow = Math.min(GOOGLE_PLACES_CONFIG.reviewsToShow, place.reviews ? place.reviews.length : 0);

    let html = `
        <div class="google-reviews-container">
            <div class="business-info">
                <div class="overall-rating">
                    <div class="rating-line">
                        <div class="stars">${'★'.repeat(Math.floor(place.rating))}${'☆'.repeat(5 - Math.floor(place.rating))}</div>
                        <span class="rating-text">${place.rating} out of 5 stars</span>
                    </div>
                    <span class="total-reviews">(${place.user_ratings_total} reviews)</span>
                </div>
            </div>
    `;

    if (place.reviews && place.reviews.length > 0) {
        html += '<div class="reviews-list">';
        
        // Sort reviews by time (most recent first) if configured
        let sortedReviews = [...place.reviews];
        if (GOOGLE_PLACES_CONFIG.sortBy === 'recent') {
            sortedReviews.sort((a, b) => b.time - a.time);
        } else if (GOOGLE_PLACES_CONFIG.sortBy === 'rating') {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        }

        // Display reviews
        for (let i = 0; i < reviewsToShow; i++) {
            const review = sortedReviews[i];
            const reviewDate = new Date(review.time * 1000).toLocaleDateString();
            
            html += `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="${review.profile_photo_url}" alt="${review.author_name}" class="reviewer-photo">
                            <div class="reviewer-details">
                                <h5 class="reviewer-name">${review.author_name}</h5>
                                <span class="review-date">${reviewDate}</span>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        </div>
                    </div>
                    <div class="review-text">
                        <p>${review.text}</p>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
    }

    // Add write review button to the HTML
    html += `
        <div class="write-review-section">
            <a href="https://search.google.com/local/writereview?placeid=${GOOGLE_PLACES_CONFIG.placeId}" target="_blank" rel="noopener noreferrer" class="write-review-btn">
                Write a Review
            </a>
        </div>
    `;
    
    html += '</div>';
    container.innerHTML = html;
}

// Displays an error message when reviews cannot be loaded
function displayErrorMessage(container) {
    container.innerHTML = `
        <div class="reviews-error">
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Reviews Temporarily Unavailable</h4>
                <p>We're having trouble loading our Google reviews right now. Please check back later or contact us directly for references.</p>
                <div class="contact-fallback">
                    <a href="tel:+19707596008" class="error-cta-button">
                        <i class="fas fa-phone"></i> Call (970) 759-6008
                    </a>
                    <a href="https://search.google.com/local/writereview?placeid=${GOOGLE_PLACES_CONFIG.placeId}" target="_blank" rel="noopener noreferrer" class="write-review-btn">
                        Write a Review
                    </a>
                </div>
            </div>
        </div>
    `;
}
