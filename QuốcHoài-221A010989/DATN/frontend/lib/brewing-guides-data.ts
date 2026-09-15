import { BrewingGuide } from '@/types/brewing-guide'

export const BREWING_GUIDES: BrewingGuide[] = [
  {
    id: 'espresso-perfect',
    title: 'Cách pha Espresso hoàn hảo',
    description: 'Hướng dẫn chi tiết cách pha tách espresso ngon với đúng độ nén và nhiệt độ',
    image: '/guides/espresso.png',
    brewTime: '25-30 giây',
    difficulty: 'Trung bình',
    drinkType: 'Espresso',
    postedDate: '15 tháng 3, 2024',
    ingredients: [
      { name: 'Hạt cà phê Espresso', amount: '18-20g' },
      { name: 'Nước nóng', amount: '200-250ml' },
    ],
    tools: [
      { name: 'Máy pha Espresso', description: 'Bất kỳ máy pha espresso nào với áp lực 9 bar' },
      { name: 'Cối xay', description: 'Xay mịn để tạo hạt đều' },
      { name: 'Tamp', description: 'Dụng cụ nén cà phê' },
      { name: 'Tách Espresso', description: 'Tách gốm dung tích 25-30ml' },
    ],
    steps: [
      {
        number: 1,
        title: 'Chuẩn bị hạt cà phê',
        description: 'Xay cà phê thành hạt mịn, mịn như bột cacao. Nhiệt độ lý tưởng là 90-93°C',
        tips: ['Xay vừa để tránh bụi', 'Sử dụng cà phê tươi nhất'],
      },
      {
        number: 2,
        title: 'Nén cà phê',
        description: 'Đặt 18-20g cà phê vào giỏ. Nén với áp lực đều 30-40kg cho tới khi bằng mặt giỏ',
        tips: ['Nén đều để tránh dòng chảy không đều', 'Kiểm tra không bị rò rỉ ở bên cạnh'],
      },
      {
        number: 3,
        title: 'Chiết xuất',
        description: 'Bắt đầu máy pha. Thời gian chiết xuất lý tưởng là 25-30 giây. Espresso sẽ có màu nâu sẫm với crema vàng',
        tips: ['Quá nhanh: Nên nén nhiều hơn', 'Quá chậm: Nên xay mịn hơn'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/j6QPs3bJ_ZE',
    tips: [
      'Luôn làm ấm tách trước khi đổ espresso vào',
      'Sử dụng nước đã lọc để tránh vôi',
      'Làm sạch đầu máy sau mỗi lần pha',
      'Thay gasket mỗi 3-6 tháng',
    ],
    relatedGuides: ['cappuccino-art', 'latte-creamy'],
  },
  {
    id: 'cappuccino-art',
    title: 'Cappuccino với Latte Art',
    description: 'Học cách tạo hình vẽ đẹp trên bề mặt cà phê cappuccino của bạn',
    image: '/guides/cappuccino.png',
    brewTime: '3-4 phút',
    difficulty: 'Khó',
    drinkType: 'Cappuccino',
    postedDate: '12 tháng 3, 2024',
    ingredients: [
      { name: 'Espresso', amount: '30ml' },
      { name: 'Sữa tươi', amount: '150ml' },
      { name: 'Foam sữa', amount: '100ml' },
    ],
    tools: [
      { name: 'Máy pha Espresso', description: 'Với thanh hơi nước' },
      { name: 'Pitchers thép', description: 'Dung tích 350-600ml' },
      { name: 'Thermometer', description: 'Để đo nhiệt độ sữa' },
      { name: 'Tách Cappuccino', description: 'Dung tích 150-180ml' },
    ],
    steps: [
      {
        number: 1,
        title: 'Pha Espresso',
        description: 'Pha một hoặc hai shot espresso vào tách đã được làm ấm',
        tips: ['Dùng espresso tươi', 'Tách phải ấm để duy trì nhiệt độ'],
      },
      {
        number: 2,
        title: 'Đánh sữa',
        description: 'Đổ sữa lạnh vào pitcher. Chìm ống hơi vào sữa và bắt đầu hơi nước. Quay mạnh để tạo xoáy',
        tips: ['Giữ nhiệt độ dưới 65°C', 'Tạo âm thanh soughing', 'Giữ ống hơi sát mặt sữa'],
      },
      {
        number: 3,
        title: 'Đổ Latte Art',
        description: 'Để sữa nguội một chút. Tay cầm pitcher cao và nghiêng. Bắt đầu đổ từ từ từ xa, sau đó tiến lại gần',
        tips: ['Bắt đầu với một vòng tròn cơ bản', 'Sau khi quen có thể vẽ hoa hay trái tim'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/jMlFkxzklG4',
    tips: [
      'Sữa tươi 3.5% béo là lý tưởng',
      'Thanh hơi phải sạch',
      'Sữa không được nóng quá 70°C',
      'Luyện tập để hoàn hảo kỹ thuật',
    ],
    relatedGuides: ['latte-creamy', 'espresso-perfect'],
  },
  {
    id: 'cold-brew-smooth',
    title: 'Cold Brew mịn mà',
    description: 'Pha cà phê lạnh siêu mịn với hương vị đậm đà nhưng không cay',
    image: '/guides/cold-brew.png',
    brewTime: '12-24 giờ',
    difficulty: 'Dễ',
    drinkType: 'Cold Brew',
    postedDate: '10 tháng 3, 2024',
    ingredients: [
      { name: 'Hạt cà phê', amount: '100g' },
      { name: 'Nước lạnh', amount: '500ml' },
      { name: 'Đá lạnh', amount: 'Tùy chỉnh' },
    ],
    tools: [
      { name: 'Jar thủy tinh', description: 'Dung tích 1 lít trở lên' },
      { name: 'Bộ lọc cà phê', description: 'Hoặc gaze sạch' },
      { name: 'Cối xay', description: 'Xay thô' },
    ],
    steps: [
      {
        number: 1,
        title: 'Xay cà phê',
        description: 'Xay hạt cà phê thành hạt thô, giống hạt đường cát',
        tips: ['Không xay mịn để tránh quá đắng', 'Sử dụng cà phê tươi'],
      },
      {
        number: 2,
        title: 'Trộn cà phê và nước',
        description: 'Đổ cà phê vào jar. Thêm nước lạnh theo tỷ lệ 1:5 (100g cà phê : 500ml nước)',
        tips: ['Khuấy tốt để cà phê thấm nước đều', 'Sử dụng nước đã lọc'],
      },
      {
        number: 3,
        title: 'Ngâm qua đêm',
        description: 'Đậy nắp jar và để tủ lạnh 12-24 giờ. Có thể để ở nhiệt độ phòng 8 giờ nếu muốn',
        tips: ['Ngâm lâu hơn = hương vị đậm hơn', 'Không có mộc độ chiết xuất quá'],
      },
      {
        number: 4,
        title: 'Lọc và phục vụ',
        description: 'Lọc hỗn hợp qua bộ lọc. Uống pure hoặc pha với sữa theo sở thích',
        tips: ['Có thể bảo quản được 2 tuần', 'Uống pha nước hoặc sữa'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/1bHB-P3-nCM',
    tips: [
      'Nước lọc sẽ cho vị tốt hơn',
      'Có thể ủ ở nhiệt độ phòng trong 8 giờ',
      'Bảo quản ở tủ lạnh kéo dài hạn sử dụng',
      'Pha 1 phần cold brew với 2 phần sữa để làm Smooth Latte',
    ],
    relatedGuides: ['latte-creamy', 'ca-phe-da'],
  },
  {
    id: 'latte-creamy',
    title: 'Latte kem mịn',
    description: 'Cách pha tách latte hoàn hảo với foam sữa mịn và hương vị cân bằng',
    image: '/guides/latte.png',
    brewTime: '4-5 phút',
    difficulty: 'Trung bình',
    drinkType: 'Latte',
    postedDate: '8 tháng 3, 2024',
    ingredients: [
      { name: 'Espresso', amount: '30-45ml' },
      { name: 'Sữa tươi', amount: '200-250ml' },
      { name: 'Foam sữa', amount: '30-50ml' },
    ],
    tools: [
      { name: 'Máy pha Espresso', description: 'Với thanh hơi nước' },
      { name: 'Pitcher sữa', description: 'Dung tích 600ml' },
      { name: 'Tách Latte', description: 'Dung tích 250ml' },
      { name: 'Thermometer', description: 'Tùy chọn' },
    ],
    steps: [
      {
        number: 1,
        title: 'Pha Espresso',
        description: 'Pha 1-2 shot espresso (30-45ml) vào tách đã làm ấm',
        tips: ['Dùng espresso tươi', 'Pha nhanh để tránh nguội'],
      },
      {
        number: 2,
        title: 'Đánh sữa',
        description: 'Đổ sữa vào pitcher. Chìm ống hơi và tạo micro-foam. Sữa nên hơi nóng chứ không sủi bọt',
        tips: ['Micro-foam là chìa khóa', 'Không nên quá 65°C', 'Âm thanh sẽ êm hơn cappuccino'],
      },
      {
        number: 3,
        title: 'Đổ sữa vào Espresso',
        description: 'Đổ sữa từ từ vào espresso, giữ tỷ lệ 3-4 phần sữa : 1 phần espresso',
        tips: ['Đổ từ cao trước để trộn', 'Sau đó gần lên để làm foam nằm trên mặt'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/ZKVtF-pDkDU',
    tips: [
      'Micro-foam mịn từ sữa thực sự rất quan trọng',
      'Latte có nhiều sữa hơn Cappuccino',
      'Sữa cao nguyên hoặc sữa tươi nguyên chất tốt nhất',
      'Uống ngay để giữ nhiệt độ',
    ],
    relatedGuides: ['cappuccino-art', 'espresso-perfect'],
  },
  {
    id: 'mocha-chocolate',
    title: 'Mocha với Chocolate',
    description: 'Hướng dẫn pha cà phê mocha hòa quyện hương vị cà phê và sô cô la',
    image: '/guides/cappuccino.png',
    brewTime: '5-6 phút',
    difficulty: 'Trung bình',
    drinkType: 'Mocha',
    postedDate: '5 tháng 3, 2024',
    ingredients: [
      { name: 'Espresso', amount: '30ml' },
      { name: 'Sô cô la', amount: '20-30ml' },
      { name: 'Sữa tươi', amount: '150ml' },
      { name: 'Kem tươi', amount: '30ml' },
    ],
    tools: [
      { name: 'Máy pha Espresso', description: '' },
      { name: 'Pitcher sữa', description: '' },
      { name: 'Tách Latte', description: '' },
    ],
    steps: [
      {
        number: 1,
        title: 'Chuẩn bị sô cô la',
        description: 'Đổ 20-30ml sô cô la vào tách, nếu sô cô la lạnh hãy hơi nước một chút',
        tips: ['Sô cô la chất lượng cao sẽ ngon hơn'],
      },
      {
        number: 2,
        title: 'Pha Espresso',
        description: 'Pha 1 shot espresso (30ml) và đổ vào tách sô cô la',
        tips: ['Sốc nhiệt sẽ giúp sô cô la chảy tốt hơn'],
      },
      {
        number: 3,
        title: 'Đánh sữa và đổ',
        description: 'Đánh sữa thành foam và đổ vào, sau đó vắt kem tươi lên trên',
        tips: ['Kem giúp balans vị ngọt', 'Có thể rưới sô cô la thêm trên cùng'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/hxIGvvGfV3U',
    tips: [
      'Sô cô la nguyên chất tốt nhất',
      'Không nên quá ngọt',
      'Kem tươi sẽ cân bằng hương vị',
    ],
    relatedGuides: ['latte-creamy', 'espresso-perfect'],
  },
  {
    id: 'ca-phe-sua',
    title: 'Cà phê sữa Việt truyền thống',
    description: 'Cách pha cà phê sữa đậm đà theo phong cách Việt Nam với phin truyền thống',
    image: '/guides/cold-brew.png',
    brewTime: '5-7 phút',
    difficulty: 'Dễ',
    drinkType: 'Cà phê sữa',
    postedDate: '1 tháng 3, 2024',
    ingredients: [
      { name: 'Cà phê sữa (Trung Nguyên hoặc tương tự)', amount: '15-20g' },
      { name: 'Nước nóng', amount: '150-200ml' },
      { name: 'Sữa đặc', amount: '20-30ml' },
    ],
    tools: [
      { name: 'Phin cà phê Việt', description: 'Phin thủy tinh hoặc kim loại' },
      { name: 'Tách hoặc cốc', description: 'Dung tích 250ml' },
    ],
    steps: [
      {
        number: 1,
        title: 'Chuẩn bị sữa',
        description: 'Đổ 20-30ml sữa đặc vào tách. Nếu muốn uống lạnh, thêm đá',
        tips: ['Lượng sữa tùy vào sở thích', 'Sữa đặc là truyền thống'],
      },
      {
        number: 2,
        title: 'Chuẩn bị phin',
        description: 'Đặt phễu phin lên tách, đặt lưới cửa và thớt lên trên. Cho cà phê vào, từ từ rắc chẻn cà phê',
        tips: ['Cà phê xay thô', 'Không rắc quá chặt'],
      },
      {
        number: 3,
        title: 'Phục vụ',
        description: 'Đổ nước nóng vào phin, đợi 5-7 phút. Nước sẽ chảy từ từ, hỗn hợp với sữa thành cà phê sữa đậm',
        tips: ['Đợi patiently', 'Mùi thơm sẽ rất hấp dẫn', 'Khuấy trộn trước khi uống'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/LQMqQb8OBFI',
    tips: [
      'Cà phê xay thô để kéo dài thời gian pha',
      'Nước nóng khoảng 80-85°C là lý tưởng',
      'Sữa đặc là chìa khóa hương vị',
      'Uống nóng hoặc pha thêm đá để uống lạnh',
    ],
    relatedGuides: ['ca-phe-da', 'cold-brew-smooth'],
  },
  {
    id: 'ca-phe-da',
    title: 'Cà phê đá Việt lạnh',
    description: 'Cà phê đá mát lạnh với hương vị đậm đà, hoàn hảo cho mùa hè',
    image: '/guides/cold-brew.png',
    brewTime: '5-8 phút',
    difficulty: 'Dễ',
    drinkType: 'Cà phê đá',
    postedDate: '28 tháng 2, 2024',
    ingredients: [
      { name: 'Cà phê sữa xay', amount: '20-25g' },
      { name: 'Nước nóng', amount: '150ml' },
      { name: 'Sữa đặc', amount: '15-20ml' },
      { name: 'Đá lạnh', amount: 'Tùy chỉnh' },
    ],
    tools: [
      { name: 'Phin cà phê', description: '' },
      { name: 'Cốc cao', description: 'Dung tích 350-400ml' },
    ],
    steps: [
      {
        number: 1,
        title: 'Chuẩn bị cốc',
        description: 'Đổ đá lạnh vào cốc cao. Thêm 15-20ml sữa đặc (tùy sở thích)',
        tips: ['Đá nhiều = lạnh hơn', 'Sữa đặc tạo vị ngọt'],
      },
      {
        number: 2,
        title: 'Pha cà phê',
        description: 'Đặt phin, cho 20-25g cà phê xay. Đổ nước nóng và đợi 5-8 phút',
        tips: ['Nước nóng 85°C', 'Không cần rắc chẻn cà phê'],
      },
      {
        number: 3,
        title: 'Thưởng thức',
        description: 'Khi cà phê chảy hết, lấy phin ra. Khuấy trộn cà phê sữa và đá lạnh. Uống ngay',
        tips: ['Đá sẽ tan dần, cà phê sẽ ngựa ngào hơn', 'Nhanh chóng thưởng thức'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/lW8WJPRHqxw',
    tips: [
      'Cà phê đá là lựa chọn tuyệt vời cho mùa hè',
      'Sử dụng cà phê tươi để có hương vị tốt nhất',
      'Có thể thêm đường nếu muốn',
      'Khuấy tốt trước khi uống',
    ],
    relatedGuides: ['ca-phe-sua', 'cold-brew-smooth'],
  },
  {
    id: 'pour-over-clean',
    title: 'Pour Over - Hương vị sạch',
    description: 'Phương pháp pha cà phê pour over tạo hương vị sạch và tinh tế',
    image: '/guides/espresso.png',
    brewTime: '3-4 phút',
    difficulty: 'Trung bình',
    drinkType: 'Espresso',
    postedDate: '25 tháng 2, 2024',
    ingredients: [
      { name: 'Cà phê xay vừa', amount: '15-17g' },
      { name: 'Nước nóng', amount: '250ml' },
    ],
    tools: [
      { name: 'Dripper Pour Over', description: 'V60, Chemex, hoặc Melitta' },
      { name: 'Lọc cà phê', description: 'Lọc giấy hoặc kim loại' },
      { name: 'Kettle', description: 'Kettle gooseneck tốt nhất' },
      { name: 'Scale', description: 'Để đo chính xác' },
    ],
    steps: [
      {
        number: 1,
        title: 'Chuẩn bị',
        description: 'Đặt lọc vào dripper và rửa bằng nước nóng. Làm ấm tách',
        tips: ['Rửa lọc để loại bỏ hương vị giấy', 'Tránh để kettle nguội'],
      },
      {
        number: 2,
        title: 'Thêm cà phê',
        description: 'Đổ 15-17g cà phê xay vừa vào dripper. Tạo một hố nhỏ ở giữa',
        tips: ['Xay vừa tương tự cát', 'Lượng 1:17 (cà phê:nước) là tốt'],
      },
      {
        number: 3,
        title: 'Đổ từ từ',
        description: 'Đổ nước nóng 50ml trước (bloom), đợi 30 giây. Sau đó đổ từ từ theo vòng tròn cho tới hết',
        tips: ['Nước 90-95°C', 'Đổ từ từ tạo extraction tốt', 'Tổng 3-4 phút'],
      },
    ],
    videoUrl: 'https://www.youtube.com/embed/f3w4VfxFEKE',
    tips: [
      'Pour over tạo hương vị sạch và tinh tế',
      'Cà phê xay vừa là chìa khóa',
      'Nước lọc sẽ giúp hương vị rõ ràng',
      'Thưởng thức ngay khi còn nóng',
    ],
    relatedGuides: ['espresso-perfect', 'cold-brew-smooth'],
  },
]

export const DRINK_TYPES = [
  'Espresso',
  'Cappuccino',
  'Latte',
  'Mocha',
  'Cold Brew',
  'Cà phê sữa',
  'Cà phê đá',
]

export function getGuidesByDrinkType(type: string) {
  if (type === 'Tất cả') return BREWING_GUIDES
  return BREWING_GUIDES.filter((guide) => guide.drinkType === type)
}

export function searchGuides(query: string) {
  const lowerQuery = query.toLowerCase()
  return BREWING_GUIDES.filter(
    (guide) =>
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.description.toLowerCase().includes(lowerQuery)
  )
}

export function getGuideById(id: string) {
  return BREWING_GUIDES.find((guide) => guide.id === id)
}
