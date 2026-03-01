/* =========================================
   I18N — ĐA NGÔN NGỮ
   Mỗi ngôn ngữ được load từ file riêng:
     langs/lang.vi.js  langs/lang.en.js
     langs/lang.ja.js  langs/lang.zh.js
     langs/lang.de.js  langs/lang.fr.js
     langs/lang.ko.js
========================================= */
window.LANGS = window.LANGS || {};
/* Dùng proxy để đọc từ window.LANGS */
const LANGS = new Proxy({}, {
  get(_, lang) { return window.LANGS[lang]; }
});


let currentLang = 'vi';

function setLang(lang) {
  currentLang = lang;
  const t = LANGS[lang] || LANGS.vi;

  /* ── 1. Static data-i18n elements ── */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  /* ── 2. Flip cards ── */
  _translateFlipCards(t, lang);

  /* ── 3. Group / nhom-title headings ── */
  _translateGroupTitles(t, lang);

  /* ── 4. Photo captions ── */
  _translatePhotos(t, lang);

  /* ── 5. Video cards ── */
  _translateVideos(t, lang);

  /* ── 6. Quiz static UI + career info ── */
  window._CAREER_CURRENT = (lang === 'en') ? CAREER_INFO_EN : CAREER_INFO;
  _translateQuizUI(t, lang);

  /* ── 7. Poll ── */
  _translatePoll(t, lang);

  /* ── 8. Comment form UI ── */
  _translateCommentForm(t, lang);

  /* ── 9. Footer ── */
  _translateFooter(t, lang);

  /* ── 10. Misc UI ── */
  _translateMisc(t, lang);

  /* ── Lang button & dropdown ── */
  const flags = {vi:'🇻🇳',en:'🇬🇧',ja:'🇯🇵',zh:'🇨🇳',de:'🇩🇪',fr:'🇫🇷',ko:'🇰🇷'};
  const names = {vi:'VI',en:'EN',ja:'JP',zh:'ZH',de:'DE',fr:'FR',ko:'KR'};
  document.getElementById('lang-current-btn').textContent = (flags[lang]||'🌍') + ' ' + (names[lang]||lang.toUpperCase()) + ' ▾';
  document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('selected'));
  const opts = document.querySelectorAll('.lang-option');
  const langArr = ['vi','en','ja','zh','de','fr','ko'];
  const idx = langArr.indexOf(lang);
  if (opts[idx]) opts[idx].classList.add('selected');

  /* ── Theme label ── */
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.getElementById('theme-label').textContent = isLight ? (t.themeLight||'Sáng') : (t.themeDark||'Tối');
  document.getElementById('theme-toggle').textContent = (isLight ? '☀️ ' : '🌙 ') + document.getElementById('theme-label').textContent;

  toggleLangDropdown(false);
}

/* ─────────────────────────────────────────────────────────────
   TRANSLATION HELPERS
───────────────────────────────────────────────────────────── */

/* Helper: set innerHTML if key exists */
function _t(t, key, selector) {
  if (!t[key]) return;
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) el.innerHTML = t[key];
}
function _tAll(t, key, selector) {
  if (!t[key]) return;
  document.querySelectorAll(selector).forEach(el => { el.innerHTML = t[key]; });
}
function _ph(t, key, selector) {
  if (!t[key]) return;
  const el = document.querySelector(selector);
  if (el) el.placeholder = t[key];
}

/* ── Flip card helper ── */
function _translateFlipCards(t, lang) {
  /* Each card: data-id="ktvcntt" etc. */
  const cards = {
    ktvcntt: {
      front: () => `<h3><img src="images/programming.png" alt="" style="width:30px;height:30px;vertical-align:middle;">
        <span data-tooltip="${t.ktvcntt_tooltip||'Người hỗ trợ kỹ thuật phần cứng + phần mềm tại tổ chức'}">${t.ktvcntt_title||'a) Kĩ thuật viên Công nghệ Thông tin'}</span></h3>
        <p>${t.ktvcntt_desc||'Kĩ thuật viên công nghệ thông tin là người làm những công việc cần đến kiến thức và kĩ năng về CNTT tại các tổ chức, doanh nghiệp.'}</p>
        <ul>
          <li>${t.ktvcntt_li1||'Khắc phục lỗi, sửa chữa máy tính cho khách hàng'}</li>
          <li>${t.ktvcntt_li2||'Tư vấn nâng cấp phần cứng, phần mềm'}</li>
          <li>${t.ktvcntt_li3||'Lắp đặt thiết bị, thiết lập kết nối mạng'}</li>
          <li>${t.ktvcntt_li4||'Quản lí máy tính, thiết bị ngoại vi'}</li>
        </ul>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.ktvcntt_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.ktvcntt_back1||'Lương khởi điểm: 8–15 triệu/tháng'}</li>
        <li>${t.ktvcntt_back2||'Có kinh nghiệm: 15–30 triệu/tháng'}</li>
        <li>${t.ktvcntt_back3||'Cần: Kiến thức phần cứng, Windows/Linux'}</li>
        <li>${t.ktvcntt_back4||'Bằng cấp: CĐ/ĐH CNTT hoặc chứng chỉ CompTIA A+'}</li>
        <li>${t.ktvcntt_back5||'Tính cách phù hợp: Kiên nhẫn, tỉ mỉ, thích giải quyết vấn đề'}</li></ul>`
    },
    attt: {
      front: () => `<h3><img src="images/cyber-security.png" alt="" style="width:30px;height:30px;vertical-align:middle;">
        <span data-tooltip="${t.attt_tooltip||'Bảo vệ hệ thống khỏi tấn công mạng & rò rỉ dữ liệu'}">${t.attt_title||'b) Kĩ sư An toàn Thông tin'}</span></h3>
        <p>${t.attt_desc||'Xây dựng và duy trì các giải pháp an toàn dữ liệu, bảo mật thông tin và khôi phục hệ thống khi sự cố xảy ra.'}</p>
        <ul>
          <li>${t.attt_li1||'Thiết lập và hướng dẫn quy định an toàn thông tin'}</li>
          <li>${t.attt_li2||'Theo dõi, báo động khi có tín hiệu đáng ngờ'}</li>
          <li>${t.attt_li3||'Lập và triển khai kế hoạch xử lí sự cố'}</li>
          <li>${t.attt_li4||'Tư vấn an toàn thông tin cho bộ phận phát triển'}</li>
        </ul>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.attt_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.attt_back1||'Lương khởi điểm: 15–25 triệu/tháng'}</li>
        <li>${t.attt_back2||'Senior: 40–80 triệu/tháng'}</li>
        <li>${t.attt_back3||'Chứng chỉ: CEH, CISSP, CompTIA Security+'}</li>
        <li>${t.attt_back4||'Kỹ năng: Penetration testing, mã hóa, firewall'}</li>
        <li>${t.attt_back5||'Tính cách phù hợp: Tư duy phân tích, cẩn trọng'}</li></ul>`
    },
    qtm: {
      front: () => `<h3><img src="images/network-administrator.png" alt="" style="width:30px;height:30px;vertical-align:middle;">
        <span data-tooltip="${t.qtm_tooltip||'Đảm bảo hệ thống mạng luôn thông suốt & an toàn'}">${t.qtm_title||'a) Kĩ sư Quản trị Mạng'}</span></h3>
        <p>${t.qtm_desc||'Đảm bảo hệ thống mạng máy tính luôn thông suốt và hoạt động an toàn. Bao gồm quản lí, vận hành, cấu hình và bảo vệ mạng.'}</p>
        <ul>
          <li>${t.qtm_li1||'Quản lí thiết bị mạng, cấu hình và điều chỉnh hiệu năng'}</li>
          <li>${t.qtm_li2||'Bảo vệ mạng trước tấn công, truy cập bất hợp pháp'}</li>
          <li>${t.qtm_li3||'Khắc phục sự cố mạng'}</li>
        </ul>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.qtm_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.qtm_back1||'Lương: 12–30 triệu/tháng'}</li>
        <li>${t.qtm_back2||'Chứng chỉ: CCNA, CCNP (Cisco)'}</li>
        <li>${t.qtm_back3||'Kỹ năng: TCP/IP, VPN, Routing & Switching'}</li>
        <li>${t.qtm_back4||'Tính cách: Kỹ lưỡng, xử lý nhanh sự cố'}</li></ul>`
    },
    btht: {
      front: () => `<h3><img src="images/software-engineer.png" alt="" style="width:30px;height:30px;vertical-align:middle;">
        <span data-tooltip="${t.btht_tooltip||'Quản lý toàn bộ hệ thống CNTT của tổ chức'}">${t.btht_title||'b) Quản trị và Bảo trì Hệ thống'}</span></h3>
        <p>${t.btht_desc||'Quản lí cả phần mềm và phần cứng liên quan đến vận hành hệ thống mạng máy tính và truyền thông dữ liệu.'}</p>
        <ul>
          <li>${t.btht_li1||'Phân tích nhu cầu về hệ thống thông tin của tổ chức'}</li>
          <li>${t.btht_li2||'Cài đặt phần cứng và phần mềm cho hệ thống mạng'}</li>
          <li>${t.btht_li3||'Tối ưu hoá và đánh giá hoạt động hệ thống'}</li>
        </ul>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.btht_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.btht_back1||'Lương: 15–35 triệu/tháng'}</li>
        <li>${t.btht_back2||'Kỹ năng: Windows Server, Linux, VMware'}</li>
        <li>${t.btht_back3||'Cần biết: Active Directory, backup, monitoring'}</li>
        <li>${t.btht_back4||'Tính cách: Có trách nhiệm, tư duy hệ thống'}</li></ul>`
    },
    ktv: {
      front: () => `<h3><img src="images/tester.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.ktv_title||'a) Kiểm thử viên'}</h3>
        <p>${t.ktv_desc||'Chạy thử phần mềm để xác nhận đáp ứng đúng các yêu cầu thiết kế và vận hành, tìm và báo cáo lỗi cho nhóm phát triển.'}</p>
        <p>${t.ktv_note||'<strong style="color:#ff9999;"><img src="images/check (1).png" alt="" style="width:20px;height:20px;vertical-align:text-bottom;"> Không nhất thiết phải biết lập trình cao!</strong>'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.ktv_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.ktv_back1||'Lương: 8–20 triệu/tháng'}</li>
        <li>${t.ktv_back2||'Chứng chỉ: ISTQB Foundation Level'}</li>
        <li>${t.ktv_back3||'Kỹ năng: Test case, bug report, Jira, Selenium'}</li>
        <li>${t.ktv_back4||'Không cần lập trình giỏi — cần tư duy logic'}</li>
        <li>${t.ktv_back5||'Tính cách: Tỉ mỉ, kiên nhẫn, hay đặt câu hỏi'}</li></ul>`
    },
    qlkt: {
      front: () => `<h3><img src="images/unit.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.qlkt_title||'b) Người quản lí Kiểm thử'}</h3>
        <p>${t.qlkt_desc||'Lập quy trình kiểm thử, viết kịch bản chạy thử, lập kế hoạch và phân công công việc cho các kiểm thử viên thực hiện.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.qlkt_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.qlkt_back1||'Lương: 20–45 triệu/tháng'}</li>
        <li>${t.qlkt_back2||'Kinh nghiệm: 3–5 năm làm kiểm thử viên'}</li>
        <li>${t.qlkt_back3||'Kỹ năng: Quản lý dự án, lập kế hoạch kiểm thử'}</li>
        <li>${t.qlkt_back4||'Tính cách: Lãnh đạo, giao tiếp tốt, quyết đoán'}</li></ul>`
    },
    uiux: {
      front: () => `<h3><img src="images/ui-design.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.uiux_title||'c) Nhà thiết kế giao diện người dùng &amp; Nhà thiết kế trải nghiệm người dùng (UI/UX)'}</h3>
        <p>${t.uiux_desc||'Đảm bảo sản phẩm phần mềm thân thiện, hấp dẫn và dễ sử dụng. Sử dụng kiến thức tâm lí học, y sinh học để điều chỉnh tính năng phù hợp với người dùng.'}</p>
        <p>${t.uiux_note||'<strong style="color:#ff9999;">Không cần kĩ năng lập trình — cần tư duy sáng tạo!</strong>'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.uiux_back_h||'💡 Lương & Công cụ'}</h4><ul>
        <li>${t.uiux_back1||'Lương: 12–35 triệu/tháng; Senior: 50 triệu+'}</li>
        <li>${t.uiux_back2||'Công cụ: Figma, Adobe XD, Sketch, Zeplin'}</li>
        <li>${t.uiux_back3||'Portfolio thiết kế là yêu cầu quan trọng'}</li>
        <li>${t.uiux_back4||'Hiểu biết về tâm lý học màu sắc, UX research'}</li>
        <li>${t.uiux_back5||'Tính cách: Sáng tạo, đồng cảm với người dùng'}</li></ul>`
    },
    cloud: {
      front: () => `<h3><img src="images/data-management.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.cloud_title||'a) Kĩ sư Điện toán Đám mây'}</h3>
        <p>${t.cloud_desc||'Thiết kế, phát triển, bảo trì và khắc phục sự cố cơ sở hạ tầng đám mây. Sử dụng máy chủ Internet để lưu trữ, xử lí và phân tích dữ liệu.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.cloud_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.cloud_back1||'Lương: 20–50 triệu/tháng'}</li>
        <li>${t.cloud_back2||'Chứng chỉ: AWS Solutions Architect, GCP, Azure'}</li>
        <li>${t.cloud_back3||'Kỹ năng: Docker, Kubernetes, Terraform, CI/CD'}</li>
        <li>${t.cloud_back4||'Tính cách: Tư duy hạ tầng, thích tự động hóa'}</li></ul>`
    },
    iot: {
      front: () => `<h3><img src="images/technology.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.iot_title||'b) Kĩ sư IoT'}</h3>
        <p>${t.iot_desc||'Thiết kế, phát triển, triển khai và bảo trì các hệ thống IoT — mạng lưới thiết bị trao đổi thông tin theo thời gian thực.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.iot_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.iot_back1||'Lương: 15–40 triệu/tháng'}</li>
        <li>${t.iot_back2||'Kỹ năng: Embedded C, MQTT, Raspberry Pi, Arduino'}</li>
        <li>${t.iot_back3||'Kết hợp: Điện tử + Phần mềm + Mạng'}</li>
        <li>${t.iot_back4||'Tính cách: Thích phần cứng lẫn phần mềm'}</li></ul>`
    },
    ai: {
      front: () => `<h3><img src="images/chip.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.ai_title||'Kĩ sư Trí tuệ Nhân tạo (AI)'}</h3>
        <p>${t.ai_desc||'Xây dựng mô hình AI, quản lí quy trình phát triển AI và đảm bảo các kết quả nghiên cứu AI mới nhất được triển khai vào sản xuất. Lĩnh vực nóng nhất hiện nay.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.ai_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.ai_back1||'Lương: 25–80 triệu/tháng; Senior: 100 triệu+'}</li>
        <li>${t.ai_back2||'Kỹ năng: Python, TensorFlow, PyTorch, ML pipelines'}</li>
        <li>${t.ai_back3||'Toán học: Đại số tuyến tính, xác suất thống kê'}</li>
        <li>${t.ai_back4||'Tính cách: Ham nghiên cứu, tư duy phân tích cao'}</li></ul>`
    },
    thietkedohoa: {
      front: () => `<h3><img src="images/designer.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.thietkedohoa_title||'a) Chuyên viên Thiết kế Đồ hoạ'}</h3>
        <p>${t.thietkedohoa_desc||'Chọn kiểu chữ, màu sắc, hình khối, hình ảnh và bài trí tổng thể sản phẩm đồ hoạ bằng Photoshop, Illustrator, Sketch... Không cần lập trình.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.thietkedohoa_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.thietkedohoa_back1||'Lương: 8–22 triệu/tháng; Freelance không giới hạn'}</li>
        <li>${t.thietkedohoa_back2||'Công cụ: Photoshop, Illustrator, CorelDRAW'}</li>
        <li>${t.thietkedohoa_back3||'Portfolio là yếu tố quyết định khi xin việc'}</li>
        <li>${t.thietkedohoa_back4||'Tính cách: Sáng tạo, có khiếu thẩm mỹ'}</li></ul>`
    },
    ttdpt: {
      front: () => `<h3><img src="images/web-design.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.ttdpt_title||'b) Chuyên viên Thiết kế Truyền thông Đa phương tiện'}</h3>
        <p>${t.ttdpt_desc||'Thiết kế, xử lí và biên tập âm thanh, hình ảnh cho sản phẩm số, kết hợp kỹ thuật đa phương tiện và truyền thông đại chúng.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.ttdpt_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.ttdpt_back1||'Lương: 10–25 triệu/tháng'}</li>
        <li>${t.ttdpt_back2||'Công cụ: Premiere Pro, After Effects, Audition'}</li>
        <li>${t.ttdpt_back3||'Cần: Kỹ năng kể chuyện bằng hình ảnh/âm thanh'}</li>
        <li>${t.ttdpt_back4||'Tính cách: Sáng tạo, nhạy cảm với nghệ thuật'}</li></ul>`
    },
    webdev: {
      front: () => `<h3><img src="images/web-development.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.webdev_title||'c) Nhà phát triển Trang web'}</h3>
        <p>${t.webdev_desc||'Thiết kế giao diện, lập trình trang web, kiểm tra và khắc phục sự cố về hiệu suất hoặc trải nghiệm người dùng.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.webdev_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.webdev_back1||'Lương: 12–40 triệu/tháng; Fullstack: 50 triệu+'}</li>
        <li>${t.webdev_back2||'Frontend: HTML, CSS, JS, React/Vue'}</li>
        <li>${t.webdev_back3||'Backend: Node.js, PHP, Python, Java'}</li>
        <li>${t.webdev_back4||'Tính cách: Logic + sáng tạo, thích xây dựng'}</li></ul>`
    },
    vfx: {
      front: () => `<h3><img src="images/movie.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.vfx_title||'d) Chuyên viên Kĩ xảo Điện ảnh'}</h3>
        <p>${t.vfx_desc||'Đảm bảo các hiệu ứng âm thanh, hình ảnh mang lại cảm xúc thật nhất và truyền tải đúng thông điệp của nhà sản xuất.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.vfx_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.vfx_back1||'Lương: 15–50 triệu/tháng (theo dự án)'}</li>
        <li>${t.vfx_back2||'Công cụ: Nuke, Houdini, Maya, Blender'}</li>
        <li>${t.vfx_back3||'Ngành đang bùng nổ với phim VN và quảng cáo'}</li>
        <li>${t.vfx_back4||'Tính cách: Sáng tạo, chú ý từng chi tiết'}</li></ul>`
    },
    data: {
      front: () => `<h3><img src="images/monitor.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.data_title||'a) Nhà phân tích Dữ liệu &amp; Nhà khoa học Dữ liệu'}</h3>
        <p>${t.data_desc||'Phân tích tập dữ liệu để xác định xu hướng, phát hiện bất thường và tri thức tiềm ẩn, làm cơ sở cho lãnh đạo ra quyết định.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.data_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.data_back1||'Lương: 18–50 triệu/tháng'}</li>
        <li>${t.data_back2||'Kỹ năng: Python/R, SQL, Tableau, Power BI'}</li>
        <li>${t.data_back3||'Cần: Toán thống kê, tư duy phân tích dữ liệu'}</li>
        <li>${t.data_back4||'Tính cách: Tò mò, thích tìm pattern trong data'}</li></ul>`
    },
    gis: {
      front: () => `<h3><img src="images/map.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.gis_title||'b) Kĩ sư GIS (Hệ thống Thông tin Địa lí)'}</h3>
        <p>${t.gis_desc||'Xây dựng bản đồ số, duy trì cơ sở dữ liệu địa lí và phân tích dữ liệu bằng các công cụ GIS cho nhiều lĩnh vực ứng dụng.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.gis_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.gis_back1||'Lương: 12–28 triệu/tháng'}</li>
        <li>${t.gis_back2||'Công cụ: ArcGIS, QGIS, Python, PostGIS'}</li>
        <li>${t.gis_back3||'Ứng dụng: Đô thị, quốc phòng, môi trường'}</li>
        <li>${t.gis_back4||'Tính cách: Tỉ mỉ, thích làm việc với bản đồ/không gian'}</li></ul>`
    },
    fintech: {
      front: () => `<h3><img src="images/stock-market.png" alt="" style="width:30px;height:30px;vertical-align:middle;"> ${t.fintech_title||'c) Kĩ sư Công nghệ Tài chính (Fintech)'}</h3>
        <p>${t.fintech_desc||'Áp dụng công nghệ tiên tiến để cải thiện dịch vụ tài chính. Ứng dụng điện toán đám mây, phần mềm phân tích dữ liệu, AI vào tài chính – ngân hàng.'}</p>
        <span class="flip-hint">${t.flip_hint||'🔄 Hover để xem thêm'}</span>`,
      back: () => `<h4>${t.fintech_back_h||'💡 Lương & Yêu cầu'}</h4><ul>
        <li>${t.fintech_back1||'Lương: 20–60 triệu/tháng'}</li>
        <li>${t.fintech_back2||'Kỹ năng: Blockchain, API tài chính, bảo mật thanh toán'}</li>
        <li>${t.fintech_back3||'Kết hợp: CNTT + Tài chính – Ngân hàng'}</li>
        <li>${t.fintech_back4||'Tính cách: Cẩn thận, hiểu quy định tài chính'}</li></ul>`
    }
  };

  Object.entries(cards).forEach(([id, def]) => {
    const wrap = document.querySelector(`.bai-viet-card[data-id="${id}"]`);
    if (!wrap) return;
    const front = wrap.querySelector('.flip-front');
    const back  = wrap.querySelector('.flip-back');
    if (front) front.innerHTML = def.front();
    if (back)  back.innerHTML  = def.back();
  });
}

/* ── Group headings ── */
function _translateGroupTitles(t, lang) {
  const map = [
    ['BÀI 1 – NHÓM NGHỀ DỊCH VỤ TRONG NGÀNH CNTT',     'nhom_dv'],
    ['BÀI 1 – NHÓM NGHỀ QUẢN TRỊ TRONG NGÀNH CNTT',     'nhom_qt'],
    ['BÀI 2 – NHÓM 1: MỘT SỐ NGHỀ TRONG NGÀNH CÔNG NGHIỆP PHẦN MỀM', 'nhom_pm'],
    ['BÀI 2 – NHÓM 2: CHUYỂN ĐỔI SỐ VÀ MỘT SỐ NGHỀ LIÊN QUAN', 'nhom_cds'],
    ['BÀI 2 – NHÓM 3: MỘT SỐ NGHỀ ỨNG DỤNG CNTT TRONG NGÀNH TRUYỀN THÔNG ĐA PHƯƠNG TIỆN', 'nhom_tt'],
    ['BÀI 2 – NHÓM 4: MỘT SỐ NGHỀ ỨNG DỤNG CNTT TRONG CÁC NGÀNH KHÁC', 'nhom_ud'],
  ];
  document.querySelectorAll('.nhom-title').forEach(el => {
    const img = el.querySelector('img');
    const imgHtml = img ? img.outerHTML + ' ' : '';
    map.forEach(([viText, key]) => {
      if (el.textContent.includes(viText.substring(0,10))) {
        el.innerHTML = imgHtml + (t[key] || viText);
      }
    });
  });
}

/* ── Photo captions ── */
function _translatePhotos(t, lang) {
  const caps = [
    ['Kĩ thuật viên CNTT sửa chữa và bảo trì phần cứng máy tính', 'cap1'],
    ['Trung tâm điều hành an toàn thông tin (SOC) giám sát 24/7',  'cap2'],
    ['Kĩ sư quản trị mạng vận hành hệ thống mạng doanh nghiệp',   'cap3'],
    ['Kĩ sư AI nghiên cứu và phát triển mô hình trí tuệ nhân tạo', 'cap4'],
    ['GIS xây dựng bản đồ số ứng dụng quy hoạch đô thị',           'cap5'],
    ['Nhà thiết kế UI/UX xây dựng giao diện và trải nghiệm người dùng', 'cap6'],
  ];
  document.querySelectorAll('.anh-caption').forEach(el => {
    caps.forEach(([vi, key]) => {
      if (el.textContent.trim().startsWith(vi.substring(0,12))) {
        el.textContent = t[key] || vi;
      }
    });
  });
}

/* ── Video cards ── */
function _translateVideos(t, lang) {
  const videos = [
    { ytId:'m4xEF92ZPuk', titleKey:'vid1_title', descKey:'vid1_desc' },
    { ytId:'inWWhr5tnEA', titleKey:'vid2_title', descKey:'vid2_desc' },
    { ytId:'9kRgVxULbag', titleKey:'vid3_title', descKey:'vid3_desc' },
    { ytId:'vgj0OjJde-U', titleKey:'vid4_title', descKey:'vid4_desc' },
  ];
  document.querySelectorAll('.video-card').forEach(card => {
    const img = card.querySelector('.yt-thumb img');
    if (!img) return;
    const src = img.src || '';
    videos.forEach(v => {
      if (src.includes(v.ytId)) {
        const h4 = card.querySelector('h4');
        const p  = card.querySelector('p');
        if (h4 && t[v.titleKey]) h4.textContent = t[v.titleKey];
        if (p  && t[v.descKey])  p.textContent  = t[v.descKey];
      }
    });
  });
}

/* ── Quiz static UI ── */
function _translateQuizUI(t, lang) {
  /* Section title */
  const secTitle = document.querySelector('#goc-quiz .section-title');
  if (secTitle && t.quiz_sec_title) secTitle.innerHTML = t.quiz_sec_title;
  /* Intro */
  const introH = document.querySelector('#quiz-intro h3');
  if (introH && t.quiz_intro_h) introH.textContent = t.quiz_intro_h;
  const introP = document.querySelector('#quiz-intro p');
  if (introP && t.quiz_intro_p) introP.innerHTML = t.quiz_intro_p;
  const startBtn = document.querySelector('.quiz-start-btn');
  if (startBtn && t.quiz_start_btn) startBtn.textContent = t.quiz_start_btn;
  /* Result static labels */
  const resTitle = document.getElementById('quiz-res-title');
  if (resTitle && t.quiz_res_title) resTitle.textContent = t.quiz_res_title;
  const resSub = document.getElementById('quiz-res-sub');
  if (resSub && t.quiz_res_sub) resSub.textContent = t.quiz_res_sub;
  const noteEl = document.getElementById('quiz-note');
  if (noteEl && t.quiz_note_html) noteEl.innerHTML = t.quiz_note_html;
  const restartBtn = document.querySelector('.quiz-restart-btn');
  if (restartBtn && t.quiz_restart_btn) restartBtn.textContent = t.quiz_restart_btn;
  /* Re-render current question if quiz is running */
  const qa = document.getElementById('quiz-qa');
  if (qa && qa.style.display !== 'none') showQuestion(quizCurrentQ);
}

/* ── Poll ── */
function _translatePoll(t, lang) {
  /* Rebuild POLLS_CURRENT with translated strings */
  const polls_en = [
    { id:'poll_bai1', tab: t.poll_tab1||'📚 Bài 1',
      q: t.poll_q1||'Trong Bài 1, bạn thấy nghề nào hấp dẫn nhất?',
      opts: [t.poll_opt_bai1_1, t.poll_opt_bai1_2, t.poll_opt_bai1_3, t.poll_opt_bai1_4].map((v,i)=>v||POLLS[0].opts[i]) },
    { id:'poll_pm',   tab: t.poll_tab2||'💻 Phần mềm',
      q: t.poll_q2||'Trong ngành Công nghiệp phần mềm, bạn chọn nghề nào?',
      opts: [t.poll_opt_pm_1, t.poll_opt_pm_2, t.poll_opt_pm_3].map((v,i)=>v||POLLS[1].opts[i]) },
    { id:'poll_cds',  tab: t.poll_tab3||'🚀 Chuyển đổi số',
      q: t.poll_q3||'Nghề nào trong Chuyển đổi số bạn thấy tương lai nhất?',
      opts: [t.poll_opt_cds_1, t.poll_opt_cds_2, t.poll_opt_cds_3].map((v,i)=>v||POLLS[2].opts[i]) },
    { id:'poll_media',tab: t.poll_tab4||'🎨 Truyền thông',
      q: t.poll_q4||'Lĩnh vực nào trong Truyền thông đa phương tiện bạn thích?',
      opts: [t.poll_opt_media_1, t.poll_opt_media_2, t.poll_opt_media_3, t.poll_opt_media_4].map((v,i)=>v||POLLS[3].opts[i]) },
  ];
  /* Store and re-render */
  window._POLLS_CURRENT = polls_en;
  window._POLL_TOTAL_LABEL = t.poll_total_label || 'Tổng';
  window._POLL_TOTAL_UNIT  = t.poll_total_unit  || 'lượt bình chọn';
  renderPoll(currentPollIdx);
  /* Section title */
  const pollTitle = document.querySelector('#goc-poll .section-title');
  if (pollTitle && t.poll_sec_title) pollTitle.innerHTML = t.poll_sec_title;
}

/* ── Comment form UI ── */
function _translateCommentForm(t, lang) {
  const nameInput = document.getElementById('ten');
  if (nameInput && t.bl_placeholder_name) nameInput.placeholder = t.bl_placeholder_name;
  const contentTA = document.getElementById('noidung');
  if (contentTA && t.bl_placeholder_content) contentTA.placeholder = t.bl_placeholder_content;
  /* Dropdown default */
  const selDefault = document.querySelector('#nghe-yeu-thich option[value=""]');
  if (selDefault && t.bl_select_default) selDefault.textContent = t.bl_select_default;
  /* Optgroup labels */
  const optgroups = document.querySelectorAll('#nghe-yeu-thich optgroup');
  const ogKeys = ['bl_optgroup1','bl_optgroup2','bl_optgroup3','bl_optgroup4','bl_optgroup5','bl_optgroup6'];
  optgroups.forEach((og, i) => { if (t[ogKeys[i]]) og.label = t[ogKeys[i]]; });
  /* Emotion label */
  const emoLabel = document.querySelector('.bl-emoji-label');
  if (emoLabel && t.bl_emotion_label) emoLabel.textContent = t.bl_emotion_label;
  /* Submit button */
  const submitBtn = document.querySelector('.bl-submit-btn');
  if (submitBtn && t.bl_submit_btn) submitBtn.textContent = t.bl_submit_btn;
  /* Filter tabs */
  const tabs = document.querySelectorAll('.bl-tab');
  const tabKeys = ['bl_filter_all','bl_filter_new','bl_filter_popular'];
  if (t[tabKeys[0]]) {
    tabs.forEach((tab, i) => { if (t[tabKeys[i]]) tab.textContent = t[tabKeys[i]]; });
  }
  /* Search input */
  const blSearch = document.querySelector('.bl-search-input');
  if (blSearch && t.bl_search_placeholder) blSearch.placeholder = t.bl_search_placeholder;
}

/* ── Footer ── */
function _translateFooter(t, lang) {
  const fAbout = document.querySelector('footer h3:first-child');
  if (fAbout && t.footer_about_title) fAbout.textContent = t.footer_about_title;
  const fSrc = document.querySelector('footer h3:last-of-type');
  if (fSrc && t.footer_sources_title) fSrc.textContent = t.footer_sources_title;
  /* Label spans */
  document.querySelectorAll('footer strong[style*="ff9999"]').forEach(el => {
    const txt = el.textContent.trim();
    if (txt.includes('Tác giả') && t.footer_author) el.textContent = t.footer_author;
    else if (txt.includes('Lớp') && t.footer_class) el.textContent = t.footer_class;
    else if (txt.includes('Trường') && t.footer_school) el.textContent = t.footer_school;
    else if (txt.includes('Môn') && t.footer_subject) el.textContent = t.footer_subject;
    else if (txt.includes('cập nhật') && t.footer_updated) el.textContent = t.footer_updated;
    else if (txt.includes('email') && t.footer_email) el.textContent = t.footer_email;
  });
  const fCopy = document.querySelector('.footer-copy');
  if (fCopy && t.footer_copy) fCopy.textContent = t.footer_copy;
}

/* ── Misc UI ── */
function _translateMisc(t, lang) {
  const btt = document.getElementById('back-to-top');
  if (btt && t.back_to_top_title) btt.title = t.back_to_top_title;
  const lsInput = document.getElementById('live-search-input');
  if (lsInput && t.search_placeholder) lsInput.placeholder = t.search_placeholder;
  const lsBtn = document.querySelector('.live-search-btn');
  if (lsBtn && t.live_search_title) lsBtn.title = t.live_search_title;
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    if (t.bookmark_title) btn.title = t.bookmark_title;
  });
  /* Page title */
  if (t.badge) document.title = t.badge + ' | Topic G';
}

let langDropOpen = false;
function toggleLangDropdown(forceClose) {
  const dd = document.getElementById('lang-dropdown');
  if (forceClose === false) { dd.classList.remove('open'); langDropOpen = false; return; }
  langDropOpen = !langDropOpen;
  dd.classList.toggle('open', langDropOpen);
}
document.addEventListener('click', e => {
  if (!document.getElementById('lang-switcher').contains(e.target)) {
    document.getElementById('lang-dropdown').classList.remove('open');
    langDropOpen = false;
  }
});

/* =========================================
   THEME TOGGLE
========================================= */
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? 'dark' : 'light');
  const t = LANGS[currentLang] || LANGS.vi;
  document.getElementById('theme-label').textContent = isLight ? (t.themeDark||'Tối') : (t.themeLight||'Sáng');
  document.getElementById('theme-toggle').textContent = (isLight ? '🌙 ' : '☀️ ') + document.getElementById('theme-label').textContent;
  try { localStorage.setItem('theme_pref', isLight ? 'dark' : 'light'); } catch(e){}
}
// Restore theme
try { const saved = localStorage.getItem('theme_pref'); if (saved) document.documentElement.setAttribute('data-theme', saved); } catch(e){}

/* =========================================
   PARTICLE CANVAS
========================================= */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(W / 14);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.6 ? '#ff6b35' : Math.random() > 0.5 ? '#c084fc' : '#e01c1c'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      // Connect nearby
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist/90) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* =========================================
   READING TIME
========================================= */
function calcReadingTime() {
  const text = document.body.innerText;
  const words = text.split(/\s+/).length;
  const mins = Math.ceil(words / 200);
  const el = document.getElementById('reading-time-val');
  if (el) el.textContent = '~' + mins + ' ' + (LANGS[currentLang]?.readingMin || 'phút');
}

/* =========================================
   QUIZ DATA & LOGIC
========================================= */
const QUIZ_QUESTIONS = [
  {
    q: 'Khi gặp sự cố máy tính, bạn thường...',
    opts: [
      { text: 'Tự mình mày mò tìm cách sửa', scores: {ktvcntt:3, qtm:2, attt:1} },
      { text: 'Tìm hiểu nguyên nhân sâu hơn, phòng ngừa tương lai', scores: {attt:3, btht:2, cloud:1} },
      { text: 'Nhờ người khác và học cách từ họ', scores: {uiux:2, ktv:2, data:1} },
      { text: 'Đọc tài liệu kỹ thuật để hiểu tường tận', scores: {ai:3, cloud:2, fintech:1} }
    ]
  },
  {
    q: 'Môn học bạn yêu thích nhất ở trường là...',
    opts: [
      { text: 'Toán – Xác suất thống kê', scores: {ai:3, data:3, fintech:2} },
      { text: 'Vật lý – Điện tử', scores: {iot:3, ktvcntt:2, qtm:1} },
      { text: 'Mỹ thuật – Thiết kế', scores: {uiux:3, thietkedohoa:3, vfx:2} },
      { text: 'Văn học – Ngôn ngữ', scores: {ttdpt:2, uiux:1, webdev:2} }
    ]
  },
  {
    q: 'Lúc rảnh, bạn thích làm gì nhất?',
    opts: [
      { text: 'Chơi game / xem phim sci-fi', scores: {ai:2, cloud:2, iot:1} },
      { text: 'Vẽ vời, thiết kế, sắp xếp bố cục', scores: {uiux:3, thietkedohoa:3, vfx:2} },
      { text: 'Lướt tin tức công nghệ / bảo mật', scores: {attt:3, qtm:2, cloud:1} },
      { text: 'Phân tích dữ liệu / làm Excel', scores: {data:3, fintech:2, ai:1} }
    ]
  },
  {
    q: 'Bạn thấy mình thuộc kiểu người nào?',
    opts: [
      { text: 'Thám tử – thích tìm bug, điểm yếu', scores: {attt:3, ktv:3, qlkt:2} },
      { text: 'Kiến trúc sư – thích xây dựng hệ thống', scores: {cloud:3, btht:3, qtm:2} },
      { text: 'Nghệ sĩ – thích tạo ra thứ đẹp', scores: {uiux:3, thietkedohoa:3, vfx:2} },
      { text: 'Nhà khoa học – thích nghiên cứu, thử nghiệm', scores: {ai:3, data:3, iot:2} }
    ]
  },
  {
    q: 'Khi làm việc nhóm, vai trò bạn thường đảm nhận là...',
    opts: [
      { text: 'Người kiểm tra, rà soát lỗi cuối', scores: {ktv:3, qlkt:2, attt:2} },
      { text: 'Người lên kế hoạch & phân công', scores: {qlkt:3, btht:2, fintech:1} },
      { text: 'Người làm phần kỹ thuật/lập trình', scores: {webdev:3, cloud:2, iot:2} },
      { text: 'Người thiết kế / trình bày', scores: {uiux:3, thietkedohoa:3, ttdpt:2} }
    ]
  },
  {
    q: 'Điều nào khiến bạn hứng thú nhất trong CNTT?',
    opts: [
      { text: 'Giữ cho hệ thống an toàn khỏi hacker', scores: {attt:3, qtm:2, btht:1} },
      { text: 'Dạy máy tính biết suy nghĩ và học hỏi', scores: {ai:3, data:2, cloud:1} },
      { text: 'Kết nối thiết bị thông minh với nhau', scores: {iot:3, cloud:2, ktvcntt:1} },
      { text: 'Tạo ra trải nghiệm người dùng tuyệt vời', scores: {uiux:3, webdev:2, thietkedohoa:1} }
    ]
  },
  {
    q: 'Bạn có ngại làm việc với con số và tài chính không?',
    opts: [
      { text: 'Không – rất thích phân tích số liệu', scores: {fintech:3, data:3, ai:1} },
      { text: 'Được – nhưng thích kỹ thuật hơn', scores: {cloud:2, iot:2, webdev:2} },
      { text: 'Hơi ngại – thích sáng tạo hơn', scores: {uiux:2, vfx:2, thietkedohoa:2} },
      { text: 'Ngại – thích giải quyết vấn đề cụ thể', scores: {ktvcntt:2, ktv:2, gis:2} }
    ]
  },
  {
    q: 'Nếu được chọn môi trường làm việc lý tưởng...',
    opts: [
      { text: 'Phòng server/mạng, thiết bị là người bạn', scores: {qtm:3, btht:2, ktvcntt:2} },
      { text: 'Studio sáng tạo với màn hình lớn', scores: {uiux:3, vfx:3, thietkedohoa:2} },
      { text: 'Trung tâm bảo mật giám sát 24/7', scores: {attt:3, qlkt:2, cloud:1} },
      { text: 'Lab nghiên cứu AI/Data science', scores: {ai:3, data:3, fintech:1} }
    ]
  },
  {
    q: 'Với bạn, điều quan trọng nhất trong công việc là...',
    opts: [
      { text: 'Được sáng tạo tự do', scores: {uiux:3, vfx:3, thietkedohoa:2} },
      { text: 'Lương cao và ổn định', scores: {ai:2, attt:2, fintech:2} },
      { text: 'Luôn học được kỹ năng mới', scores: {cloud:2, iot:2, webdev:2} },
      { text: 'Công việc có tác động xã hội', scores: {gis:3, data:2, fintech:2} }
    ]
  },
  {
    q: 'Bạn nghĩ mình giỏi nhất ở kỹ năng nào?',
    opts: [
      { text: 'Quan sát và chú ý chi tiết', scores: {ktv:3, attt:2, thietkedohoa:2} },
      { text: 'Tư duy logic và giải quyết vấn đề phức tạp', scores: {ai:3, data:2, cloud:2} },
      { text: 'Giao tiếp và thuyết phục người khác', scores: {uiux:2, qlkt:2, ttdpt:2} },
      { text: 'Học nhanh công nghệ mới', scores: {webdev:3, iot:2, cloud:2} }
    ]
  }
];

const CAREER_INFO = {
  ktvcntt: { name:'Kĩ thuật viên CNTT', group:'Bài 1 – Dịch vụ', anchor:'#cac-bai-viet', why:'Bạn thích giải quyết vấn đề thực tế, làm việc trực tiếp với thiết bị và hỗ trợ người dùng. Sự tỉ mỉ và kiên nhẫn là lợi thế của bạn.', color:'#e01c1c' },
  attt: { name:'Kĩ sư An toàn Thông tin', group:'Bài 1 – Dịch vụ', anchor:'#cac-bai-viet', why:'Tư duy phân tích và bản năng tìm kiếm điểm yếu hệ thống rất phù hợp với bạn. Bạn thích thử thách và luôn đặt câu hỏi "điều gì có thể sai?".', color:'#ff4444' },
  qtm: { name:'Kĩ sư Quản trị Mạng', group:'Bài 1 – Quản trị', anchor:'#cac-bai-viet', why:'Bạn có tư duy hệ thống, thích vận hành và đảm bảo mọi thứ hoạt động trơn tru. Kỹ năng xử lý sự cố nhanh là điểm mạnh của bạn.', color:'#ff6b35' },
  btht: { name:'Quản trị và Bảo trì Hệ thống', group:'Bài 1 – Quản trị', anchor:'#cac-bai-viet', why:'Bạn có tầm nhìn tổng thể về hệ thống CNTT và khả năng lập kế hoạch dài hạn. Bạn thích kiểm soát và đảm bảo an toàn toàn diện.', color:'#ff8c00' },
  ktv: { name:'Kiểm thử viên', group:'Bài 2 – Phần mềm', anchor:'#cac-bai-viet', why:'Bạn có óc quan sát tinh tường, thích tìm lỗi và không hài lòng với sản phẩm chưa hoàn hảo. Đây là nghề lý tưởng cho người tỉ mỉ!', color:'#e01c1c' },
  qlkt: { name:'Người quản lí Kiểm thử', group:'Bài 2 – Phần mềm', anchor:'#cac-bai-viet', why:'Kỹ năng lãnh đạo và khả năng lập kế hoạch chi tiết của bạn rất phù hợp. Bạn không chỉ giỏi kỹ thuật mà còn biết tổ chức nhóm hiệu quả.', color:'#ff4444' },
  uiux: { name:'Nhà thiết kế UI/UX', group:'Bài 2 – Phần mềm', anchor:'#cac-bai-viet', why:'Bạn kết hợp tư duy sáng tạo với sự đồng cảm với người dùng. Bạn muốn tạo ra những sản phẩm đẹp và dễ dùng.', color:'#c084fc' },
  cloud: { name:'Kĩ sư Điện toán Đám mây', group:'Bài 2 – Chuyển đổi số', anchor:'#cac-bai-viet', why:'Bạn thích xây dựng hạ tầng quy mô lớn, tự động hóa và luôn cập nhật công nghệ mới nhất. Tư duy kiến trúc hệ thống là điểm mạnh.', color:'#ff6b35' },
  iot: { name:'Kĩ sư IoT', group:'Bài 2 – Chuyển đổi số', anchor:'#cac-bai-viet', why:'Sự kết hợp giữa phần cứng và phần mềm hấp dẫn bạn. Bạn thích kết nối thế giới thực với không gian số.', color:'#ff8c00' },
  ai: { name:'Kĩ sư Trí tuệ Nhân tạo (AI)', group:'Bài 2 – Chuyển đổi số', anchor:'#cac-bai-viet', why:'Niềm đam mê nghiên cứu và tư duy toán học của bạn phù hợp hoàn hảo với AI. Bạn muốn tạo ra những thứ chưa từng tồn tại.', color:'#a78bfa' },
  thietkedohoa: { name:'Chuyên viên Thiết kế Đồ hoạ', group:'Bài 2 – Truyền thông', anchor:'#cac-bai-viet', why:'Khiếu thẩm mỹ và đam mê sáng tạo hình ảnh là tài năng thiên bẩm của bạn. Bạn muốn làm thế giới đẹp hơn.', color:'#c084fc' },
  ttdpt: { name:'Chuyên viên Thiết kế TTĐPT', group:'Bài 2 – Truyền thông', anchor:'#cac-bai-viet', why:'Bạn kết hợp được nhiều loại phương tiện — âm thanh, hình ảnh, video — và có khả năng kể chuyện qua đa phương tiện.', color:'#d946ef' },
  webdev: { name:'Nhà phát triển Trang web', group:'Bài 2 – Truyền thông', anchor:'#cac-bai-viet', why:'Bạn vừa thích lập trình vừa quan tâm đến giao diện. Sự kết hợp logic-sáng tạo làm cho bạn trở thành web developer lý tưởng.', color:'#06b6d4' },
  vfx: { name:'Chuyên viên Kĩ xảo Điện ảnh', group:'Bài 2 – Truyền thông', anchor:'#cac-bai-viet', why:'Trí tưởng tượng phong phú và kỹ năng kỹ thuật của bạn kết hợp để tạo ra những kỳ diệu điện ảnh.', color:'#f59e0b' },
  data: { name:'Nhà phân tích / Khoa học Dữ liệu', group:'Bài 2 – Ứng dụng', anchor:'#cac-bai-viet', why:'Bạn thích tìm kiếm ý nghĩa trong những con số và có tư duy phân tích sắc bén. Data là ngôn ngữ tự nhiên của bạn.', color:'#10b981' },
  gis: { name:'Kĩ sư GIS', group:'Bài 2 – Ứng dụng', anchor:'#cac-bai-viet', why:'Sự kết hợp giữa công nghệ và địa lý hấp dẫn bạn. Bạn thích làm việc với bản đồ và dữ liệu không gian.', color:'#84cc16' },
  fintech: { name:'Kĩ sư Công nghệ Tài chính (Fintech)', group:'Bài 2 – Ứng dụng', anchor:'#cac-bai-viet', why:'Bạn không sợ con số và muốn áp dụng công nghệ vào lĩnh vực tài chính – nơi một quyết định đúng có giá trị khổng lồ.', color:'#f59e0b' }
};

/* ── English Career Info for quiz results ── */
const CAREER_INFO_EN = {
  ktvcntt:      { name:'IT Technician',                     group:'Lesson 1 – Service',              anchor:'#cac-bai-viet', why:'You enjoy solving real problems hands-on, working directly with devices and supporting users. Your patience and attention to detail are your biggest strengths.', color:'#e01c1c' },
  attt:         { name:'Information Security Engineer',     group:'Lesson 1 – Service',              anchor:'#cac-bai-viet', why:'Your analytical mindset and instinct for finding system weaknesses make you a natural. You love challenges and always ask "what could go wrong?".', color:'#ff4444' },
  qtm:          { name:'Network Engineer',                  group:'Lesson 1 – Management',           anchor:'#cac-bai-viet', why:'You have a systems mindset, love keeping everything running smoothly, and excel at quick incident response. Stability is your superpower.', color:'#ff6b35' },
  btht:         { name:'System Administration & Maintenance', group:'Lesson 1 – Management',         anchor:'#cac-bai-viet', why:'You have a holistic view of IT infrastructure and the ability to plan long-term. You enjoy being in control and ensuring comprehensive safety.', color:'#ff8c00' },
  ktv:          { name:'Software Tester',                   group:'Lesson 2 – Software',             anchor:'#cac-bai-viet', why:'Your keen eye for observation, love of finding bugs, and refusal to accept imperfect products make this ideal for a detail-oriented person like you!', color:'#e01c1c' },
  qlkt:         { name:'Test Manager',                      group:'Lesson 2 – Software',             anchor:'#cac-bai-viet', why:'Your leadership skills and ability to plan in detail are a perfect fit. You\'re not just technically skilled — you know how to organise a team effectively.', color:'#ff4444' },
  uiux:         { name:'UI/UX Designer',                    group:'Lesson 2 – Software',             anchor:'#cac-bai-viet', why:'You blend creative thinking with deep empathy for users. You want to create products that are both beautiful and effortless to use.', color:'#c084fc' },
  cloud:        { name:'Cloud Computing Engineer',          group:'Lesson 2 – Digital Transformation', anchor:'#cac-bai-viet', why:'You love building large-scale infrastructure, automating everything, and staying on the cutting edge of technology. Systems architecture is your strength.', color:'#ff6b35' },
  iot:          { name:'IoT Engineer',                      group:'Lesson 2 – Digital Transformation', anchor:'#cac-bai-viet', why:'The combination of hardware and software fascinates you. You love bridging the physical world with the digital space through connected devices.', color:'#ff8c00' },
  ai:           { name:'AI Engineer (Artificial Intelligence)', group:'Lesson 2 – Digital Transformation', anchor:'#cac-bai-viet', why:'Your passion for research and mathematical thinking are a perfect match for AI. You want to create things that have never existed before.', color:'#a78bfa' },
  thietkedohoa: { name:'Graphic Designer',                  group:'Lesson 2 – Media',                anchor:'#cac-bai-viet', why:'Your aesthetic sense and passion for visual creativity are natural talents. You want to make the world a more beautiful place.', color:'#c084fc' },
  ttdpt:        { name:'Multimedia Communications Designer', group:'Lesson 2 – Media',               anchor:'#cac-bai-viet', why:'You can weave together audio, images and video into compelling stories. Multi-media is your creative language.', color:'#d946ef' },
  webdev:       { name:'Web Developer',                     group:'Lesson 2 – Media',                anchor:'#cac-bai-viet', why:'You enjoy both programming and caring about interfaces. Your blend of logic and creativity makes you an ideal web developer.', color:'#06b6d4' },
  vfx:          { name:'VFX Artist',                        group:'Lesson 2 – Media',                anchor:'#cac-bai-viet', why:'Your rich imagination and technical skills combine to create cinematic wonders that move audiences.', color:'#f59e0b' },
  data:         { name:'Data Analyst / Data Scientist',     group:'Lesson 2 – Applications',         anchor:'#cac-bai-viet', why:'You enjoy finding meaning in numbers and have sharp analytical thinking. Data is your natural language.', color:'#10b981' },
  gis:          { name:'GIS Engineer',                      group:'Lesson 2 – Applications',         anchor:'#cac-bai-viet', why:'The combination of technology and geography fascinates you. You love working with maps and spatial data to solve real-world problems.', color:'#84cc16' },
  fintech:      { name:'Fintech Engineer',                  group:'Lesson 2 – Applications',         anchor:'#cac-bai-viet', why:'You\'re not afraid of numbers and want to apply technology to finance — where one right decision can have enormous value.', color:'#f59e0b' },
};

let quizScores = {};
let quizCurrentQ = 0;
let quizAnswered = [];

function startQuiz() {
  quizScores = {};
  Object.keys(CAREER_INFO).forEach(k => quizScores[k] = 0);
  quizCurrentQ = 0;
  quizAnswered = [];
  document.getElementById('quiz-intro').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-qa').style.display = 'block';
  showQuestion(0);
}

function showQuestion(idx) {
  const q = QUIZ_QUESTIONS[idx];
  const _ql = (LANGS[currentLang]||LANGS.vi).quiz_q_label || 'CÂU';
  document.getElementById('quiz-q-num').textContent = _ql + ' ' + (idx+1) + ' / ' + QUIZ_QUESTIONS.length;
  document.getElementById('quiz-q-text').textContent = q.q;
  document.getElementById('quiz-prog-fill').style.width = (idx / QUIZ_QUESTIONS.length * 100) + '%';
  const letters = ['A','B','C','D'];
  const optsEl = document.getElementById('quiz-opts');
  optsEl.innerHTML = q.opts.map((o,i) =>
    `<button class="quiz-opt" onclick="selectQuizOpt(this, ${idx}, ${i})">
      <span class="quiz-opt-letter">${letters[i]}</span>
      ${o.text}
    </button>`
  ).join('');
}

function selectQuizOpt(btn, qIdx, optIdx) {
  document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const opt = QUIZ_QUESTIONS[qIdx].opts[optIdx];
  Object.entries(opt.scores).forEach(([k,v]) => { quizScores[k] = (quizScores[k]||0) + v; });
  quizAnswered[qIdx] = optIdx;
  setTimeout(() => {
    if (quizCurrentQ < QUIZ_QUESTIONS.length - 1) {
      quizCurrentQ++;
      showQuestion(quizCurrentQ);
    } else {
      showQuizResult();
    }
  }, 380);
}

function showQuizResult() {
  document.getElementById('quiz-qa').style.display = 'none';
  document.getElementById('quiz-prog-fill').style.width = '100%';

  const sorted = Object.entries(quizScores).sort((a,b) => b[1]-a[1]);
  const top2 = sorted.slice(0,2);
  const total = top2[0][1] + top2[1][1];
  const pct1 = total > 0 ? Math.round(top2[0][1] / total * 100) : 60;
  const pct2 = 100 - pct1;

  const cardsEl = document.getElementById('quiz-res-cards');
  const _qt = LANGS[currentLang] || LANGS.vi;
  const _CAREER = window._CAREER_CURRENT || CAREER_INFO;
  cardsEl.innerHTML = [
    { key: top2[0][0], pct: pct1, rank: 1 },
    { key: top2[1][0], pct: pct2, rank: 2 }
  ].map(({key, pct, rank}) => {
    const info = _CAREER[key] || { name: key, group: '', anchor: '#cac-bai-viet', why: '', color: '#ff6b35' };
    const rankLabel = rank === 1 ? (_qt.quiz_rank1||'★ PHÙ HỢP NHẤT') : (_qt.quiz_rank2||'✦ GỢI Ý 2');
    const matchLabel = _qt.quiz_match_label || 'Mức độ phù hợp';
    const learnBtn   = _qt.quiz_learn_btn   || '📖 Tìm hiểu thêm →';
    return `
      <div class="quiz-result-card rank${rank}">
        <div class="quiz-rank-badge">${rankLabel}</div>
        <div class="quiz-result-job">${info.name}</div>
        <div class="quiz-result-group">${info.group}</div>
        <div class="quiz-pct-bar-label">
          <span class="quiz-pct-label">${matchLabel}</span>
          <span class="quiz-pct-num">${pct}%</span>
        </div>
        <div class="quiz-pct-bar-track"><div class="quiz-pct-bar-fill" data-pct="${pct}"></div></div>
        <div class="quiz-why">${info.why}</div>
        <a href="${info.anchor}" class="quiz-learn-btn" onclick="closeLightbox()">${learnBtn}</a>
      </div>`;
  }).join('');

  const res = document.getElementById('quiz-result');
  res.style.display = 'block';

  // Animate bars after render
  setTimeout(() => {
    res.querySelectorAll('.quiz-pct-bar-fill').forEach(el => {
      el.style.width = el.getAttribute('data-pct') + '%';
    });
  }, 100);
}

function restartQuiz() {
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-intro').style.display = 'block';
}

/* =========================================
   POLL
========================================= */
const POLLS = [
  {
    id: 'poll_bai1',
    tab: '📚 Bài 1',
    q: 'Trong Bài 1, bạn thấy nghề nào hấp dẫn nhất?',
    opts: ['Kĩ thuật viên CNTT', 'Kĩ sư An toàn Thông tin', 'Kĩ sư Quản trị Mạng', 'Quản trị & Bảo trì Hệ thống']
  },
  {
    id: 'poll_pm',
    tab: '💻 Phần mềm',
    q: 'Trong ngành Công nghiệp phần mềm, bạn chọn nghề nào?',
    opts: ['Kiểm thử viên', 'Người quản lí Kiểm thử', 'Nhà thiết kế UI/UX']
  },
  {
    id: 'poll_cds',
    tab: '🚀 Chuyển đổi số',
    q: 'Nghề nào trong Chuyển đổi số bạn thấy tương lai nhất?',
    opts: ['Kĩ sư Điện toán Đám mây', 'Kĩ sư IoT', 'Kĩ sư Trí tuệ Nhân tạo (AI)']
  },
  {
    id: 'poll_media',
    tab: '🎨 Truyền thông',
    q: 'Lĩnh vực nào trong Truyền thông đa phương tiện bạn thích?',
    opts: ['Thiết kế Đồ hoạ', 'Thiết kế TTĐPT', 'Nhà phát triển Trang web', 'Kĩ xảo Điện ảnh']
  }
];

let currentPollIdx = 0;

function loadPollData(id) {
  try { return JSON.parse(localStorage.getItem('poll_' + id) || 'null'); } catch(e) { return null; }
}
function savePollData(id, data) {
  try { localStorage.setItem('poll_' + id, JSON.stringify(data)); } catch(e) {}
}

function renderPoll(idx) {
  currentPollIdx = idx;
  const polls = window._POLLS_CURRENT || POLLS;
  const poll = polls[idx];
  if (!poll) return;
  const saved = loadPollData(poll.id);
  const voted = saved && saved.voted;
  const votes = saved ? saved.votes : poll.opts.map(() => Math.floor(Math.random()*20 + 3));

  document.getElementById('poll-question').textContent = poll.q;
  const totalVotes = votes.reduce((a,b) => a+b, 0);
  const totalLabel = (window._POLL_TOTAL_LABEL||'Tổng') + ' ' + totalVotes + ' ' + (window._POLL_TOTAL_UNIT||'lượt bình chọn');

  document.getElementById('poll-options').innerHTML = poll.opts.map((opt, i) => {
    const pct = totalVotes > 0 ? Math.round(votes[i] / totalVotes * 100) : 0;
    return `
      <button class="poll-option-btn ${voted ? '' : ''}" onclick="votePoll(${idx}, ${i})" ${voted ? 'disabled' : ''}>
        <span>${opt}</span>
        <div class="poll-bar-wrap" style="${voted ? 'display:block' : 'display:none'}">
          <div class="poll-bar-fill ${i%2===1?'purple':''}" style="width:${voted ? pct+'%' : '0%'}"></div>
        </div>
        <span class="poll-pct" style="${voted ? 'display:block' : 'display:none'}">${voted ? pct+'%' : ''}</span>
      </button>`;
  }).join('');

  if (voted) {
    document.getElementById('poll-options').classList.add('poll-voted');
    const votedBtn = document.querySelectorAll('.poll-option-btn')[saved.choice];
    if (votedBtn) votedBtn.classList.add('voted');
  }
  document.getElementById('poll-meta').textContent = totalLabel;

  // Tabs
  const tabsEl = document.getElementById('poll-tabs');
  tabsEl.innerHTML = polls.map((p, i) =>
    `<button class="poll-tab ${i === idx ? 'active' : ''}" onclick="renderPoll(${i})">${p.tab}</button>`
  ).join('');

  // Animate bars if voted
  if (voted) {
    setTimeout(() => {
      document.querySelectorAll('.poll-bar-fill').forEach((bar, i) => {
        const pct = totalVotes > 0 ? Math.round(votes[i] / totalVotes * 100) : 0;
        bar.style.width = pct + '%';
      });
    }, 100);
  }
}

function votePoll(pollIdx, optIdx) {
  const poll = POLLS[pollIdx];
  let saved = loadPollData(poll.id);
  if (saved && saved.voted) return;
  const votes = saved ? saved.votes : poll.opts.map(() => Math.floor(Math.random()*20 + 3));
  votes[optIdx]++;
  savePollData(poll.id, { voted: true, choice: optIdx, votes });
  renderPoll(pollIdx);
  showToast((LANGS[currentLang]||LANGS.vi).toast_poll_voted || '✓ Đã ghi nhận bình chọn của bạn!');
}

/* =========================================
   BOOKMARK
========================================= */
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('bm_v1') || '[]'); } catch(e) { return []; }
}
function toggleBookmark(btn, id) {
  let bms = getBookmarks();
  const saved = bms.includes(id);
  if (saved) { bms = bms.filter(b => b !== id); btn.classList.remove('saved'); showToast((LANGS[currentLang]||LANGS.vi).toast_bookmark_remove || '🔖 Đã bỏ lưu'); }
  else { bms.push(id); btn.classList.add('saved'); showToast((LANGS[currentLang]||LANGS.vi).toast_bookmark_save || '🔖 Đã lưu bài viết!'); }
  try { localStorage.setItem('bm_v1', JSON.stringify(bms)); } catch(e) {}
}
function restoreBookmarks() {
  const bms = getBookmarks();
  bms.forEach(id => {
    const card = document.querySelector(`[data-id="${id}"] .bookmark-btn`);
    if (card) card.classList.add('saved');
  });
}

/* =========================================
   COPY LINK
========================================= */
function copyLink(sectionId) {
  const url = window.location.href.split('#')[0] + '#' + sectionId;
  navigator.clipboard.writeText(url).then(() => showToast((LANGS[currentLang]||LANGS.vi).toast_copy || '🔗 Đã sao chép link!')).catch(() => showToast('📋 ' + url));
}

/* =========================================
   PROGRESS BAR
========================================= */
function updateProgress() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const total = doc.scrollHeight - doc.clientHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
}

/* =========================================
   BACK TO TOP
========================================= */
function updateBackToTop() {
  const btn = document.getElementById('back-to-top');
  if ((document.documentElement.scrollTop || document.body.scrollTop) > 300)
    btn.classList.add('visible');
  else btn.classList.remove('visible');
}

/* =========================================
   SCROLL SPY
========================================= */
function updateScrollSpy() {
  const sections = ['bai-gioi-thieu','cac-bai-viet','goc-anh','goc-video','goc-quiz','goc-poll','goc-binh-luan'];
  const scrollY = window.scrollY + 80;
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + current);
  });
}

/* =========================================
   SCROLL REVEAL
========================================= */
function initReveal() {
  const items = document.querySelectorAll('.bai-viet-card, .binh-luan-item, .anh-item, .video-card, .thong-ke-item, .gioi-thieu-box');
  items.forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4 * 0.08) + 's';
    }
  });
  checkReveal();
}
function checkReveal() {
  const windowH = window.innerHeight;
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    if (el.getBoundingClientRect().top < windowH - 60) el.classList.add('revealed');
  });
}

/* =========================================
   COUNTER ANIMATION
========================================= */
function animateCounter(el, target, duration) {
  const isPlus = target.toString().includes('+');
  const num = parseInt(target.toString().replace(/[^0-9]/g,''));
  const suffix = isPlus ? '+' : '';
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * num);
    el.textContent = current >= 1000 ? Math.floor(current/1000) + ',' + String(current%1000).padStart(3,'0') + suffix : current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
let countersAnimated = false;
function checkCounters() {
  if (countersAnimated) return;
  const section = document.querySelector('.thong-ke');
  if (!section) return;
  if (section.getBoundingClientRect().top < window.innerHeight - 50) {
    countersAnimated = true;
    document.querySelectorAll('.thong-ke-item .so').forEach(el => animateCounter(el, el.textContent, 1800));
  }
}

/* =========================================
   SCROLL EVENTS
========================================= */
window.addEventListener('scroll', () => {
  updateProgress();
  updateBackToTop();
  updateScrollSpy();
  checkReveal();
  checkCounters();
}, { passive: true });

/* =========================================
   LIVE CLOCK & VIEWERS
========================================= */
function updateClock() {
  const now = new Date();
  const el = document.getElementById('live-clock');
  if (el) el.textContent = [now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
}
setInterval(updateClock, 1000);
updateClock();

let baseViewers = 255;
setInterval(() => {
  baseViewers += Math.floor(Math.random()*7) - 3;
  if (baseViewers < 200) baseViewers = 200;
  const el = document.getElementById('viewer-count');
  if (el) el.textContent = baseViewers;
}, 3500);

function toggleLiveSearch() {
  const inp = document.getElementById('live-search-input');
  inp.classList.toggle('open');
  if (inp.classList.contains('open')) inp.focus();
}
function hideLiveSearch(e) {
  setTimeout(() => {
    const inp = document.getElementById('live-search-input');
    if (inp && !inp.value) inp.classList.remove('open');
  }, 200);
}
function liveSearch(val) {
  if (!val.trim()) { showAllBL(); return; }
  document.querySelectorAll('#danh-sach-bl .binh-luan-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}
function showAllBL() {
  document.querySelectorAll('#danh-sach-bl .binh-luan-item').forEach(it => it.style.display = '');
}

/* =========================================
   LIGHTBOX
========================================= */
function openLightbox(src, caption) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* =========================================
   TOAST
========================================= */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* =========================================
   COMMENTS
========================================= */
let selectedEmoji = '😊';
const LS_KEY = 'binhluanChuDeG_v2';
const avatarColors = [
  'linear-gradient(135deg,#8b0000,#cc2200)',
  'linear-gradient(135deg,#4a0000,#880000)',
  'linear-gradient(135deg,#660000,#aa1111)',
  'linear-gradient(135deg,#2d0000,#770000)',
  'linear-gradient(135deg,#990000,#dd3300)',
  'linear-gradient(135deg,#3d0000,#660000)',
];

function selectEmoji(btn) {
  document.querySelectorAll('.bl-emoji-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedEmoji = btn.getAttribute('data-emoji');
}
function updateAvatar(val) {
  const av = document.getElementById('bl-avatar-display');
  if (av) av.textContent = val.trim() ? val.trim()[0].toUpperCase() : '?';
}
function updateCharCount(ta) {
  const el = document.getElementById('bl-char-count');
  if (el) el.textContent = ta.value.length + '/500';
}
function loadSavedComments() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch(e) { return []; }
}
function saveComments(arr) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch(e) {}
}
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return Math.floor(diff/60) + ' phút trước';
  if (diff < 86400) return Math.floor(diff/3600) + ' giờ trước';
  const d = new Date(ts);
  return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function renderComment(data, prepend) {
  const ds = document.getElementById('danh-sach-bl');
  const item = document.createElement('div');
  item.className = 'binh-luan-item';
  item.setAttribute('data-id', data.id);
  item.setAttribute('data-time', data.time);
  const color = avatarColors[data.colorIdx % avatarColors.length];
  const letter = data.ten[0].toUpperCase();
  const jobHtml = data.nghe ? '💼 ' + data.nghe : '💼 —';
  const likedClass = data.selfLiked ? ' liked' : '';
  item.innerHTML = `
    <div class="bl-item-header">
      <div class="bl-item-avatar" style="background:${color}">${letter}</div>
      <div class="bl-item-meta">
        <div class="ten">${data.ten.replace(/</g,'&lt;')}</div>
        <div class="bl-item-job">${jobHtml}</div>
      </div>
      <button class="bl-like-btn${likedClass}" onclick="toggleLike(this,'${data.id}')"><span class="bl-heart">♥</span> <span class="bl-like-num">${data.likes||0}</span></button>
    </div>
    <div class="nd">${data.nd.replace(/</g,'&lt;')}</div>
    <div class="bl-item-footer">${data.emoji} <span class="bl-time" data-ts="${data.time}">${timeAgo(data.time)}</span></div>`;
  if (prepend) ds.insertBefore(item, ds.firstChild);
  else ds.appendChild(item);
}
setInterval(() => {
  document.querySelectorAll('.bl-time[data-ts]').forEach(el => {
    el.textContent = timeAgo(parseInt(el.getAttribute('data-ts')));
  });
}, 30000);
const defaultComments = [
  { id:'seed1', ten:'Giáo viên Tin học', nghe:'', nd:'Ngành CNTT mở ra rất nhiều cơ hội nghề nghiệp đa dạng. Các em hãy tìm hiểu kĩ và chọn con đường phù hợp với sở thích của bản thân nhé!', emoji:'😊', time:Date.now()-7200000, likes:5, colorIdx:0 },
  { id:'seed2', ten:'Học sinh lớp 12', nghe:'Kĩ sư An toàn Thông tin', nd:'Em rất thích ngành An toàn Thông tin vì đây là lĩnh vực quan trọng và có nhiều thách thức thú vị. Em sẽ tìm hiểu thêm các trường đào tạo ngành này!', emoji:'😄', time:Date.now()-3600000, likes:3, colorIdx:1 },
];
function initComments() {
  const saved = loadSavedComments();
  const ds = document.getElementById('danh-sach-bl');
  ds.innerHTML = '';
  const all = saved.length ? saved : defaultComments;
  all.slice().sort((a,b) => b.time - a.time).forEach(c => renderComment(c, false));
  updateBLCount();
}
function guiYKien() {
  const ten = document.getElementById('ten').value.trim();
  const nd = document.getElementById('noidung').value.trim();
  const nghe = document.getElementById('nghe-yeu-thich').value;
  if (!ten || !nd) { showToast((LANGS[currentLang]||LANGS.vi).toast_comment_required || '⚠ Vui lòng nhập tên và nội dung!'); return; }
  let saved = loadSavedComments();
  if (!saved.length) saved = defaultComments.slice();
  const data = { id:'c'+Date.now(), ten, nghe, nd, emoji:selectedEmoji, time:Date.now(), likes:0, colorIdx:saved.length % avatarColors.length, selfLiked:false };
  saved.unshift(data);
  saveComments(saved);
  renderComment(data, true);
  document.getElementById('ten').value = '';
  document.getElementById('noidung').value = '';
  document.getElementById('nghe-yeu-thich').value = '';
  document.getElementById('bl-char-count').textContent = '0/500';
  document.getElementById('bl-avatar-display').textContent = '?';
  showToast((LANGS[currentLang]||LANGS.vi).toast_comment_sent || '✓ Đã gửi bình luận thành công!');
  updateBLCount();
}
function toggleLike(btn, id) {
  btn.classList.toggle('liked');
  const numEl = btn.querySelector('.bl-like-num');
  const n = parseInt(numEl.textContent) || 0;
  const newN = btn.classList.contains('liked') ? n+1 : n-1;
  numEl.textContent = newN;
  let saved = loadSavedComments();
  if (!saved.length) saved = defaultComments.slice();
  const found = saved.find(c => c.id === id);
  if (found) { found.likes = newN; found.selfLiked = btn.classList.contains('liked'); saveComments(saved); }
}
let currentFilter = 'popular';
function filterBL(type, tabBtn) {
  currentFilter = type;
  if (tabBtn) {
    document.querySelectorAll('.bl-tab').forEach(t => t.classList.remove('active'));
    tabBtn.classList.add('active');
  }
  const items = Array.from(document.querySelectorAll('#danh-sach-bl .binh-luan-item'));
  if (type === 'new') items.sort((a,b) => parseInt(b.dataset.time||0) - parseInt(a.dataset.time||0));
  else if (type === 'popular') items.sort((a,b) => {
    const la = parseInt((a.querySelector('.bl-like-num')||{}).textContent||0);
    const lb = parseInt((b.querySelector('.bl-like-num')||{}).textContent||0);
    return lb - la;
  });
  const ds = document.getElementById('danh-sach-bl');
  items.forEach(it => ds.appendChild(it));
}
function searchBL(val) {
  document.querySelectorAll('#danh-sach-bl .binh-luan-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
  updateBLCount();
}
function updateBLCount() {
  const el = document.getElementById('bl-total-count');
  if (el) el.textContent = document.querySelectorAll('#danh-sach-bl .binh-luan-item').length;
}

/* =========================================
   INIT
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  initComments();
  initReveal();
  updateScrollSpy();
  checkCounters();
  calcReadingTime();
  initParticles();
  renderPoll(0);
  restoreBookmarks();

  // Restore theme label
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const t = LANGS[currentLang] || LANGS.vi;
  document.getElementById('theme-label').textContent = isLight ? (t.themeLight||'Sáng') : (t.themeDark||'Tối');
  document.getElementById('theme-toggle').textContent = (isLight ? '☀️ ' : '🌙 ') + document.getElementById('theme-label').textContent;
});