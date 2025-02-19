(function() {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');
    const titles = [
        'Engineering',
        'Operations',
        'Sales',
        'Product',
        'Customer Support',
        'Finance',
        'Marketing'
    ];
    const images = {
        0: '/static/engineering.png',
        1: '/static/operations.png',
        2: '/static/sales.png',
        3: '/static/product.png',
        4: '/static/support.png',
        5: '/static/finance.png',
        6: '/static/marketing.png'
    };

    window.moveCarousel = function(direction) {
        currentIndex = (currentIndex + direction + items.length) % items.length;
        updateCarousel(currentIndex);
        resetAutoPlay();
    };

    function updateCarousel(index) {
        // Remove active class from all items and dots
        items.forEach(item => {
            item.classList.remove('active');
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Add active class to current item and dot
        items[index].classList.add('active');
        dots[index].classList.add('active');

        // Update title
        const titleElement = document.querySelector('.carousel-title');
        titleElement.innerHTML = `Unleash Your <span class="highlight">${titles[index]}</span> Team's Potential.`;

        // Update image with fade effect
        const imageElement = document.querySelector('.services-image');
        imageElement.style.opacity = '0';
        setTimeout(() => {
            imageElement.src = images[index];
            imageElement.style.opacity = '1';
        }, 300);
    }

    // Auto-play functionality
    let autoPlayInterval;

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            moveCarousel(1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Initialize carousel
    updateCarousel(currentIndex);
    startAutoPlay();

    // Pause auto-play when user interacts with navigation
    document.querySelectorAll('.nav-arrow, .carousel-dot').forEach(element => {
        element.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        element.addEventListener('mouseleave', startAutoPlay);
    });

    // Add click handlers for dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const newIndex = parseInt(dot.dataset.index);
            currentIndex = newIndex;
            updateCarousel(currentIndex);
            resetAutoPlay();
        });
    });
})();