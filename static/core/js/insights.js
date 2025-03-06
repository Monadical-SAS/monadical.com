document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articlesGrid = document.getElementById('articles-grid');

    // Initial setup
    const hiddenPosts = Array.from(document.querySelectorAll('.insight-card.hidden'));
    const postsPerPage = parseInt(loadMoreBtn?.dataset.postsPerPage || 20);
    const totalPosts = parseInt(loadMoreBtn?.dataset.totalPosts || 0);
    let currentPage = parseInt(loadMoreBtn?.dataset.currentPage || 1);
    let activeFilters = new Set(['article']);

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.type;
            for (const item of filterBtns) {
                item.classList.remove('active');
            }
            this.classList.toggle('active')
            activeFilters.clear()
            activeFilters.add(filterType)   
            // Apply filters and reset pagination
            currentPage = 1;
            if (loadMoreBtn) {
                loadMoreBtn.dataset.currentPage = currentPage;
            }
            applyFilters();
        });
    });

    function applyFilters() {
        const allCards = document.querySelectorAll('.insight-card');

        // First pass: determine which cards should be visible based on filters
        allCards.forEach(card => {
            const cardType = card.dataset.type.trim();
            const shouldShow = activeFilters.has(cardType);

            if (shouldShow) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Second pass: apply pagination to visible cards
        const visibleCards = Array.from(allCards).filter(card =>
            card.style.display !== 'none'
        );

        visibleCards.forEach((card, index) => {
            if (index < currentPage * postsPerPage) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            if (visibleCards.length > currentPage * postsPerPage) {
                loadMoreBtn.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    }

    applyFilters();

    // Load More functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.textContent = 'LOADING...';

            try {
                currentPage++;
                loadMoreBtn.dataset.currentPage = currentPage;
                applyFilters();
            } catch (error) {
                console.error('Error showing more posts:', error);
                loadMoreBtn.textContent = 'ERROR - TRY AGAIN';
            } finally {
                loadMoreBtn.classList.remove('loading');
                loadMoreBtn.textContent = 'LOAD MORE';
            }
        });
    }
});