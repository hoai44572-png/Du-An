const safeStorage = {
    _fallback: {},
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return this._fallback[key] || null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            this._fallback[key] = value;
        }
    }
};

const translationDictionary = {
    // === MULTILINE TRANSLATIONS ADDED AUTOMATICALLY ===
    "Cung cấp giải pháp trí tuệ nhân tạo và phân tích dữ liệu, hỗ trợ ra quyết định thông minh, tự động hóa quy trình và khai thác tối đa giá trị từ dữ liệu doanh nghiệp.": "Providing artificial intelligence and data analysis solutions, supporting smart decision-making, automating processes, and exploiting maximum value from enterprise data.",
    "Thiết kế và triển khai hệ thống lưu trữ dữ liệu tập trung, giúp doanh nghiệp quản lý, đồng bộ và khai thác dữ liệu hiệu quả.": "Designing and deploying centralized data storage systems, helping businesses manage, synchronize, and exploit data effectively.",
    "Khai thác dữ liệu thông qua báo cáo, dashboard và mô hình phân tích, hỗ trợ ra quyết định nhanh và chính xác.": "Exploiting data through reports, dashboards, and analytical models, supporting fast and accurate decision-making.",
    "Triển khai các mô hình AI như dự đoán, phân loại, chatbot, nhận diện hình ảnh… giúp tự động hóa và tối ưu vận hành.": "Deploying AI models such as prediction, classification, chatbots, image recognition... helping automate and optimize operations.",
    "Thi công và lắp đặt hệ thống camera giám sát, mạng wifi chuyên nghiệp, đảm bảo an ninh, ổn định kết nối và phù hợp với mọi quy mô doanh nghiệp.": "Constructing and installing surveillance camera systems, professional wifi networks, ensuring security, connection stability, and suitable for all business sizes.",
    "Thiết kế và lắp đặt hệ thống camera an ninh cho văn phòng, nhà xưởng, cửa hàng… với khả năng giám sát từ xa, lưu trữ và cảnh báo thông minh.": "Designing and installing security camera systems for offices, factories, shops... with remote monitoring, storage, and smart alert capabilities.",
    "Triển khai hệ thống WiFi phủ sóng ổn định, bảo mật cao, đáp ứng số lượng lớn người dùng và thiết bị trong môi trường doanh nghiệp.": "Deploying WiFi systems with stable coverage, high security, meeting a large number of users and devices in enterprise environments.",
    "Thi công hệ thống mạng tổng thể (LAN, Switch, Router, Server…), đồng bộ với camera và WiFi để đảm bảo vận hành xuyên suốt.": "Constructing overall network systems (LAN, Switch, Router, Server...), synchronized with cameras and WiFi to ensure seamless operation.",
    "Dịch vụ nổi bật": "Featured Services",
    "Phát triển và triển khai các giải pháp phần mềm tùy chỉnh, tối ưu vận hành doanh nghiệp, nâng cao hiệu suất, đáp ứng linh hoạt theo nhu cầu và định hướng phát triển dài hạn.": "Developing and deploying customized software solutions, optimizing enterprise operation, improving performance, flexibly responding to needs and long-term development orientations.",
    "Xem giải pháp": "View Solutions",
    "GIẢI PHÁP": "SOLUTIONS",
    "Chúng tôi cung cấp các giải pháp công nghệ toàn diện, đáp ứng mọi nhu cầu của doanh nghiệp": "We provide comprehensive technology solutions, meeting all business needs",
    "Thiết kế và xây dựng phần mềm \"đo ni đóng giày\" theo quy trình vận hành riêng của doanh nghiệp, giúp tối ưu hiệu suất và tăng khả năng cạnh tranh.": "Designing and building customized software according to the specific operational processes of the enterprise, helping optimize performance and increase competitiveness.",
    "Tích hợp công nghệ vào toàn bộ hoạt động (quản lý, bán hàng, vận hành), giúp doanh nghiệp tự động hóa quy trình và nâng cao trải nghiệm khách hàng.": "Integrating technology into all activities (management, sales, operations), helping businesses automate processes and improve customer experience.",
    "Xây dựng hệ thống nền tảng &amp; tích hợp": "Building Platform & Integration Systems",
    "Xây dựng hệ thống nền tảng & tích hợp": "Building Platform & Integration Systems",
    "Phát triển hệ thống trung tâm (CRM, ERP, Dashboard…) và kết nối các nền tảng hiện có thành một hệ sinh thái đồng bộ, dữ liệu xuyên suốt.": "Developing central systems (CRM, ERP, Dashboard...) and connecting existing platforms into a unified ecosystem, seamless data.",
    "QUY TRÌNH": "PROCESS",
    "Quy trình": "Process",
    "Quy trình chuyên nghiệp, minh bạch và hiệu quả, đảm bảo chất lượng cao nhất": "Professional, transparent and effective process, ensuring the highest quality",
    "Hiểu rõ nhu cầu và mục tiêu của doanh nghiệp để xây dựng giải pháp phù hợp": "Understand the needs and goals of the business to build appropriate solutions",
    "Thiết kế giải pháp &amp; kiến trúc hệ thống": "Solution Design & System Architecture",
    "Thiết kế giải pháp & kiến trúc hệ thống": "Solution Design & System Architecture",
    "Xây dựng kiến trúc tổng thể và thiết kế giải pháp tối ưu cho doanh nghiệp": "Build overall architecture and design optimal solutions for businesses",
    "Phát triển phần mềm và kiểm thử kỹ lưỡng để đảm bảo chất lượng và độ ổn định": "Develop software and test thoroughly to ensure quality and stability",
    "Triển khai hệ thống và hỗ trợ bảo trì lâu dài để đảm bảo hoạt động ổn định": "Deploy system and support long-term maintenance to ensure stable operation",
    "SẴN SÀNG TRIỂN KHAI": "READY TO DEPLOY",
    "Đừng để công nghệ làm rào cản": "Don't let technology be a barrier",
    "Hãy biến nó thành lợi thế cạnh tranh của bạn cùng": "Turn it into your competitive advantage with",
    "Dịch vụ thi công & lắp đặt": "Construction & Installation Services",
    "Tư vấn chiến lược chuyển đổi số toàn diện, giúp doanh nghiệp tối ưu quy trình, nâng cao trải nghiệm khách hàng và tăng trưởng bền vững trong môi trường số hóa.": "Comprehensive digital transformation strategic consulting, helping businesses optimize processes, improve customer experience, and achieve sustainable growth in a digitalized environment.",
    "Chúng tôi cung cấp các giải pháp thi công và lắp đặt chuyên nghiệp, đáp ứng mọi nhu cầu của doanh nghiệp": "We provide professional construction and installation solutions, meeting all business needs",
    "Đánh giá hiện trạng &amp; mức độ trưởng thành số": "Current Status & Digital Maturity Assessment",
    "Đánh giá hiện trạng & mức độ trưởng thành số": "Current Status & Digital Maturity Assessment",
    "Phân tích toàn diện hệ thống, quy trình và năng lực công nghệ hiện tại, từ đó xác định mức độ sẵn sàng chuyển đổi số của doanh nghiệp.": "Comprehensive analysis of current systems, processes, and technology capabilities, thereby determining the digital transformation readiness of the enterprise.",
    "Xây dựng chiến lược chuyển đổi số tổng thể": "Building Overall Digital Transformation Strategy",
    "Tư vấn lộ trình chuyển đổi số theo từng giai đoạn, phù hợp với mục tiêu kinh doanh, nguồn lực và ngành nghề của doanh nghiệp.": "Consulting on digital transformation roadmap by phase, in line with business goals, resources, and industry of the enterprise.",
    "Tư vấn lựa chọn công nghệ &amp; giải pháp triển khai": "Technology Selection & Deployment Solution Consulting",
    "Tư vấn lựa chọn công nghệ & giải pháp triển khai": "Technology Selection & Deployment Solution Consulting",
    "Đề xuất các nền tảng, công nghệ và mô hình triển khai tối ưu (Cloud, AI, Data, CRM, ERP…), đảm bảo hiệu quả đầu tư và khả năng mở rộng.": "Proposing optimal platforms, technologies, and deployment models (Cloud, AI, Data, CRM, ERP...), ensuring investment efficiency and scalability.",
    "Thu nhập và phân tích dữ liệu để hiểu rõ hiện trạng doanh nghiệp": "Collect and analyze data to understand the current state of the enterprise",
    "Xác định mục tiêu &amp; định hướng chuyển đổi": "Identify Objectives & Transformation Direction",
    "Xác định mục tiêu & định hướng chuyển đổi": "Identify Objectives & Transformation Direction",
    "Định hình chiến lược và mục tiêu cụ thể cho quá trình chuyển đổi": "Shape specific strategy and goals for the transformation process",
    "Lập kế hoạch chi tiết và lựa chọn giải pháp tối ưu cho từng giai đoạn": "Make a detailed plan and choose the optimal solution for each stage",
    "Hỗ trợ triển khai và tối ưu hóa liên tục để đạt hiệu quả cao nhất": "Support deployment and continuous optimization for maximum efficiency",
    "Đừng để công nghệ làm": "Don't let technology be",
    "Về Trang chủ": "Go to Homepage",
    "Kiến tạo giải pháp": "Creating Solutions",
    "Khám phá dịch vụ": "Explore Services",
    "Hexagon Corporation – Công nghệ tiên phong, nơi chúng tôi không ngừng kiến tạo và đổi mới để mang đến những giá trị vượt trội trong kỷ nguyên số.": "Hexagon Corporation – Pioneering technology, where we constantly create and innovate to deliver outstanding values in the digital era.",
    "Với tầm nhìn đa chiều và khát vọng vươn tầm, Hexagon tự hào là đối tác tin cậy, đồng hành cùng bạn trên hành trình chinh phục những đỉnh cao công nghệ.": "With a multi-dimensional vision and aspiration to reach higher, Hexagon is proud to be a trusted partner, accompanying you on the journey to conquer technological peaks.",
    "Hexagon Corporation luôn nỗ lực mang đến những giá trị tốt nhất cho khách hàng và đối tác.": "Hexagon Corporation always strives to deliver the best values to customers and partners.",
    "Quay lại danh sách": "Back to List",
    "Hòa chung không khí rực lửa, đại gia đình HHC đã cùng nhau tham gia các hoạt động tham quan, dã ngoại và tăng cường sự gắn kết tại vùng đảo xinh đẹp của Vinpearl Nha Trang. Tại đây, các thành viên cùng người thân đã được trải nghiệm những giây phút ý nghĩa, ấm áp và tận hưởng những giá trị xứng đáng.": "Exciting atmosphere at the myH25 Teambuilding Program at Hung Hau House. Joining the fiery atmosphere, the HHC family participated in sightseeing and picnic activities, strengthening bonds on the beautiful island of Vinpearl Nha Trang. Here, members and their loved ones experienced meaningful, warm moments and enjoyed well-deserved values.",
    "Teambuilding không chỉ là hoạt động để gắn kết tình đồng đội mà còn là dịp để toàn thể các đơn vị, tập thể, và cá nhân cùng nhau nhìn lại và tự hào về những thành tựu đã gặt hái, cũng như những khó khăn, trở ngại mà chúng ta đã cùng nhau vượt qua. Đây chính là bước đà hoàn hảo để chuẩn bị cho một sự khởi đầu trọn vẹn niềm vui, hứa hẹn một hành trình mới với nhiều thắng lợi hơn nữa!": "Teambuilding is not only an activity to strengthen team spirit but also an opportunity for all units, collectives, and individuals to look back and be proud of the achievements, as well as the difficulties and obstacles that we have overcome together. This is the perfect momentum to prepare for a complete start of joy, promising a new journey with more victories!",
    "Tạm biệt Vinpearl Nha Trang với vô vàn kỷ niệm đẹp, chúng ta hãy cùng nhau mang nguồn năng lượng tích cực này trở lại công việc, tiếp tục đồng lòng, đoàn kết và vững bước tiến lên để chinh phục những mục tiêu lớn hơn.": "Saying goodbye to Vinpearl Nha Trang with countless beautiful memories, let us bring this positive energy back to work, continuing to unite, cooperate, and steadily step forward to conquer larger goals.",
    "Năm mới, vận hội mới, thiết bị cũng phải mới! Đầu tư cho công nghệ là đầu tư cho tương lai. Ghé 'Lục Giác' để chọn cho mình những siêu phẩm hỗ trợ đắc lực cho công việc và giải trí:": "New year, new opportunities, new equipment! Investing in technology is investing in the future. Visit 'Hexagon' to choose the best support products for yourself for work and entertainment:",
    "Công ty Cổ phần Lục Giác hân hạnh được đồng hành cùng các bạn sinh viên khoa Công nghệ Thông tin - Đại học Văn Hiến trong chương trình \"VHE Startup Devote\".": "Hexagon Joint Stock Company is pleased to accompany students of the Faculty of Information Technology - Van Hien University in the \"VHE Startup Devote\" program.",
    "Trong khuôn khổ cuộc thi, Lục Giác đã hỗ trợ các bạn sinh viên xây dựng mô hình kinh doanh thiết bị công nghệ điện tử, đồng thời chia sẻ phương pháp trình bày kế hoạch kinh doanh chuyên nghiệp và khả thi.": "Within the framework of the competition, Hexagon supported the students in building a business model for electronic technology equipment, and shared methods for presenting professional and feasible business plans.",
    "Với kinh nghiệm thực tế từ doanh nghiệp cùng sự sáng tạo và linh hoạt của các bạn sinh viên, đội myU đã xuất sắc chinh phục ban giám khảo và mang về giải thưởng cao nhất - Giải Nhất Khởi Nghiệp.": "With practical experience from the enterprise along with the creativity and flexibility of the students, the myU team excellently conquered the judges and brought home the highest award - First Prize in Startup.",
    "Thành công này không chỉ khẳng định sự chuyên nghiệp và tiềm năng của sinh viên Đại học Văn Hiến, mà còn thể hiện tầm nhìn phát triển mạnh mẽ của mô hình kinh doanh đến từ Lục Giác.": "This success not only confirms the professionalism and potential of Van Hien University students, but also demonstrates the strong growth vision of the business model from Hexagon.",
    "Lục Giác hy vọng sẽ tiếp tục đồng hành cùng các bạn sinh viên trong hành trình lan tỏa tinh thần khởi nghiệp trong kỷ nguyên số.": "Hexagon hopes to continue accompanying students on the journey of spreading the entrepreneurial spirit in the digital era.",
    "Gửi yêu cầu tư vấn": "Send consultation request",
    // Headers & Navigation
    "Trang chủ": "Home",
    "Giới thiệu": "About Us",
    "Dịch vụ": "Services",
    "Hỗ trợ": "Support",
    "Liên hệ": "Contact",
    "Tin tức": "News",
    "Quản trị hệ thống": "Admin Portal",
    "Tin tức & Sự kiện": "News & Events",
    "Tin tức mới nhất, cập nhật và thông tin từ Hexagon Corporation.": "Latest news, updates and announcements from Hexagon Corporation.",
    "Theo dõi những tin tức, sự kiện và thông tin nổi bật từ Hexagon Corporation.": "Follow technology news, outstanding events, and announcements from Hexagon Corporation.",
    "Cập nhật tin tức công nghệ, sự kiện nổi bật và thông báo mới nhất từ Hexagon Corporation.": "Updating technology news, outstanding events, and the latest announcements from Hexagon Corporation.",
    "Cập nhật tin tức, sự kiện và thông tin mới nhất từ Hexagon Corporation.": "Updating the latest news, events, and information from Hexagon Corporation.",
    
    // Switcher titles
    "Tiếng Việt": "Vietnamese",
    "English": "English",
    
    // Breadcrumbs
    "Bài viết": "Posts",
    "Hoạt động": "Activity",
    "Sự kiện": "Event",
    "Chuyển đổi số": "Digital Transformation",
    
    // Main sections headings
    "Lĩnh vực hoạt động": "Fields of Activity",
    "Dịch vụ của": "Our Services",
    "Chúng tôi tập trung phát triển hệ sinh thái công nghệ toàn diện, đáp ứng mọi nhu cầu chuyển đổi số của doanh nghiệp.": "We focus on developing a comprehensive technology ecosystem, meeting all digital transformation needs of businesses.",
    "Tại Hexagon, chúng tôi tập trung phát triển hệ sinh thái công nghệ toàn diện, bao gồm:": "At Hexagon, we focus on developing a comprehensive technology ecosystem, including:",
    "Các đối tác liên kết": "Affiliated Partners",
    "Đối tác chiến lược": "Strategic Partners",
    "Hexagon tự hào hợp tác cùng các thương hiệu hàng đầu trong hệ sinh thái công nghệ.": "Hexagon is proud to cooperate with leading brands in the technology ecosystem.",
    "Liên hệ với chúng tôi": "Contact Us",
    "Sẵn sàng cho dự án tiếp theo? Đội ngũ chuyên gia của Hexagon luôn ở đây để lắng nghe và đưa ra giải pháp tốt nhất cho bạn.": "Ready for the next project? Hexagon's team of experts is always here to listen and provide the best solution for you.",
    "Đội ngũ chuyên gia của Hexagon luôn ở đây để lắng nghe và đưa ra giải pháp công nghệ tốt nhất cho bạn.": "Hexagon's team of experts is always here to listen and provide the best technology solutions for you.",
    "Thông tin liên hệ trực tiếp": "Direct Contact Information",
    "Kết nối với chúng tôi": "Connect with Us",
    "Kết nối với": "Connect with",
    "chúng tôi": "us",
    
    // Footer & Meta
    "Copyright 2026 ©": "Copyright 2026 ©",
    "Hexagon Corporation": "Hexagon Corporation",
    ". All rights reserved.": ". All rights reserved.",
    ". All rights reserved. |": ". All rights reserved. |",
    "Trụ sở chính": "Headquarters",
    "615 Âu Cơ, Phường Tân Phú, TP. Hồ Chí Minh": "615 Au Co Street, Tan Phu Ward, Ho Chi Minh City",
    "Email": "Email",
    "Email liên hệ": "Email Address",
    "Hotline": "Hotline",
    "Hotline tư vấn": "Hotline",
    "Giờ làm việc": "Working Hours",
    "Thứ 2 - Thứ 6: 8:00 - 17:30": "Monday - Friday: 8:00 AM - 5:30 PM",
    "Liên kết": "Quick Links",
    "Trí tuệ nhân tạo": "Artificial Intelligence",
    "Trung tâm hỗ trợ": "Support Center",
    "Chính sách bảo mật": "Privacy Policy",
    "Điều khoản sử dụng": "Terms of Use",
    "Về trang chủ": "Go to Homepage",
    "Quay lại website chính": "Back to Main Website",
    
    // Home Page Specific
    "Công nghệ tương lai": "Future Technology",
    "HEXAGON Solutions": "HEXAGON Solutions",
    "Hexagon kiến tạo các giải pháp chuyển đổi số toàn diện, từ phần mềm, AI đến an ninh mạng, giúp doanh nghiệp bứt phá trong kỷ nguyên số.": "Hexagon creates comprehensive digital transformation solutions, from software and AI to cybersecurity, helping businesses break through in the digital era.",
    "Khám phá Dịch vụ": "Explore Services",
    "Liên hệ Tư vấn": "Contact for Consultation",
    "Cuộn xuống để khám phá": "Scroll down to discover",
    "Cuộn xuống": "Scroll down",
    "Về chúng tôi": "About Us",
    "Về Hexagon": "About Hexagon",
    "Hexagon Corporation – Công nghệ tiên phong, nơi chúng tôi không ngừng kiến tạo và đổi mới để mang đến những giá trị vượt trội trong kỷ nguyên số. Với tầm nhìn đa chiều và khát vọng vươn tầm, Hexagon tự hào là đối tác tin cậy, đồng hành cùng bạn trên hành trình chinh phục những đỉnh cao công nghệ.": "Hexagon Corporation – Pioneering technology, where we constantly create and innovate to deliver outstanding values in the digital era. With a multi-dimensional vision and aspiration to reach higher, Hexagon is proud to be a trusted partner, accompanying you on the journey to conquer technological peaks.",
    "🎯 Sứ mệnh": "🎯 Mission",
    "🚀 Tầm nhìn": "🚀 Vision",
    "💎 Giá trị cốt lõi": "💎 Core Values",
    "🌐 Nền tảng": "🌐 Platform",
    "Kiến tạo tương lai số bằng các giải pháp tiên tiến.": "Creating the digital future with advanced solutions.",
    "Kiến tạo tương lai số bằng các giải pháp tiên tiến": "Creating the digital future with advanced solutions",
    "Biểu tượng hệ sinh thái công nghệ đổi mới": "To become a symbol of an innovative technology ecosystem",
    "Trở thành biểu tượng về hệ sinh thái công nghệ đổi mới.": "To become a symbol of an innovative technology ecosystem.",
    "Đổi mới - Đồng hành - Tiên phong - Minh bạch.": "Innovation - Companionship - Pioneering - Transparency.",
    "Đổi mới - Đồng hành - Tiên phong - Minh bạch": "Innovation - Companionship - Pioneering - Transparency",
    "Hệ sinh thái đa ngành, vững chắc và linh hoạt.": "Multi-industry ecosystem, solid and flexible.",
    "Hệ sinh thái đa ngành, vững chắc và linh hoạt": "Multi-industry ecosystem, solid and flexible",
    "\"Làm ngày, làm đêm, làm thêm ngày nghỉ ^_^\"": "\"Work day, work night, work extra on days off ^_^\"",
    "— Hexagon Culture": "— Hexagon Culture",
    "Văn phòng Hexagon": "Hexagon Office",
    "Phần mềm & Ứng dụng": "Software & Applications",
    "Phát triển phần mềm, ứng dụng di động và giải pháp doanh nghiệp theo yêu cầu, ứng dụng công nghệ mới nhất.": "Developing customized software, mobile apps, and enterprise solutions using the latest technologies.",
    "Tìm hiểu thêm": "Learn More",
    "Tìm hiểu thêm →": "Learn More →",
    "Trí tuệ nhân tạo (AI)": "Artificial Intelligence (AI)",
    "Tích hợp AI vào quy trình kinh doanh, phát triển chatbot thông minh và hệ thống phân tích dữ liệu.": "Integrating AI into business processes, developing smart chatbots and data analysis systems.",
    "An ninh mạng": "Cybersecurity",
    "Bảo vệ hệ thống và dữ liệu doanh nghiệp khỏi các mối đe dọa, đánh giá lỗ hổng và tư vấn bảo mật.": "Protecting systems and business data from threats, assessing vulnerabilities, and security consulting.",
    "Dịch vụ đám mây": "Cloud Services",
    "Triển khai hạ tầng đám mây, di chuyển dữ liệu lên cloud và tối ưu hóa chi phí vận hành.": "Deploying cloud infrastructure, migrating data to the cloud, and optimizing operational costs.",
    "IoT & Công nghệ thông minh": "IoT & Smart Tech",
    "Giải pháp kết nối thiết bị thông minh, thu thập dữ liệu và tự động hóa quy trình sản xuất.": "Solutions for connecting smart devices, collecting data, and automating production processes.",
    "Tư vấn chuyển đổi số": "Digital Transformation Consulting",
    "Đồng hành cùng doanh nghiệp xây dựng chiến lược số hóa và tối ưu hóa quy trình vận hành.": "Accompanying businesses to build digitalization strategies and optimize operations.",
    
    // Articles list in Home Page
    "Không khí tưng bừng tại Chương trình Teambuilding myH25 tại Ngôi nhà Hùng Hậu": "Exciting atmosphere at the myH25 Teambuilding Program at Hung Hau House",
    "Cùng nhìn lại những khoảnh khắc đáng nhớ và đẹp nhất của đại gia đình HHC trong chương trình TEAMBUILDING MYH25, diễn ra tại khu nghỉ dưỡng Vinpearl Nha Trang.": "Looking back at the most memorable and beautiful moments of the HHC family in the TEAMBUILDING MYH25 program, held at Vinpearl Nha Trang resort.",
    "Đồng hành cùng sinh viên Đại học Văn Hiến tại Ngày hội sinh viên": "Accompanying Van Hien University students at the Student Festival",
    "Công ty Cổ phần Lục Giác hân hạnh được đồng hành cùng các bạn sinh viên khoa Công nghệ Thông tin - Đại học Văn Hiến trong chương trình \"VHE Startup Devote\".": "Hexagon Joint Stock Company is pleased to accompany students of the Faculty of Information Technology - Van Hien University in the \"VHE Startup Devote\" program.",
    "Sắm tết công nghệ - Nâng cấp thiết bị, khởi đầu bứt phá": "Shopping for tech Tet - Upgrading devices, starting a breakthrough",
    "Năm mới, vận hội mới, thiết bị cũng phải mới! Đầu tư cho công nghệ là đầu tư cho tương lai. Ghé 'Lục Giác' để chọn cho mình những siêu phẩm hỗ trợ đắc lực.": "New year, new opportunities, new equipment! Investing in technology is investing in the future. Visit 'Hexagon' to choose the best support products for yourself.",
    "Bài viết 4": "Article 4",
    "Bài viết 5": "Article 5",
    "Xem tất cả bài viết": "View All Posts",
    "Xem tất cả tin tức": "View All News",
    "Đọc tiếp": "Read More",
    "Đọc tiếp →": "Read More →",
    "Xem chi tiết": "View Details",
    "Xem chi tiết →": "View Details →",
    
    // Contact form inputs & labels
    "Họ và tên *": "Full Name *",
    "Họ tên của bạn": "Your full name",
    "Số điện thoại *": "Phone Number *",
    "Số điện thoại": "Phone number",
    "Địa chỉ Email *": "Email Address *",
    "Nội dung yêu cầu *": "Request Content *",
    "Hãy viết nội dung yêu cầu tại đây...": "Please write your request content here...",
    "Facebook": "Facebook",
    "LinkedIn": "LinkedIn",
    "YouTube": "YouTube",
    "Zalo": "Zalo",
    "Gửi Yêu Cầu": "Send Request",
    
    // Detail Pages - Lĩnh vực hoạt động
    // 1. Cung cấp thiết bị CNTT
    "Cung cấp thiết bị CNTT - Hexagon Corporation": "IT Equipment Supply - Hexagon Corporation",
    "Giải pháp nổi bật": "Outstanding Solutions",
    "Xây dựng hệ thống dữ liệu tập trung": "Centralized Data System Construction",
    "Phân tích dữ liệu &amp; trực quan hóa": "Data Analysis & Visualization",
    "Phân tích dữ liệu & trực quan hóa": "Data Analysis & Visualization",
    "Ứng dụng AI &amp; Machine Learning": "AI & Machine Learning Applications",
    "Ứng dụng AI & Machine Learning": "AI & Machine Learning Applications",
    "Quy trình thực hiện": "Implementation Process",
    "Quy trình chuyên nghiệp, minh bạch và hiệu quả.": "Professional, transparent and effective process.",
    "Thu thập &amp; chuẩn hóa dữ liệu": "Data Collection & Standardization",
    "Thu thập & chuẩn hóa dữ liệu": "Data Collection & Standardization",
    "Thiết kế kiến trúc dữ liệu": "Data Architecture Design",
    "Phát triển mô hình &amp; hệ thống": "Model & System Development",
    "Phát triển mô hình & hệ thống": "Model & System Development",
    "Triển khai &amp; tối ưu liên tục": "Continuous Deployment & Optimization",
    "Triển khai & tối ưu liên tục": "Continuous Deployment & Optimization",
    "Sẵn sàng triển khai?": "Ready to Deploy?",
    "Đừng để công nghệ làm rào cản. Hãy biến nó thành lợi thế cạnh tranh của bạn cùng Hexagon.": "Don't let technology be a barrier. Turn it into your competitive advantage with Hexagon.",
    "Về trang chủ": "Go to Homepage",
    "Liên hệ ngay": "Contact Now",
    
    // 2. Dịch vụ CNTT
    "Dịch vụ Công nghệ thông tin - Hexagon Corporation": "IT Services - Hexagon Corporation",
    "Dịch vụ Công nghệ thông tin": "IT Services",
    "Liên hệ tư vấn": "Contact for Consultation",
    "Giải pháp hệ thống camera giám sát": "Surveillance Camera System Solutions",
    "Giải pháp mạng WiFi doanh nghiệp": "Enterprise WiFi Network Solutions",
    "Giải pháp hạ tầng mạng &amp; tích hợp": "Network Infrastructure & Integration Solutions",
    "Giải pháp hạ tầng mạng & tích hợp": "Network Infrastructure & Integration Solutions",
    "Khảo sát &amp; tư vấn giải pháp": "Survey & Solution Consulting",
    "Khảo sát & tư vấn giải pháp": "Survey & Solution Consulting",
    "Thiết kế sơ đồ &amp; cấu hình hệ thống": "Diagram Design & System Configuration",
    "Thiết kế sơ đồ & cấu hình hệ thống": "Diagram Design & System Configuration",
    "Thi thi công &amp; lắp đặt": "Construction & Installation",
    "Thi công & lắp đặt": "Construction & Installation",
    "Bàn giao &amp; bảo trì": "Handover & Maintenance",
    "Bàn giao & bảo trì": "Handover & Maintenance",
    
    // 3. Giải pháp công nghệ
    "Giải pháp công nghệ - Hexagon Corporation": "Technology Solutions - Hexagon Corporation",
    "Giải pháp công nghệ": "Technology Solutions",
    "công nghệ": "technology",
    "Hài lòng khách hàng": "Customer Satisfaction",
    "Dự án hoàn thành": "Completed Projects",
    "Khách hàng giới thiệu": "Customer Referrals",
    "Hỗ trợ kỹ thuật": "Technical Support",
    "Năm kinh nghiệm": "Years of Experience",
    "nổi bật": "outstanding",
    "Phát triển phần mềm theo yêu cầu": "Custom Software Development",
    "Giải pháp chuyển đổi số doanh nghiệp": "Enterprise Digital Transformation Solutions",
    "thực hiện": "process",
    "Khảo sát &amp; phân tích yêu cầu": "Survey & Requirement Analysis",
    "Khảo sát & phân tích yêu cầu": "Survey & Requirement Analysis",
    "Phát triển &amp; Thử nghiệm": "Development & Testing",
    "Phát triển & Thử nghiệm": "Development & Testing",
    "Triển khai &amp; Bảo trì": "Deployment & Maintenance",
    "Triển khai & Bảo trì": "Deployment & Maintenance",
    
    // 4. Giải pháp thi công & lắp đặt
    "Giải pháp thi công &amp; lắp đặt - Hexagon Corporation": "Construction & Installation Solutions - Hexagon Corporation",
    "Giải pháp thi công & lắp đặt - Hexagon Corporation": "Construction & Installation Solutions - Hexagon Corporation",
    "Giải pháp thi công &amp; lắp đặt": "Construction & Installation Solutions",
    "Giải pháp thi công & lắp đặt": "Construction & Installation Solutions",
    "thi công &amp; lắp đặt": "construction & installation",
    "thi công & lắp đặt": "construction & installation",
    "Chất lượng": "Quality",
    "Đảm bảo tiến độ": "Schedule Assurance",
    "Khách hàng hài lòng": "Satisfied Customers",
    "Khảo sát &amp; đánh giá doanh nghiệp": "Enterprise Survey & Evaluation",
    "Khảo sát & đánh giá doanh nghiệp": "Enterprise Survey & Evaluation",
    "Xây dựng lộ trình &amp; giải pháp": "Roadmap & Solution Building",
    "Xây dựng lộ trình & giải pháp": "Roadmap & Solution Building",
    "Đồng hành triển khai &amp; tối ưu": "Accompanying Deployment & Optimization",
    "Đồng hành triển khai & tối ưu": "Accompanying Deployment & Optimization",
    "Đúng tiến độ": "On Schedule",
    "Cam kết bàn giao đúng thời hạn đã thỏa thuận": "Committed to delivering on agreed deadline",
    "Bảo hành dài hạn": "Long-term Warranty",
    "Chính sách bảo hành và hỗ trợ kỹ thuật lên đến 24 tháng": "Warranty policy and technical support up to 24 months",
    "Đội ngũ chuyên nghiệp": "Professional Team",
    "Kỹ sư giàu kinh nghiệm, tay nghề cao": "Experienced, highly skilled engineers",
    
    // Detail Pages - Tin tức
    "Bài viết 4 - Hexagon Corporation": "Article 4 - Hexagon Corporation",
    "Bài viết 4": "Article 4",
    "Đây là nội dung chi tiết của bài viết 4. Nội dung bài viết sẽ được cập nhật sau.": "This is the detailed content of Article 4. The content of the article will be updated later.",
    "Bài viết liên quan": "Related Posts",
    "Giải pháp công nghệ thông tin cho doanh nghiệp hiện đại": "IT solutions for modern enterprises",
    "Bài viết 5 - Hexagon Corporation": "Article 5 - Hexagon Corporation",
    "Bài viết 5": "Article 5",
    "Đây là nội dung chi tiết của bài viết 5. Nội dung bài viết sẽ được cập nhật sau.": "This is the detailed content of Article 5. The content of the article will be updated later.",
    "Không khí tưng bừng tại Chương trình Teambuilding myH25 tại Ngôi nhà Hùng Hậu - Hexagon Corporation": "Exciting atmosphere at the myH25 Teambuilding Program at Hung Hau House - Hexagon Corporation",
    "HHC - Sẵn sàng bứt phá!": "HHC - Ready to break through!",
    "Cung cấp thiết bị CNTT chất lượng cao cho doanh nghiệp": "Providing high-quality IT equipment for enterprises",
    "Sắm tết công nghệ - Nâng cấp thiết bị, khởi đầu bứt phá - Hexagon Corporation": "Shopping for tech Tet - Upgrading devices, starting a breakthrough - Hexagon Corporation",
    "Hiệu năng đỉnh cao.": "Peak performance.",
    "Thiết kế thời thượng.": "Trendy design.",
    "Giá tốt bất ngờ kèm quà tặng Tết giá trị.": "Surprisingly good prices with valuable Tet gifts.",
    "Đừng chỉ bắt đầu năm mới - hãy chinh phục nó với những công cụ phù hợp!": "Don't just start the new year - conquer it with the right tools!",
    "Đồng hành cùng sinh viên Đại học Văn Hiến tại Ngày hội sinh viên - Hexagon Corporation": "Accompanying Van Hien University students at the Student Festival - Hexagon Corporation",
    "Giải pháp phần mềm doanh nghiệp - Tối ưu hóa vận hành": "Enterprise software solutions - Optimizing operation",
    "Tin tức - Hexagon Corporation": "News - Hexagon Corporation",
    "Sắm tết công nghệ - Nâng cấp thiết bị, khởi đầu bứt phá": "Shopping for tech Tet - Upgrading devices, starting a breakthrough",
    "Trung tâm hỗ trợ": "Support Center",
    "Chính sách bảo mật": "Privacy Policy",
    "Điều khoản sử dụng": "Terms of Use",
    "Trí tuệ nhân tạo": "Artificial Intelligence",
    
    // Breadcrumbs inner items
    "Thông tin chi tiết": "Detailed Information",
    "Xem thêm các bài viết liên quan dưới đây.": "View more related articles below."
};

// Traverse and find all text nodes
function walkTextNodes(node, callback) {
    if (node.nodeType === 3) { // TEXT_NODE
        callback(node);
    } else {
        if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (let child of node.childNodes) {
                walkTextNodes(child, callback);
            }
        }
    }
}

// Function to translate the page
function translatePage(lang) {
    const dict = translationDictionary;
    
    // 1. Text nodes
    walkTextNodes(document.body, (node) => {
        if (!node._originalValue) {
            node._originalValue = node.nodeValue;
        }
        
        const text = node.nodeValue;
        const trimmed = text.trim();
        const normalized = trimmed.replace(/\s+/g, ' ');
        
        if (lang === 'en') {
            const matchKey = dict[trimmed] ? trimmed : (dict[normalized] ? normalized : null);
            if (matchKey) {
                const leading = text.match(/^\s*/)[0];
                const trailing = text.match(/\s*$/)[0];
                node.nodeValue = leading + dict[matchKey] + trailing;
            }
        } else {
            node.nodeValue = node._originalValue;
        }
    });
    
    // 2. Placeholders
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!input.dataset.originalPlaceholder) {
            input.dataset.originalPlaceholder = input.getAttribute('placeholder') || '';
        }
        
        if (lang === 'en') {
            const p = input.dataset.originalPlaceholder.trim();
            const normalizedP = p.replace(/\s+/g, ' ');
            const matchKey = dict[p] ? p : (dict[normalizedP] ? normalizedP : null);
            if (matchKey) {
                input.setAttribute('placeholder', dict[matchKey]);
            }
        } else {
            if (input.dataset.originalPlaceholder) {
                input.setAttribute('placeholder', input.dataset.originalPlaceholder);
            }
        }
    });

    // 3. Tooltips / Titles
    const titledElements = document.querySelectorAll('[title]');
    titledElements.forEach(el => {
        if (!el.dataset.originalTitle) {
            el.dataset.originalTitle = el.getAttribute('title') || '';
        }
        if (lang === 'en') {
            const t = el.dataset.originalTitle.trim();
            const normalizedT = t.replace(/\s+/g, ' ');
            const matchKey = dict[t] ? t : (dict[normalizedT] ? normalizedT : null);
            if (matchKey) {
                el.setAttribute('title', dict[matchKey]);
            }
        } else {
            if (el.dataset.originalTitle) {
                el.setAttribute('title', el.dataset.originalTitle);
            }
        }
    });

    // 4. Page Title
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        if (!pageTitle._originalValue) {
            pageTitle._originalValue = pageTitle.textContent;
        }
        if (lang === 'en') {
            const t = pageTitle._originalValue.trim();
            const normalizedT = t.replace(/\s+/g, ' ');
            const matchKey = dict[t] ? t : (dict[normalizedT] ? normalizedT : null);
            if (matchKey) {
                pageTitle.textContent = dict[matchKey];
            }
        } else {
            pageTitle.textContent = pageTitle._originalValue;
        }
    }
}

// Update the visually active switcher buttons
function updateLanguageSwitchers(lang) {
    const viBtns = document.querySelectorAll('button[title="Tiếng Việt"], button[title="Vietnamese"]');
    const enBtns = document.querySelectorAll('button[title="English"]');
    
    viBtns.forEach(btn => {
        if (lang === 'vi') {
            btn.classList.add('active');
            btn.style.opacity = '1';
        } else {
            btn.classList.remove('active');
            btn.style.opacity = '0.45';
        }
    });
    
    enBtns.forEach(btn => {
        if (lang === 'en') {
            btn.classList.add('active');
            btn.style.opacity = '1';
        } else {
            btn.classList.remove('active');
            btn.style.opacity = '0.45';
        }
    });
}

// Inject transition CSS dynamically
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), filter 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lang-switching {
            opacity: 0.08 !important;
            filter: blur(5px) !important;
        }
    `;
    document.head.appendChild(style);
})();

// Set up language switcher behavior on load
function initLanguageSwitcher() {
    // Default to 'vi' if not set
    let lang = safeStorage.getItem('hhc_lang');
    if (!lang) {
        lang = 'vi';
        safeStorage.setItem('hhc_lang', 'vi');
    }
    
    // Perform initial translation
    if (lang === 'en') {
        translatePage('en');
    }
    updateLanguageSwitchers(lang);
    
    // Setup click handlers
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('button[title]');
        if (!btn) return;
        
        const title = btn.getAttribute('title');
        let newLang = '';
        if (title === 'Tiếng Việt' || title === 'Vietnamese') {
            newLang = 'vi';
        } else if (title === 'English') {
            newLang = 'en';
        }
        
        if (newLang && newLang !== safeStorage.getItem('hhc_lang')) {
            e.preventDefault();
            
            // Add fade-out transition class
            document.body.classList.add('lang-switching');
            
            setTimeout(() => {
                safeStorage.setItem('hhc_lang', newLang);
                translatePage(newLang);
                updateLanguageSwitchers(newLang);
                
                // Dispatch language changed event (e.g. to notify typing effect to reset)
                window.dispatchEvent(new Event('hhc-lang-changed'));
                
                // Fade-in back
                setTimeout(() => {
                    document.body.classList.remove('lang-switching');
                }, 40);
            }, 220);
        }
    });
}

// Initialize switchers when script is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}
