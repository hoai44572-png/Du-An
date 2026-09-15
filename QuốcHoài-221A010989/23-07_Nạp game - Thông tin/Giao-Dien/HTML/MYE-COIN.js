/**
 * MYE-COIN.js
 * Tương tác cho trang MYE Coin:
 * - Chọn hình thức nạp (payment method)
 * - Chọn gói nạp (coin package)
 * - Mobile menu toggle (từ Header)
 */

function initMYECoinPage() {
  // ── 1. Mobile menu toggle (header fragment) ──────────────────
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu    = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // ── 2. Chọn hình thức nạp ────────────────────────────────────
  const paymentCards = document.querySelectorAll('.mc-payment__card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ── 3. Chọn gói nạp ──────────────────────────────────────────
  const packageCards = document.querySelectorAll('.mc-package__card');
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // ── 4. Nút MUA trong gói nạp ─────────────────────────────────
  const buyBtns = document.querySelectorAll('.mc-package__btn');
  buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Không kích hoạt click card cha
      const card     = btn.closest('.mc-package__card');
      const coinText = card.querySelector('.mc-package__coin')?.textContent || '';
      const price    = card.querySelector('.mc-package__price')?.textContent || '';
      // Mô phỏng hành động mua — có thể tích hợp API sau
      alert(`Bạn đã chọn: ${coinText}\nGiá: ${price}\n\n(Chức năng thanh toán sẽ được tích hợp sau)`);
    });
  });

  // ── 5. Scroll-to-top button ───────────────────────────────────
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
