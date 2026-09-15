/**
 * Header-Footer Loader
 * Tải và chèn Header / Footer vào trang từ các file fragment HTML riêng biệt.
 * Đồng thời inject các file CSS tương ứng vào <head>.
 */

/**
 * Inject một file CSS vào <head> nếu chưa tồn tại.
 * @param {string} href - Đường dẫn tới file CSS
 */
function injectCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return; // Tránh load trùng
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Tải một file HTML fragment và chèn nội dung vào phần tử chứa (placeholder).
 * @param {string} url - Đường dẫn tới file HTML fragment
 * @param {string} placeholderId - id của phần tử DOM sẽ nhận nội dung
 * @returns {Promise<void>}
 */
async function loadFragment(url, placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.warn(`[Header-Footer Loader] Không tìm thấy placeholder "#${placeholderId}"`);
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Không thể tải: ${url}`);
    }
    const html = await response.text();
    placeholder.outerHTML = html;
  } catch (err) {
    console.error(`[Header-Footer Loader] Lỗi khi tải fragment "${url}":`, err);
  }
}

/**
 * Khởi tạo: inject CSS, tải Header và Footer song song,
 * rồi khởi động logic trang (initNapGamePage).
 */
async function initHeaderFooter() {
  // Inject CSS của Header và Footer trước khi render
  injectCSS('Header-Footer/Header.css');
  injectCSS('Header-Footer/Footer.css');

  // Tải fragment song song để tăng tốc độ
  await Promise.all([
    loadFragment('Header-Footer/Header.html', 'header-placeholder'),
    loadFragment('Header-Footer/Footer.html', 'footer-placeholder'),
  ]);

  // Sau khi header/footer đã được inject vào DOM, khởi chạy logic trang
  if (typeof initNapGamePage === 'function') {
    initNapGamePage();
  }
}

// Chạy ngay khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', initHeaderFooter);
