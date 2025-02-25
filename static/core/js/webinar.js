// Webinar form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submission intercepted');
    const form = event.target;
    const formData = new FormData(form);

    // Create data object from form
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send form data to server
    fetch('https://forms.monadical.com/submit/webinar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) throw new Error('Submission failed');
        // Continue with showing content regardless of server response
        showWebinarContent();
    })
    .catch(error => {
        console.error('Form submission error:', error);
        // Still show content even if server submission fails
        showWebinarContent();
    });
}

// Function to show webinar content
function showWebinarContent() {
    // Store access granted in localStorage
    localStorage.setItem('webinar_access_granted', 'true');

    // Show content immediately
    document.getElementById('webinar-form-section').style.display = 'none';
    document.getElementById('webinar-full-content').style.display = 'block';
}

// Countdown Timer
function updateCountdown(webinarDateStr, redirectUrl) {
    const webinarDate = new Date(webinarDateStr).getTime();
    const now = new Date().getTime();
    const distance = webinarDate - now;

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the countdown display
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;

    // Update the "minutes until start" message if within 60 minutes
    const totalMinutes = Math.ceil(distance / (1000 * 60));
    const countdownMinutes = document.getElementById("countdown-minutes");
    if (countdownMinutes && totalMinutes <= 60 && totalMinutes > 0) {
        countdownMinutes.textContent = `STARTING IN ${totalMinutes} MINUTES!`;
    } else if (countdownMinutes && totalMinutes <= 0) {
        // Redirect to the webinar URL when it starts
        window.location.href = redirectUrl;
    }

    if (distance < 0) {
        clearInterval(window.countdownTimer);
        const countdownEl = document.getElementById("countdown");
        if (countdownEl) countdownEl.style.display = "none";
    }
}

// Background image opacity control
function setOpacity() {
    const maxWidth = 1140;
    const width = $(window).width();
    $('#webinar-cube-left').css({
        opacity: (width < maxWidth) ? 0.1 : 0.6
    });
    $('#webinar-tentacle-right').css({
        opacity: (width < maxWidth) ? 0.1 : 0.6
    });
}

// Initialize everything on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get webinar container and its data attributes
    const webinarContent = document.getElementById('webinar-content');

    if (webinarContent) {
        const webinarDate = webinarContent.getAttribute('data-webinar-date');
        const redirectUrl = webinarContent.getAttribute('data-redirect-url');
        const isFutureWebinar = webinarContent.getAttribute('data-is-future-webinar') === 'true';

        // Initialize countdown timer if this is a future webinar
        if (isFutureWebinar && webinarDate) {
            updateCountdown(webinarDate, redirectUrl);
            window.countdownTimer = setInterval(() => updateCountdown(webinarDate, redirectUrl), 1000);
        }
    }

    // Check for webinar access in localStorage
    const hasAccess = localStorage.getItem('webinar_access_granted') === 'true';
    if (hasAccess) {
        const formSection = document.getElementById('webinar-form-section');
        const contentView = document.getElementById('webinar-full-content');
        if (formSection && contentView) {
            formSection.style.display = 'none';
            contentView.style.display = 'block';
        }
    }

    // Set up form submission handler
    const webinarForm = document.getElementById('webinarAccessForm');
    if (webinarForm) {
        webinarForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize opacity control if jQuery is available
    if (typeof $ !== 'undefined') {
        setOpacity();
        $(window).resize(setOpacity);
    }

    // Add debug logs to check if script loads
    console.log('Webinar script loaded');
});

// Export functions for use in inline scripts if needed
window.handleFormSubmit = handleFormSubmit;
window.updateCountdown = updateCountdown;
window.setOpacity = setOpacity;
window.showWebinarContent = showWebinarContent;