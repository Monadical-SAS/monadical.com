document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Services JS loaded');

    // Get all filter buttons and content sections
    const filterButtons = document.querySelectorAll('.filter-btn');
    const contentSections = document.querySelectorAll('.content-section');

    console.log('Found filter buttons:', filterButtons.length);
    console.log('Found content sections:', contentSections.length);

    // Add click event listeners to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.getAttribute('data-type'));

            // Get the filter type from data attribute
            const filterType = this.getAttribute('data-type');

            // Remove active class from all buttons and add to clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));

            // Show the corresponding content section
            const targetSection = document.getElementById(filterType + '-section');
            console.log('Target section:', filterType + '-section', targetSection ? 'found' : 'not found');

            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});