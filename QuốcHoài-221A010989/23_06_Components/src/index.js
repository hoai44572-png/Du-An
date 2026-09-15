import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './Trang-Chu.css';

function index() {

  // ===== STATE =====
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [language, setLanguage] = useState('vi'); // 'vi' or 'en'
  const autoplayRef = useRef(null);

  // ===== TRANSLATIONS =====
  const translations = {
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

      // Hero
      heroTagline: 'Lan tỏa giá trị đất',
      heroTitle: 'Sen Hồng',
      heroDesc: 'CLB Doanh nhân Đồng Tháp tại TPHCM quy tụ những người con quê hương Đất Sen Hồng. Với tinh thần Hợp tác - Đổi mới - Phát triển, CLB đóng vai trò là cầu nối chiến lược, hợp tác, thúc đẩy giá trị kinh doanh và lan toả sẻ chia nghĩa tình quê hương.',
      heroBtn: 'Tham gia cộng đồng',

      // Logo Section
      logoTitle: 'HỘI VIÊN CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH',

      // About
      aboutTitle: 'VỀ CÂU LẠC BỘ',
      aboutDesc: 'CLB Doanh nhân Đồng Tháp tại TP.HCM là nơi hội tụ các doanh nghiệp, nhà quản lý và cá nhân khởi nghiệp trên địa bàn tỉnh. Với tinh thần kết nối – đồng hành – sẻ chia, CLB đóng vai trò thúc đẩy giá trị kinh doanh trong bối cảnh hội nhập và chuyển đổi số.',
      orgTitle: 'CƠ CẤU TỔ CHỨC',
      orgName: 'Họ tên',
      orgRole: 'Chức vụ CLB',
      orgCompanyRole: 'Chức vụ Doanh nghiệp',
      orgCompany: 'Doanh nghiệp',

      // Teams
      teamsTitle: 'CÁC BAN CHUYÊN MÔN',
      teamsSubtitle: 'CLB DOANH NHÂN ĐỒNG THÁP TẠI TP. HỒ CHÍ MINH',
      team1: 'Ban Kinh tế - Đầu tư',
      team2: 'Ban Văn hóa - Thể thao',
      team3: 'Ban Xã hội - Cộng đồng',
      team4: 'Ban Khởi nghiệp',
      team5: 'Ban Giao thương quốc tế',
      teamView: 'Xem hoạt động',

      // Stats
      statsTitle: 'HÀNH TRÌNH KIẾN TẠO & GẮN KẾT GIÁ TRỊ',
      stats1: 'Hội viên là các doanh nghiệp và doanh nhân tiêu biểu tại TP.HCM',
      stats2: 'Năm hình thành và phát triển mạng lưới kết nối đồng hương',
      stats3: 'Cơ hội giao thương và kết nối đầu tư được khởi tạo mỗi năm',
      stats4: 'Chương trình thiện nguyện và hoạt động hướng về quê hương',

      // News
      newsTitle: 'TIN TỨC & SỰ KIỆN',
      newsViewMore: 'Xem thêm',
      newsBadge: 'Mới nhất',
      newsReadMore: 'Xem thêm',

      // Values
      valuesTitle: 'GIÁ TRỊ KHI THAM GIA CỘNG ĐỒNG',
      valuesViewMore: 'Xem thêm',
      values1Title: 'Kết nối chất lượng',
      values1Desc: 'Tiếp cận mạng lưới doanh nhân uy tín, mở rộng cơ hội hợp tác thực tế.',
      values2Title: 'Phát triển kiến thức',
      values2Desc: 'Cập nhật xu hướng, nâng cao tư duy quản trị và kỹ năng kinh doanh.',
      values3Title: 'Cơ hội hợp tác',
      values3Desc: 'Tham gia các dự án, hoạt động kết nối và xúc tiến thương mại.',

      // Contact
      contactTitle: 'QUAN TÂM VÀ HỢP TÁC VỚI CÁC CHƯƠNG TRÌNH HOẠT ĐỘNG CỦA CLB DOANH NHÂN ĐỒNG THÁP TẠI TP.HCM',
      contactRegister: 'Đăng ký hội viên',

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

      // Hero
      heroTagline: 'Spreading the values of',
      heroTitle: 'Lotus Land',
      heroDesc: 'The Dong Thap Business Club in HCMC gathers sons and daughters of the Lotus Land homeland. With the spirit of Cooperation - Innovation - Development, the club serves as a strategic bridge, promoting business values and spreading the spirit of sharing for the homeland.',
      heroBtn: 'Join the community',

      // Logo Section
      logoTitle: 'MEMBERS OF DONG THAP BUSINESS CLUB IN HO CHI MINH CITY',

      // About
      aboutTitle: 'ABOUT THE CLUB',
      aboutDesc: 'The Dong Thap Business Club in HCMC is where businesses, managers and start-up individuals in the province gather. With the spirit of connection - companionship - sharing, the club plays a role in promoting business values in the context of integration and digital transformation.',
      orgTitle: 'ORGANIZATIONAL STRUCTURE',
      orgName: 'Full name',
      orgRole: 'Club Position',
      orgCompanyRole: 'Company Position',
      orgCompany: 'Company',

      // Teams
      teamsTitle: 'SPECIALIZED COMMITTEES',
      teamsSubtitle: 'DONG THAP BUSINESS CLUB IN HO CHI MINH CITY',
      team1: 'Economics & Investment',
      team2: 'Culture & Sports',
      team3: 'Social & Community',
      team4: 'Startup',
      team5: 'International Trade',
      teamView: 'View activities',

      // Stats
      statsTitle: 'JOURNEY OF CREATION & VALUE CONNECTION',
      stats1: 'Members are typical businesses and entrepreneurs in HCMC',
      stats2: 'Years of formation and development of the compatriot connection network',
      stats3: 'Trade and investment connection opportunities created each year',
      stats4: 'Charity programs and activities towards the homeland',

      // News
      newsTitle: 'NEWS & EVENTS',
      newsViewMore: 'View more',
      newsBadge: 'Latest',
      newsReadMore: 'Read more',

      // Values
      valuesTitle: 'VALUES WHEN JOINING THE COMMUNITY',
      valuesViewMore: 'View more',
      values1Title: 'Quality connections',
      values1Desc: 'Access to a network of reputable entrepreneurs, expand practical cooperation opportunities.',
      values2Title: 'Knowledge development',
      values2Desc: 'Update trends, improve management thinking and business skills.',
      values3Title: 'Cooperation opportunities',
      values3Desc: 'Participate in projects, networking and trade promotion activities.',

      // Contact
      contactTitle: 'INTERESTED AND COOPERATING WITH THE ACTIVITIES OF DONG THAP BUSINESS CLUB IN HCMC',
      contactRegister: 'Register as member',

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

  // ===== PROFILE DATA =====
  const profileSlides = [
    // Slide 1
    [
      {
        name: 'Nguyễn Thanh Hà',
        role: 'Chủ tịch CLB',
        companyRole: 'Tổng Giám đốc',
        company: 'Công ty TNHH ABC Holdings',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2.png'
      },
      {
        name: 'Lê Thị Ngọc Anh',
        role: 'Trưởng ban Truyền thông',
        companyRole: 'Marketing Director',
        company: 'Công ty CP Media Plus',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png'
      },
      {
        name: 'Trần Minh Tuấn',
        role: 'Phó Chủ tịch CLB',
        companyRole: 'Giám đốc Điều hành',
        company: 'Công ty TNHH XYZ Group',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png'
      }
    ],
    // Slide 2
    [
      {
        name: 'Phạm Văn Hùng',
        role: 'Phó Chủ tịch CLB',
        companyRole: 'Chủ tịch HĐQT',
        company: 'Công ty CP Đầu tư Sen Vàng',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2.png'
      },
      {
        name: 'Nguyễn Thị Mai',
        role: 'Phó Trưởng ban Thường trực',
        companyRole: 'Phó Tổng Giám đốc',
        company: 'Công ty TNHH May mặc Đồng Tháp',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png'
      },
      {
        name: 'Hoàng Minh Đức',
        role: 'Ủy viên Ban Chấp hành',
        companyRole: 'Giám đốc Phát triển',
        company: 'Tập đoàn Nông nghiệp Hitech',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png'
      }
    ],
    // Slide 3
    [
      {
        name: 'Trần Văn Khang',
        role: 'Ủy viên BCH',
        companyRole: 'Tổng Giám đốc',
        company: 'Công ty CP Logistics Đồng Tháp',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2.png'
      },
      {
        name: 'Đỗ Thu Trang',
        role: 'Thủ quỹ CLB',
        companyRole: 'Giám đốc Tài chính',
        company: 'Công ty TNHH Sen Việt',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-1.png'
      },
      {
        name: 'Vũ Hoàng Long',
        role: 'Ủy viên BCH',
        companyRole: 'Giám đốc Điều hành',
        company: 'Công ty Công nghệ số Mekong',
        avatar: 'https://webdemo.hexagon.xyz/medias/Ellipse 2-2.png'
      }
    ]
  ];

  // ===== LOGO MARQUEE DATA =====
  const logoItems = [
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi E.png', alt: 'Logo Khối E' },
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi C.png', alt: 'Logo Khối C' },
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi D.png', alt: 'Logo Khối D' },
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/Happy Food.png', alt: 'Logo Happy Food' },
    { type: 'custom', id: 'ecobook' },
    { type: 'custom', id: 'comoon' },
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/B.png', alt: 'Binh Minh' },
    { type: 'image', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi F.png', alt: 'Logo Khối F' }
  ];

  // ===== TEAMS DATA =====
  const teams = [
    {
      icon: 'https://webdemo.hexagon.xyz/medias/economy 1-2.png',
      key: 'team1'
    },
    {
      icon: 'https://webdemo.hexagon.xyz/medias/economy 1.png',
      key: 'team2'
    },
    {
      icon: 'https://webdemo.hexagon.xyz/medias/economy 1-1.png',
      key: 'team3'
    },
    {
      icon: 'https://webdemo.hexagon.xyz/medias/Rectangle 4007.png',
      key: 'team4'
    },
    {
      icon: 'https://webdemo.hexagon.xyz/medias/Rectangle 4008.png',
      key: 'team5'
    }
  ];

  // ===== NEWS DATA =====
  const newsItems = [
    {
      type: 'large',
      image: 'https://webdemo.hexagon.xyz/medias/Frame 1000002842.png',
      date: '20/03/2026',
      title: 'Hội thảo kết nối doanh nghiệp chia sẻ xu hướng phát triển',
      desc: 'Sự kiện quy tụ nhiều chuyên gia và doanh nhân, cùng thảo luận về chiến lược phát triển, chuyển đổi số và cơ hội hợp tác trong thời đại mới.',
      link: 'https://demo.doanhnhandongthap.vn/vi/tin-tuc/hoi-thao-ket-noi-doanh-nghiep-chia-se-xu-huong-phat-trien'
    },
    {
      type: 'large',
      image: 'https://webdemo.hexagon.xyz/medias/Frame 1000002842-1.png',
      date: '20/03/2026',
      title: 'Kết nối và chia sẻ niềm vui là cách phát triển sự hiệu quả...',
      desc: 'Khi chúng ta làm việc với một trái tim mở lòng và tinh thần sẻ chia, áp lực sẽ biến thành động lực, và khó khăn sẽ trở thành trải nghiệm.',
      link: 'https://demo.doanhnhandongthap.vn/vi/tin-tuc/ket-noi-va-chia-se-niem-vui-la-cach-phat-trien-su-hieu-qua'
    },
    {
      type: 'small',
      image: 'https://webdemo.hexagon.xyz/medias/Frame 1000002842-2.png',
      date: '10/03/2026',
      title: 'Lan tỏa yêu thương thiện nguyện',
      desc: 'Các thành viên đã cùng chung tay tổ chức hoạt động trao tặng...'
    },
    {
      type: 'small',
      image: 'https://webdemo.hexagon.xyz/medias/Frame 1000002842-3.png',
      date: '23/02/2026',
      title: 'Hợp tác giữa các doanh nghiệp',
      desc: 'Định hướng phát triển tương lai là mở rộng quan hệ hợp tác giữa các ...'
    },
    {
      type: 'small',
      image: 'https://webdemo.hexagon.xyz/medias/Frame 1000002842-4.png',
      date: '23/02/2026',
      title: 'Đẩy mạnh chuyển đổi số ...',
      desc: 'Sự phát triển hệ thống chuyển đổi đồng bộ nhằm tối ưu hóa...'
    }
  ];

  // ===== EFFECTS =====
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      changeProfile(1);
    }, 6000);

    return () => clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== PROFILE SLIDER FUNCTIONS =====
  const changeProfile = (step) => {
    let nextIndex = currentProfileIndex + step;
    if (nextIndex >= profileSlides.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = profileSlides.length - 1;
    setCurrentProfileIndex(nextIndex);
    resetAutoplay();
  };

  const setProfile = (index) => {
    setCurrentProfileIndex(index);
    resetAutoplay();
  };

  const resetAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      changeProfile(1);
    }, 6000);
  };

  // ===== SCROLL FUNCTIONS =====
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== LANGUAGE TOGGLE =====
  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  // ===== RENDER CUSTOM LOGO =====
  const renderCustomLogo = (id) => {
    if (id === 'ecobook') {
      return (
        <div className="custom-logo eco-logo flex flex-col items-center justify-center">
          <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: 'block', margin: '0 auto 4px' }}>
            <path d="M 15 25 C 25 15, 38 15, 40 20 C 42 15, 55 15, 65 25 C 55 18, 42 18, 40 23 C 38 18, 25 18, 15 25 Z" fill="#22c55e" />
            <path d="M 18 18 C 26 10, 38 10, 40 15 C 42 10, 54 10, 62 18 C 54 12, 42 12, 40 17 C 38 12, 26 12, 18 18 Z" fill="#eab308" />
            <path d="M 22 11 C 28 5, 38 5, 40 10 C 42 5, 52 5, 58 11 C 52 7, 42 7, 40 12 C 38 7, 28 7, 22 11 Z" fill="#22c55e" />
          </svg>
          <div className="logo-text text-[11px] font-extrabold tracking-[0.08em] text-[#15803d]">ECOBOOK</div>
        </div>
      );
    }
    if (id === 'comoon') {
      return (
        <div className="custom-logo comoon-logo flex flex-col items-center justify-center">
          <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: 'block', margin: '0 auto 4px' }}>
            <path d="M 20 12 C 30 5, 50 5, 60 12 C 55 18, 45 18, 40 18 C 35 18, 25 18, 20 12 Z" fill="#15803d" />
            <path d="M 22 17 C 30 11, 50 11, 58 17 C 53 23, 47 23, 40 23 C 33 23, 27 23, 22 17 Z" fill="#eab308" />
            <path d="M 25 22 C 32 17, 48 17, 55 22 C 50 30, 45 32, 40 32 C 35 32, 30 30, 25 22 Z" fill="#15803d" />
          </svg>
          <div className="logo-text text-[11px] font-extrabold tracking-[0.08em] text-[#15803d]">COMOON</div>
        </div>
      );
    }
    return null;
  };

  const t = translations[language];

  return (
    <div className="font-primary bg-[#f0f6fa] text-[#1e293b] pt-[80px] overflow-x-hidden">
      {/* ===== Animated gradient overlay ===== */}
      <div id="global-gradient-bg" className="fixed inset-0 z-[9999] pointer-events-none bg-gradient-to-br from-[#f43f5e]/50 via-[#06b6d4]/40 to-[#a855f7]/30 mix-blend-soft-light animate-gradientFlow"></div>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center h-[80px] bg-[#2465B3] border-b border-transparent">
        <div className="max-w-[1750px] mx-auto px-4 md:px-[85px] w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
            <img src="https://webdemo.hexagon.xyz/medias/logo 2.png" alt="Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col leading-tight gap-[8px]">
              <span className="font-bold block w-full text-[13px] text-white text-left">{t.clubName}</span>
              <span className="font-bold block w-full text-[13px] text-white text-center">{t.clubLocation}</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
            <a href="./Trang-Chu.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navHome}</a>
            <a href="./Gioi-Thieu.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navAbout}</a>
            <a href="./Hoi-Vien.jsx" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navMembers}</a>
            <a href="/" className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navActivities}</a>
            <a href="#tin-tuc" onClick={(e) => { e.preventDefault(); scrollToSection('tin-tuc'); }} className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navNews}</a>
            <a href="#lien-he" onClick={(e) => { e.preventDefault(); scrollToSection('lien-he'); }} className="text-[#e5e7eb] text-[15px] font-medium whitespace-nowrap hover:text-white transition-colors">{t.navContact}</a>
          </nav>

          <div className="hidden md:block">
            <div 
              className="lang-toggle flex items-center bg-gradient-to-b from-[#CBA359] via-[#FAF390] via-[#FBC944] to-[#FCAF14] rounded-[50px] p-[3px] gap-[2px] flex-shrink-0 cursor-pointer hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-105 transition-all"
              onClick={toggleLanguage}
            >
              <span 
                className={`text-[12px] font-bold cursor-pointer tracking-[0.06em] leading-none flex items-center justify-center w-[28px] h-[28px] rounded-full flex-shrink-0 transition-all ${language === 'vi' ? 'bg-[#5a3200] text-[#c8860a]' : 'bg-transparent text-[#7a4e00]'}`}
              >
                {t.langVN}
              </span>
              <span 
                className={`text-[12px] font-bold cursor-pointer tracking-[0.04em] leading-none pl-[2px] transition-all ${language === 'en' ? 'text-[#c8860a]' : 'text-[#7a4e00]'}`}
              >
                {t.langEN}
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
            <a href="./Trang-Chu.jsx" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navHome}</a>
            <a href="./Gioi-Thieu.jsx" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navAbout}</a>
            <a href="./Hoi-Vien.jsx" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navMembers}</a>
            <a href="/" className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navActivities}</a>
            <a href="#tin-tuc" onClick={(e) => { e.preventDefault(); scrollToSection('tin-tuc'); }} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navNews}</a>
            <a href="#lien-he" onClick={(e) => { e.preventDefault(); scrollToSection('lien-he'); }} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t.navContact}</a>
            <div className="flex justify-center px-6 pt-4 mt-2 pb-2 border-t border-gray-100">
              <div 
                className="lang-toggle flex items-center bg-gradient-to-b from-[#CBA359] via-[#FAF390] via-[#FBC944] to-[#FCAF14] rounded-[50px] p-[3px] gap-[2px] flex-shrink-0 cursor-pointer"
                onClick={toggleLanguage}
              >
                <span 
                  className={`text-[12px] font-bold cursor-pointer tracking-[0.06em] leading-none flex items-center justify-center w-[28px] h-[28px] rounded-full flex-shrink-0 transition-all ${language === 'vi' ? 'bg-[#5a3200] text-[#c8860a]' : 'bg-transparent text-[#7a4e00]'}`}
                >
                  {t.langVN}
                </span>
                <span 
                  className={`text-[12px] font-bold cursor-pointer tracking-[0.04em] leading-none pl-[2px] transition-all ${language === 'en' ? 'text-[#c8860a]' : 'text-[#7a4e00]'}`}
                >
                  {t.langEN}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="hero-section min-h-[700px] h-screen relative bg-[url('https://webdemo.hexagon.xyz/medias/hieuunghero.webp')] bg-cover bg-center bg-blend-screen flex items-center" style={{ backgroundImage: 'url(https://webdemo.hexagon.xyz/medias/hieuunghero.webp), linear-gradient(0deg, #a8dfff 0%, #cdeeff 25%, #66aaff 60%, #3399ff 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#041e3c]/45 via-[#041e3c]/25 to-transparent z-[1]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-b from-transparent to-[#a8dfff] z-[2] pointer-events-none"></div>
        <div className="relative z-[3] w-full">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-start">
            <div className="hero-glass-card bg-white/19 backdrop-blur-[9px] border border-white/30 rounded-tl-[16px] rounded-tr-[100px] rounded-br-[16px] rounded-bl-[100px] p-12 w-full max-w-[620px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col items-center gap-8">
              <div className="flex flex-col text-left gap-3">
                <h3 className="text-[15px] font-medium text-white/85 uppercase tracking-[0.12em]">{t.heroTagline}</h3>
                <h1 className="hero-title text-[80px] font-extrabold leading-[1.1] text-white bg-gradient-to-r from-white via-white to-[#ffd700] bg-clip-text text-transparent shadow-[0_0_12px_rgba(255,215,0,0.45)]">{t.heroTitle}</h1>
                <p className="text-[15px] text-white/80 font-normal leading-relaxed">
                  {t.heroDesc}
                </p>
              </div>
              <button className="hero-cta-btn bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white border-none px-9 py-5 text-[15px] font-semibold rounded-tr-[30px] rounded-bl-[30px] cursor-pointer shadow-[0_10px_25px_rgba(0,114,255,0.35)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,114,255,0.55)] transition-all" onClick={() => scrollToSection('lien-he')}>
                {t.heroBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: MEMBER LOGO SLIDER ===== */}
      <div className="bg-gradient-to-b from-[#a8dfff] via-[#cdeeff] to-[#e6efff] py-9 text-center overflow-hidden relative z-10">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#0A2540] uppercase tracking-[0.05em] mb-7 px-5">
            {t.logoTitle}
          </h2>
          <div className="logo-marquee relative w-full overflow-hidden flex">
            <div className="marquee-track flex gap-6 w-max animate-marqueeScroll hover:animation-play-state-paused">
              {[...logoItems, ...logoItems].map((item, idx) => (
                <div key={idx} className="logo-card bg-white rounded-[16px] w-[180px] h-[108px] flex flex-col justify-center items-center p-4 shadow-[0_4px_12px_rgba(10,37,64,0.04)] flex-shrink-0 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,37,64,0.08)] transition-all">
                  {item.type === 'image' ? (
                    <img src={item.src} alt={item.alt} className="max-h-[64px] max-w-[140px] object-contain hover:scale-105 transition-transform" />
                  ) : (
                    renderCustomLogo(item.id)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3 & 4: ABOUT & ORG STRUCTURE ===== */}
      <section className="about-section py-[100px] bg-[url('https://webdemo.hexagon.xyz/medias/hoavanvct.png')] bg-no-repeat bg-contain bg-bottom relative" style={{ backgroundImage: 'url(https://webdemo.hexagon.xyz/medias/hoavanvct.png), linear-gradient(180deg, #e8f4ff 0%, #ece6ff 60%, #f0e0ff 100%)' }}>
        <div className="about-container max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8">
          {/* Left Card */}
          <div className="about-card left-card bg-white border-[1.5px] border-[#00c6ff]/25 shadow-[0_10px_30px_rgba(0,114,255,0.08)] rounded-[20px] p-[50px_40px] flex flex-col relative overflow-hidden lg:rounded-r-[20px] lg:rounded-l-none">
            <h2 className="text-2xl font-extrabold text-[#0B5077] mb-6 relative z-[3]">{t.aboutTitle}</h2>
            <p className="text-[15px] text-[#1e293b] leading-relaxed relative z-[3] max-w-[85%]">
              {t.aboutDesc}
            </p>
            <img src="https://webdemo.hexagon.xyz/medias/business-man-holding-smart-device-pointing-index-finger-screen-with-dot-connection-digital-illustration 1.png" alt="Business connection illustration" className="about-corner-img absolute bottom-[-15px] left-[-15px] w-[290px] h-auto opacity-95 pointer-events-none z-[2] hover:scale-[1.03] hover:translate-x-[2px] hover:-translate-y-[2px] hover:opacity-100 transition-all" />
            <img src="https://webdemo.hexagon.xyz/medias/veclb.png" alt="" className="about-veclb-img absolute bottom-0 right-0 w-[320px] h-auto opacity-70 pointer-events-none z-[1] hover:scale-[1.04] hover:opacity-85 transition-all" />
          </div>

          {/* Right Card: Carousel */}
          <div className="about-card right-card bg-white border-[1.5px] border-[#00c6ff]/25 shadow-[0_10px_30px_rgba(0,114,255,0.08)] rounded-[20px] p-[50px_40px] flex flex-col relative overflow-hidden lg:rounded-l-[20px] lg:rounded-r-none">
            <h2 className="text-2xl font-extrabold text-[#0B5077] mb-6 relative z-[3]">{t.orgTitle}</h2>

            <div className="profile-slider relative flex-grow flex items-center">
              {profileSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className={`profile-slide flex flex-col gap-4 w-full ${currentProfileIndex === slideIdx ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-500`}>
                  {slide.map((member, memberIdx) => (
                    <div key={memberIdx} className="profile-item flex items-center gap-5 bg-white/45 border border-white/55 rounded-[100px_20px_20px_100px] p-[8px_24px_8px_8px] w-full shadow-[0_4px_15px_rgba(10,37,64,0.03)] backdrop-blur-[10px] hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(10,37,64,0.08)] hover:bg-white/65 transition-all">
                      <div className="profile-avatar-wrapper flex-shrink-0 w-[110px] h-[110px] rounded-full border-4 border-white shadow-[0_4px_12px_rgba(10,37,64,0.1)] overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="profile-details flex flex-col gap-1.5">
                        <p className="text-sm text-[#1e293b] leading-snug"><span className="font-bold text-[#0B355B]">{t.orgName}:</span> <span className="font-medium">{member.name}</span></p>
                        <p className="text-sm text-[#1e293b] leading-snug"><span className="font-bold text-[#0B355B]">{t.orgRole}:</span> <span className="font-medium">{member.role}</span></p>
                        <p className="text-sm text-[#1e293b] leading-snug"><span className="font-bold text-[#0B355B]">{t.orgCompanyRole}:</span> <span className="font-medium">{member.companyRole}</span></p>
                        <p className="text-sm text-[#1e293b] leading-snug"><span className="font-bold text-[#0B355B]">{t.orgCompany}:</span> <span className="font-medium">{member.company}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="slider-controls flex items-center justify-center gap-5 mt-6">
              <button className="slider-arrow bg-[#cdeeff] border-none text-[#0B5077] w-9 h-9 rounded-[8px] text-[14px] font-bold cursor-pointer shadow-[0_4px_10px_rgba(10,37,64,0.05)] hover:bg-[#0B5077] hover:text-white hover:scale-105 transition-all flex items-center justify-center" onClick={() => changeProfile(-1)}>&#10094;</button>
              <div className="slider-dots flex items-center gap-2">
                {profileSlides.map((_, idx) => (
                  <span key={idx} className={`dot w-2 h-2 rounded-full bg-[#cdeeff] cursor-pointer transition-all ${currentProfileIndex === idx ? 'w-[48px] h-[6px] rounded-[3px] bg-[#0B5077]' : ''}`} onClick={() => setProfile(idx)}></span>
                ))}
              </div>
              <button className="slider-arrow bg-[#cdeeff] border-none text-[#0B5077] w-9 h-9 rounded-[8px] text-[14px] font-bold cursor-pointer shadow-[0_4px_10px_rgba(10,37,64,0.05)] hover:bg-[#0B5077] hover:text-white hover:scale-105 transition-all flex items-center justify-center" onClick={() => changeProfile(1)}>&#10095;</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CÁC BAN CHUYÊN MÔN ===== */}
      <section className="py-[100px] text-center bg-gradient-to-b from-[#f0e0ff] via-[#dce8ff] to-[#d4e0ff]" id="hoat-dong-ban">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-[#0b4c8c]">{t.teamsTitle}</h2>
          <h2 className="text-2xl font-semibold text-[#1158a7] mb-12">{t.teamsSubtitle}</h2>

          <div className="teams-grid flex flex-wrap justify-center gap-[30px] mb-[30px]">
            {teams.map((team, idx) => (
              <div key={idx} className="team-glass-card flex-[0_1_360px] w-full min-h-[270px] bg-gradient-to-b from-[#2CB2FF] to-[#0B5077] rounded-[80px_0] p-6 flex flex-col items-center shadow-[0_15px_35px_rgba(12,74,115,0.25)] hover:-translate-y-2 hover:shadow-[0_25px_45px_rgba(12,74,115,0.4)] hover:bg-gradient-to-br from-[#21adff] to-[#0e5685] transition-all">
                <div className="w-full h-[100px] flex items-center justify-center bg-transparent mb-1">
                  <img src={team.icon} alt={t[team.key]} className="team-card-icon h-[70px] w-auto max-w-full object-contain brightness-0 invert opacity-95 hover:scale-105 hover:opacity-100 transition-all" />
                </div>
                <h4 className="text-[19px] font-bold text-white mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.15)]">{t[team.key]}</h4>
                <button className="team-card-btn bg-white/15 border border-white/40 text-white px-7 py-2.5 text-[13px] font-semibold rounded-[30px] cursor-pointer flex items-center gap-2 hover:bg-white hover:border-white hover:text-[#0c4c73] hover:shadow-[0_5px_15px_rgba(255,255,255,0.2)] transition-all">
                  {t.teamView} <span className="btn-arrow transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: HÀNH TRÌNH KIẾN TẠO ===== */}
      <section className="stats-section py-[110px] bg-gradient-to-b from-[#d4e0ff] via-[#e8d8ff] to-[#f5e0f8] relative overflow-hidden text-center">
        <div className="stats-bg-loop absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] max-w-full h-full bg-[url('https://webdemo.hexagon.xyz/medias/hoa.webp')] bg-contain bg-no-repeat bg-center mix-blend-screen opacity-80 pointer-events-none z-[1]"></div>
        <div className="stats-container max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <h2 className="text-2xl font-[850] text-[#0b4c8c] mb-[70px] tracking-[0.05em] shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
            {t.statsTitle}
          </h2>

          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            <div className="stat-item flex flex-col items-center bg-transparent border-none p-5 hover:-translate-y-1 transition-all duration-300">
              <span className="font-serif text-5xl font-bold text-[#0b2540] leading-none mb-4">500+</span>
              <p className="text-sm text-[#1e293b] font-medium leading-relaxed max-w-[250px]">{t.stats1}</p>
            </div>
            <div className="stat-item flex flex-col items-center bg-transparent border-none p-5 hover:-translate-y-1 transition-all duration-300">
              <span className="font-serif text-5xl font-bold text-[#0b2540] leading-none mb-4">20+</span>
              <p className="text-sm text-[#1e293b] font-medium leading-relaxed max-w-[250px]">{t.stats2}</p>
            </div>
            <div className="stat-item flex flex-col items-center bg-transparent border-none p-5 hover:-translate-y-1 transition-all duration-300">
              <span className="font-serif text-5xl font-bold text-[#0b2540] leading-none mb-4">1.000+</span>
              <p className="text-sm text-[#1e293b] font-medium leading-relaxed max-w-[250px]">{t.stats3}</p>
            </div>
            <div className="stat-item flex flex-col items-center bg-transparent border-none p-5 hover:-translate-y-1 transition-all duration-300">
              <span className="font-serif text-5xl font-bold text-[#0b2540] leading-none mb-4">100+</span>
              <p className="text-sm text-[#1e293b] font-medium leading-relaxed max-w-[250px]">{t.stats4}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: TIN TỨC & SỰ KIỆN ===== */}
      <section className="py-[100px] bg-gradient-to-b from-[#f5e0f8] via-[#f8eeff] to-[#f2f4ff]" id="tin-tuc">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="news-header flex justify-between items-end mb-[50px] border-b border-black/5 pb-4">
            <h2 className="text-2xl font-extrabold text-[#0B5077]">{t.newsTitle}</h2>
            <a href="#" className="news-view-more text-sm font-bold text-[#0B355B] no-underline flex items-center gap-1.5 hover:text-[#f43f5e] transition-all duration-300">
              {t.newsViewMore} <span className="arrow-right inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>

          <div className="news-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-[30px]">
            {newsItems.map((item, idx) => (
              <div key={idx} className={`news-card bg-white border border-[#eef3f7] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:border-[#dbeafe] transition-all ${item.type === 'large' ? 'lg:col-span-3' : 'lg:col-span-2'} ${item.type === 'small' ? 'small-card' : ''}`}>
                <div className={`news-img-wrapper relative w-full ${item.type === 'large' ? 'h-[220px]' : 'h-[170px]'} overflow-hidden`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-all duration-300" />
                  {item.type === 'large' && (
                    <span className="news-badge absolute top-3 right-3 bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-[#0B5077] text-[11px] font-bold px-3 py-1 rounded-xl shadow-md">{t.newsBadge}</span>
                  )}
                </div>
                <div className="news-info p-6 flex-grow flex flex-col relative">
                  <span className="text-xs font-medium text-[#64748b] mb-2.5">{item.date}</span>
                  <h4 className="text-[17px] font-bold text-[#0B5077] mb-3 leading-tight">{item.title}</h4>
                  <p className="text-[13px] text-[#64748b] leading-relaxed mb-5">{item.desc}</p>
                  {item.type === 'large' ? (
                    <a href={item.link} className="news-link mt-auto text-[13px] font-bold text-[#0B355B] no-underline flex items-center gap-1.5 hover:text-[#f43f5e] transition-all duration-300">
                      {t.newsReadMore} <span className="link-arrow inline-block transition-transform duration-300">&rarr;</span>
                    </a>
                  ) : (
                    <a href="#" className="news-card-arrow absolute bottom-5 right-6 w-8 h-8 rounded-full bg-[#f1f5f9] text-[#0B5077] flex items-center justify-center no-underline text-xs hover:bg-[#0B5077] hover:text-white transition-all duration-300">&#10132;</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: GIÁ TRỊ KHI THAM GIA CỘNG ĐỒNG ===== */}
      <section className="values-section py-[80px] md:py-[90px] relative" style={{ background: 'linear-gradient(180deg, rgba(242,244,255,0.80) 0%, transparent 35%, rgba(240,185,252,0.88) 100%), linear-gradient(to right, rgba(200,245,255,0.95) 0%, rgba(216,229,255,0.70) 50%, rgba(247,201,252,0.20) 100%), url(https://webdemo.hexagon.xyz/medias/bg-giatri.png) right center / cover no-repeat' }}>
        <div className="values-container max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-[1]">
          <div className="values-header flex justify-between items-center mb-12">
            <h2 className="values-section-title text-2xl font-extrabold text-[#0b4c8c] leading-tight">{t.valuesTitle}</h2>
            <a href="#" className="values-view-more text-sm font-bold text-[#0b4c8c] no-underline flex items-center gap-1.5 hover:text-[#f43f5e] transition-all duration-300">
              {t.valuesViewMore} <span className="arrow-right inline-block transition-transform duration-300">&rarr;</span>
            </a>
          </div>

          <div className="values-stack hidden md:block relative w-[490px] h-[610px]">
            {/* Card 1 */}
            <div className="value-glass-card absolute w-[225px] h-[300px] top-[50px] left-0 z-[1] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1-2.png" alt="Globe icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values1Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values1Desc}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="value-glass-card absolute w-[225px] h-[300px] top-0 left-[260px] z-[2] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1-1.png" alt="Chart icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values2Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values2Desc}</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="value-glass-card absolute w-[225px] h-[300px] top-[295px] left-[130px] z-[3] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1.png" alt="Handshake icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values3Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values3Desc}</p>
              </div>
            </div>
          </div>

          {/* Mobile values stack */}
          <div className="md:hidden flex flex-col gap-5 items-center w-full">
            <div className="value-glass-card relative w-full max-w-[320px] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1-2.png" alt="Globe icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values1Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values1Desc}</p>
              </div>
            </div>
            <div className="value-glass-card relative w-full max-w-[320px] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1-1.png" alt="Chart icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values2Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values2Desc}</p>
              </div>
            </div>
            <div className="value-glass-card relative w-full max-w-[320px] bg-white/50 backdrop-blur-[16px] border border-white/80 rounded-[70px_15px_70px_15px] p-[30px_22px_26px] flex flex-col items-center justify-start text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] transition-all">
              <div className="value-card-icon-wrapper w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center mb-[18px] flex-shrink-0 shadow-[0_4px_20px_rgba(12,74,115,0.10)] hover:shadow-[0_8px_28px_rgba(12,74,115,0.18)] hover:scale-105 transition-all">
                <img src="https://webdemo.hexagon.xyz/medias/icon_1 1.png" alt="Handshake icon" className="value-card-icon w-[100px] h-[100px] object-contain" />
              </div>
              <div className="value-card-text flex flex-col gap-2 items-center">
                <h4 className="text-[15px] font-bold text-[#0b4c8c]">{t.values3Title}</h4>
                <p className="text-[13px] text-[#334155] leading-relaxed">{t.values3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: QUAN TÂM & HỢP TÁC ===== */}
      <section className="contact-cta-section py-[100px] pb-[160px] text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(240,185,252,0.95) 0%, rgba(236,182,250,0.45) 22%, rgba(228,178,248,0.20) 58%, rgba(232,180,248,1.00) 100%), url(https://webdemo.hexagon.xyz/medias/bg-lienhe.png) center center / cover no-repeat' }} id="lien-he">
        <div className="contact-cta-container max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <h2 className="contact-cta-title text-2xl font-extrabold text-[#0B5077] leading-relaxed">
            {t.contactTitle}
          </h2>

          <div className="contact-info-pill-bar flex justify-center gap-[30px] my-[45px] flex-wrap">
            <a href="mailto:info@dte.hunghau.vn" className="contact-pill-item bg-white/75 border border-white/25 rounded-[40px] px-[30px] py-3.5 flex items-center gap-4 no-underline shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all">
              <span className="text-lg">✉️</span>
              <span className="text-[#64748b] text-sm font-light">|</span>
              <span className="pill-text text-[15px] font-bold text-[#0B5077]">info@dte.hunghau.vn</span>
            </a>
            <a href="tel:18001568" className="contact-pill-item bg-white/75 border border-white/25 rounded-[40px] px-[30px] py-3.5 flex items-center gap-4 no-underline shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all">
              <span className="text-lg">📞</span>
              <span className="text-[#64748b] text-sm font-light">|</span>
              <span className="pill-text text-[15px] font-bold text-[#0B5077]">1800 1568</span>
            </a>
          </div>

          <button className="contact-register-btn bg-gradient-to-br from-[#0f2e5c] to-[#0d5c8a] text-white border-none px-[45px] py-4 text-[15px] font-bold rounded-[40px] cursor-pointer shadow-[0_8px_25px_rgba(15,46,92,0.25)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,46,92,0.45)] transition-all">
            {t.contactRegister}
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gradient-to-b from-[#e8b4f8] via-[#c9b8f5] via-[#8b9ef0] to-[#6a7be8] text-white relative overflow-hidden">
        <div className="relative z-[2] w-[1300px] max-w-[90%] mx-auto pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[40%_30%_30%] gap-[50px] pb-10">
            <div>
              <div className="flex items-center gap-[14px] mb-6">
                <img src="https://webdemo.hexagon.xyz/medias/logo 2.png" alt="Logo CLB" className="h-[60px] w-auto object-contain flex-shrink-0" />
                <div className="flex flex-col leading-[1.3]">
                  <span className="text-white text-[15px] font-extrabold tracking-[0.02em]">{t.clubName}</span>
                  <span className="text-[#FFD700] text-[13px] font-semibold">{t.clubLocation}</span>
                </div>
              </div>

              <h4 className="text-[14px] font-bold text-[#FFD700] mb-3 tracking-[0.02em]">{t.footerHeadquarters}</h4>
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

            <div>
              <h4 className="text-[14px] font-bold text-[#FFD700] mb-4 tracking-[0.02em] relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#FFD700] after:rounded-[2px]">
                {t.footerLinks}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-2 gap-x-5">
                <li><a href="/" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerHome}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerNews}</a></li>
                <li><a href="/gioi-thieu" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerAbout}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerActivities}</a></li>
                <li><a href="/hoi-vien" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerMembers}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerRegister}</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">{t.footerBan}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold text-[#FFD700] mb-4 tracking-[0.02em] relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-[#FFD700] after:rounded-[2px]">
                {t.footerOther}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-3 gap-2 gap-x-3">
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">MYH</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">MYC</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHF</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHE</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHA</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">COWE</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HHN</a></li>
                <li><a href="#" className="footer-link text-[13px] text-white no-underline hover:text-[#FFD700] hover:translate-x-1 transition-all">HYV</a></li>
              </ul>
            </div>
          </div>

          <hr className="border-t border-white/30 my-0" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-5">
            <p className="text-[12px] text-white/70 m-0">{t.footerCopyright}</p>

            <div className="social-icons flex items-center gap-4">
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

      {/* ===== BACK TO TOP BUTTON ===== */}
      <button
        className={`back-to-top fixed bottom-[30px] right-[30px] w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0072ff] text-white border-none outline-none cursor-pointer flex items-center justify-center shadow-[0_6px_20px_rgba(0,114,255,0.35)] z-[999] transition-all duration-300 hover:brightness-110 hover:shadow-[0_8px_25px_rgba(0,114,255,0.50)] hover:-translate-y-1 ${showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-[15px]'}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hover:-translate-y-1 transition-transform duration-300">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<index />);
}

export default index;

