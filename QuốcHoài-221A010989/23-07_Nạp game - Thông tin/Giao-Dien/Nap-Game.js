/**
 * Nap-Game.js
 * Chứa toàn bộ logic tương tác của trang Nạp Game.
 * Hàm initNapGamePage() được gọi bởi Header-Footer.js sau khi
 * Header và Footer đã được inject vào DOM.
 */

function initNapGamePage() {
  // Mobile Menu Toggle (phần tử trong Header.html)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Real-time Game Search Filter
  const searchInput = document.getElementById('game-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const gameCards = document.querySelectorAll('.game-card-item');
  const noResultsMsg = document.getElementById('no-results-message');

  function filterGames() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';

    let visibleCount = 0;

    gameCards.forEach(card => {
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || '';
      const tag = card.getAttribute('data-tag')?.toLowerCase() || '';

      const matchesSearch = title.includes(query);
      const matchesCategory =
        activeCategory === 'all' ||
        category.includes(activeCategory) ||
        tag.includes(activeCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.remove('hidden');
      } else {
        noResultsMsg.classList.add('hidden');
      }
    }

    if (clearSearchBtn) {
      if (query.length > 0) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterGames);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterGames();
        searchInput.focus();
      }
    });
  }

  // Category Tabs Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterGames();
    });
  });

  // Pagination Active Toggles
  const pageBtns = document.querySelectorAll('.page-btn:not([disabled])');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('page-num')) {
        pageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Smooth scroll back to top button
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
