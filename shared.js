(() => {
  const STORE_KEY = "luxwear-language";
  const translations = {
    ar: {
      home: "الرئيسية", brandTag: "اسلوبك يستحق الافضل",
      welcome: "أهلاً وسهلاً بك في", welcomeSub: "سعداء بزيارتك", welcomeText: "تواصل معنا وتابع أحدث منتجاتنا",
      contact: "يسعدنا تواصلك معنا", facebook: "Facebook", whatsapp: "WhatsApp",
      contactVia: "Contact Us Via", follow: "تابعنا عبر", facebookPage: "Facebook Page",
      followFacebook: "Follow us on Facebook", whatsappChannel: "WhatsApp Channel",
      followOffers: "Follow our offers and updates", instagram: "Instagram Channel",
      tiktok: "TikTok Channel", followTikTok: "Follow us on TikTok",
      about: "معلومات عنا", location: "موقعنا على الخريطة", address: "مدينة العبور - الحي الأول - خلف سنتر العبور بجوار مصلحة الدمغة والموازين",
      review: "تقييمك يهمنا", reviewHint: "شاركنا رأيك", hours: "مواعيد العمل",
      services: "دليل الخدمات", washing: "تعليمات الغسيل", policy: "سياسة الاستبدال والاسترجاع والضمان",
      thanks: "شكراً لاختيارك", serviceAlways: "نسعد بخدمتك دائماً",
      open: "مفتوح الآن", closed: "مغلق الآن", closesAt: "يغلق عند", opensAt: "يفتح عند",
      opensToday: "يفتح اليوم عند", opensTomorrow: "يفتح غداً عند", weeklyHours: "جدول مواعيد العمل",
      hideHours: "إخفاء المواعيد", showHours: "عرض المواعيد", days: ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
      washingTitle: "تعليمات الغسيل", turnInside: "اقلب القطعة على ظهرها",
      turnInsideText: "اقلب القطعة على ظهرها قبل الغسيل لحماية الطباعة والخامة.",
      coldWash: "اغسل بماء بارد", coldWashText: "اغسل القطعة بماء بارد أو درجة حرارة لا تتخطى 30° م.",
      underwearTemp: "للمـلابس الداخلية استخدم 40° م.",
      dryShade: "انشر القطعة بعيداً عن الشمس", dryShadeText: "انشر القطعة بعيداً عن أشعة الشمس المباشرة.",
      noDryer: "ممنوع استخدام المجفف القوي", noDryerText: "تجنب استخدام المجفف القوي للملابس للحفاظ على جودة القماش ومقاس القطعة.",
      policyTitle: "سياسة الاستبدال والاسترجاع والضمان",
      exchangeTitle: "الاستبدال والاسترجاع",
      exchange1: "يمكنك استبدال أو استرجاع المنتج خلال 14 يوما من تاريخ الشراء.",
      exchange2: "يشترط أن يكون المنتج في حالته الأصلية وغير مستخدم.",
      exchange3: "يشترط تقديم أصل فاتورة الشراء.",
      warrantyTitle: "الضمان ضد عيوب الصناعة",
      warranty1: "في حالة اتباع تعليمات الغسيل بشكل صحيح إذا ظهر أي عيب من عيوب الصناعة، يمكنك استبدال أو استرجاع القطعة.",
      warranty2: "في حالة أن المنتج تلف بسبب سوء الاستخدام أو عدم اتباع تعليمات الغسيل، فلا يمكن استرجاع المنتج أو استبداله.",
      backHome: "العودة للصفحة الرئيسية"
    },
    en: {
      home: "Home", brandTag: "Your style deserves the best",
      welcome: "WELCOME TO", welcomeSub: "We are happy to have you here", welcomeText: "Contact us and discover our latest products",
      contact: "GET IN TOUCH", facebook: "Facebook", whatsapp: "WhatsApp",
      contactVia: "Contact Us Via", follow: "FOLLOW US", facebookPage: "Facebook Page",
      followFacebook: "Follow us on Facebook", whatsappChannel: "WhatsApp Channel",
      followOffers: "Follow our offers and updates", instagram: "Instagram",
      tiktok: "TikTok", followTikTok: "Follow us on TikTok",
      about: "ABOUT US", location: "OUR LOCATION", address: "Al Obour City – First District – Behind Obour Center, next to the Stamping and Weights Authority",
      review: "YOUR FEEDBACK MATTERS", reviewHint: "Share your experience", hours: "WORKING HOURS",
      services: "SERVICES GUIDE", washing: "WASHING INSTRUCTIONS", policy: "RETURN, EXCHANGE & WARRANTY POLICY",
      thanks: "THANK YOU FOR CHOOSING US", serviceAlways: "We are always happy to serve you",
      open: "OPEN NOW", closed: "CLOSED NOW", closesAt: "Closes at", opensAt: "Opens at",
      opensToday: "Opens today at", opensTomorrow: "Opens tomorrow at", weeklyHours: "Weekly working hours",
      hideHours: "Hide hours", showHours: "View hours", days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      washingTitle: "WASHING INSTRUCTIONS", turnInside: "Turn the garment inside out",
      turnInsideText: "Turn the garment inside out before washing to protect the print and fabric.",
      coldWash: "Wash in cold water", coldWashText: "Wash in cold water or at a temperature not exceeding 30°C.",
      underwearTemp: "Use 40°C for underwear.",
      dryShade: "Dry away from direct sunlight", dryShadeText: "Hang the garment to dry away from direct sunlight.",
      noDryer: "Avoid high-heat tumble drying", noDryerText: "Avoid high-heat tumble drying to preserve the fabric quality and garment fit.",
      policyTitle: "RETURN, EXCHANGE & WARRANTY POLICY",
      exchangeTitle: "RETURNS & EXCHANGES",
      exchange1: "You can exchange or return the product within 14 days from the purchase date.",
      exchange2: "The product must be in its original condition and unused.",
      exchange3: "The original purchase receipt must be presented.",
      warrantyTitle: "MANUFACTURING DEFECT WARRANTY",
      warranty1: "If the washing instructions have been followed correctly and a manufacturing defect appears, you may exchange or return the item.",
      warranty2: "If the product is damaged due to misuse or failure to follow the washing instructions, it cannot be returned or exchanged.",
      backHome: "BACK TO HOME"
    }
  };

  const schedule = [
    {open: 12*60, close: 24*60+30}, // Sunday
    {open: 12*60, close: 24*60+30},
    {open: 12*60, close: 24*60+30},
    {open: 12*60, close: 24*60+30},
    {open: 12*60, close: 24*60+30},
    {open: 13*60, close: 24*60+90}, // Friday 1:30 AM next day
    {open: 12*60, close: 24*60+30}
  ];

  function getLang() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === "ar" || saved === "en") return saved;
    return (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
  }
  let lang = getLang();
  const t = key => translations[lang][key] ?? key;

  function applyLanguage(next) {
    lang = next === "en" ? "en" : "ar";
    localStorage.setItem(STORE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("is-en", lang === "en");
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const value = t(el.dataset.i18n);
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-lang]").forEach(el => {
      el.classList.toggle("active", el.dataset.lang === lang);
      el.setAttribute("aria-pressed", el.dataset.lang === lang ? "true" : "false");
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    updateHours();
  }

  function timeText(totalMinutes) {
    const m = ((totalMinutes % 1440) + 1440) % 1440;
    const h24 = Math.floor(m / 60), min = m % 60;
    const h = h24 % 12 || 12;
    const suffix = lang === "ar" ? (h24 < 12 ? "ص" : "م") : (h24 < 12 ? "AM" : "PM");
    return `${lang === "ar" ? toArabicDigits(h) : h}:${String(min).padStart(2,"0")} ${suffix}`;
  }
  function toArabicDigits(value) {
    return String(value).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
  }
  function updateHours() {
    // Always evaluate the schedule in Egypt time, even if a visitor's device uses another timezone.
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const part = key => parts.find(item => item.type === key)?.value;
    const weekdayIndex = {Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6};
    const day = weekdayIndex[part("weekday")];
    const minute = Number(part("hour"))*60 + Number(part("minute"));
    let isOpen = false, closing = null, nextOpen = null;

    // Current day's opening interval.
    const today = schedule[day];
    if (minute >= today.open && minute < today.close - 1440) isOpen = true;
    if (today.close > 1440 && minute >= today.open) isOpen = true;
    if (isOpen) closing = today.close % 1440;

    // Previous day's after-midnight interval.
    if (!isOpen) {
      const prevDay = (day + 6) % 7;
      const prev = schedule[prevDay];
      const overnightClose = prev.close - 1440;
      if (prev.close > 1440 && minute < overnightClose) {
        isOpen = true;
        closing = overnightClose;
      }
    }

    const status = document.getElementById("live-status");
    const detail = document.getElementById("live-detail");
    if (status && detail) {
      status.textContent = t(isOpen ? "open" : "closed");
      status.className = "status " + (isOpen ? "open" : "closed");
      if (isOpen) {
        detail.textContent = `${t("closesAt")} ${timeText(closing)}`;
      } else {
        let offset = 0;
        for (let i=0; i<8; i++) {
          const d = (day+i)%7;
          if (i === 0 && minute < schedule[d].open) { offset = 0; nextOpen = schedule[d].open; break; }
          if (i > 0) { offset = i; nextOpen = schedule[d].open; break; }
        }
        detail.textContent = `${t(offset === 0 ? "opensToday" : offset === 1 ? "opensTomorrow" : "opensAt")} ${timeText(nextOpen)}`;
      }
    }

    const list = document.getElementById("weekly-hours");
    if (list) {
      list.innerHTML = "";
      const days = translations[lang].days;
      schedule.forEach((s, i) => {
        const row = document.createElement("div");
        row.className = "hours-row";
        row.innerHTML = `<span>${days[i]}</span><span>${timeText(s.open)} – ${timeText(s.close)}</span>`;
        list.appendChild(row);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
    });
    const hoursToggle = document.getElementById("hours-toggle");
    const weekly = document.getElementById("weekly-hours");
    if (hoursToggle && weekly) {
      hoursToggle.addEventListener("click", () => {
        const show = weekly.hidden;
        weekly.hidden = !show;
        hoursToggle.setAttribute("aria-expanded", String(show));
        const label = hoursToggle.querySelector("[data-i18n]");
        if (label) label.dataset.i18n = show ? "hideHours" : "showHours";
        applyLanguage(lang);
      });
    }
    applyLanguage(lang);
    updateHours();
    window.setInterval(updateHours, 30000);
  });

  window.LUX = { setLanguage: applyLanguage, getLanguage: () => lang };
})();