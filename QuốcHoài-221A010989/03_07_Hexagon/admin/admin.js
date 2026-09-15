/**
 * Admin Panel & Page Builder JavaScript
 * Hexagon Corporation - Admin Demo
 */

// Helper to show custom premium toast notifications
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    
    // Icon definition
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle text-emerald-500 text-lg"></i>' 
        : '<i class="fas fa-exclamation-circle text-red-500 text-lg"></i>';

    toast.innerHTML = `
        ${icon}
        <div>
            <p class="font-semibold text-sm">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove toast after 3.5s
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-in reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Authentication Check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('admin/') || window.location.pathname.endsWith('admin');
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (isLoggedIn && isLoginPage) {
        window.location.href = 'dashboard.html';
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    showToast('Đăng xuất thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Initial Mock Data for Pages Manager
const defaultPages = [
    {
        id: "1",
        title: "Trang Chủ (Hexagon)",
        slug: "trang-chu",
        language: "VI",
        status: "Published",
        lastUpdated: "2026-07-08 00:00:00",
        animation: true,
        textColor: "#ffffff",
        bgType: "gradient",
        bgColor: "#1A6B49",
        bgGradientStart: "#0D5939",
        bgGradientEnd: "#1A6B49",
        bgGradientDir: "to-r",
        bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        bgOverlayColor: "#0D5939",
        bgOverlayOpacity: 0.85,
        btnEnabled: true,
        btnText: "Khám Phá Ngay",
        btnUrl: "#gioi-thieu",
        btnStyle: "gold"
    },
    {
        id: "2",
        title: "Home Page (Hexagon English)",
        slug: "home-en",
        language: "EN",
        status: "Draft",
        lastUpdated: "2026-07-07 18:30:00",
        animation: true,
        textColor: "#f3f4f6",
        bgType: "image-gradient",
        bgColor: "#111827",
        bgGradientStart: "#0D5939",
        bgGradientEnd: "#FFA800",
        bgGradientDir: "to-br",
        bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        bgOverlayColor: "#000000",
        bgOverlayOpacity: 0.7,
        btnEnabled: true,
        btnText: "Get Started",
        btnUrl: "#contact",
        btnStyle: "outline"
    },
    {
        id: "3",
        title: "Tuyển Dụng Kỳ H25",
        slug: "tuyen-dung-h25",
        language: "VI",
        status: "Published",
        lastUpdated: "2026-07-06 14:15:00",
        animation: false,
        textColor: "#111827",
        bgType: "color",
        bgColor: "#ffffff",
        bgGradientStart: "#ffffff",
        bgGradientEnd: "#e5e7eb",
        bgGradientDir: "to-b",
        bgImage: "",
        bgOverlayColor: "#000000",
        bgOverlayOpacity: 0.5,
        btnEnabled: false,
        btnText: "Nộp Hồ Sơ",
        btnUrl: "#apply",
        btnStyle: "green"
    }
];

// Load Pages from LocalStorage
function getPages() {
    let pages = localStorage.getItem('hexagon_pages');
    if (!pages) {
        localStorage.setItem('hexagon_pages', JSON.stringify(defaultPages));
        return defaultPages;
    }
    return JSON.parse(pages);
}

// Save Pages to LocalStorage
function savePages(pages) {
    localStorage.setItem('hexagon_pages', JSON.stringify(pages));
}

// Formatter for current datetime
function getFormattedDateTime() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Create new page
function createPage(title, slug, language, description) {
    const pages = getPages();
    const newId = String(pages.length > 0 ? Math.max(...pages.map(p => Number(p.id))) + 1 : 1);
    
    const newPage = {
        id: newId,
        title: title || "Trang Mới Chưa Đặt Tên",
        slug: slug || `trang-moi-${newId}`,
        language: language || "VI",
        status: "Draft",
        lastUpdated: getFormattedDateTime(),
        description: description || "",
        animation: true,
        textColor: "#ffffff",
        bgType: "gradient",
        bgColor: "#1A6B49",
        bgGradientStart: "#0D5939",
        bgGradientEnd: "#1A6B49",
        bgGradientDir: "to-r",
        bgImage: "",
        bgOverlayColor: "#000000",
        bgOverlayOpacity: 0.5,
        btnEnabled: true,
        btnText: "Xem Thêm",
        btnUrl: "#",
        btnStyle: "gold"
    };

    pages.push(newPage);
    savePages(pages);
    showToast('Tạo trang mới thành công!', 'success');
    return newPage;
}

// Delete page
function deletePage(id) {
    let pages = getPages();
    pages = pages.filter(p => p.id !== id);
    savePages(pages);
    showToast('Đã xóa trang thành công!', 'success');
}

// Duplicate Page & Translate (Vietnamese <-> English)
function duplicateAndTranslatePage(id) {
    const pages = getPages();
    const targetPage = pages.find(p => p.id === id);
    
    if (!targetPage) {
        showToast('Không tìm thấy trang để nhân bản!', 'error');
        return;
    }

    const newId = String(pages.length > 0 ? Math.max(...pages.map(p => Number(p.id))) + 1 : 1);
    const newLanguage = targetPage.language === 'VI' ? 'EN' : 'VI';
    
    const duplicatedPage = {
        ...targetPage,
        id: newId,
        title: `${targetPage.title} (Bản dịch)`,
        slug: `${targetPage.slug}-${newLanguage.toLowerCase()}`,
        language: newLanguage,
        status: "Draft",
        lastUpdated: getFormattedDateTime()
    };

    pages.push(duplicatedPage);
    savePages(pages);
    showToast(`Đã tạo bản dịch sang tiếng ${newLanguage === 'VI' ? 'Việt' : 'Anh'}!`, 'success');
    
    setTimeout(() => {
        window.location.href = `builder.html?pageId=${newId}`;
    }, 1500);
}

// Generate premium mock images selection list for builder
const mockImages = [
    { name: "Hexagon Main Office", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
    { name: "Technology Server", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" },
    { name: "Business Workspace", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80" },
    { name: "Abstract Digital Mesh", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80" }
];
