// =============================================================
// DEMO MODE — chỉ chạy khi NEXT_PUBLIC_DEMO_MODE=true
// Inject session admin giả vào localStorage để bypass login.
// Không ảnh hưởng production.
// =============================================================

const DEMO_USER_KEY = 'ika_user'
const DEMO_TOKEN_KEY = 'ika_token'

const DEMO_SESSION = {
  id: 'demo-admin-001',
  name: 'Demo Admin',
  email: 'admin@ika.vn',
  role: 'admin',
  phone: '0901234567',
  address: '123 Lê Lợi',
  city: 'Hồ Chí Minh',
}

const DEMO_TOKEN = 'demo-token-dev-only'

export function injectDemoSessionIfNeeded(): void {
  if (typeof window === 'undefined') return
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return

  // Chỉ inject nếu chưa có session thực
  const existing = localStorage.getItem(DEMO_USER_KEY)
  if (existing) {
    try {
      const parsed = JSON.parse(existing)
      // Nếu đã có session thực (không phải demo) thì giữ nguyên
      if (parsed.id !== DEMO_SESSION.id) return
    } catch {
      // parse lỗi → inject lại
    }
  }

  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_SESSION))
  localStorage.setItem(DEMO_TOKEN_KEY, DEMO_TOKEN)

  // Phát event để useSession() cập nhật ngay
  window.dispatchEvent(new Event('ika-auth-change'))
}
