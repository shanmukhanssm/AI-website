/* ============================================
   SEARCH RESULTS PAGE — Simple Veg/Non-Veg filter
   ============================================ */

let activeTag = '';

async function renderSearchPage(params) {
    try {
        const query = params.get('q') || '';
        activeTag = params.get('tag') || '';

        const results = await searchProducts(query, activeTag);
        const root = document.getElementById('app-root');

    root.innerHTML = `
        <div class="search-page">
            <!-- Filter Sidebar -->
            <aside class="filter-sidebar">
                <div class="filter-panel">
                    <div class="filter-title"><i data-lucide="sliders-horizontal" style="width:18px;height:18px;"></i> Filter</div>

                    <!-- Veg / Non-Veg Filter -->
                    <div class="filter-group">
                        <div class="filter-group-title">Type</div>
                        <label class="filter-option ${!activeTag ? 'active' : ''}" id="filter-all">
                            <input type="radio" name="tag" value="" ${!activeTag ? 'checked' : ''} onchange="applyTagFilter('')">
                            All Pickles
                        </label>
                        <label class="filter-option ${activeTag === 'veg' ? 'active' : ''}" id="filter-veg">
                            <input type="radio" name="tag" value="veg" ${activeTag === 'veg' ? 'checked' : ''} onchange="applyTagFilter('veg')">
                            Veg
                        </label>
                        <label class="filter-option ${activeTag === 'non-veg' ? 'active' : ''}" id="filter-non-veg">
                            <input type="radio" name="tag" value="non-veg" ${activeTag === 'non-veg' ? 'checked' : ''} onchange="applyTagFilter('non-veg')">
                            Non-Veg
                        </label>
                    </div>

                    <!-- Sort -->
                    <div class="filter-group">
                        <div class="filter-group-title">Sort By</div>
                        <label class="filter-option">
                            <input type="radio" name="sort" value="default" checked onchange="sortResults('default')">
                            Default
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="sort" value="low" onchange="sortResults('low')">
                            Price: Low to High
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="sort" value="high" onchange="sortResults('high')">
                            Price: High to Low
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="sort" value="rating" onchange="sortResults('rating')">
                            Highest Rated
                        </label>
                    </div>

                    <button class="btn btn-outline btn-sm w-full" onclick="clearFilters('${query}')" id="clear-filters-btn" style="width:100%; margin-top: 8px;">Clear Filters</button>
                </div>
            </aside>

            <!-- Results -->
            <div class="search-results">
                <div class="results-header">
                    <div>
                        <div class="search-container" style="max-width: 100%;">
                            <span class="search-icon"><i data-lucide="search"></i></span>
                            <input type="text" class="search-input" id="search-page-input" placeholder="Search pickles..." value="${query}" style="padding-right: 100px;">
                            <button class="search-btn" onclick="handlePageSearch()" id="search-page-btn">Search</button>
                        </div>
                        <p class="results-count mt-2">
                            Showing <strong>${results.length}</strong> result${results.length !== 1 ? 's' : ''}
                            ${query ? ` for "<strong>${query}</strong>"` : ''}
                            ${activeTag ? ` in <strong>${activeTag}</strong>` : ''}
                        </p>
                    </div>
                </div>

                ${results.length > 0 ? `
                    <div class="product-grid" id="results-grid">
                        ${results.map(p => renderProductCard(p)).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-icon"><i data-lucide="search-x"></i></div>
                        <h3>No pickles found</h3>
                        <p>Try a different search term or adjust your filters</p>
                        <button class="btn btn-primary mt-3" onclick="window.location.hash='#/'">Browse All Pickles</button>
                    </div>
                `}
            </div>
        </div>
    `;

    document.getElementById('search-page-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handlePageSearch();
    });

    if (window.lucide) lucide.createIcons();
} catch (error) {
    console.error('Error rendering search page:', error);
    // Show error message to user
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div class="empty-state" style="padding-top: 120px;">
            <div class="empty-icon"><i data-lucide="alert-triangle"></i></div>
            <h3>Something went wrong</h3>
            <p>We're having trouble loading the search results. Please try again later.</p>
            <button class="btn btn-primary mt-3" onclick="window.location.reload()">Reload Page</button>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}
}

function handlePageSearch() {
    const query = document.getElementById('search-page-input').value.trim();
    let hash = '#/search?';
    if (query) hash += `q=${encodeURIComponent(query)}&`;
    if (activeTag) hash += `tag=${encodeURIComponent(activeTag)}&`;
    window.location.hash = hash.slice(0, -1);
}

function applyTagFilter(tag) {
    const query = document.getElementById('search-page-input')?.value.trim() || '';
    activeTag = tag;
    let hash = '#/search?';
    if (query) hash += `q=${encodeURIComponent(query)}&`;
    if (activeTag) hash += `tag=${encodeURIComponent(activeTag)}&`;
    window.location.hash = hash.slice(0, -1);
}

function clearFilters(query) {
    activeTag = '';
    window.location.hash = query ? `#/search?q=${encodeURIComponent(query)}` : '#/search';
}

async function sortResults(sortType) {
    const grid = document.getElementById('results-grid');
    if (!grid) return;

    const query = document.getElementById('search-page-input')?.value.trim() || '';
    let results = await searchProducts(query, activeTag);

    if (sortType === 'low') results.sort((a, b) => a.price - b.price);
    else if (sortType === 'high') results.sort((a, b) => b.price - a.price);
    else if (sortType === 'rating') results.sort((a, b) => b.rating - a.rating);

    grid.innerHTML = results.map(p => renderProductCard(p)).join('');
}
