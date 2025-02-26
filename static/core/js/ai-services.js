// AI Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animation for cards on scroll
    function animateOnScroll() {
        const cards = document.querySelectorAll('.service-card, .expertise-card, .article-card');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (cardTop < windowHeight - 100) {
                card.classList.add('animated');
            }
        });
    }

    // Initial check on page load
    animateOnScroll();

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
});