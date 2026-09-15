import React, { useState, useEffect } from 'react';
import './Gioi-Thieu.css';

// Translation data
const translations = {
  vi: {
    'club-name': 'CÂU LẠC BỘ DOANH NHÂN ĐỒNG THÁP',
    'club-location': 'TẠI TP.HỒ CHÍ MINH',
    'nav-home': 'Trang chủ',
    'nav-about': 'Giới thiệu',
    'nav-members': 'Hội viên',
    'nav-activities': 'Hoạt động Ban',
    'nav-news': 'Tin tức & Sự kiện',
    'nav-contact': 'Liên hệ',
    'page-title': 'GIỚI THIỆU DOANH NHÂN ĐỒNG THÁP',
    'sub-title': 'Kết nối – Đồng hành – Phát triển',
    'desc-1': 'Cộng đồng Doanh nhân Đồng Tháp hướng đến việc xây dựng môi trường kết nối giữa các doanh nghiệp, thúc đẩy hợp tác và tạo ra nhiều giá trị bền vững cho địa phương.',
    'desc-2': 'Với tinh thần đổi mới, sáng tạo và phát triển lâu dài, cộng đồng doanh nhân luôn đóng vai trò quan trọng trong việc thúc đẩy kinh tế, hỗ trợ khởi nghiệp và nâng cao năng lực cạnh tranh.',
    'vision-label': 'Tầm nhìn:',
    'vision-text': 'Xây dựng mạng lưới doanh nhân năng động, hiện đại và hội nhập.',
    'mission-label': 'Sứ mệnh:',
    'mission-text': 'Kết nối doanh nghiệp – chia sẻ tri thức – tạo giá trị phát triển bền vững.',
    'stat-1': 'Doanh nghiệp tham gia',
    'stat-2': 'Sự kiện kết nối mỗi năm',
    'stat-3': 'Hướng đến phát triển bền vững',
    'footer-club-name': 'CÂU LẠC BỘ DOANH NHÂN ĐỒNG THÁP',
    'footer-club-location': 'TẠI TP. HỒ CHÍ MINH',
    'footer-headquarters': 'TRỤ SỞ CHÍNH',
    'footer-address': 'Phòng Đồng Tháp, HungHau Campus, Trường Đại học Văn Hiến, Đại lộ Nguyễn Văn Linh, Khu đô thị Nam Thành Phố, Thành phố Hồ Chí Minh',
    'footer-hotline': 'Hotline: 1800 1568',
    'footer-links': 'LIÊN KẾT TRANG',
    'footer-link-home': 'Trang chủ',
    'footer-link-news': 'Tin tức và sự kiện',
    'footer-link-about': 'Về chúng tôi',
    'footer-link-activities': 'Các lĩnh vực hoạt động',
    'footer-link-members': 'Doanh nghiệp hội viên',
    'footer-link-register': 'Đăng kí',
    'footer-link-board': 'Hoạt động Ban',
    'footer-other': 'KHÁC',
    'footer-copyright': 'Copyright © 2026 CLB Doanh nhân Đồng Tháp tại TP.HCM. All rights reserved.'
  },
  en: {
    'club-name': 'DONG THAP BUSINESS CLUB',
    'club-location': 'IN HO CHI MINH CITY',
    'nav-home': 'Home',
    'nav-about': 'About',
    'nav-members': 'Members',
    'nav-activities': 'Board Activities',
    'nav-news': 'News & Events',
    'nav-contact': 'Contact',
    'page-title': 'INTRODUCTION TO DONG THAP BUSINESS',
    'sub-title': 'Connect – Accompany – Develop',
    'desc-1': 'The Dong Thap Business Community aims to build a connecting environment between businesses, promote cooperation and create sustainable values for the locality.',
    'desc-2': 'With a spirit of innovation, creativity and long-term development, the business community always plays an important role in promoting the economy, supporting startups and improving competitiveness.',
    'vision-label': 'Vision:',
    'vision-text': 'Building a dynamic, modern and integrated business network.',
    'mission-label': 'Mission:',
    'mission-text': 'Connecting businesses – sharing knowledge – creating sustainable development values.',
    'stat-1': 'Businesses participating',
    'stat-2': 'Networking events per year',
    'stat-3': 'Towards sustainable development',
    'footer-club-name': 'DONG THAP BUSINESS CLUB',
    'footer-club-location': 'IN HO CHI MINH CITY',
    'footer-headquarters': 'HEADQUARTERS',
    'footer-address': 'Dong Thap Room, HungHau Campus, Van Hien University, Nguyen Van Linh Boulevard, South City Urban Area, Ho Chi Minh City',
    'footer-hotline': 'Hotline: 1800 1568',
    'footer-links': 'PAGE LINKS',
    'footer-link-home': 'Home',
    'footer-link-news': 'News & Events',
    'footer-link-about': 'About Us',
    'footer-link-activities': 'Activity Areas',
    'footer-link-members': 'Member Businesses',
    'footer-link-register': 'Register',
    'footer-link-board': 'Board Activities',
    'footer-other': 'OTHER',
    'footer-copyright': 'Copyright © 2026 Dong Thap Business Club in HCMC. All rights reserved.'
  }
};

function App() {
  const [currentLang, setCurrentLang] = useState('vi');

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = translations[currentLang];

  const handleLangToggle = (lang) => {
    setCurrentLang(lang);
  };

  return (
    <div className="App">
      {/* ===== HEADER ===== */}
      <header 
        className="fixed top-0 left-0 w-full z-50 flex items-center"
        style={{ height: '80px', background: '#2465B3' }}
      >
        <div className="max-w-[1750px] mx-auto px-4 md:px-[85px] w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
            <img 
              src="https://webdemo.hexagon.xyz/medias/logo 2.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain" 
            />
            <div className="flex flex-col leading-tight" style={{ gap: '8px' }}>
              <span 
                className="font-bold block w-full" 
                style={{ fontSize: '13px', color: '#ffffff', textAlign: 'left' }}
              >
                {t['club-name']}
              </span>
              <span 
                className="font-bold block w-full" 
                style={{ fontSize: '13px', color: '#ffffff', textAlign: 'center' }}
              >
                {t['club-location']}
              </span>
            </div>
          </a>

          <nav className="desktop-nav hidden md:flex items-center justify-center flex-1" style={{ gap: '32px' }}>
            <div className="relative group">
              <a href="./Trang-Chu.jsx" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-home']}
              </a>
            </div>
            <div className="relative group">
              <a href="./Gioi-Thieu.jsx" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-about']}
              </a>
            </div>
            <div className="relative group">
              <a href="./Hoi-Vien.jsx" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-members']}
              </a>
            </div>
            <div className="relative group">
              <a href="/" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-activities']}
              </a>
            </div>
            <div className="relative group">
              <a href="#tin-tuc" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-news']}
              </a>
            </div>
            <div className="relative group">
              <a href="#lien-he" className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap" style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}>
                {t['nav-contact']}
              </a>
            </div>
          </nav>

          {/* Desktop Language Toggle */}
          <div className="hidden md:block">
            <div 
              className="lang-toggle" 
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(180deg, #CBA359 0%, #FAF390 18%, #FBC944 65%, #FCAF14 94%)',
                borderRadius: '50px',
                padding: '3px 5px',
                gap: '2px',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'box-shadow 0.3s, filter 0.3s'
              }}
            >
              <span 
                role="button" 
                tabIndex="0" 
                title="Tiếng Việt" 
                onClick={() => handleLangToggle('vi')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: currentLang === 'vi' ? '#5a3200' : 'transparent',
                  color: currentLang === 'vi' ? '#ffffff' : '#c8860a'
                }}
              >
                VN
              </span>
              <span 
                role="button" 
                tabIndex="0" 
                title="English" 
                onClick={() => handleLangToggle('en')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  paddingLeft: '2px',
                  background: currentLang === 'en' ? '#5a3200' : 'transparent',
                  color: currentLang === 'en' ? '#ffffff' : '#7a4e00',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                EN
              </span>
            </div>
          </div>

          {/* Mobile Language Toggle */}
          <div className="mobile-lang-toggle md:hidden">
            <div 
              className="lang-toggle" 
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(180deg, #CBA359 0%, #FAF390 18%, #FBC944 65%, #FCAF14 94%)',
                borderRadius: '50px',
                padding: '3px 5px',
                gap: '2px',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'box-shadow 0.3s, filter 0.3s'
              }}
            >
              <span 
                role="button" 
                tabIndex="0" 
                title="Tiếng Việt" 
                onClick={() => handleLangToggle('vi')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: currentLang === 'vi' ? '#5a3200' : 'transparent',
                  color: currentLang === 'vi' ? '#ffffff' : '#c8860a'
                }}
              >
                VN
              </span>
              <span 
                role="button" 
                tabIndex="0" 
                title="English" 
                onClick={() => handleLangToggle('en')}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  paddingLeft: '2px',
                  background: currentLang === 'en' ? '#5a3200' : 'transparent',
                  color: currentLang === 'en' ? '#ffffff' : '#7a4e00',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                EN
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <section className="intro-section">
        <div className="section-title">
          <h1>{t['page-title']}</h1>
          <div className="line"></div>
        </div>

        <div className="content">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
            alt="Doanh nhân Đồng Tháp"
          />

          <div className="text">
            <h2>{t['sub-title']}</h2>

            <p>{t['desc-1']}</p>

            <p>{t['desc-2']}</p>

            <div className="highlight">
              <strong>{t['vision-label']}</strong>
              <span>{t['vision-text']}</span>
              <br /><br />

              <strong>{t['mission-label']}</strong>
              <span>{t['mission-text']}</span>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="card">
            <h3>500+</h3>
            <p>{t['stat-1']}</p>
          </div>

          <div className="card">
            <h3>50+</h3>
            <p>{t['stat-2']}</p>
          </div>

          <div className="card">
            <h3>100%</h3>
            <p>{t['stat-3']}</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'linear-gradient(180deg, #e8b4f8 0%, #c9b8f5 25%, #8b9ef0 60%, #6a7be8 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '1300px',
          maxWidth: '90%',
          margin: '0 auto',
          paddingTop: '80px',
          paddingBottom: '40px'
        }}>
          {/* Grid 3 cột */}
          <div id="footer-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: '40% 30% 30%',
            gap: '50px',
            paddingBottom: '40px'
          }}>
            {/* Cột 1: Trụ sở chính */}
            <div>
              {/* Logo + Tên CLB */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <img 
                  src="https://webdemo.hexagon.xyz/medias/logo 2.png" 
                  alt="Logo CLB" 
                  style={{ height: '60px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                  <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 800, letterSpacing: '0.02em' }}>
                    {t['footer-club-name']}
                  </span>
                  <span style={{ color: '#FFD700', fontSize: '13px', fontWeight: 600 }}>
                    {t['footer-club-location']}
                  </span>
                </div>
              </div>

              {/* Trụ sở chính */}
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFD700', marginBottom: '12px', letterSpacing: '0.02em' }}>
                {t['footer-headquarters']}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF', lineHeight: 1.5 }}>
                  <span style={{ color: '#FFD700', flexShrink: 0 }}>☑️</span>
                  <span>{t['footer-address']}</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF' }}>
                  <span style={{ color: '#FFD700', flexShrink: 0 }}>☑️</span>
                  <span>
                    Email: <a href="mailto:info@dte.hunghau.vn" style={{ color: '#FFFFFF', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseOver={(e) => e.target.style.color = '#FFD700'}
                      onMouseOut={(e) => e.target.style.color = '#FFFFFF'}
                    >
                      info@dte.hunghau.vn
                    </a>
                  </span>
                </li>
                <li style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#FFFFFF' }}>
                  <span style={{ color: '#FFD700', flexShrink: 0 }}>☑️</span>
                  <span>
                    Hotline: <a href="tel:18001568" style={{ color: '#FFFFFF', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseOver={(e) => e.target.style.color = '#FFD700'}
                      onMouseOut={(e) => e.target.style.color = '#FFFFFF'}
                    >
                      1800 1568
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            {/* Cột 2: Liên kết trang */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFD700',
                marginBottom: '16px',
                letterSpacing: '0.02em',
                position: 'relative',
                paddingBottom: '10px'
              }}>
                {t['footer-links']}
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: '#FFD700', borderRadius: '2px' }}></span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
                <li><a href="/" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-home']}</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-news']}</a></li>
                <li><a href="/gioi-thieu" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-about']}</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-activities']}</a></li>
                <li><a href="/hoi-vien" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-members']}</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-register']}</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>{t['footer-link-board']}</a></li>
              </ul>
            </div>

            {/* Cột 3: Khác */}
            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFD700',
                marginBottom: '16px',
                letterSpacing: '0.02em',
                position: 'relative',
                paddingBottom: '10px'
              }}>
                {t['footer-other']}
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: '#FFD700', borderRadius: '2px' }}></span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 12px' }}>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>MYH</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>MYC</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>HHF</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>HHE</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>HHA</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>COWE</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>HNN</a></li>
                <li><a href="#" className="footer-link" style={{ textDecoration: 'none', fontSize: '13px', color: '#FFFFFF', transition: 'all 0.3s' }}>HYY</a></li>
              </ul>
            </div>
          </div>

          {/* Divider + Copyright + Social Icons */}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.3)', margin: 0 }} />
          <div id="footer-bottom-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px 0' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              {t['footer-copyright']}
            </p>

            {/* Social Icons */}
            <div className="social-icons" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Facebook */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#1877F2'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#0A66C2'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;