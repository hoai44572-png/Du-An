import React, { useState } from 'react';
import './Hoi-Vien.css';

function HoiVien() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('vi'); // 'vi' or 'en'

  // ===== TRANSLATIONS =====
  const t = {
    vi: {
      // Header
      clubName: 'CÂU LẠC BỘ DOANH NHÂN ĐỒNG THÁP',
      clubLocation: 'TẠI TP.HỒ CHÍ MINH',
      navHome: 'Trang chủ',
      navAbout: 'Giới thiệu',
      navMembers: 'Hội viên',
      navActivities: 'Hoạt động Ban',
      navNews: 'Tin tức & Sự kiện',
      navContact: 'Liên hệ',
      langVN: 'VN',
      langEN: 'EN',

      // Main Content
      pageTitle: 'HỘI VIÊN',
      contentTitle: 'Cộng đồng doanh nhân cùng phát triển',
      contentDesc1: 'Hội viên là lực lượng nòng cốt tạo nên sự kết nối, chia sẻ và phát triển trong cộng đồng doanh nghiệp Đồng Tháp.',
      contentDesc2: 'Việc tham gia hội viên mở ra cơ hội mở rộng mạng lưới, trao đổi kinh nghiệm, tiếp cận chương trình hỗ trợ và đồng hành trong các hoạt động xúc tiến thương mại.',
      benefitsTitle: 'Quyền lợi hội viên',
      benefit1: 'Tham gia các chương trình kết nối doanh nghiệp',
      benefit2: 'Tiếp cận hoạt động đào tạo và hội thảo chuyên đề',
      benefit3: 'Nhận thông tin thị trường và cơ hội hợp tác',
      benefit4: 'Tham gia các hoạt động cộng đồng doanh nhân',
      benefit5: 'Đồng hành cùng các chương trình phát triển địa phương',
      stat1: 'Hội viên',
      stat2: 'Đối tác',
      stat3: 'Sự kiện / năm',
      stat4: 'Nhóm kết nối',

      // Footer
      footerHeadquarters: 'TRỤ SỞ CHÍNH',
      footerLinks: 'LIÊN KẾT TRANG',
      footerOther: 'KHÁC',
      footerHome: 'Trang chủ',
      footerNews: 'Tin tức và sự kiện',
      footerAbout: 'Về chúng tôi',
      footerActivities: 'Các lĩnh vực hoạt động',
      footerMembers: 'Doanh nghiệp hội viên',
      footerRegister: 'Đăng kí',
      footerBan: 'Hoạt động Ban',
      footerCopyright: 'Copyright © 2026 CLB Doanh nhân Đồng Tháp tại TP.HCM. All rights reserved.',
    },
    en: {
      // Header
      clubName: 'DONG THAP BUSINESS CLUB',
      clubLocation: 'IN HO CHI MINH CITY',
      navHome: 'Home',
      navAbout: 'About',
      navMembers: 'Members',
      navActivities: 'Activities',
      navNews: 'News & Events',
      navContact: 'Contact',
      langVN: 'VN',
      langEN: 'EN',

      // Main Content
      pageTitle: 'MEMBERS',
      contentTitle: 'Entrepreneur community together developing',
      contentDesc1: 'Members are the core force creating connection, sharing and development in the Dong Thap business community.',
      contentDesc2: 'Joining as a member opens up opportunities to expand networks, exchange experiences, access support programs and accompany trade promotion activities.',
      benefitsTitle: 'Member benefits',
      benefit1: 'Participate in business networking programs',
      benefit2: 'Access training and workshop activities',
      benefit3: 'Receive market information and cooperation opportunities',
      benefit4: 'Participate in entrepreneur community activities',
      benefit5: 'Accompany local development programs',
      stat1: 'Members',
      stat2: 'Partners',
      stat3: 'Events / year',
      stat4: 'Connect groups',

      // Footer
      footerHeadquarters: 'HEADQUARTERS',
      footerLinks: 'PAGE LINKS',
      footerOther: 'OTHER',
      footerHome: 'Home',
      footerNews: 'News & Events',
      footerAbout: 'About us',
      footerActivities: 'Activities',
      footerMembers: 'Member Businesses',
      footerRegister: 'Register',
      footerBan: 'Committee Activities',
      footerCopyright: 'Copyright © 2026 Dong Thap Business Club in HCMC. All rights reserved.',
    }
  };

  const lang = t[language];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="font-primary bg-white text-[#333] pt-[80px]">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center h-[80px] bg-[#2465B3] border-b border-transparent transition-all duration-300">
        <div className="max-w-[1750px] mx-auto px-4 md:px-[85px] w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
            <img src="https://webdemo.hexagon.xyz/medias/logo 2.png" alt="Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col leading-tight gap-[8px]">
              <span className="font-bold block w-full text-[13px] text-white text-left">{lang.clubName}</span>
              <span className="font-bold block w-full text-[13px] text-white text-center">{lang.clubLocation}</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
            <a href="./Trang-Chu.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navHome}</a>
            <a href="./Gioi-Thieu.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navAbout}</a>
            <a href="./Hoi-Vien.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navMembers}</a>
            <a href="/" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navActivities}</a>
            <a href="#tin-tuc" onClick={(e) => { e.preventDefault(); scrollToSection('tin-tuc'); }} className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navNews}</a>
            <a href="#lien-he" onClick={(e) => { e.preventDefault(); scrollToSection('lien-he'); }} className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{lang.navContact}</a>
          </nav>

          <div className="hidden md:block">
            <div 
              className="lang-toggle flex items-center bg-gradient-to-b from-[#CBA359] via-[#FAF390] via-[#FBC944] to-[#FCAF14] rounded-[50px] p-[3px] gap-[2px] flex-shrink-0 cursor-pointer hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-105 transition-all"
              onClick={toggleLanguage}
            >
              <span 
                className={`text-[12px] font-bold cursor-pointer tracking-[0.06em] leading-none flex items-center justify-center w-[28px] h-[28px] rounded-full flex-shrink-0 transition-all ${language === 'vi' ? 'bg-[#5a3200] text-[#c8860a]' : 'bg-transparent text-[#7a4e00]'}`}
              >
                {lang.langVN}
              </span>
              <span 
                className={`text-[12px] font-bold cursor-pointer tracking-[0.04em] leading-none pl-[2px] transition-all ${language === 'en' ? 'text-[#c8860a]' : 'text-[#7a4e00]'}`}
              >
                {lang.langEN}
              </span>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden fixed top-20 left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-40 transition-all`}>
          <div className="py-4">
            <a href="/" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navHome}</a>
            <a href="/gioi-thieu" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navAbout}</a>
            <a href="/hoi-vien" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navMembers}</a>
            <a href="/" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navActivities}</a>
            <a href="#tin-tuc" onClick={(e) => { e.preventDefault(); scrollToSection('tin-tuc'); }} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navNews}</a>
            <a href="#lien-he" onClick={(e) => { e.preventDefault(); scrollToSection('lien-he'); }} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{lang.navContact}</a>
            <div className="flex justify-center px-6 pt-4 mt-2 pb-2 border-t border-gray-100">
              <div 
                className="lang-toggle flex items-center bg-gradient-to-b from-[#CBA359] via-[#FAF390] via-[#FBC944] to-[#FCAF14] rounded-[50px] p-[3px] gap-[2px] flex-shrink-0 cursor-pointer hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-105 transition-all"
                onClick={toggleLanguage}
              >
                <span 
                  className={`text-[12px] font-bold cursor-pointer tracking-[0.06em] leading-none flex items-center justify-center w-[28px] h-[28px] rounded-full flex-shrink-0 transition-all ${language === 'vi' ? 'bg-[#5a3200] text-[#c8860a]' : 'bg-transparent text-[#7a4e00]'}`}
                >
                  {lang.langVN}
                </span>
                <span 
                  className={`text-[12px] font-bold cursor-pointer tracking-[0.04em] leading-none pl-[2px] transition-all ${language === 'en' ? 'text-[#c8860a]' : 'text-[#7a4e00]'}`}
                >
                  {lang.langEN}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <section className="member-section max-w-[1100px] mx-auto px-5 py-[60px]">
        <div className="section-header text-center mb-[50px]">
          <h1 className="text-[38px] text-[#0F5B94] mb-2.5 max-md:text-[30px]">{lang.pageTitle}</h1>
          <div className="divider w-[90px] h-1 bg-[#F7931E] mx-auto rounded-[30px]"></div>
        </div>

        <div className="member-wrapper grid grid-cols-1 md:grid-cols-2 gap-[50px] items-center">
          <div className="member-image">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Hội viên"
              className="w-full rounded-[16px] object-cover shadow-[0_12px_30px_rgba(0,0,0,.12)]"
            />
          </div>

          <div className="member-content">
            <h2 className="text-[28px] text-[#0F5B94] mb-5">{lang.contentTitle}</h2>

            <p className="mb-[18px] text-[#555]">
              {lang.contentDesc1}
            </p>

            <p className="mb-[18px] text-[#555]">
              {lang.contentDesc2}
            </p>

            <div className="benefits mt-[25px] bg-[#F7F9FC] p-6 rounded-[14px]">
              <h3 className="text-[#0F5B94] mb-[18px]">{lang.benefitsTitle}</h3>
              <ul className="list-none">
                <li className="py-2.5 border-b border-[#eee] last:border-none before:content-['✓'] before:text-[#F7931E] before:font-bold before:mr-2.5">{lang.benefit1}</li>
                <li className="py-2.5 border-b border-[#eee] last:border-none before:content-['✓'] before:text-[#F7931E] before:font-bold before:mr-2.5">{lang.benefit2}</li>
                <li className="py-2.5 border-b border-[#eee] last:border-none before:content-['✓'] before:text-[#F7931E] before:font-bold before:mr-2.5">{lang.benefit3}</li>
                <li className="py-2.5 border-b border-[#eee] last:border-none before:content-['✓'] before:text-[#F7931E] before:font-bold before:mr-2.5">{lang.benefit4}</li>
                <li className="py-2.5 border-b border-[#eee] last:border-none before:content-['✓'] before:text-[#F7931E] before:font-bold before:mr-2.5">{lang.benefit5}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="member-stats mt-[60px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="stat bg-white rounded-[14px] p-7 text-center shadow-[0_5px_20px_rgba(0,0,0,.08)]">
            <h3 className="text-[34px] text-[#0F5B94] mb-2">800+</h3>
            <span className="text-[#666]">{lang.stat1}</span>
          </div>

          <div className="stat bg-white rounded-[14px] p-7 text-center shadow-[0_5px_20px_rgba(0,0,0,.08)]">
            <h3 className="text-[34px] text-[#0F5B94] mb-2">120+</h3>
            <span className="text-[#666]">{lang.stat2}</span>
          </div>

          <div className="stat bg-white rounded-[14px] p-7 text-center shadow-[0_5px_20px_rgba(0,0,0,.08)]">
            <h3 className="text-[34px] text-[#0F5B94] mb-2">40+</h3>
            <span className="text-[#666]">{lang.stat3}</span>
          </div>

          <div className="stat bg-white rounded-[14px] p-7 text-center shadow-[0_5px_20px_rgba(0,0,0,.08)]">
            <h3 className="text-[34px] text-[#0F5B94] mb-2">12</h3>
            <span className="text-[#666]">{lang.stat4}</span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gradient-to-b from-[#e8b4f8] via-[#c9b8f5] via-[#8b9ef0] to-[#6a7be8] text-white relative overflow-hidden">
        <div className="relative z-[2] w-[1300px] max-w-[90%] mx-auto pt-20 pb-10">
          {/* Grid 3 cột */}
          <div id="footer-main-grid" className="grid grid-cols-1 md:grid-cols-[40%_30%_30%] gap-[50px] pb-10 max-md:grid-cols-1 max-md:gap-[30px]">
            {/* Cột 1: Trụ sở chính */}
            <div>
              <div className="flex items-center gap-[14px] mb-6">
                <img src="https://webdemo.hexagon.xyz/medias/logo 2.png" alt="Logo CLB" className="h-[60px] w-auto object-contain flex-shrink-0" />
                <div className="flex flex-col leading-[1.3]">
                  <span className="text-white text-[15px] font-extrabold tracking-[0.02em]">{lang.clubName}</span>
                  <span className="text-[#FFD700] text-[13px] font-semibold">{lang.clubLocation}</span>
                </div>
              </div>

              <h4 className="text-[14px] font-bold text-[#FFD700] mb-3 tracking-[0.02em]">{lang.footerHeadquarters}</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                <li className="flex gap-2.5 text-[13px] text-white leading-[1.5]">
                  <span className="text-[#FFD700] flex-shrink-0">☑️</span>
                  <span>Phòng Đồng Tháp, HungHau Campus, Trường Đại học Văn Hiến, Đại lộ Nguyễn Văn Linh, Khu đô thị Nam Thành Phố, Thành phố Hồ Chí Minh</span>
                </li>
                <li className="flex gap-2.5 text-[13px] text-white">
                  <span className="text-[#FFD700] flex-shrink-0">☑️</span>
                  <span>Email: <a href="mailto:info@dte.hunghau.vn" className="text-white no-underline hover:text-[#FFD700] transition-colors">info@dte.hunghau.vn</a></span>
                </li>
                <li className="flex gap-2.5 text-[13px] text-white">
                  <span className="text-[#FFD700] flex-shrink-0">☑️</span>
                  <span>Hotline: <a href="tel:18001568" className="text-white no-underline hover:text-[#FFD700] transition-colors">1800 1568</a></span>
                </li>
              </ul>
            </div>

            {/* Cột 2: Liên kết trang */}
            <div>
              <h4 className="text-[14px] font-bold text-[#FFD700] mb-4 tracking-[0.02em] relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#FFD700] after:rounded-[2px]">
                {lang.footerLinks}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-2 gap-x-5">
                <li><a href="/" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerHome}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerNews}</a></li>
                <li><a href="/gioi-thieu" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerAbout}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerActivities}</a></li>
                <li><a href="/hoi-vien" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerMembers}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerRegister}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{lang.footerBan}</a></li>
              </ul>
            </div>

            {/* Cột 3: Khác */}
            <div>
              <h4 className="text-[14px] font-bold text-[#FFD700] mb-4 tracking-[0.02em] relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#FFD700] after:rounded-[2px]">
                {lang.footerOther}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-3 gap-2 gap-x-3">
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">MYH</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">MYC</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHF</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHE</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHA</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">COWE</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HNN</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HYY</a></li>
              </ul>
            </div>
          </div>

          {/* Divider + Copyright + Social Icons */}
          <hr className="border-t border-white/30 my-0" />
          <div id="footer-bottom-line" className="flex flex-col sm:flex-row justify-between items-center gap-4 py-5 max-sm:text-center">
            <p className="text-[12px] text-white/70 m-0">{lang.footerCopyright}</p>

            {/* Social Icons */}
            <div className="social-icons flex items-center gap-4 max-sm:justify-center">
              <a href="#" target="_blank" className="social-icon inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 text-white no-underline hover:bg-[#1877F2] hover:-translate-y-1 hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" target="_blank" className="social-icon inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 text-white no-underline hover:bg-[#FF0000] hover:-translate-y-1 hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" target="_blank" className="social-icon inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 text-white no-underline hover:bg-black hover:-translate-y-1 hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a href="#" target="_blank" className="social-icon inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 text-white no-underline hover:bg-[#0A66C2] hover:-translate-y-1 hover:scale-110 transition-all">
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

export default HoiVien;