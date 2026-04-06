import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Speaker, 
  Disc, 
  Maximize, 
  Wallet, 
  Sparkles, 
  ChevronRight, 
  Loader2, 
  Download, 
  Copy, 
  RefreshCw,
  AlertTriangle,
  Info,
  Layers,
  Image as ImageIcon,
  BookOpen,
  X,
  Heart,
  Zap,
  Volume2,
  DollarSign,
  HelpCircle,
  Globe
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { getMaestroAdvice, getSpeakerAdvice, generateSetupImage } from '@/src/services/llmService';
import { ApiProvider, ApiConfig, SpeakerInput } from '@/src/types';
import { sanitizeInput, obfuscate, deobfuscate } from '@/src/lib/security';
import { Settings, Plus, Trash2, CheckCircle2, Layout, Radio } from 'lucide-react';

const TRANSLATIONS = {
  vi: {
    title: "THE GRAND MAESTRO",
    subtitle: "60 năm kinh nghiệm Audiophile",
    legacy: "Phối ghép huyền thoại",
    synergy: "Sự hòa quyện là tất cả. 7 + 7 = 25.",
    inputTitle: "Thông số Đầu vào",
    inputDesc: "Dữ liệu của bạn là cơ sở để Maestro tính toán sự tương quan giữa các dải tần và trở kháng.",
    example: "Ví dụ",
    equipment: "Thiết bị hiện có (Loa/Amply)",
    musicTaste: "Gu âm nhạc chính",
    source: "Nguồn nhạc",
    material: "Vật liệu phòng chính",
    roomSize: "Diện tích phòng",
    budget: "Ngân sách tối đa",
    analyze: "NHẬN TƯ VẤN TỪ MAESTRO",
    guide: "Hướng dẫn sử dụng",
    guideTitle: "CẨM NANG MAESTRO",
    guideStep1: "1. Cấu hình API",
    guideStep1Desc: "Nhấn vào 'Cấu hình API' ở góc trên bên phải. Thêm API Key từ Gemini, OpenAI, OpenRouter hoặc cấu hình Local LLM (Ollama) để kích hoạt bộ não của Maestro.",
    guideStep2: "2. Chọn Tab Tư vấn",
    guideStep2Desc: "Sử dụng tab 'Phối ghép Hệ thống' nếu bạn đã có loa/amply. Sử dụng tab 'Tư vấn Chọn Loa' nếu bạn đang tìm mua loa mới.",
    guideStep3: "3. Nhập thông số chính xác",
    guideStep3Desc: "Cung cấp chi tiết về thiết bị, diện tích phòng và gu âm nhạc. Càng chi tiết, Maestro tư vấn càng 'đúng long mạch'.",
    guideStep4: "4. Phân tích & Thực thi",
    guideStep4Desc: "Nhấn 'NHẬN TƯ VẤN'. Maestro sẽ đưa ra lộ trình nâng cấp, các cặp phối ghép vàng và những thiết bị tuyệt đối không nên mua.",
    guideFooter: "Lưu ý: Phối ghép là nghệ thuật của sự bù trừ. Hãy tin vào đôi tai của chính mình.",
    tabPairing: "Phối ghép Hệ thống",
    tabSpeaker: "Tư vấn Chọn Loa",
    speakerTaste: "Khẩu vị âm thanh",
    tasteFullRange: "Mộc mạc, tinh tế (Toàn dải)",
    tasteCoaxial: "Đồng nhất, sân khấu rộng (Đồng trục)",
    tasteMultiWay: "Đầy đặn, uy lực (3-4 đường tiếng)",
    roomHeight: "Chiều cao phòng (m)",
    roomAcoustics: "Vật liệu phòng & Tiêu tán âm",
    ampType: "Ampli hiện có (Tùy chọn)",
    placeholderAmp: "VD: Chưa có, hoặc Accuphase E-280",
    sourceType: "Nguồn nhạc chính",
    volumeHabit: "Thói quen âm lượng",
    volLow: "Thì thầm, chi tiết đêm khuya",
    volHigh: "Mở lớn, cảm nhận độ động",
    aesthetic: "Gu thẩm mỹ & Kỳ vọng",
    aesVintage: "Vintage (Thùng gỗ, Loa cổ)",
    aesModern: "Modern (Thon gọn, Sơn mài)",
    expectation: "Kỳ vọng âm thanh",
    expNeutral: "Trung thực tuyệt đối",
    expSweet: "Ngọt ngào, nịnh tai",
    analyzing: "ĐANG PHÂN TÍCH...",
    philosophy: "Triết lý Maestro",
    philosophyQuote: "\"Tôi không quan tâm bạn giàu thế nào. Tôi chỉ quan tâm đôi tai bạn được phục vụ ra sao. Phối ghép là nghệ thuật của sự bù trừ.\"",
    reportTitle: "Báo cáo Phối ghép",
    reportDesc: "Hãy điền thông tin hệ thống của bạn ở bảng bên phải. Maestro sẽ trả về một báo cáo khoa học, biểu đồ âm sắc và hình ảnh AI minh họa.",
    waiting: "Đang chờ dữ liệu",
    chartTitle: "Biểu đồ đặc tính âm sắc",
    aiImage: "Hình ảnh phối ghép AI",
    copy: "Sao chép",
    copied: "Đã sao chép",
    download: "Tải báo cáo (.md)",
    filename: "bao-cao-maestro.md",
    newAdvice: "Tư vấn mới",
    drawing: "Maestro đang vẽ...",
    placeholderImage: "Hình ảnh sẽ xuất hiện sau khi phân tích",
    error: "Đã có lỗi xảy ra khi kết nối với The Grand Maestro. Vui lòng thử lại.",
    quotaError: "Bạn đã hết hạn mức sử dụng API. Vui lòng kiểm tra lại gói dịch vụ hoặc thử lại sau.",
    certified: "Chứng nhận\nMaestro\nLựa chọn",
    footer: "The Grand Maestro created by Hung Nguyen © 2026 | Triết lý âm thanh thuần khiết",
    about: "Giới thiệu",
    settings: "Cấu hình API",
    apiManagement: "Quản lý API",
    provider: "Nhà cung cấp",
    apiKey: "API Key",
    model: "Model",
    name: "Tên gợi nhớ",
    baseUrl: "URL API Nội bộ",
    addApi: "Thêm API",
    active: "Đang dùng",
    noApis: "Chưa có API nào được cấu hình. Vui lòng thêm ít nhất một API.",
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    aboutContent: `# 🎼 THE GRAND MAESTRO
### *Huyền Thoại Phối Ghép & Người Thầy Audiophile Ảo*

---

**The Grand Maestro** không chỉ là một ứng dụng, đó là sự kết tinh của **60 năm đam mê**, hàng chục ngàn giờ nghe thử và sự am hiểu sâu sắc về linh hồn của âm thanh. Được xây dựng dựa trên trí tuệ của những bậc thầy âm thanh thực thụ, Maestro mang đến cho bạn một trải nghiệm tư vấn chưa từng có.

### 🏛️ Triết lý "Sự Hòa Quyện Tuyệt Đối" (Synergy)
Trong giới âm thanh, chúng tôi tin rằng: **1 + 1 không phải là 2, mà phải là 3, hoặc thậm chí là 5.**
Một bộ dàn đắt tiền chưa chắc đã hay nếu các thiết bị "đánh nhau". Maestro hoạt động dựa trên triết lý **"Bù trừ và Cân bằng"**:
> *"Nếu loa của bạn quá sáng, tôi sẽ tìm cho bạn một chiếc amply ấm áp. Nếu phòng của bạn quá dội, tôi sẽ chỉ cho bạn cách chế ngự nó. Phối ghép là một nghệ thuật, và Maestro là người nhạc trưởng của bạn."*

### 🌟 Những Giá Trị Cốt Lõi
*   **🔍 Phân Tích Kỹ Thuật Chuyên Sâu:** Không chỉ nhìn vào thương hiệu, Maestro phân tích sâu vào trở kháng, độ nhạy, dòng điện và đặc tính hài âm của từng thiết bị.
*   **🏠 Âm Học Phòng Nghe:** Chúng tôi hiểu rằng căn phòng là thiết bị quan trọng nhất. Maestro tính toán sự tương tác giữa vật liệu tường, diện tích và vị trí đặt loa để đưa ra lời khuyên chính xác nhất.
*   **📋 10 Lựa Chọn Đẳng Cấp:** Bạn sẽ nhận được 5 phương án **Bán dẫn (Solid-State)** mạnh mẽ, chính xác và 5 phương án **Đèn (Tube)** ngọt ngào, ma mị.
*   **📊 Biểu Đồ Đặc Tính Âm Sắc:** Một cái nhìn trực quan về 5 yếu tố: Chi tiết, Ấm áp, Âm trường, Tốc độ và Lực bass.
*   **🎨 Tầm Nhìn Không Gian:** AI của chúng tôi sẽ phác họa nên một không gian nghe nhạc lý tưởng, nơi các thiết bị được sắp đặt một cách khoa học và đầy tính nghệ thuật.

### 🤝 Lời Hứa Từ Maestro
Tôi không nhận hoa hồng từ bất kỳ hãng nào. Tôi không quan tâm bạn giàu hay nghèo. Tôi chỉ quan tâm đến việc **đôi tai của bạn được phục vụ một cách xứng đáng nhất**.

---
*Created by **Hung Nguyen** | © 2026 The Grand Maestro*`,
    detail: "Chi tiết",
    warmth: "Ấm áp",
    soundstage: "Âm trường",
    speed: "Tốc độ",
    punch: "Lực bass",
    legacyQuote: "\"Những phối ghép này đã đứng vững qua hàng thập kỷ. Chúng là tiêu chuẩn vàng để bạn tham chiếu.\"",
    sourceDigital: "Digital (Streaming/CD)",
    sourceVinyl: "Vinyl (Đĩa than)",
    sourceTape: "Tape (Băng cối/Cassette)",
    sourceStreaming: "Streaming (Tidal/Qobuz)",
    matBrick: "Tường gạch / Sơn",
    matWood: "Vách gỗ / Tiêu âm gỗ",
    matGlass: "Nhiều kính / Cửa sổ lớn",
    matPlaster: "Trần thạch cao",
    matOpen: "Phòng khách hở / Thông tầng",
    matBedroom: "Phòng ngủ (nhiều đồ vải/rèm)",
    matDedicated: "Phòng nghe chuyên biệt (đã xử lý)",
    placeholderEquip: "Ví dụ: JBL L100 Century, Denon PMA-2000...",
    placeholderMusic: "Ví dụ: Jazz, Vocal, Rock thập niên 70...",
    placeholderSize: "m2",
    placeholderBudget: "VNĐ / USD",
    exampleEquip: "JBL L100 Century, Denon PMA-2000",
    exampleMusic: "Jazz, Vocal, Rock thập niên 70",
    exampleBudget: "20.000.000 VNĐ",
    legacyPairings: [
      { title: "Tannoy + Accuphase", desc: "Sự ngọt ngào, ấm áp kinh điển của Anh Quốc kết hợp với sự chính xác, tinh tế của Nhật Bản. Phù hợp cho Jazz và Vocal." },
      { title: "JBL + McIntosh", desc: "Sức mạnh cơ bắp Mỹ. Tiếng bass uy lực, dải trung rực rỡ. Phối ghép huyền thoại cho Rock và Pop." },
      { title: "LS3/5a + Rogers/Leak", desc: "Huyền thoại phòng thu BBC. Dải trung (midrange) quyến rũ nhất lịch sử âm thanh." },
      { title: "Klipsch + Cary Audio", desc: "Loa kèn độ nhạy cao đi cùng amply đèn Single-Ended. Sự sống động và nhạc tính tuyệt đối." },
      { title: "B&W + Classé", desc: "Sự kết hợp hoàn hảo giữa độ chi tiết cực cao và khả năng kiểm soát loa tuyệt vời. Tiêu chuẩn cho phòng thu Abbey Road." },
      { title: "Sonus Faber + Audio Research", desc: "Vẻ đẹp Ý quyến rũ đi cùng chất âm đèn Mỹ ấm áp, rộng mở. Đỉnh cao của sự sang trọng." },
      { title: "Dynaudio + Krell", desc: "Loa Đan Mạch khó tính cần dòng điện cực lớn từ amply Mỹ để phô diễn hết sức mạnh dải trầm." },
      { title: "ProAc + Naim", desc: "Chất âm 'Pace, Rhythm and Timing' đặc trưng của Anh Quốc. Rất nhạc tính và lôi cuốn." }
    ]
  },
  en: {
    title: "THE GRAND MAESTRO",
    subtitle: "60 Years of Audiophile Wisdom",
    legacy: "Legendary Pairings",
    synergy: "Synergy is everything. 7 + 7 = 25.",
    inputTitle: "Input Parameters",
    inputDesc: "Your data is the basis for Maestro to calculate the correlation between frequency bands and impedance.",
    example: "Example",
    equipment: "Existing Equipment (Speakers/Amp)",
    musicTaste: "Primary Music Taste",
    source: "Music Source",
    material: "Primary Room Material",
    roomSize: "Room Size",
    budget: "Maximum Budget",
    analyze: "GET MAESTRO ADVICE",
    guide: "User Guide",
    guideTitle: "MAESTRO HANDBOOK",
    guideStep1: "1. API Configuration",
    guideStep1Desc: "Click 'API Settings' in the top right. Add an API Key from Gemini, OpenAI, OpenRouter, or configure a Local LLM (Ollama) to activate Maestro's brain.",
    guideStep2: "2. Choose Consultation Tab",
    guideStep2Desc: "Use 'System Pairing' if you already have gear. Use 'Speaker Selection' if you're looking to buy new speakers.",
    guideStep3: "3. Enter Accurate Specs",
    guideStep3Desc: "Provide details about your equipment, room size, and music taste. More detail leads to better 'synergy' advice.",
    guideStep4: "4. Analyze & Execute",
    guideStep4Desc: "Click 'GET ADVICE'. Maestro will provide an upgrade roadmap, golden pairings, and a 'do not buy' list.",
    guideFooter: "Note: Pairing is the art of compensation. Trust your own ears.",
    tabPairing: "System Pairing",
    tabSpeaker: "Speaker Selection",
    speakerTaste: "Sound Taste",
    tasteFullRange: "Simple, Delicate (Full-range)",
    tasteCoaxial: "Coherent, Wide Stage (Coaxial)",
    tasteMultiWay: "Full, Powerful (3-4 Way)",
    roomHeight: "Room Height (m)",
    roomAcoustics: "Room Material & Treatment",
    ampType: "Existing Amp (Optional)",
    placeholderAmp: "e.g., None, or McIntosh MA252",
    sourceType: "Primary Music Source",
    volumeHabit: "Volume Habit",
    volLow: "Whisper, Night Detail",
    volHigh: "Loud, Dynamic Impact",
    aesthetic: "Aesthetic & Expectation",
    aesVintage: "Vintage (Wood, Classic)",
    aesModern: "Modern (Slim, Lacquer)",
    expectation: "Sound Expectation",
    expNeutral: "Absolute Neutrality",
    expSweet: "Sweet, Colored",
    analyzing: "ANALYZING...",
    philosophy: "Maestro Philosophy",
    philosophyQuote: "\"I don't care how rich you are. I only care how your ears are served. Pairing is the art of compensation.\"",
    reportTitle: "Pairing Report",
    reportDesc: "Fill in your system information on the right. Maestro will return a scientific report, tonal chart, and AI illustration.",
    waiting: "Waiting for input",
    chartTitle: "Tonal Characteristics Chart",
    aiImage: "AI Setup Image",
    copy: "Copy",
    copied: "Copied",
    download: "Download Report (.md)",
    filename: "maestro-report.md",
    newAdvice: "New Advice",
    drawing: "Maestro is drawing...",
    placeholderImage: "Image will appear after analysis",
    error: "An error occurred connecting to The Grand Maestro. Please try again.",
    quotaError: "You have exceeded your API quota. Please check your plan or try again later.",
    certified: "Certified\nMaestro\nSelection",
    footer: "The Grand Maestro created by Hung Nguyen © 2026 | Pure Sound Philosophy",
    about: "About",
    settings: "API Settings",
    apiManagement: "API Management",
    provider: "Provider",
    apiKey: "API Key",
    model: "Model",
    name: "Friendly Name",
    baseUrl: "Local API URL",
    addApi: "Add API",
    active: "Active",
    noApis: "No APIs configured. Please add at least one API.",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    aboutContent: `# 🎼 THE GRAND MAESTRO
### *The Legend of Pairing & Your Virtual Audiophile Mentor*

---

**The Grand Maestro** is more than just an app; it is the culmination of **60 years of passion**, tens of thousands of listening hours, and a profound understanding of the soul of sound. Built upon the wisdom of true audio masters, Maestro offers you an unprecedented consulting experience.

### 🏛️ The Philosophy of "Absolute Synergy"
In the audio world, we believe: **1 + 1 is not 2, it should be 3, or even 5.**
An expensive system isn't necessarily great if the components "fight" each other. Maestro operates on the philosophy of **"Compensation and Balance"**:
> *"If your speakers are too bright, I will find you a warm amplifier. If your room is too reflective, I will show you how to tame it. Pairing is an art, and Maestro is your conductor."*

### 🌟 Core Values
*   **🔍 Deep Technical Analysis:** Beyond brands, Maestro dives deep into impedance, sensitivity, current, and the harmonic characteristics of each device.
*   **🏠 Room Acoustics:** We understand that the room is the most important component. Maestro calculates the interaction between wall materials, area, and speaker placement to provide the most accurate advice.
*   **📋 10 Premium Selections:** You will receive 5 powerful, precise **Solid-State** options and 5 sweet, magical **Tube** options.
*   **📊 Tonal Characteristic Chart:** A visual insight into 5 elements: Detail, Warmth, Soundstage, Speed, and Punch.
*   **🎨 Spatial Vision:** Our AI will sketch an ideal listening space where equipment is arranged scientifically and artistically.

### 🤝 The Maestro's Promise
I take no commissions from any brand. I don't care if you are rich or poor. I only care that **your ears are served in the most deserving way**.

---
*Created by **Hung Nguyen** | © 2026 The Grand Maestro*
    `,
    detail: "Detail",
    warmth: "Warmth",
    soundstage: "Soundstage",
    speed: "Speed",
    punch: "Punch",
    legacyQuote: "\"These pairings have stood the test of time. They are the gold standard for your reference.\"",
    sourceDigital: "Digital (Streaming/CD)",
    sourceVinyl: "Vinyl (Turntable)",
    sourceTape: "Tape (Reel-to-Reel/Cassette)",
    sourceStreaming: "Streaming (Tidal/Qobuz)",
    matBrick: "Brick Wall / Paint",
    matWood: "Wood Panel / Acoustic Wood",
    matGlass: "Lots of Glass / Large Windows",
    matPlaster: "Plaster Ceiling",
    matOpen: "Open Living Room / Loft",
    matBedroom: "Bedroom (Soft Furnishings)",
    matDedicated: "Dedicated Listening Room (Treated)",
    placeholderEquip: "Example: JBL L100 Century, Denon PMA-2000...",
    placeholderMusic: "Example: Jazz, Vocal, Rock 70s...",
    placeholderSize: "sqm",
    placeholderBudget: "USD / EUR",
    exampleEquip: "KEF LS50 Meta, Hegel H190",
    exampleMusic: "Jazz, Classical, Blues",
    exampleBudget: "5,000 USD",
    legacyPairings: [
      { title: "Tannoy + Accuphase", desc: "Classic British sweetness and warmth combined with Japanese precision. Perfect for Jazz and Vocals." },
      { title: "JBL + McIntosh", desc: "American muscle. Powerful bass, brilliant midrange. Legendary pairing for Rock and Pop." },
      { title: "LS3/5a + Rogers/Leak", desc: "BBC studio legend. The most charming midrange in audio history." },
      { title: "Klipsch + Cary Audio", desc: "High-sensitivity horns with Single-Ended tube amps. Absolute liveliness and musicality." },
      { title: "B&W + Classé", desc: "Perfect blend of extreme detail and superb control. The Abbey Road studio standard." },
      { title: "Sonus Faber + Audio Research", desc: "Italian beauty meets warm, open American tube sound. The pinnacle of luxury." },
      { title: "Dynaudio + Krell", desc: "Demanding Danish speakers need massive current from American amps to show their bass power." },
      { title: "ProAc + Naim", desc: "Signature British 'Pace, Rhythm and Timing'. Very musical and engaging." }
    ]
  },
  zh: {
    title: "音响大师 (THE GRAND MAESTRO)",
    subtitle: "60年发烧友智慧",
    legacy: "传奇搭配",
    synergy: "协同效应就是一切。7 + 7 = 25。",
    inputTitle: "输入参数",
    inputDesc: "您的数据是大师计算频段与阻抗之间相关性的基础。",
    example: "示例",
    equipment: "现有设备（扬声器/放大器）",
    musicTaste: "主要音乐口味",
    source: "音源",
    material: "主要房间材料",
    roomSize: "房间面积",
    budget: "最高预算",
    analyze: "获取大师建议",
    guide: "使用指南",
    guideTitle: "大师手册",
    guideStep1: "1. API 配置",
    guideStep1Desc: "点击右上角的“API 设置”。添加来自 Gemini、OpenAI、OpenRouter 的 API 密钥，或配置本地 LLM (Ollama) 以激活大师的大脑。",
    guideStep2: "2. 选择咨询选项卡",
    guideStep2Desc: "如果您已有设备，请使用“系统搭配”。如果您正在寻找新音箱，请使用“音箱选购建议”。",
    guideStep3: "3. 输入准确参数",
    guideStep3Desc: "提供有关您的设备、房间面积和音乐口味的详细信息。细节越多，建议就越精准。",
    guideStep4: "4. 分析与执行",
    guideStep4Desc: "点击“获取建议”。大师将提供升级路线图、黄金搭配以及“绝对不要购买”清单。",
    guideFooter: "注意：搭配是补偿的艺术。请相信您自己的耳朵。",
    tabPairing: "系统搭配",
    tabSpeaker: "音箱选购建议",
    speakerTaste: "声音口味",
    tasteFullRange: "质朴、细腻 (全频)",
    tasteCoaxial: "一致、宽阔声场 (同轴)",
    tasteMultiWay: "饱满、有力 (3-4 分频)",
    roomHeight: "房间高度 (m)",
    roomAcoustics: "房间材料与处理",
    ampType: "现有功放 (可选)",
    placeholderAmp: "例如：无，或 Yamaha A-S1200",
    sourceType: "主要音源",
    volumeHabit: "音量习惯",
    volLow: "低音量、深夜细节",
    volHigh: "高音量、动态冲击",
    aesthetic: "审美与期望",
    aesVintage: "复古 (木质、经典)",
    aesModern: "现代 (苗条、漆面)",
    expectation: "声音期望",
    expNeutral: "绝对中性",
    expSweet: "甜美、悦耳",
    analyzing: "正在分析...",
    philosophy: "大师哲学",
    philosophyQuote: "“我不在乎你有多富有。我只在乎你的耳朵得到了怎样的服务。搭配是补偿的艺术。”",
    reportTitle: "搭配报告",
    reportDesc: "在右侧填写您的系统信息。大师将返回一份科学报告、音调图和 AI 插图。",
    waiting: "等待输入",
    chartTitle: "音色特性图",
    aiImage: "AI 设置图像",
    copy: "复制",
    copied: "已复制",
    download: "下载报告 (.md)",
    filename: "maestro-report-zh.md",
    newAdvice: "新建议",
    drawing: "大师正在绘画...",
    placeholderImage: "分析后将显示图像",
    error: "连接到音响大师时出错。请重试。",
    quotaError: "您已超出 API 配额。请检查您的计划或稍后重试。",
    certified: "认证\n大师\n精选",
    footer: "The Grand Maestro created by Hung Nguyen © 2026 | 纯净声音哲学",
    about: "关于",
    settings: "API 设置",
    apiManagement: "API 管理",
    provider: "提供商",
    apiKey: "API 密钥",
    model: "模型",
    name: "友好名称",
    baseUrl: "本地 API URL",
    addApi: "添加 API",
    active: "激活",
    noApis: "未配置 API。请至少添加一个 API。",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    aboutContent: `# 🎼 音响大师 (THE GRAND MAESTRO)
### *传奇搭配 & 您的虚拟发烧友导师*

---

**音响大师** 不仅仅是一个应用程序；它是 **60 年激情**、数万小时试听以及对声音灵魂深刻理解的结晶。大师基于真正的音响大师的智慧，为您提供前所未有的咨询体验。

### 🏛️ “绝对协同”的哲学
在音响世界中，我们相信：**1 + 1 不是 2，它应该是 3，甚至 5。**
如果组件之间相互“冲突”，昂贵的系统不一定出色。大师的运作哲学是 **“补偿与平衡”**：
> *“如果您的扬声器太亮，我会为您找到一个温暖的放大器。如果您的房间反射太强，我会告诉您如何驯服它。搭配是一门艺术，而大师就是您的指挥家。”*

### 🌟 核心价值
*   **🔍 深度技术分析：** 除了品牌，大师还深入研究每个设备的阻抗、灵敏度、电流和和谐特性。
*   **🏠 房间声学：** 我们理解房间是最重要的组件。大师计算墙壁材料、面积和扬声器摆放之间的相互作用，以提供最准确地建议。
*   **📋 10 个顶级选择：** 您将收到 5 个强大、精确的 **晶体管 (Solid-State)** 选项和 5 个甜美、神奇的 **电子管 (Tube)** 选项。
*   **📊 音色特性图：** 直观洞察 5 个元素：细节、温暖、声场、速度和力度。
*   **🎨 空间愿景：** 我们的 AI 将勾勒出一个理想的听音空间，设备摆放既科学又具有艺术感。

### 🤝 大师的承诺
我不从任何品牌收取佣金。我不在乎你是富有还是贫穷。我只关心 **你的耳朵是否得到了最值得的服务**。

---
*由 **Hung Nguyen** 创建 | © 2026 音响大师*`,
    detail: "细节",
    warmth: "温暖",
    soundstage: "声场",
    speed: "速度",
    punch: "力度",
    legacyQuote: "“这些搭配经受住了时间的考验。它们是您的参考金标准。”",
    sourceDigital: "数字 (流媒体/CD)",
    sourceVinyl: "黑胶 (唱片机)",
    sourceTape: "磁带 (开盘机/卡座)",
    sourceStreaming: "流媒体 (Tidal/Qobuz)",
    matBrick: "砖墙 / 油漆",
    matWood: "木板 / 声学木材",
    matGlass: "大量玻璃 / 大窗户",
    matPlaster: "石膏天花板",
    matOpen: "开放式客厅 / 复式",
    matBedroom: "卧室 (软装较多)",
    matDedicated: "专用听音室 (已处理)",
    placeholderEquip: "例如：JBL L100 Century, Denon PMA-2000...",
    placeholderMusic: "例如：爵士, 人声, 70年代摇滚...",
    placeholderSize: "平方米",
    placeholderBudget: "人民币 / 美元",
    exampleEquip: "B&W 805 D4, McIntosh MA5300",
    exampleMusic: "爵士, 古典, 流行",
    exampleBudget: "50,000 CNY",
    legacyPairings: [
      { title: "Tannoy + Accuphase", desc: "经典的英国甜美温暖与日本的精准结合。非常适合爵士乐和人声。" },
      { title: "JBL + McIntosh", desc: "美国肌肉。强劲的低音，灿烂的中音。摇滚和流行音乐的传奇搭配。" },
      { title: "LS3/5a + Rogers/Leak", desc: "BBC录音室传奇。音响史上最迷人的中音。" },
      { title: "Klipsch + Cary Audio", desc: "高灵敏度号角与单端电子管放大器。绝对的活力和音乐感。" },
      { title: "B&W + Classé", desc: "极致细节与卓越控制的完美结合。艾比路录音室标准。" },
      { title: "Sonus Faber + Audio Research", desc: "意大利之美遇上温暖、开阔的美国电子管音色。奢华的巅峰。" },
      { title: "Dynaudio + Krell", desc: "苛刻的丹麦扬声器需要美国放大器的巨大电流来展示其低音实力。" },
      { title: "ProAc + Naim", desc: "标志性的英国“节奏、韵律和时机”。非常有音乐感和吸引力。" }
    ]
  },
  ja: {
    title: "ザ・グランド・マエストロ",
    subtitle: "60年にわたるオーディオフィルの知恵",
    legacy: "伝説のペアリング",
    synergy: "シナジーがすべてです。7 + 7 = 25。",
    inputTitle: "入力パラメータ",
    inputDesc: "あなたのデータは、マエストロが周波数帯域とインピーダンスの相関関係を計算するための基礎となります。",
    example: "例",
    equipment: "既存の機器（スピーカー/アンプ）",
    musicTaste: "主な音楽の好み",
    source: "音源",
    material: "主な部屋の素材",
    roomSize: "部屋の広さ",
    budget: "最大予算",
    analyze: "マエストロのアドバイスを受ける",
    guide: "ユーザーガイド",
    guideTitle: "マエストロ・ハンドブック",
    guideStep1: "1. API設定",
    guideStep1Desc: "右上の「API設定」をクリックします。Gemini, OpenAI, OpenRouterのAPIキーを追加するか、ローカルLLM (Ollama) を設定して、マエストロの脳を活性化させます。",
    guideStep2: "2. 相談タブの選択",
    guideStep2Desc: "すでに機材をお持ちの場合は「システムペアリング」を、新しいスピーカーをお探しの場合は「スピーカー選定」を使用してください。",
    guideStep3: "3. 正確なスペックの入力",
    guideStep3Desc: "機材、部屋の広さ、音楽の好みについて詳しく入力してください。詳細なほど、より良いアドバイスが得られます。",
    guideStep4: "4. 分析と実行",
    guideStep4Desc: "「アドバイスを受ける」をクリックします。マエストロがアップグレードロードマップ、黄金の組み合わせ、購入禁止リストを提示します。",
    guideFooter: "注：ペアリングは補償の芸術です。自分の耳を信じてください。",
    tabPairing: "システムペアリング",
    tabSpeaker: "スピーカー選定",
    speakerTaste: "サウンドの好み",
    tasteFullRange: "素朴、繊細 (フルレンジ)",
    tasteCoaxial: "コヒーレント、ワイドステージ (同軸)",
    tasteMultiWay: "フル、パワフル (3-4 ウェイ)",
    roomHeight: "部屋の高さ (m)",
    roomAcoustics: "部屋の素材と処理",
    ampType: "既存のアンプ (オプション)",
    placeholderAmp: "例：なし、または Luxman L-505uXII",
    sourceType: "主な音源",
    volumeHabit: "音量の習慣",
    volLow: "ささやき、深夜のディテール",
    volHigh: "大音量、ダイナミックな衝撃",
    aesthetic: "美学と期待",
    aesVintage: "ヴィンテージ (ウッド、クラシック)",
    aesModern: "モダン (スリム、ラッカー)",
    expectation: "サウンドの期待",
    expNeutral: "絶対的な中立性",
    expSweet: "甘い、心地よい",
    analyzing: "分析中...",
    philosophy: "マエストロの哲学",
    philosophyQuote: "「あなたがどれほど裕福かは気にしません。あなたの耳がどのように奉仕されるかだけを気にします。ペアリングは補償の芸術です。」",
    reportTitle: "ペアリングレポート",
    reportDesc: "右側にシステム情報を入力してください。マエストロは科学的なレポート、トーンチャート、AIイラストを返します。",
    waiting: "入力待ち",
    chartTitle: "音色特性チャート",
    aiImage: "AIセットアップ画像",
    copy: "コピー",
    copied: "コピー済み",
    download: "レポートをダウンロード (.md)",
    filename: "maestro-report-ja.md",
    newAdvice: "新しいアドバイス",
    drawing: "マエストロが描いています...",
    placeholderImage: "分析後に画像が表示されます",
    error: "ザ・グランド・マエストロへの接続中にエラーが発生しました。もう一度お試しください。",
    quotaError: "APIのクォータを超過しました。プランを確認するか、後でもう一度お試しください。",
    certified: "認定\nマエストロ\nセレクション",
    footer: "The Grand Maestro created by Hung Nguyen © 2026 | 純粋なサウンド哲学",
    about: "概要",
    settings: "API 設定",
    apiManagement: "API 管理",
    provider: "プロバイダー",
    apiKey: "API キー",
    model: "モデル",
    name: "フレンドリー名",
    baseUrl: "ローカル API URL",
    addApi: "API を追加",
    active: "有効",
    noApis: "API が設定されていません。少なくとも 1 つの API を追加してください。",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    aboutContent: `# 🎼 ザ・グランド・マエストロ (THE GRAND MAESTRO)
### *伝説のペアリング & あなたの仮想オーディオフィル・メンター*

---

**ザ・グランド・マエストロ** は単なるアプリではありません。それは **60 年にわたる情熱**、数万時間のリスニング、そして音の魂に対する深い理解の集大成です。真のオーディオマスターの知恵に基づいて構築されたマエストロは、かつてないコンサルティング体験を提供します。

### 🏛️ 「絶対的な相乗効果」の哲学
オーディオの世界では、**1 + 1 は 2 ではなく、3、あるいは 5 になるべきだ** と信じています。
コンポーネント同士が「喧嘩」している場合、高価なシステムが必ずしも優れているとは限りません。マエストロは **「補償とバランス」** の哲学に基づいて動作します。
> *「スピーカーが明るすぎるなら、温かみのあるアンプを見つけましょう。部屋の反射が強すぎるなら、それを手なずける方法を教えましょう。ペアリングは芸術であり、マエストロはあなたの指揮者です。」*

### 🌟 コアバリュー
*   **🔍 深い技術分析:** ブランドを超えて、マエストロは各デバイスのインピーダンス、感度、電流、および高調波特性を深く掘り下げます。
*   **🏠 部屋の音響:** 部屋が最も重要なコンポーネントであることを私たちは理解しています。マエストロは、壁の素材、面積、スピーカーの配置の間の相互作用を計算し、最も正確なアドバイスを提供します。
*   **📋 10 のプレミアムセレクション:** 5 つのパワフルで精密な **ソリッドステート (Solid-State)** オプションと、5 つの甘く魔法のような **真空管 (Tube)** オプションを受け取ります。
*   **📊 音色特性チャート:** 5 つの要素（ディテール、温かみ、サウンドステージ、スピード、パンチ）を視覚的に把握できます。
*   **🎨 空間のビジョン:** 私たちの AI が、機器が科学的かつ芸術的に配置された理想的なリスニングスペースをスケッチします。

### 🤝 マエストロの約束
私はどのブランドからもコミッションを受け取りません。あなたが裕福か貧しいかは気にしません。私は **あなたの耳が最もふさわしい方法で奉仕されること** だけを気にしています。

---
*作成者: **Hung Nguyen** | © 2026 ザ・グランド・マエストロ*`,
    detail: "ディテール",
    warmth: "温かみ",
    soundstage: "サウンドステージ",
    speed: "スピード",
    punch: "パンチ",
    legacyQuote: "「これらのペアリングは時の試練に耐えてきました。これらはあなたの参照のためのゴールドスタンダードです。」",
    sourceDigital: "デジタル (ストリーミング/CD)",
    sourceVinyl: "アナログ (ターンテーブル)",
    sourceTape: "テープ (オープンリール/カセット)",
    sourceStreaming: "ストリーミング (Tidal/Qobuz)",
    matBrick: "レンガ壁 / 塗装",
    matWood: "ウッドパネル / 吸音木材",
    matGlass: "ガラス多用 / 大窓",
    matPlaster: "石膏ボード天井",
    matOpen: "オープンリビング / 吹き抜け",
    matBedroom: "寝室 (布製品多め)",
    matDedicated: "専用リスニングルーム (処理済み)",
    placeholderEquip: "例：JBL L100 Century, Denon PMA-2000...",
    placeholderMusic: "例：ジャズ、ボーカル、70年代ロック...",
    placeholderSize: "平米",
    placeholderBudget: "円 / ドル",
    exampleEquip: "Tannoy Stirling, Accuphase E-280",
    exampleMusic: "ジャズ、クラシック、歌謡曲",
    exampleBudget: "800,000 JPY",
    legacyPairings: [
      { title: "Tannoy + Accuphase", desc: "英国の伝統的な甘さと温かさが日本の精密さと融合。ジャズやボーカルに最適です。" },
      { title: "JBL + McIntosh", desc: "アメリカン・マッスル。パワフルな低音, 輝かしい中音域。ロックとポップの伝説的なペアリング。" },
      { title: "LS3/5a + Rogers/Leak", desc: "BBCスタジオの伝説。オーディオ史上最も魅力的なミッドレンジ。" },
      { title: "Klipsch + Cary Audio", desc: "高感度ホーンとシングルエンド真空管アンプ。絶対的な躍動感と音楽性。" },
      { title: "B&W + Classé", desc: "極限のディテールと優れたコントロールの完璧な融合。アビー・ロード・スタジオの標準。" },
      { title: "Sonus Faber + Audio Research", desc: "イタリアの美しさとアメリカの温かい真空管サウンドの融合。ラグジュアリーの極致。" },
      { title: "Dynaudio + Krell", desc: "要求の厳しいデンマークのスピーカーには、低域のパワーを引き出すためにアメリカのアンプからの巨大な電流が必要です。" },
      { title: "ProAc + Naim", desc: "英国特有の「ペース、リズム、タイミング」。非常に音楽的で魅力的です。" }
    ]
  },
  ko: {
    title: "더 그랜드 마에스트로",
    subtitle: "60년의 오디오파일 지혜",
    legacy: "전설적인 조합",
    synergy: "시너지가 전부입니다. 7 + 7 = 25.",
    inputTitle: "입력 매개변수",
    inputDesc: "귀하의 데이터는 마에스트로가 주파수 대역과 임피던스 간의 상관관계를 계산하는 기초가 됩니다.",
    example: "예시",
    equipment: "기존 장비 (스피커/앰프)",
    musicTaste: "주요 음악 취향",
    source: "음원",
    material: "주요 실내 자재",
    roomSize: "방 크기",
    budget: "최대 예산",
    analyze: "마에스트로 조언 받기",
    guide: "사용 가이드",
    guideTitle: "마에스트로 핸드북",
    guideStep1: "1. API 설정",
    guideStep1Desc: "오른쪽 상단의 'API 설정'을 클릭하세요. Gemini, OpenAI, OpenRouter의 API 키를 추가하거나 로컬 LLM (Ollama)을 구성하여 마에스트로의 두뇌를 활성화하세요.",
    guideStep2: "2. 상담 탭 선택",
    guideStep2Desc: "이미 장비가 있는 경우 '시스템 페어링'을, 새 스피커를 찾는 경우 '스피커 선택 조언'을 사용하세요.",
    guideStep3: "3. 정확한 사양 입력",
    guideStep3Desc: "장비, 방 크기, 음악 취향에 대한 세부 정보를 제공하세요. 세부 정보가 많을수록 더 나은 조언을 얻을 수 있습니다.",
    guideStep4: "4. 분석 및 실행",
    guideStep4Desc: "'조언 받기'를 클릭하세요. 마에스트로가 업그레이드 로드맵, 황금 조합 및 '구매 금지' 목록을 제공합니다.",
    guideFooter: "참고: 페어링은 보상의 예술입니다. 자신의 귀를 믿으세요.",
    tabPairing: "시스템 페어링",
    tabSpeaker: "스피커 선택 조언",
    speakerTaste: "사운드 취향",
    tasteFullRange: "소박하고 섬세함 (풀레인지)",
    tasteCoaxial: "일관성, 넓은 스테이지 (동축)",
    tasteMultiWay: "풍부하고 강력함 (3-4 웨이)",
    roomHeight: "방 높이 (m)",
    roomAcoustics: "방 재질 및 처리",
    ampType: "기존 앰프 (선택 사항)",
    placeholderAmp: "예: 없음, 또는 NAD C316BEE",
    sourceType: "주요 음원",
    volumeHabit: "볼륨 습관",
    volLow: "속삭임, 심야 디테일",
    volHigh: "크게, 역동적인 충격",
    aesthetic: "미학 및 기대",
    aesVintage: "빈티지 (우드, 클래식)",
    aesModern: "모던 (슬림, 래커)",
    expectation: "사운드 기대치",
    expNeutral: "절대적인 중립성",
    expSweet: "달콤하고 기분 좋은",
    analyzing: "분석 중...",
    philosophy: "마에스트로 철학",
    philosophyQuote: "\"당신이 얼마나 부자인지는 상관없습니다. 당신의 귀가 어떻게 대접받는지만 신경 씁니다. 페어링은 보상의 예술입니다.\"",
    reportTitle: "페어링 보고서",
    reportDesc: "오른쪽에 시스템 정보를 입력하세요. 마에스트로가 과학적 보고서, 톤 차트 및 AI 일러스트레이션을 반환합니다.",
    waiting: "입력 대기 중",
    chartTitle: "음색 특성 차트",
    aiImage: "AI 설정 이미지",
    copy: "복사",
    copied: "복사됨",
    download: "보고서 다운로드 (.md)",
    filename: "maestro-report-ko.md",
    newAdvice: "새 조언",
    drawing: "마에스트로가 그리는 중...",
    placeholderImage: "분석 후 이미지가 나타납니다",
    error: "더 그랜드 마에스트로에 연결하는 중 오류가 발생했습니다. 다시 시도하십시오.",
    quotaError: "API 할당량을 초과했습니다. 플랜을 확인하거나 나중에 다시 시도하십시오.",
    certified: "인증된\n마에스트로\n선택",
    footer: "The Grand Maestro created by Hung Nguyen © 2026 | 순수 사운드 철학",
    about: "소개",
    settings: "API 설정",
    apiManagement: "API 관리",
    provider: "제공자",
    apiKey: "API 키",
    model: "모델",
    name: "친숙한 이름",
    baseUrl: "로컬 API URL",
    addApi: "API 추가",
    active: "활성",
    noApis: "구성된 API가 없습니다. 최소 하나 이상의 API를 추가하십시오.",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    aboutContent: `# 🎼 더 그랜드 마에스트로 (THE GRAND MAESTRO)
### *페어링의 전설 & 당신의 가상 오디오파일 멘토*

---

**더 그랜드 마에스트로**는 단순한 앱 그 이상입니다. 이는 **60년의 열정**, 수만 시간의 청취, 그리고 소리의 영혼에 대한 깊은 이해의 결집체입니다. 진정한 오디오 마스터들의 지혜를 바탕으로 구축된 마에스트로는 당신에게 전례 없는 컨설팅 경험을 제공합니다.

### 🏛️ "절대적 시너지"의 철학
오디오 세계에서 우리는 믿습니다: **1 + 1은 2가 아니라 3, 혹은 5가 되어야 합니다.**
부품들이 서로 "싸운다면" 값비싼 시스템이 반드시 훌륭한 것은 아닙니다. 마에스트로는 **"보상과 균형"**의 철학에 따라 작동합니다:
> *"스피커가 너무 밝다면 따뜻한 앰프를 찾아드리겠습니다. 방의 반사가 너무 심하다면 이를 길들이는 방법을 알려드리겠습니다. 페어링은 예술이며, 마에스트로는 당신의 지휘자입니다."*

### 🌟 핵심 가치
*   **🔍 심층 기술 분석:** 브랜드를 넘어, 마에스트로는 각 장치의 임피던스, 감도, 전류 및 고조파 특성을 깊이 파고듭니다.
*   **🏠 룸 어쿠스틱:** 우리는 방이 가장 중요한 구성 요소임을 이해합니다. 마에스트로는 벽 자재, 면적 및 스피커 배치 간의 상호 작용을 계산하여 가장 정확한 조언을 제공합니다.
*   **📋 10가지 프리미엄 선택:** 5가지 강력하고 정밀한 **솔리드 스테이트 (Solid-State)** 옵션과 5가지 달콤하고 마법 같은 **진공관 (Tube)** 옵션을 받게 됩니다.
*   **📊 음색 특성 차트:** 디테일, 따뜻함, 사운드스테이지, 속도, 펀치력의 5가지 요소를 시각적으로 통찰합니다.
*   **🎨 공간의 비전:** 우리 AI는 장비가 과학적이고 예술적으로 배치된 이상적인 청취 공간을 스케치합니다.

### 🤝 마에스트로의 약속
나는 어떤 브랜드로부터도 수수료를 받지 않습니다. 당신이 부자인지 가난한지는 상관없습니다. 나는 오직 **당신의 귀가 가장 가치 있는 방식으로 대접받는 것**에만 신경 씁니다.

---
*제작: **Hung Nguyen** | © 2026 더 그랜드 마에스트로*`,
    detail: "디테일",
    warmth: "따뜻함",
    soundstage: "사운드스테이지",
    speed: "속도",
    punch: "펀치력",
    legacyQuote: "\"이러한 조합은 시간의 시험을 견뎌냈습니다. 귀하의 참고를 위한 골드 표준입니다.\"",
    sourceDigital: "디지털 (스트리밍/CD)",
    sourceVinyl: "바이닐 (턴테이블)",
    sourceTape: "테이프 (릴투릴/카세트)",
    sourceStreaming: "스트리밍 (Tidal/Qobuz)",
    matBrick: "벽돌 벽 / 페인트",
    matWood: "나무 패널 / 흡음 목재",
    matGlass: "유리 많음 / 큰 창문",
    matPlaster: "석고보드 천장",
    matOpen: "개방형 거실 / 복층",
    matBedroom: "침실 (패브릭 많음)",
    matDedicated: "전용 리스닝 룸 (처리됨)",
    placeholderEquip: "예: JBL L100 Century, Denon PMA-2000...",
    placeholderMusic: "예: 재즈, 보컬, 70년대 록...",
    placeholderSize: "제곱미터",
    placeholderBudget: "원 / 달러",
    exampleEquip: "Harbeth HL5, Naim Supernait 3",
    exampleMusic: "재즈, 클래식, 가요",
    exampleBudget: "7,000,000 KRW",
    legacyPairings: [
      { title: "Tannoy + Accuphase", desc: "영국의 고전적인 달콤함과 따뜻함이 일본의 정밀함과 결합되었습니다. 재즈와 보컬에 적합합니다." },
      { title: "JBL + McIntosh", desc: "미국식 근육질 사운드. 강력한 저음, 화려한 중음역대. 록과 팝을 위한 전설적인 조합입니다." },
      { title: "LS3/5a + Rogers/Leak", desc: "BBC 스튜디오의 전설. 오디오 역사상 가장 매력적인 미드레인지." },
      { title: "Klipsch + Cary Audio", desc: "고감도 혼 스피커와 싱글 엔드 진공관 앰프. 절대적인 생동감과 음악성." },
      { title: "B&W + Classé", desc: "극한의 디테일과 뛰어난 제어력의 완벽한 조화. 애비 로드 스튜디오의 표준." },
      { title: "Sonus Faber + Audio Research", desc: "이탈리아의 아름다움과 미국의 따뜻한 진공관 사운드의 만남. 럭셔리의 정점." },
      { title: "Dynaudio + Krell", desc: "까다로운 덴마크 스피커는 저음의 위력을 보여주기 위해 미국산 앰프의 거대한 전류가 필요합니다." },
      { title: "ProAc + Naim", desc: "영국 특유의 '페이스, 리듬, 타이밍'. 매우 음악적이고 매력적입니다." }
    ]
  }
};

export default function App() {
  const [lang, setLang] = useState<'vi' | 'en' | 'zh' | 'ja' | 'ko'>('vi');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState<'pairing' | 'speaker'>('pairing');

  const [formData, setFormData] = useState({
    existingEquipment: '',
    musicTaste: '',
    source: 'Digital',
    roomSize: '',
    roomMaterial: 'Brick',
    budget: '',
  });

  const [speakerFormData, setSpeakerFormData] = useState<Omit<SpeakerInput, 'language'>>({
    speakerTaste: 'Full-range',
    roomSize: '',
    roomHeight: '',
    roomAcoustics: 'Normal',
    ampType: '',
    sourceType: 'Digital',
    volumeHabit: 'Low',
    aesthetic: 'Vintage',
    expectation: 'Neutral',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [cleanReport, setCleanReport] = useState<string | null>(null);
  const [soundProfile, setSoundProfile] = useState<any[] | null>(null);
  const [setupImage, setSetupImage] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLegacy, setShowLegacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>(() => {
    const saved = localStorage.getItem('maestro_api_configs');
    if (saved) {
      try {
        // Try to deobfuscate first (new security layer)
        const deobfuscated = deobfuscate(saved);
        return JSON.parse(deobfuscated);
      } catch (e) {
        // Fallback for old plain-text data
        try {
          return JSON.parse(saved);
        } catch (err) {
          console.error("Failed to parse API configs", err);
        }
      }
    }
    return [{
      id: 'default-gemini',
      name: 'Default Gemini',
      provider: ApiProvider.GEMINI,
      apiKey: process.env.GEMINI_API_KEY || '',
      model: 'gemini-3.1-pro-preview',
      isActive: true
    }];
  });

  useEffect(() => {
    const serialized = JSON.stringify(apiConfigs);
    localStorage.setItem('maestro_api_configs', obfuscate(serialized));
  }, [apiConfigs]);

  const activeConfig = apiConfigs.find(c => c.isActive) || apiConfigs[0];
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    setCleanReport(null);
    setSoundProfile(null);
    setSetupImage(null);
    
    const currentLang = lang === 'vi' ? 'Vietnamese' : lang === 'zh' ? 'Chinese' : lang === 'ja' ? 'Japanese' : lang === 'ko' ? 'Korean' : 'English';

    try {
      let responseText = "";
      if (activeTab === 'pairing') {
        // Security: Sanitize all inputs before sending to LLM
        const sanitizedData = {
          ...formData,
          existingEquipment: sanitizeInput(formData.existingEquipment, 200),
          musicTaste: sanitizeInput(formData.musicTaste, 200),
          source: sanitizeInput(formData.source, 100),
          roomSize: sanitizeInput(formData.roomSize, 50),
          roomMaterial: sanitizeInput(formData.roomMaterial, 100),
          budget: sanitizeInput(formData.budget, 100),
          language: currentLang
        };
        responseText = await getMaestroAdvice(sanitizedData, activeConfig);
      } else {
        // Security: Sanitize all inputs before sending to LLM
        const sanitizedSpeakerData = {
          ...speakerFormData,
          speakerTaste: sanitizeInput(speakerFormData.speakerTaste, 200),
          roomSize: sanitizeInput(speakerFormData.roomSize, 50),
          roomHeight: sanitizeInput(speakerFormData.roomHeight, 50),
          roomAcoustics: sanitizeInput(speakerFormData.roomAcoustics, 200),
          ampType: sanitizeInput(speakerFormData.ampType, 100),
          sourceType: sanitizeInput(speakerFormData.sourceType, 100),
          volumeHabit: sanitizeInput(speakerFormData.volumeHabit, 100),
          aesthetic: sanitizeInput(speakerFormData.aesthetic, 100),
          expectation: sanitizeInput(speakerFormData.expectation, 200),
          budget: sanitizeInput(speakerFormData.budget, 100),
          language: currentLang
        };
        responseText = await getSpeakerAdvice(sanitizedSpeakerData, activeConfig);
      }
      
      // Parse the raw response
      let cleanReportText = responseText;
      let soundProfileData = null;
      let imagePromptText = "";

      // Extract JSON
      const jsonMatch = responseText.match(/\[SOUND_PROFILE_JSON\]([\s\S]*?)\[\/SOUND_PROFILE_JSON\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1].trim());
          soundProfileData = Object.entries(parsed).map(([key, value]) => ({
            subject: t[key as keyof typeof t] || key,
            A: value,
            fullMark: 100
          }));
          cleanReportText = cleanReportText.replace(jsonMatch[0], "");
        } catch (e) {
          console.error("Failed to parse sound profile JSON", e);
        }
      }

      // Extract Image Prompt
      const promptMatch = responseText.match(/\[IMAGE_PROMPT\]([\s\S]*?)\[\/IMAGE_PROMPT\]/);
      if (promptMatch) {
        imagePromptText = promptMatch[1].trim();
        cleanReportText = cleanReportText.replace(promptMatch[0], "");
      }

      setReport(responseText);
      setCleanReport(cleanReportText.trim());
      setSoundProfile(soundProfileData);
      
      // Scroll to report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Generate Image
      if (imagePromptText) {
        setGeneratingImage(true);
        try {
          const imageUrl = await generateSetupImage(imagePromptText, activeConfig);
          setSetupImage(imageUrl);
        } catch (imgErr) {
          console.error("Image generation failed:", imgErr);
        } finally {
          setGeneratingImage(false);
        }
      }

    } catch (err: any) {
      const errorMsg = err?.message || JSON.stringify(err) || "";
      const isQuotaError = errorMsg.includes("429") || 
                          errorMsg.toLowerCase().includes("quota") || 
                          (err?.status === "RESOURCE_EXHAUSTED") ||
                          (err?.error?.code === 429);
      
      if (isQuotaError) {
        setError(t.quotaError);
      } else {
        setError(t.error);
      }
      console.error("Maestro Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (cleanReport) {
      navigator.clipboard.writeText(cleanReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (cleanReport) {
      const blob = new Blob([cleanReport], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = t.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const reset = () => {
    setReport(null);
    setCleanReport(null);
    setSoundProfile(null);
    setSetupImage(null);
    setFormData({
      existingEquipment: '',
      musicTaste: '',
      source: 'Digital',
      roomSize: '',
      roomMaterial: 'Brick',
      budget: '',
    });
    setSpeakerFormData({
      speakerTaste: 'Full-range',
      roomSize: '',
      roomHeight: '',
      roomAcoustics: 'Normal',
      ampType: '',
      sourceType: 'Digital',
      volumeHabit: 'Low',
      aesthetic: 'Vintage',
      expectation: 'Neutral',
      budget: '',
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 selection:bg-gold selection:text-dark-bg">
      {/* Header */}
      <header className="border-b border-border bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-gold/10">
                <Speaker className="text-gold w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-semibold text-white tracking-wide">{t.title}</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-mono">{t.subtitle}</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center bg-white/5 border border-border rounded-full p-1">
              <button
                onClick={() => setActiveTab('pairing')}
                className={cn(
                  "px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'pairing' ? "bg-gold text-dark-bg shadow-lg" : "text-gray-500 hover:text-gold"
                )}
              >
                <Layers className="w-3 h-3" /> {t.tabPairing}
              </button>
              <button
                onClick={() => setActiveTab('speaker')}
                className={cn(
                  "px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === 'speaker' ? "bg-gold text-dark-bg shadow-lg" : "text-gray-500 hover:text-gold"
                )}
              >
                <Radio className="w-3 h-3" /> {t.tabSpeaker}
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border hover:border-gold/50 transition-colors">
                <Globe className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{lang}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-24 bg-card-bg border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {(['vi', 'en', 'zh', 'ja', 'ko'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg",
                      lang === l ? "bg-gold/10 text-gold" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Help & Legacy */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-border rounded-full p-1">
              <button 
                onClick={() => setShowLegacy(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold hover:bg-white/5 transition-all"
              >
                <BookOpen className="w-3 h-3" /> <span className="hidden xl:inline">{t.legacy}</span>
              </button>
              <button 
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold hover:bg-white/5 transition-all"
              >
                <HelpCircle className="w-3 h-3" /> <span className="hidden xl:inline">{t.guide}</span>
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold hover:bg-white/5 transition-all"
              >
                <Info className="w-3 h-3" /> <span className="hidden xl:inline">{t.about}</span>
              </button>
            </div>

            {/* API Settings - Primary Button */}
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-dark-bg rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              <Settings className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t.settings}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form (Sticky) */}
          <div className="lg:col-span-4 space-y-8 order-1 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">
            <section className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl text-white mb-4">{t.inputTitle}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t.inputDesc}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({
                  existingEquipment: t.exampleEquip,
                  musicTaste: t.exampleMusic,
                  source: 'Digital',
                  roomSize: '25',
                  roomMaterial: 'Wood',
                  budget: t.exampleBudget,
                })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3" /> {t.example}
              </button>
            </section>

            <form onSubmit={handleSubmit} className="space-y-8">
              {activeTab === 'pairing' ? (
                <div className="space-y-6">
                  {/* Group 1: Equipment & Taste */}
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-border/50 rounded-xl">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Speaker className="w-4 h-4" /> Thiết bị & Gu nhạc
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.equipment}
                      </label>
                      <input 
                        type="text"
                        placeholder={t.placeholderEquip}
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                        value={formData.existingEquipment}
                        onChange={(e) => setFormData({...formData, existingEquipment: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.musicTaste}
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder={t.placeholderMusic}
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                        value={formData.musicTaste}
                        onChange={(e) => setFormData({...formData, musicTaste: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.source}
                      </label>
                      <select 
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                      >
                        <option value="Digital">{t.sourceDigital}</option>
                        <option value="Vinyl">{t.sourceVinyl}</option>
                        <option value="Tape">{t.sourceTape}</option>
                        <option value="Streaming">{t.sourceStreaming}</option>
                      </select>
                    </div>
                  </div>

                  {/* Group 2: Room & Budget */}
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-border/50 rounded-xl">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Maximize className="w-4 h-4" /> Không gian & Ngân sách
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.material}
                      </label>
                      <select 
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                        value={formData.roomMaterial}
                        onChange={(e) => setFormData({...formData, roomMaterial: e.target.value})}
                      >
                        <option value="Brick">{t.matBrick}</option>
                        <option value="Wood">{t.matWood}</option>
                        <option value="Glass">{t.matGlass}</option>
                        <option value="Plaster">{t.matPlaster}</option>
                        <option value="Open">{t.matOpen}</option>
                        <option value="Bedroom">{t.matBedroom}</option>
                        <option value="Dedicated">{t.matDedicated}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.roomSize}
                        </label>
                        <input 
                          required
                          type="text"
                          placeholder={t.placeholderSize}
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                          value={formData.roomSize}
                          onChange={(e) => setFormData({...formData, roomSize: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.budget}
                        </label>
                        <input 
                          required
                          type="text"
                          placeholder={t.placeholderBudget}
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group 1: Room Acoustics */}
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-border/50 rounded-xl">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Maximize className="w-4 h-4" /> Không gian nghe
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.roomSize}
                        </label>
                        <input 
                          required
                          type="number"
                          placeholder={t.placeholderSize}
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                          value={speakerFormData.roomSize}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, roomSize: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.roomHeight}
                        </label>
                        <input 
                          required
                          type="number"
                          placeholder="m"
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                          value={speakerFormData.roomHeight}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, roomHeight: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.roomAcoustics}
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder={t.roomAcoustics}
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                        value={speakerFormData.roomAcoustics}
                        onChange={(e) => setSpeakerFormData({...speakerFormData, roomAcoustics: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Group 2: Sound Taste */}
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-border/50 rounded-xl">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4" /> Gu thưởng thức
                    </h3>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.speakerTaste}
                      </label>
                      <select 
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                        value={speakerFormData.speakerTaste}
                        onChange={(e) => setSpeakerFormData({...speakerFormData, speakerTaste: e.target.value})}
                      >
                        <option value="Full-range">{t.tasteFullRange}</option>
                        <option value="Coaxial">{t.tasteCoaxial}</option>
                        <option value="Multi-way">{t.tasteMultiWay}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.volumeHabit}
                      </label>
                      <select 
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                        value={speakerFormData.volumeHabit}
                        onChange={(e) => setSpeakerFormData({...speakerFormData, volumeHabit: e.target.value})}
                      >
                        <option value="Low">{t.volLow}</option>
                        <option value="High">{t.volHigh}</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.aesthetic}
                        </label>
                        <select 
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                          value={speakerFormData.aesthetic}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, aesthetic: e.target.value})}
                        >
                          <option value="Vintage">{t.aesVintage}</option>
                          <option value="Modern">{t.aesModern}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.expectation}
                        </label>
                        <select 
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                          value={speakerFormData.expectation}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, expectation: e.target.value})}
                        >
                          <option value="Neutral">{t.expNeutral}</option>
                          <option value="Sweet">{t.expSweet}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Group 3: Equipment & Budget */}
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-border/50 rounded-xl">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Thiết bị & Ngân sách
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.ampType}
                        </label>
                        <input 
                          type="text"
                          placeholder={(t as any).placeholderAmp || "e.g., None, or McIntosh MA252"}
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                          value={speakerFormData.ampType}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, ampType: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                          {t.sourceType}
                        </label>
                        <select 
                          className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none text-gray-200"
                          value={speakerFormData.sourceType}
                          onChange={(e) => setSpeakerFormData({...speakerFormData, sourceType: e.target.value})}
                        >
                          <option value="Digital">Digital</option>
                          <option value="Analog">Analog</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-2">
                        {t.budget}
                      </label>
                      <input 
                        required
                        type="text"
                        placeholder={t.placeholderBudget}
                        className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
                        value={speakerFormData.budget}
                        onChange={(e) => setSpeakerFormData({...speakerFormData, budget: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                disabled={loading}
                type="submit"
                className={cn(
                  "w-full bg-gold hover:bg-gold/90 text-dark-bg font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/20",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t.analyze}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Report */}
          <div className="lg:col-span-8 order-2">
            <AnimatePresence mode="wait">
              {cleanReport ? (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  ref={reportRef}
                  className="space-y-8"
                >
                  <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Decorative Seal */}
                    <div className="absolute top-8 right-8 w-24 h-24 border-4 border-gold/10 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
                      <div className="text-[8px] font-mono text-gold/20 text-center leading-tight uppercase tracking-widest whitespace-pre-line">
                        {t.certified}
                      </div>
                    </div>

                    <div className="p-8 md:p-12">
                      {/* Sound Profile Chart & Image */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                        {soundProfile && (
                          <div className="bg-black/40 rounded-xl p-6 border border-border">
                            <h3 className="font-serif text-lg text-gold mb-4 flex items-center gap-2">
                              <Layers className="w-4 h-4" /> {t.chartTitle}
                            </h3>
                            <div className="h-[300px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soundProfile}>
                                  <PolarGrid stroke="#333" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                  <Radar
                                    name="Sound Profile"
                                    dataKey="A"
                                    stroke="#D4AF37"
                                    fill="#D4AF37"
                                    fillOpacity={0.4}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        <div className="bg-black/40 rounded-xl p-6 border border-border flex flex-col">
                          <h3 className="font-serif text-lg text-gold mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> {t.aiImage}
                          </h3>
                          <div className="flex-1 aspect-video rounded-lg overflow-hidden bg-black/60 border border-border/50 flex items-center justify-center relative">
                            {generatingImage ? (
                              <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-gold/50" />
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">{t.drawing}</p>
                              </div>
                            ) : setupImage ? (
                              <img src={setupImage} alt="Setup AI" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <p className="text-xs text-gray-500 italic">{t.placeholderImage}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanReport}</ReactMarkdown>
                      </div>

                      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                          <button 
                            onClick={handleCopy}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                              copied ? "bg-green-500/20 text-green-400" : "bg-white/5 hover:bg-white/10"
                            )}
                          >
                            <Copy className="w-3.5 h-3.5" /> {copied ? t.copied : t.copy}
                          </button>
                          <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> {t.download}
                          </button>
                        </div>
                        <button 
                          onClick={reset}
                          className="flex items-center gap-2 px-4 py-2 text-gold hover:text-gold/80 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> {t.newAdvice}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/[0.02]"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center relative">
                    <Speaker className="w-12 h-12 text-gray-500" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-gold/20"
                    />
                  </div>
                  <div className="space-y-3 max-w-sm">
                    <h3 className="font-serif text-2xl text-gray-300">{t.reportTitle}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {t.reportDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono uppercase tracking-[0.3em]">
                    <span className="w-8 h-[1px] bg-border"></span>
                    {t.waiting}
                    <span className="w-8 h-[1px] bg-border"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200">{t.error}</p>
              </div>
            )}

            <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-gold">
                <Info className="w-4 h-4" />
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider">{t.philosophy}</h3>
              </div>
              <p className="text-xs italic text-gray-400 leading-relaxed">
                {t.philosophyQuote}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Legacy Pairings Modal */}
      <AnimatePresence>
        {showLegacy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegacy(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl text-gold flex items-center gap-3">
                    <BookOpen className="w-6 h-6" /> {t.legacy}
                  </h2>
                  <button onClick={() => setShowLegacy(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.legacyPairings.map((pair, i) => (
                    <div key={i} className="p-4 bg-black/40 border border-border rounded-xl space-y-2">
                      <h4 className="font-serif text-white font-bold">{pair.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{pair.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-gold/5 border border-gold/10 rounded-lg">
                  <p className="text-[10px] italic text-gray-500 text-center">
                    {t.legacyQuote}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <h2 className="font-serif text-2xl text-gold flex items-center gap-3">
                    <Info className="w-6 h-6" /> {t.about}
                  </h2>
                  <button onClick={() => setShowAbout(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
                  <div className="markdown-body text-gray-200 pb-12">
                    {t.aboutContent ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.aboutContent.trim()}</ReactMarkdown>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No content available for this language.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <h2 className="font-serif text-2xl text-gold flex items-center gap-3">
                    <Settings className="w-6 h-6" /> {t.apiManagement}
                  </h2>
                  <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {apiConfigs.map((config) => (
                      <div 
                        key={config.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          config.isActive ? "border-gold bg-gold/5" : "border-border bg-black/20"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.name}</label>
                                <input 
                                  type="text"
                                  value={config.name}
                                  onChange={(e) => {
                                    const newConfigs = apiConfigs.map(c => c.id === config.id ? { ...c, name: e.target.value } : c);
                                    setApiConfigs(newConfigs);
                                  }}
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.provider}</label>
                                <select 
                                  value={config.provider}
                                  onChange={(e) => {
                                    const newConfigs = apiConfigs.map(c => c.id === config.id ? { ...c, provider: e.target.value as ApiProvider } : c);
                                    setApiConfigs(newConfigs);
                                  }}
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                                >
                                  <option value={ApiProvider.GEMINI}>Gemini API (Google)</option>
                                  <option value={ApiProvider.OPENAI}>ChatGPT (OpenAI)</option>
                                  <option value={ApiProvider.OPENROUTER}>OpenRouter (Multi-LLM)</option>
                                  <option value={ApiProvider.LOCAL}>Local LLM (Ollama/LM Studio)</option>
                                </select>
                              </div>
                            </div>
                            {config.provider === ApiProvider.LOCAL && (
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.baseUrl}</label>
                                <input 
                                  type="text"
                                  value={config.baseUrl || ""}
                                  onChange={(e) => {
                                    const newConfigs = apiConfigs.map(c => c.id === config.id ? { ...c, baseUrl: e.target.value } : c);
                                    setApiConfigs(newConfigs);
                                  }}
                                  placeholder="http://localhost:11434/v1"
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                                />
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.apiKey}</label>
                                <input 
                                  type="password"
                                  value={config.apiKey}
                                  onChange={(e) => {
                                    const newConfigs = apiConfigs.map(c => c.id === config.id ? { ...c, apiKey: e.target.value } : c);
                                    setApiConfigs(newConfigs);
                                  }}
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.model}</label>
                                <input 
                                  type="text"
                                  value={config.model}
                                  onChange={(e) => {
                                    const newConfigs = apiConfigs.map(c => c.id === config.id ? { ...c, model: e.target.value } : c);
                                    setApiConfigs(newConfigs);
                                  }}
                                  placeholder={
                                    config.provider === ApiProvider.GEMINI ? "gemini-3.1-pro-preview" : 
                                    config.provider === ApiProvider.OPENAI ? "gpt-4o" : 
                                    config.provider === ApiProvider.OPENROUTER ? "anthropic/claude-3.5-sonnet" :
                                    "gemma2:9b"
                                  }
                                  className="w-full bg-black/40 border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => {
                                const newConfigs = apiConfigs.map(c => ({ ...c, isActive: c.id === config.id }));
                                setApiConfigs(newConfigs);
                              }}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                                config.isActive ? "bg-gold text-black" : "bg-white/5 text-white hover:bg-white/10"
                              )}
                            >
                              {config.isActive ? <CheckCircle2 className="w-3 h-3" /> : null}
                              {config.isActive ? t.active : t.save}
                            </button>
                            {apiConfigs.length > 1 && (
                              <button 
                                onClick={() => {
                                  const newConfigs = apiConfigs.filter(c => c.id !== config.id);
                                  if (config.isActive && newConfigs.length > 0) {
                                    newConfigs[0].isActive = true;
                                  }
                                  setApiConfigs(newConfigs);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                              >
                                <Trash2 className="w-3 h-3" /> {t.delete}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      const newId = Math.random().toString(36).substr(2, 9);
                      setApiConfigs([...apiConfigs, {
                        id: newId,
                        name: 'New API',
                        provider: ApiProvider.GEMINI,
                        apiKey: '',
                        model: 'gemini-3.1-pro-preview',
                        isActive: false
                      }]);
                    }}
                    className="w-full py-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-gold hover:border-gold transition-all"
                  >
                    <Plus className="w-4 h-4" /> {t.addApi}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                  <h2 className="font-serif text-2xl text-gold flex items-center gap-3">
                    <HelpCircle className="w-6 h-6" /> {t.guideTitle}
                  </h2>
                  <button onClick={() => setShowGuide(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-black/40 border border-border rounded-xl space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">1</div>
                      <h3 className="font-serif text-lg text-white">{t.guideStep1}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{t.guideStep1Desc}</p>
                    </div>
                    <div className="p-6 bg-black/40 border border-border rounded-xl space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">2</div>
                      <h3 className="font-serif text-lg text-white">{t.guideStep2}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{t.guideStep2Desc}</p>
                    </div>
                    <div className="p-6 bg-black/40 border border-border rounded-xl space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">3</div>
                      <h3 className="font-serif text-lg text-white">{t.guideStep3}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{t.guideStep3Desc}</p>
                    </div>
                    <div className="p-6 bg-black/40 border border-border rounded-xl space-y-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">4</div>
                      <h3 className="font-serif text-lg text-white">{t.guideStep4}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{t.guideStep4Desc}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gold/5 border border-gold/10 rounded-xl">
                    <p className="text-xs italic text-gray-500 text-center">
                      {t.guideFooter}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-black/30">
        <div className="max-w-[1600px] mx-auto px-6 text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono">
            {t.footer}
          </p>
          <div className="flex justify-center gap-6">
            <div className="w-1 h-1 rounded-full bg-gold/30"></div>
            <div className="w-1 h-1 rounded-full bg-gold/30"></div>
            <div className="w-1 h-1 rounded-full bg-gold/30"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
