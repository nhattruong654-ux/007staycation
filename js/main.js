(function(){
  "use strict";

  /* ---------- Real viewport height, computed in JS ---------- *
   * CSS vh/dvh units are unreliable on real iPhones (confirmed on this
   * project already). Rather than trust the CSS unit for .hero's
   * full-screen height, set an exact pixel value from window.innerHeight —
   * always accurate to the actual visible viewport, no unit-quirk
   * exceptions. */
  function setRealVh(){
    document.documentElement.style.setProperty('--real-vh', window.innerHeight + 'px');
  }
  setRealVh();
  window.addEventListener('resize', setRealVh);
  window.addEventListener('orientationchange', setRealVh);

  /* ---------- Nav scroll state + mobile toggle ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function(){
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive:true });

  var navLinksClose = document.getElementById('navLinksClose');

  function closeNav(){
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded','false');
  }

  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinksClose.addEventListener('click', closeNav);
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });

  /* ---------- Branch card room-photo crossfade ---------- */
  document.querySelectorAll('.branch-card__media').forEach(function(media, mediaIndex){
    var branchSlides = media.querySelectorAll('.branch-card__slide');
    if (branchSlides.length < 2) return;
    var branchCurrent = 0;
    setInterval(function(){
      branchSlides[branchCurrent].classList.remove('is-active');
      branchCurrent = (branchCurrent + 1) % branchSlides.length;
      branchSlides[branchCurrent].classList.add('is-active');
    }, 2600 + mediaIndex * 300);
  });

  /* ---------- Hero text reveal on load ---------- */
  window.addEventListener('DOMContentLoaded', function(){
    var lines = document.querySelectorAll('.hero .reveal-line');
    lines.forEach(function(line, i){
      setTimeout(function(){ line.classList.add('is-visible'); }, 200 + i * 140);
    });
  });

  /* ---------- Generic scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('.reveal-up');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(function(el){ io.observe(el); });

  /* ---------- Room data + 2-step branch → rooms flow ---------- */
  var ROOMS = {
    cn1: {
      name: '007 Staycation',
      address: '40 Trần Quốc Toản, Phường Long Hương',
      rooms: ['Mission 001','Mission 002','Mission 003','Mission 004','Mission 005','Mission 006']
    },
    cn2: {
      name: '007 The Concept',
      address: '51 Nguyễn Thị Minh Khai, Phường Bà Rịa',
      rooms: ['Mission 001','Mission 002','Mission 003','Mission 004','Mission 005','Mission 006','007 DNA','007 SOUL']
    }
  };
  // Real per-room photo counts, uploaded by each branch and pre-optimized into
  // assets/images/rooms/<branch>/<room-slug>-<n>.jpg. Falls back to the shared
  // placeholder pool for any room that hasn't sent photos yet.
  var ROOM_IMAGE_COUNTS = {
    cn1: { 'Mission 001':4, 'Mission 002':3, 'Mission 003':5, 'Mission 004':2, 'Mission 005':4, 'Mission 006':4 },
    cn2: { 'Mission 001':3, 'Mission 002':5, 'Mission 003':4, 'Mission 004':4, 'Mission 005':3, 'Mission 006':2, '007 DNA':5, '007 SOUL':5 }
  };
  function slugifyRoom(name){ return name.toLowerCase().replace(/\s+/g, '-'); }
  function realImagesForRoom(branchKey, name){
    var count = ROOM_IMAGE_COUNTS[branchKey] && ROOM_IMAGE_COUNTS[branchKey][name];
    if (!count) return null;
    var slug = slugifyRoom(name);
    var arr = [];
    for (var i = 1; i <= count; i++) { arr.push('assets/images/rooms/' + branchKey + '/' + slug + '-' + i + '.jpg'); }
    return arr;
  }

  var PLACEHOLDER_POOL = [
    'assets/images/rooms/room-placeholder.jpg',
    'assets/images/gallery/gallery-1.jpg',
    'assets/images/gallery/gallery-2.jpg',
    'assets/images/gallery/gallery-3.jpg',
    'assets/images/gallery/gallery-4.jpg',
    'assets/images/gallery/gallery-5.jpg',
    'assets/images/gallery/gallery-6.jpg',
    'assets/images/gallery/gallery-7.jpg',
    'assets/images/gallery/gallery-8.jpg'
  ];
  function placeholderImagesForRoom(i){
    return [0, 3, 6].map(function(offset){ return PLACEHOLDER_POOL[(i + offset) % PLACEHOLDER_POOL.length]; });
  }

  // Per-room amenities for both branches.
  var ROOM_AMENITIES = {
    cn1: {
      'Mission 001': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/ Ấm siêu tốc','Board game','Sofa','Đồ dùng cá nhân','Bếp'],
      'Mission 002': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/Ấm siêu tốc','Board game','Sofa','Đồ dùng cá nhân'],
      'Mission 003': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/Ấm siêu tốc','Board game','Đồ dùng cá nhân','Ban công','Sofa','Gương cầu lồi'],
      'Mission 004': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/Ấm siêu tốc','Board game','Máy nước nóng','Gương cầu lồi'],
      'Mission 005': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/ Ấm siêu tốc','Board game','Sofa','Đồ dùng cá nhân','Ban công','Gương cầu lồi'],
      'Mission 006': ['Giường đôi','Máy chiếu (YouTube/Netflix)','Gương toàn thân','Máy sấy tóc/Ấm siêu tốc','Board game','Gương cầu lồi','Ban công','Sofa']
    },
    cn2: {
      '007 SOUL': ['Giường đôi','Sofa đơn','Bồn tắm','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game'],
      '007 DNA': ['Giường đôi','Sofa','Lò sưởi','Bồn tắm','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','WC riêng'],
      'Mission 001': ['Giường đôi','Sofa đơn','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','Ban công'],
      'Mission 002': ['Giường đôi','Bồn tắm','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','Bàn ăn'],
      'Mission 003': ['Giường đôi','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','WC riêng'],
      'Mission 004': ['Giường đôi','Bồn tắm','Ghế tình yêu','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','WC riêng'],
      'Mission 005': ['Giường đôi','Sofa đơn','Bồn tắm','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','WC riêng','Ban công'],
      'Mission 006': ['Giường đôi','Ghế tình yêu','Máy chiếu','Tủ lạnh','Đồ dùng cá nhân','Board game','WC riêng']
    }
  };

  // Room code + floor, used on the booking request slip.
  var ROOM_META = {
    cn1: {
      'Mission 001': { code: '001', floor: 'Tầng trệt' },
      'Mission 002': { code: '002', floor: 'Tầng 1' },
      'Mission 003': { code: '003', floor: 'Tầng 1' },
      'Mission 004': { code: '004', floor: 'Tầng 2' },
      'Mission 005': { code: '005', floor: 'Tầng 2' },
      'Mission 006': { code: '006', floor: 'Tầng 3' }
    },
    cn2: {
      '007 SOUL': { code: 'SOUL', floor: 'Tầng trệt' },
      '007 DNA': { code: 'DNA', floor: 'Tầng 1' },
      'Mission 001': { code: '001', floor: 'Tầng 1' },
      'Mission 002': { code: '002', floor: 'Tầng 1' },
      'Mission 003': { code: '003', floor: 'Tầng 2' },
      'Mission 004': { code: '004', floor: 'Tầng 2' },
      'Mission 005': { code: '005', floor: 'Tầng 2' },
      'Mission 006': { code: '006', floor: 'Tầng 2' }
    }
  };

  // Pricing — combo/fullday are [weekday T2–T5, weekend T6–CN] VND, same
  // 2-tier split as always. Overnight is the exception: it only steps up on
  // Saturday nights — Mon–Fri and Sun all share the same "normal" rate.
  // Both branches split rooms into two tiers by size.
  var PRICE_TABLE_A = { combo:[250000,280000], overnight:{normal:400000, saturday:450000}, fullday:[650000,750000] };
  var PRICE_TABLE_B = { combo:[200000,230000], overnight:{normal:350000, saturday:400000}, fullday:[600000,700000] };
  var CN1_ROOM_PRICE = {
    'Mission 001': PRICE_TABLE_A, 'Mission 002': PRICE_TABLE_B, 'Mission 003': PRICE_TABLE_A,
    'Mission 004': PRICE_TABLE_B, 'Mission 005': PRICE_TABLE_A, 'Mission 006': PRICE_TABLE_A
  };
  var CN1_EXTRA_HOUR = [70000, 90000];

  var CN2_PRICE_MISSION = { combo:[250000,280000], overnight:{normal:400000, saturday:500000}, fullday:[750000,800000] };
  var CN2_PRICE_SPECIAL = { combo:[300000,350000], overnight:{normal:500000, saturday:600000}, fullday:[850000,950000] };
  var CN2_ROOM_PRICE = {
    '007 DNA': CN2_PRICE_SPECIAL, '007 SOUL': CN2_PRICE_SPECIAL,
    'Mission 001': CN2_PRICE_MISSION, 'Mission 002': CN2_PRICE_MISSION, 'Mission 003': CN2_PRICE_MISSION,
    'Mission 004': CN2_PRICE_MISSION, 'Mission 005': CN2_PRICE_MISSION, 'Mission 006': CN2_PRICE_MISSION
  };
  var CN2_EXTRA_HOUR = [90000, 90000];

  function formatVND(n){ return Math.round(n / 1000) + 'k'; }
  // Pricing table's own weekend column is "THỨ 6 – CN" (Fri–Sun); Mon–Thu is the weekday column.
  function isWeekendRate(date){ var d = date.getDay(); return d === 0 || d === 5 || d === 6; }
  function isSaturday(date){ return date.getDay() === 6; }
  function overnightRate(p, date){ return isSaturday(date) ? p.overnight.saturday : p.overnight.normal; }
  function priceFor(branchKey, room){
    return branchKey === 'cn1' ? (CN1_ROOM_PRICE[room] || PRICE_TABLE_A) : (CN2_ROOM_PRICE[room] || CN2_PRICE_MISSION);
  }
  function extraHourRate(branchKey){ return branchKey === 'cn1' ? CN1_EXTRA_HOUR : CN2_EXTRA_HOUR; }

  function roomPriceTableHtml(branchKey, room){
    var p = priceFor(branchKey, room);
    var rows = [
      ['Combo 3h', '10:00 – 21:00', [p.combo[0], p.combo[1], p.combo[1]]],
      ['Qua đêm', '21:30 – 09:30', [p.overnight.normal, p.overnight.normal, p.overnight.saturday]]
    ];
    if (p.fullday) rows.push(['Nguyên ngày', '11:00 – 09:00', [p.fullday[0], p.fullday[1], p.fullday[1]]]);
    var body = rows.map(function(r){
      return '<tr><td><strong>' + r[0] + '</strong><span class="room-card__price-time">' + r[1] + '</span></td>' +
        '<td>' + formatVND(r[2][0]) + '</td><td>' + formatVND(r[2][1]) + '</td><td>' + formatVND(r[2][2]) + '</td></tr>';
    }).join('');
    return '<table class="room-card__price-table"><thead><tr><th>Khung giờ</th><th>T2–T5</th><th>T6–CN</th><th>T7</th></tr></thead>' +
      '<tbody>' + body + '</tbody></table>';
  }

  // The checkout minute (relative to check-in day's midnight, so always
  // >1440 since it's next-morning) included in the base "Qua đêm" price for
  // a given check-in time: any check-in up to 23:00 (early or on-schedule)
  // is guaranteed exactly a full 12h; check-ins after 23:00 are capped at
  // 11:00 checkout instead (not a full 12h).
  function includedOvernightCheckoutMin(checkinMin){
    if (checkinMin <= 23 * 60) return checkinMin + 12 * 60;
    return 1440 + 11 * 60;
  }

  // Late-checkout / early-checkin surcharge rate: CN1 gets a cheaper rate on
  // weekdays (T2–T5); every other case (CN1 weekend, or CN2 any day) is 90k.
  function overtimeRates(branchKey, date){
    if (branchKey === 'cn1' && !isWeekendRate(date)) return { hour: 70000, half: 40000 };
    return { hour: 90000, half: 50000 };
  }
  function overtimeSurcharge(overageMin, rates){
    if (overageMin <= 0) return 0;
    var fullHours = Math.floor(overageMin / 60);
    var halfHour = (overageMin % 60) >= 30 ? 1 : 0;
    return fullHours * rates.hour + halfHour * rates.half;
  }

  // Computes the price for the exact search the customer just ran, mirroring
  // the packages above (combo + extra-hour, Sat-aware overnight with late
  // checkout surcharge, or per-day for CN1).
  function computeBookingPrice(branchKey, room, mode, reqDate, checkoutDate, reqStartMin, reqEndMin){
    var p = priceFor(branchKey, room);
    var extra = extraHourRate(branchKey);
    if (mode === 'hour') {
      var wk = isWeekendRate(reqDate) ? 1 : 0;
      var hours = parseInt(availDuration.value, 10) || 3;
      var total = p.combo[wk] + Math.max(0, hours - 3) * extra[wk];
      return { total: total, note: hours > 3 ? ('Combo 3h + ' + (hours - 3) + ' giờ thêm') : 'Combo 3h' };
    }
    if (mode === 'overnight') {
      var base = overnightRate(p, reqDate);
      var surcharge = 0;
      if (reqStartMin != null && reqEndMin != null) {
        var included = includedOvernightCheckoutMin(reqStartMin);
        surcharge = overtimeSurcharge(reqEndMin - included, overtimeRates(branchKey, reqDate));
      }
      var note = 'Qua đêm' + (isSaturday(reqDate) ? ' (Thứ 7)' : '') + (surcharge > 0 ? ' + phụ thu lệch giờ' : '');
      return { total: base + surcharge, note: note };
    }
    // mode === 'day' — standard window for the whole stay is check-in 11:00
    // on the first day → check-out 09:00 on the final day (regardless of
    // night count, since it's one continuous stay, not N separate 22h
    // packages back-to-back); any extra time beyond that single window is
    // charged with the same overtime rates as "Qua đêm".
    if (!p.fullday) return null; // rooms with no full-day package — direct contact instead
    var nights = Math.max(1, Math.round((checkoutDate - reqDate) / 86400000));
    var total2 = 0;
    for (var i = 0; i < nights; i++) {
      var d = addDays(reqDate, i);
      total2 += p.fullday[isWeekendRate(d) ? 1 : 0];
    }
    var surcharge2 = 0;
    if (reqStartMin != null && reqEndMin != null) {
      var actualTotalMin = (checkoutDate - reqDate) / 60000 + reqEndMin - reqStartMin;
      var includedTotalMin = nights * 24 * 60 - 11 * 60 + 9 * 60;
      surcharge2 = overtimeSurcharge(actualTotalMin - includedTotalMin, overtimeRates(branchKey, reqDate));
    }
    var note2 = nights + ' ngày (Nguyên ngày)' + (surcharge2 > 0 ? ' + phụ thu lệch giờ' : '');
    return { total: total2 + surcharge2, note: note2 };
  }

  function amenitiesOrFallbackHtml(branchKey, name){
    var list = ROOM_AMENITIES[branchKey] && ROOM_AMENITIES[branchKey][name];
    if (!list) {
      return '<p>Một nhiệm vụ nghỉ dưỡng riêng tại ' + (branchKey === 'cn1' ? '007 Staycation' : '007 The Concept') + '.</p>';
    }
    return '<ul class="room-card__amenities">' +
      list.map(function(item){ return '<li>' + item + '</li>'; }).join('') +
      '</ul>';
  }

  var homeView = document.getElementById('homeView');
  var roomsView = document.getElementById('roomsView');
  var roomSelectBranchTag = document.getElementById('roomSelectBranchTag');
  var roomsPageTitle = document.getElementById('roomsPageTitle');
  var backToBranches = document.getElementById('backToBranches');
  var roomGrid = document.getElementById('roomGrid');
  var branchAddress = document.getElementById('branchAddress');
  var branchCards = document.querySelectorAll('.branch-card');
  var currentBranchKey = 'cn1';

  function renderRooms(branchKey){
    currentBranchKey = branchKey;
    resetAvailability();
    var data = ROOMS[branchKey];
    branchAddress.textContent = data.address;
    roomSelectBranchTag.textContent = '// ' + (branchKey === 'cn1' ? 'CHI NHÁNH 01' : 'CHI NHÁNH 02');
    roomsPageTitle.textContent = data.name;
    roomGrid.innerHTML = '';
    data.rooms.forEach(function(name, i){
      var realImgs = realImagesForRoom(branchKey, name);
      var imgs = realImgs || placeholderImagesForRoom(i);
      var isPlaceholder = !realImgs;
      var slides = imgs.map(function(src, si){ return '<img src="' + src + '" alt="' + name + ' — ' + data.name + '"' + (si === 0 ? ' loading="lazy"' : '') + '>'; }).join('');
      var dots = imgs.map(function(_, di){ return '<span class="room-card__dot' + (di === 0 ? ' is-active' : '') + '"></span>'; }).join('');
      var card = document.createElement('article');
      card.className = 'room-card';
      card.dataset.slide = '0';
      card.dataset.room = name;
      card.innerHTML =
        '<div class="room-card__carousel">' +
          '<div class="room-card__track">' + slides + '</div>' +
          '<button class="room-card__arrow room-card__arrow--prev" aria-label="Ảnh trước">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<button class="room-card__arrow room-card__arrow--next" aria-label="Ảnh sau">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<div class="room-card__dots">' + dots + '</div>' +
          '<span class="room-card__badge mono">' + name.toUpperCase() + '</span>' +
          (isPlaceholder ? '<span class="room-card__placeholder mono">ẢNH MINH HỌA</span>' : '') +
        '</div>' +
        '<div class="room-card__body">' +
          '<h3>' + name + '</h3>' +
          roomPriceTableHtml(branchKey, name) +
          '<div class="room-card__body-cols">' +
            '<div class="room-card__amenities-col">' + amenitiesOrFallbackHtml(branchKey, name) + '</div>' +
            '<div class="room-card__status-col">' +
              '<p class="room-card__computed-price" hidden></p>' +
              '<p class="room-card__suggestion" hidden></p>' +
            '</div>' +
          '</div>' +
        '</div>';
      roomGrid.appendChild(card);
    });
  }

  function setCardSlide(card, index){
    var track = card.querySelector('.room-card__track');
    var dots = card.querySelectorAll('.room-card__dot');
    var count = dots.length;
    index = ((index % count) + count) % count;
    card.dataset.slide = String(index);
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function(dot, i){ dot.classList.toggle('is-active', i === index); });
  }

  // Event delegation: one listener handles the prev/next arrows for every
  // room card, since cards are re-created each time the branch changes.
  roomGrid.addEventListener('click', function(e){
    var bookBtn = e.target.closest('.room-card__status.is-free');
    if (bookBtn) { openBookingModal(bookBtn.dataset.room); return; }
    var prevBtn = e.target.closest('.room-card__arrow--prev');
    var nextBtn = e.target.closest('.room-card__arrow--next');
    if (!prevBtn && !nextBtn) return;
    var card = e.target.closest('.room-card');
    var current = parseInt(card.dataset.slide, 10) || 0;
    setCardSlide(card, current + (nextBtn ? 1 : -1));
  });

  // Picking a branch swaps the entire homepage (hero/about/etc.) out for a
  // dedicated rooms page, matching a normal booking-site flow instead of
  // just revealing a section further down the same long scroll.
  function showBranch(branchKey){
    renderRooms(branchKey);
    homeView.hidden = true;
    roomsView.hidden = false;
    window.scrollTo(0, 0);
  }

  function showHome(targetId){
    roomsView.hidden = true;
    homeView.hidden = false;
    requestAnimationFrame(function(){
      if (targetId) {
        var target = document.getElementById(targetId);
        if (target) target.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  branchCards.forEach(function(card){
    card.addEventListener('click', function(){ showBranch(card.dataset.branch); });
  });

  backToBranches.addEventListener('click', function(){ showHome('missions'); });

  /* ---------- Availability search ("Tìm phòng trống") ----------
     Reads the public "LichTrong" CSV — columns: Tên chi nhánh (unused), NGÀY ĐẶT,
     PHÒNG, GIỜ IN, GIỜ OUT, NGÀY OUT (unused), CHI NHÁNH ("Staycation"/"Concept") —
     no guest names/phone numbers — and checks the selected Mission list for
     time-range conflicts against the requested window. */
  var AVAILABILITY_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRm1pfbG_Ycwk5851Vsa5yMbQfg8mBLBb4eXy5XXb3DtKJ8Zp0HzPMM8OGkMRp_s_90t3FoWHvQvHkD/pub?gid=1918618473&single=true&output=csv';

  var BRANCH_CODE = { cn1: 'STAYCATION', cn2: 'CONCEPT' };
  var availCache = null;
  var availFetchPromise = null;

  function pad2(n){ return String(n).padStart(2, '0'); }
  function minutesToClock(min){
    min = ((min % 1440) + 1440) % 1440;
    return pad2(Math.floor(min / 60)) + ':' + pad2(min % 60);
  }

  function parseCsv(text){
    var rows = [];
    var lines = text.split(/\r\n|\n/);
    lines.forEach(function(line){
      if (!line.trim()) return;
      var cells = [];
      var cur = '';
      var inQuotes = false;
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (inQuotes) {
          if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (ch === '"') { inQuotes = false; }
          else { cur += ch; }
        } else if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { cells.push(cur); cur = ''; }
        else { cur += ch; }
      }
      cells.push(cur);
      rows.push(cells);
    });
    return rows;
  }

  // Accepts "D/M", "D/M/YYYY" or "YYYY-MM-DD"; returns a local-midnight Date.
  function parseVNDate(str){
    str = (str || '').trim();
    if (!str) return null;
    var iso = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
    var dm = str.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (dm) {
      var year = dm[3] ? (dm[3].length === 2 ? 2000 + (+dm[3]) : +dm[3]) : new Date().getFullYear();
      return new Date(year, (+dm[2]) - 1, +dm[1]);
    }
    return null;
  }

  function parseVNTime(str){
    var m = (str || '').trim().match(/^(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return { h: +m[1], m: +m[2] };
  }

  function sameDay(a, b){
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function addDays(d, n){
    var r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function loadAvailability(){
    if (availCache) return Promise.resolve(availCache);
    if (availFetchPromise) return availFetchPromise;
    if (!AVAILABILITY_CSV_URL) return Promise.reject(new Error('NO_URL'));
    availFetchPromise = fetch(AVAILABILITY_CSV_URL)
      .then(function(res){ if (!res.ok) throw new Error('FETCH_FAILED'); return res.text(); })
      .then(function(text){
        var rows = parseCsv(text);
        rows.shift(); // header row: Tên chi nhánh, NGÀY ĐẶT, PHÒNG, GIỜ IN, GIỜ OUT, NGÀY OUT, CHI NHÁNH
        availCache = rows.map(function(r){
          var checkinDate = parseVNDate(r[1]);
          var checkoutDate = parseVNDate(r[5]);
          // NGÀY OUT is the authoritative checkout date — multi-night stays
          // (e.g. check-in today, check-out 2 days later) need it, since
          // guessing from GIỜ IN/GIỜ OUT alone can only ever detect a single
          // midnight crossing, not several. Falls back to that guess only
          // when NGÀY OUT is missing/unparseable or looks bogus (before
          // check-in).
          var dayOffset = null;
          if (checkinDate && checkoutDate) {
            var diff = Math.round((checkoutDate - checkinDate) / 86400000);
            if (diff >= 0) dayOffset = diff;
          }
          return {
            date: checkinDate,
            room: (r[2] || '').trim(),
            start: parseVNTime(r[3]),
            end: parseVNTime(r[4]),
            dayOffset: dayOffset,
            branch: (r[6] || '').trim().toUpperCase()
          };
        }).filter(function(r){ return r.date && r.branch && r.room && r.start && r.end; });
        computeCleaningBuffers(availCache);
        return availCache;
      });
    return availFetchPromise;
  }

  // Uses the sheet's own NGÀY OUT when available (row.dayOffset, set in
  // loadAvailability) so multi-night stays report the real checkout day
  // instead of just guessing "next day" from end<=start, which can only
  // ever detect a single midnight crossing.
  function bookingSpanMinutes(row){
    var startMin = row.start.h * 60 + row.start.m;
    var endMin = row.end.h * 60 + row.end.m;
    var offsetDays = row.dayOffset != null ? row.dayOffset : (endMin <= startMin ? 1 : 0);
    return { start: startMin, end: offsetDays * 1440 + endMin };
  }

  // Cleaning-staff constraint: only 2 rooms per branch can be turned around
  // in the standard 30-minute buffer after checkout. If 3 or more rooms in
  // the same branch check out at the exact same time, the 3rd room onward
  // (by the branch's room listing order) isn't actually bookable again
  // until a full hour has passed. Computed once per data load and stashed
  // on each row as row.cleanBuffer, so findConflict/suggestNearestSlot can
  // just read it.
  function computeCleaningBuffers(rows){
    var groups = {};
    rows.forEach(function(row){
      var span = bookingSpanMinutes(row);
      var key = row.branch + '|' + row.date.getTime() + '|' + span.end;
      (groups[key] || (groups[key] = [])).push(row);
    });
    Object.keys(groups).forEach(function(key){
      var group = groups[key];
      var branchKey = null;
      for (var k in BRANCH_CODE) { if (BRANCH_CODE[k] === group[0].branch) { branchKey = k; break; } }
      var order = (branchKey && ROOMS[branchKey] && ROOMS[branchKey].rooms) || [];
      group.sort(function(a, b){ return order.indexOf(a.room) - order.indexOf(b.room); });
      group.forEach(function(row, idx){ row.cleanBuffer = idx < 2 ? 30 : 60; });
    });
  }

  // Checks [reqStartMin, reqEndMin) on reqDate against every booking for this
  // room/branch, treating each booking as occupying the room through its own
  // checkout + cleaning buffer. Shifts each booking's [start, bufferedEnd)
  // window by however many days reqDate falls after the booking's check-in
  // date, so this works no matter which day of a (possibly multi-night)
  // stay reqDate lands on — not just the check-in day or the day after.
  //
  // Also requires REQUEST_BUFFER minutes of clearance before a booking that
  // starts AFTER the requested window — otherwise a search could show
  // "Còn phòng" for a slot that ends the exact minute the next guest checks
  // in, leaving no time to clean (e.g. an existing 15:00-18:00 booking and
  // a combo search for 12:00-15:00: no overlap, but zero turnaround time).
  function findConflict(rows, branchCode, room, reqDate, reqStartMin, reqEndMin){
    var REQUEST_BUFFER = 30;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.branch !== branchCode || row.room !== room) continue;
      var span = bookingSpanMinutes(row);
      var bufferedEnd = span.end + (row.cleanBuffer || 30);
      var dayDiff = Math.round((reqDate - row.date) / 86400000);
      var shiftedStart = span.start - dayDiff * 1440;
      var shiftedEnd = bufferedEnd - dayDiff * 1440;
      if (shiftedStart - REQUEST_BUFFER < reqEndMin && shiftedEnd > reqStartMin) return { start: shiftedStart, end: shiftedEnd };
    }
    return null;
  }

  // For a room that's busy at the requested hourly slot, suggest the nearest
  // later slot: conflicting booking's checkout + its cleaning buffer
  // (conflictSpan.end already has this baked in — see findConflict), only
  // if that start is within 2h of the requested time AND the room then
  // stays free for at least 3h30 before its next booking (otherwise not
  // worth it). No late-day cutoff except Saturday (21:00) — Saturday
  // nights book up fast enough that a nearest-slot offer that late isn't
  // useful, but combo is bookable any time on other days, so suggestions
  // are offered any time too, including past 22:00.
  function suggestNearestSlot(rows, branchCode, room, reqDate, requestedStartMin, requestedDurationMin, conflictSpan){
    var CLEAN_BUFFER = 30, MIN_GAP = 210, MAX_DISTANCE = 120;
    var suggestedStart = conflictSpan.end;
    if (suggestedStart - requestedStartMin > MAX_DISTANCE) return null;
    if (isSaturday(reqDate) && ((suggestedStart % 1440) + 1440) % 1440 >= 21 * 60) return null;
    var nextStart = Infinity;
    var blocked = false;
    rows.forEach(function(row){
      if (row.branch !== branchCode || row.room !== room) return;
      var span = bookingSpanMinutes(row);
      var offset;
      if (sameDay(row.date, reqDate)) offset = 0;
      else if (sameDay(row.date, addDays(reqDate, 1))) offset = 1440;
      else return;
      var s = span.start + offset, e = span.end + offset + (row.cleanBuffer || 30);
      // A booking that's already running at (or starts exactly at)
      // suggestedStart makes the whole suggestion invalid outright — the
      // old check only looked at bookings starting strictly after
      // suggestedStart, so it missed exactly this case and could suggest a
      // slot that was already booked.
      if (s <= suggestedStart && e > suggestedStart) { blocked = true; return; }
      if (s > suggestedStart && s < nextStart) nextStart = s;
    });
    if (blocked) return null;
    var gap = nextStart === Infinity ? Infinity : nextStart - suggestedStart;
    if (gap < MIN_GAP) return null;
    var usableMin = Math.min(requestedDurationMin, gap - CLEAN_BUFFER);
    return { start: suggestedStart, end: suggestedStart + usableMin };
  }

  // For a room that's free at the requested start but whose requested
  // checkout doesn't leave the 30-min cleaning buffer before a booking
  // later that day, suggest shifting the whole stay earlier by just
  // enough to clear that buffer, keeping the same duration — e.g. an
  // existing 15:00-18:00 booking with a combo search for 12:00 (ending
  // exactly at 15:00) suggests 11:30-14:30 instead of just showing "Hết
  // phòng" with no alternative.
  function suggestEarlierSlot(rows, branchCode, room, reqDate, requestedStartMin, requestedDurationMin){
    var REQUEST_BUFFER = 30, MAX_DISTANCE = 120;
    var nextStart = Infinity;
    rows.forEach(function(row){
      if (row.branch !== branchCode || row.room !== room) return;
      var span = bookingSpanMinutes(row);
      var dayDiff = Math.round((reqDate - row.date) / 86400000);
      var s = span.start - dayDiff * 1440;
      if (s >= requestedStartMin && s < nextStart) nextStart = s;
    });
    if (nextStart === Infinity) return null;
    var latestEnd = nextStart - REQUEST_BUFFER;
    var earlierStart = latestEnd - requestedDurationMin;
    if (earlierStart >= requestedStartMin) return null;
    if (requestedStartMin - earlierStart > MAX_DISTANCE) return null;
    if (findConflict(rows, branchCode, room, reqDate, earlierStart, latestEnd)) return null;
    return { start: earlierStart, end: latestEnd };
  }

  var availTabs = document.querySelectorAll('.availability__tab');
  var availDay = document.getElementById('availDay');
  var availMonth = document.getElementById('availMonth');
  var availYear = document.getElementById('availYear');
  var availFieldOut = document.getElementById('availFieldOut');
  var availOutDay = document.getElementById('availOutDay');
  var availOutMonth = document.getElementById('availOutMonth');
  var availOutYear = document.getElementById('availOutYear');
  var availTime = document.getElementById('availTime');
  var availTimeOut = document.getElementById('availTimeOut');
  var availDuration = document.getElementById('availDuration');
  var availFieldB = document.getElementById('availFieldB');
  var availFieldBLabel = document.getElementById('availFieldBLabel');
  var availFieldC = document.getElementById('availFieldC');
  var availFieldCLabel = document.getElementById('availFieldCLabel');
  var availSearchBtn = document.getElementById('availSearchBtn');
  var availStatus = document.getElementById('availStatus');
  var lastCheckin = null, lastCheckout = null;
  var availMode = 'hour';

  function todayDateOnly(){
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function daysInMonth(year, month){ return new Date(year, month, 0).getDate(); }
  function getSelectedDate(daySel, monthSel, yearSel){
    var y = parseInt(yearSel.value, 10), m = parseInt(monthSel.value, 10), d = parseInt(daySel.value, 10);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  // Cascading Ngày/Tháng/Năm dropdowns (always DD/MM/YYYY, regardless of the
  // visitor's browser/OS locale) instead of a native <input type="date">.
  // minDateFn is re-evaluated on every rebuild so the "Trả phòng" group can
  // track a moving floor (the day after whatever "Nhận phòng" is set to).
  function setupDateGroup(daySel, monthSel, yearSel, minDateFn, defaultDate){
    function rebuildYear(){
      var minDate = minDateFn();
      var prevY = parseInt(yearSel.value, 10) || defaultDate.getFullYear();
      var years = [];
      for (var y = minDate.getFullYear(); y <= minDate.getFullYear() + 2; y++) { years.push(y); }
      yearSel.innerHTML = '';
      years.forEach(function(y){
        var opt = document.createElement('option');
        opt.value = String(y); opt.textContent = String(y);
        yearSel.appendChild(opt);
      });
      yearSel.value = years.indexOf(prevY) !== -1 ? String(prevY) : String(years[0]);
    }
    function rebuildMonth(){
      var minDate = minDateFn();
      var y = parseInt(yearSel.value, 10);
      var prevM = parseInt(monthSel.value, 10) || defaultDate.getMonth() + 1;
      var startM = (y === minDate.getFullYear()) ? (minDate.getMonth() + 1) : 1;
      var opts = [];
      for (var m = startM; m <= 12; m++) { opts.push(m); }
      monthSel.innerHTML = '';
      opts.forEach(function(m){
        var opt = document.createElement('option');
        opt.value = String(m); opt.textContent = pad2(m);
        monthSel.appendChild(opt);
      });
      monthSel.value = opts.indexOf(prevM) !== -1 ? String(prevM) : String(opts[0]);
    }
    function rebuildDay(){
      var minDate = minDateFn();
      var y = parseInt(yearSel.value, 10), m = parseInt(monthSel.value, 10);
      var prevD = parseInt(daySel.value, 10) || defaultDate.getDate();
      var startD = (y === minDate.getFullYear() && m === minDate.getMonth() + 1) ? minDate.getDate() : 1;
      var dim = daysInMonth(y, m);
      var opts = [];
      for (var d = startD; d <= dim; d++) { opts.push(d); }
      daySel.innerHTML = '';
      opts.forEach(function(d){
        var opt = document.createElement('option');
        opt.value = String(d); opt.textContent = pad2(d);
        daySel.appendChild(opt);
      });
      daySel.value = opts.indexOf(prevD) !== -1 ? String(prevD) : String(opts[0]);
    }
    function rebuildAll(){ rebuildYear(); rebuildMonth(); rebuildDay(); }
    rebuildAll();
    yearSel.addEventListener('change', function(){ rebuildMonth(); rebuildDay(); });
    monthSel.addEventListener('change', rebuildDay);
    return { rebuildAll: rebuildAll };
  }

  var checkinGroup = setupDateGroup(availDay, availMonth, availYear, todayDateOnly, todayDateOnly());
  var checkoutGroup = setupDateGroup(availOutDay, availOutMonth, availOutYear, function(){
    return addDays(getSelectedDate(availDay, availMonth, availYear) || todayDateOnly(), 1);
  }, addDays(todayDateOnly(), 1));

  // "Roll" through the full 24h (or from a given start) in 30-minute steps
  // instead of relying on the native OS time-picker widget.
  function fillTimeOptions(select, defaultValue, startMinute){
    startMinute = startMinute || 0;
    for (var m = startMinute; m < 24 * 60; m += 30) {
      var value = pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      if (value === defaultValue) opt.selected = true;
      select.appendChild(opt);
    }
  }
  fillTimeOptions(availTime, '12:00');
  fillTimeOptions(availTimeOut, '09:00'); // Giờ ra mở đủ 24/24 (qua đêm & theo ngày)

  // If "Nhận phòng" is today, drop any "Giờ vào" slot that has already
  // passed so customers can't pick a start time in the past.
  function refreshAvailTimeOptions(){
    var selDate = getSelectedDate(availDay, availMonth, availYear);
    var isToday = selDate && sameDay(selDate, todayDateOnly());
    var nowMin = 0;
    if (isToday) {
      var now = new Date();
      nowMin = Math.ceil((now.getHours() * 60 + now.getMinutes()) / 30) * 30;
    }
    var prevValue = availTime.value;
    availTime.innerHTML = '';
    var firstValue = null;
    for (var m = 0; m < 24 * 60; m += 30) {
      if (m < nowMin) continue;
      var value = pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
      if (firstValue === null) firstValue = value;
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      availTime.appendChild(opt);
    }
    if (!firstValue) {
      var noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = 'Đã hết khung giờ hôm nay';
      availTime.appendChild(noneOpt);
    } else if (Array.from(availTime.options).some(function(o){ return o.value === prevValue; })) {
      availTime.value = prevValue;
    } else {
      availTime.value = firstValue;
    }
  }
  [availDay, availMonth, availYear].forEach(function(sel){
    sel.addEventListener('change', function(){
      checkoutGroup.rebuildAll();
      refreshAvailTimeOptions();
    });
  });
  refreshAvailTimeOptions();

  // "Số giờ nghỉ" runs 3–12 giờ.
  for (var durH = 3; durH <= 12; durH++) {
    var durOpt = document.createElement('option');
    durOpt.value = String(durH);
    durOpt.textContent = durH + ' giờ';
    if (durH === 3) durOpt.selected = true;
    availDuration.appendChild(durOpt);
  }

  function setAvailMode(mode){
    availMode = mode;
    availTabs.forEach(function(t){
      var active = t.dataset.mode === mode;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    availFieldOut.hidden = mode !== 'day';
    availTimeOut.hidden = mode === 'hour';
    availDuration.hidden = mode !== 'hour';
    if (mode === 'hour') {
      availFieldBLabel.textContent = 'Giờ vào';
      availFieldCLabel.textContent = 'Số giờ nghỉ';
    } else if (mode === 'overnight') {
      availFieldBLabel.textContent = 'Giờ vào (tối)';
      availFieldCLabel.textContent = 'Giờ ra (sáng hôm sau)';
    } else {
      availFieldBLabel.textContent = 'Giờ nhận phòng';
      availFieldCLabel.textContent = 'Giờ trả phòng';
    }
    resetAvailability();
  }
  availTabs.forEach(function(t){
    t.addEventListener('click', function(){ setAvailMode(t.dataset.mode); });
  });
  setAvailMode('hour');

  function resetAvailability(){
    availStatus.textContent = '';
    roomGrid.querySelectorAll('.room-card__status').forEach(function(el){ el.remove(); });
    roomGrid.querySelectorAll('.room-card__suggestion').forEach(function(el){ el.hidden = true; el.innerHTML = ''; });
  }

  availSearchBtn.addEventListener('click', function(){
    var reqDate = getSelectedDate(availDay, availMonth, availYear);
    if (!reqDate) { availStatus.textContent = 'Vui lòng chọn ngày nhận phòng.'; return; }

    var reqStartMin, reqEndMin, checkoutDate = null, dayTimeInMin = 0, dayTimeOutMin = 1440;
    if (availMode === 'hour') {
      var t = parseVNTime(availTime.value);
      if (!t) { availStatus.textContent = 'Vui lòng chọn giờ vào.'; return; }
      reqStartMin = t.h * 60 + t.m;
      // Combo (theo giờ) is bookable any time of day except Saturday night
      // after 22:00 — Saturday's overnight demand means combo isn't
      // offered that late, point the guest at "Qua đêm" instead.
      if (isSaturday(reqDate) && reqStartMin > 22 * 60) {
        resetAvailability();
        availStatus.textContent = 'Chỉ còn qua đêm — vui lòng chuyển sang chế độ "Qua đêm".';
        return;
      }
      reqEndMin = reqStartMin + parseInt(availDuration.value, 10) * 60;
      lastCheckin = { date: reqDate, min: reqStartMin };
      lastCheckout = { date: addDays(reqDate, Math.floor(reqEndMin / 1440)), min: reqEndMin % 1440 };
    } else if (availMode === 'overnight') {
      var t1 = parseVNTime(availTime.value), t2 = parseVNTime(availTimeOut.value);
      if (!t1 || !t2) { availStatus.textContent = 'Vui lòng chọn giờ vào và giờ ra.'; return; }
      reqStartMin = t1.h * 60 + t1.m;
      var outMin = t2.h * 60 + t2.m;
      reqEndMin = outMin <= reqStartMin ? outMin + 1440 : outMin;
      lastCheckin = { date: reqDate, min: reqStartMin };
      lastCheckout = { date: addDays(reqDate, Math.floor(reqEndMin / 1440)), min: reqEndMin % 1440 };
    } else {
      checkoutDate = getSelectedDate(availOutDay, availOutMonth, availOutYear);
      if (!checkoutDate) { availStatus.textContent = 'Vui lòng chọn ngày trả phòng.'; return; }
      if (checkoutDate <= reqDate) { availStatus.textContent = 'Ngày trả phòng phải sau ngày nhận phòng.'; return; }
      var tIn = parseVNTime(availTime.value), tOut = parseVNTime(availTimeOut.value);
      if (!tIn || !tOut) { availStatus.textContent = 'Vui lòng chọn giờ nhận và giờ trả phòng.'; return; }
      dayTimeInMin = tIn.h * 60 + tIn.m;
      dayTimeOutMin = tOut.h * 60 + tOut.m;
      lastCheckin = { date: reqDate, min: dayTimeInMin };
      lastCheckout = { date: checkoutDate, min: dayTimeOutMin };
    }

    resetAvailability();
    availStatus.textContent = 'Đang kiểm tra...';

    loadAvailability().then(function(rows){
      var data = ROOMS[currentBranchKey];
      var branchCode = BRANCH_CODE[currentBranchKey];
      data.rooms.forEach(function(room){
        var conflict = null;
        if (availMode === 'day') {
          // First day is occupied from check-in time onward; the checkout
          // day only until check-out time; any full days in between are
          // occupied all day.
          var d = new Date(reqDate);
          while (d <= checkoutDate && !conflict) {
            var dayStart = sameDay(d, reqDate) ? dayTimeInMin : 0;
            var dayEnd = sameDay(d, checkoutDate) ? dayTimeOutMin : 1440;
            conflict = findConflict(rows, branchCode, room, d, dayStart, dayEnd);
            d = addDays(d, 1);
          }
        } else {
          conflict = findConflict(rows, branchCode, room, reqDate, reqStartMin, reqEndMin);
          // Overnight check-outs past 22:00 aren't offered — too late in the
          // day to still call it "qua đêm" — so show "hết phòng" instead.
          if (!conflict && availMode === 'overnight' && reqEndMin > 1440 + 22 * 60) {
            conflict = { start: reqStartMin, end: reqEndMin };
          }
        }
        var card = roomGrid.querySelector('.room-card[data-room="' + CSS.escape(room) + '"]');
        if (!card) return;
        var statusCol = card.querySelector('.room-card__status-col');
        var priceEl = statusCol.querySelector('.room-card__computed-price');
        var oldStatus = statusCol.querySelector('.room-card__status');
        if (oldStatus) oldStatus.remove();
        var badge = document.createElement(conflict ? 'span' : 'button');
        badge.className = 'room-card__status ' + (conflict ? 'is-busy' : 'is-free');
        badge.innerHTML = conflict
          ? '<img src="assets/images/sticker-het-phong.png" alt="Hết phòng">'
          : '<img src="assets/images/sticker-con-phong.png" alt="Còn phòng"><span class="room-card__book-label">Book phòng</span>';
        if (!conflict) badge.dataset.room = room;
        statusCol.appendChild(badge);

        if (!conflict) {
          var priced = computeBookingPrice(currentBranchKey, room, availMode, reqDate, checkoutDate,
            availMode === 'day' ? dayTimeInMin : reqStartMin, availMode === 'day' ? dayTimeOutMin : reqEndMin);
          if (priced) {
            priceEl.innerHTML = formatVND(priced.total);
            priceEl.hidden = false;
          } else {
            priceEl.innerHTML = 'Liên hệ trực tiếp để báo giá';
            priceEl.hidden = false;
          }
        } else {
          priceEl.hidden = true;
          var suggestionEl = statusCol.querySelector('.room-card__suggestion');
          if (availMode === 'hour') {
            // If the conflicting booking's own start is at/after the
            // requested checkout, there's no actual time overlap — the
            // room was free to check in, the problem is only that the
            // requested checkout doesn't leave buffer before that booking
            // — so offer shifting earlier instead of later. Otherwise the
            // booking genuinely overlaps the requested window, so keep
            // offering the next slot after it clears.
            var suggestion = conflict.start >= reqEndMin
              ? suggestEarlierSlot(rows, branchCode, room, reqDate, reqStartMin, reqEndMin - reqStartMin)
              : suggestNearestSlot(rows, branchCode, room, reqDate, reqStartMin, reqEndMin - reqStartMin, conflict);
            if (suggestion) {
              suggestionEl.innerHTML = 'Bạn có thể book phòng này từ <strong>' + minutesToClock(suggestion.start) +
                '</strong> đến <strong>' + minutesToClock(suggestion.end) + '</strong>';
              suggestionEl.hidden = false;
            } else {
              suggestionEl.hidden = true;
            }
          } else {
            suggestionEl.hidden = true;
          }
        }
      });
      availStatus.textContent = 'Đã cập nhật tình trạng — xem trên từng ảnh phòng bên dưới.';
    }).catch(function(err){
      availStatus.textContent = (err && err.message === 'NO_URL')
        ? 'Chưa kết nối dữ liệu lịch đặt phòng — sẽ sớm cập nhật.'
        : 'Không tải được dữ liệu lịch trống, vui lòng thử lại.';
    });
  });

  /* ---------- Booking request modal ---------- */
  var bookingModal = document.getElementById('bookingModal');
  var bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
  var bookingModalClose = document.getElementById('bookingModalClose');
  var bookingModalTitle = document.getElementById('bookingModalTitle');
  var bkRoomCode = document.getElementById('bkRoomCode');
  var bkCheckin = document.getElementById('bkCheckin');
  var bkCheckout = document.getElementById('bkCheckout');
  var bkTotal = document.getElementById('bkTotal');
  var bkCopyBtn = document.getElementById('bkCopyBtn');
  var bkZaloBtn = document.getElementById('bkZaloBtn');
  var bkMessengerBtn = document.getElementById('bkMessengerBtn');
  var bkCopiedNote = document.getElementById('bkCopiedNote');
  var currentBookingText = '';

  var WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  function formatCheckPoint(point){
    return minutesToClock(point.min) + ' (' + point.date.getDate() + '/' + (point.date.getMonth() + 1) +
      ', ' + WEEKDAY_NAMES[point.date.getDay()] + ')';
  }

  function openBookingModal(room){
    if (!lastCheckin || !lastCheckout) return;
    var meta = (ROOM_META[currentBranchKey] && ROOM_META[currentBranchKey][room]) || { code: room, floor: '' };
    var codeDisplay = meta.floor ? (meta.code + ' (' + meta.floor + ')') : meta.code;
    var checkinDisplay = formatCheckPoint(lastCheckin);
    var checkoutDisplay = formatCheckPoint(lastCheckout);
    var branchName = ROOMS[currentBranchKey].name;
    bookingModalTitle.textContent = branchName.toUpperCase() + ' xin xác nhận thông tin booking';
    bkRoomCode.textContent = codeDisplay;
    bkCheckin.textContent = checkinDisplay;
    bkCheckout.textContent = checkoutDisplay;
    var dayDiff = Math.round((lastCheckout.date - lastCheckin.date) / 86400000);
    var modalReqEndMin = availMode === 'day' ? lastCheckout.min : lastCheckout.min + dayDiff * 1440;
    var priced = computeBookingPrice(currentBranchKey, room, availMode, lastCheckin.date, lastCheckout.date, lastCheckin.min, modalReqEndMin);
    var totalDisplay = priced ? formatVND(priced.total) : 'Liên hệ trực tiếp';
    bkTotal.textContent = (priced && priced.note && priced.note.indexOf('phụ thu') !== -1)
      ? totalDisplay + ' (đã gồm phụ thu trả phòng trễ)'
      : totalDisplay;
    currentBookingText =
      branchName.toUpperCase() + ' xin xác nhận thông tin booking' + '\n' +
      'Mã Phòng: ' + codeDisplay + '\n' +
      'Ngày và giờ checkin: ' + checkinDisplay + '\n' +
      'Ngày và giờ checkout: ' + checkoutDisplay + '\n' +
      'Thành tiền: ' + totalDisplay;
    bkCopiedNote.hidden = true;
    bookingModal.hidden = false;
  }
  function closeBookingModal(){ bookingModal.hidden = true; }
  bookingModalBackdrop.addEventListener('click', closeBookingModal);
  bookingModalClose.addEventListener('click', closeBookingModal);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !bookingModal.hidden) closeBookingModal();
  });

  function copyBookingText(){
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(currentBookingText).then(function(){
      bkCopiedNote.hidden = false;
    }).catch(function(){ /* clipboard permission denied — Zalo/Messenger links still work manually */ });
  }
  bkCopyBtn.addEventListener('click', copyBookingText);
  bkZaloBtn.addEventListener('click', copyBookingText);
  bkMessengerBtn.addEventListener('click', copyBookingText);

  // Nav links point at sections inside #homeView (e.g. #about, #quiz). If the
  // rooms page is currently showing, jumping straight to the hash would do
  // nothing since homeView is hidden — bring the homepage back first, then
  // scroll to the requested section.
  document.querySelectorAll('.nav a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      if (roomsView.hidden) return;
      e.preventDefault();
      showHome(a.getAttribute('href').slice(1));
    });
  });

  /* ---------- Lưu ý & Nội quy carousel — swipe, arrows, or dots. The same
     content appears on both the homepage and each branch's rooms page, so
     this initializes independently per instance rather than by id. ---------- */
  function initRulesCarousel(rulesCarousel){
    var rulesTrack = rulesCarousel.querySelector('.rules-carousel__track');
    var rulesDots = rulesCarousel.querySelectorAll('.rules-carousel__dot');
    var rulesSlideCount = rulesDots.length;
    var rulesIndex = 0;

    function setRulesSlide(index){
      rulesIndex = ((index % rulesSlideCount) + rulesSlideCount) % rulesSlideCount;
      rulesTrack.style.transform = 'translateX(-' + (rulesIndex * 100) + '%)';
      rulesDots.forEach(function(dot, i){ dot.classList.toggle('is-active', i === rulesIndex); });
    }

    rulesCarousel.querySelector('.rules-carousel__arrow--prev').addEventListener('click', function(){ setRulesSlide(rulesIndex - 1); });
    rulesCarousel.querySelector('.rules-carousel__arrow--next').addEventListener('click', function(){ setRulesSlide(rulesIndex + 1); });
    rulesDots.forEach(function(dot, i){ dot.addEventListener('click', function(){ setRulesSlide(i); }); });

    var rulesTouchStartX = 0, rulesTouchStartY = 0, rulesTouchDeltaX = 0, rulesSwiping = false;
    rulesTrack.addEventListener('touchstart', function(e){
      rulesTouchStartX = e.touches[0].clientX;
      rulesTouchStartY = e.touches[0].clientY;
      rulesTouchDeltaX = 0;
      rulesSwiping = false;
    }, { passive:true });
    rulesTrack.addEventListener('touchmove', function(e){
      rulesTouchDeltaX = e.touches[0].clientX - rulesTouchStartX;
      var deltaY = e.touches[0].clientY - rulesTouchStartY;
      if (!rulesSwiping && Math.abs(rulesTouchDeltaX) > Math.abs(deltaY) && Math.abs(rulesTouchDeltaX) > 10) {
        rulesSwiping = true;
      }
    }, { passive:true });
    rulesTrack.addEventListener('touchend', function(){
      if (rulesSwiping && Math.abs(rulesTouchDeltaX) > 40) {
        setRulesSlide(rulesIndex + (rulesTouchDeltaX < 0 ? 1 : -1));
      }
      rulesSwiping = false;
    });
  }
  document.querySelectorAll('.rules-carousel').forEach(initRulesCarousel);

})();
