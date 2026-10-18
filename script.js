/* ===================================================================
   我们的小宇宙 —— 交互逻辑
   原生 JavaScript 编写，不依赖任何第三方库/框架
   ⭐ 想修改网站上的文字、照片、音乐、纪念日，只需要改下面的 CONFIG 对象 ⭐
   =================================================================== */

"use strict";

/* ------------------------------------------------------------------
   第一部分：网站内容配置（唯一需要你手动修改的地方）
   ------------------------------------------------------------------ */
const CONFIG = {
  // 她的名字 / 你的名字（会显示在封面、相恋计时头像、结尾处）
  girlName: "宝贝",
  myName: "你的小熊",

  // 纪念日（第一次见面 / 正式在一起的日期），格式必须是 "YYYY-MM-DDTHH:mm:ss"
  anniversaryDate: "2023-02-14T00:00:00",

  // 封面文案
  hero: {
    eyebrow: "OUR LOVE STORY",
    subtitle: "写给宝贝的一封信",
    titleLine1: "我们的小宇宙",
    titleLine2: "从第一次见面，到未来的每一天",
  },

  // 相恋计时区：主图 + 今日心语
  counter: {
    photo: "assets/images/cover.jpg", // 相恋计时区的大图，没有真实照片也会自动显示渐变占位
    dailyQuoteLabel: "今天也想认真说",
    dailyQuoteText: "和你在一起，真好",
  },

  // 引言过渡区（深色大字）
  quoteBreak: {
    eyebrow: "OUR ORDINARY DAYS",
    title: "是每个普通日子里都有你",
  },

  // 时间线：按时间顺序排列，想增删回忆，直接增删数组里的 { ... } 即可
  timeline: [
    {
      date: "2023.02.14",
      title: "第一次见面",
      desc: "那天你笑起来的样子，我现在闭上眼睛还能看见。从那一刻起，我们的小宇宙开始悄悄发光。",
      img: "assets/images/photo1.jpg",
    },
    {
      date: "2023.05.20",
      title: "第一次牵手",
      desc: "你的手有点凉，我悄悄把它放进我的口袋里，心跳声大概全世界都听得见。",
      img: "assets/images/photo2.jpg",
    },
    {
      date: "2023.10.01",
      title: "一起去旅行",
      desc: "我们走了很多路，拍了很多傻乎乎的照片，但我只记得你笑的那几张。",
      img: "assets/images/photo3.jpg",
    },
    {
      date: "2024.02.14",
      title: "一周年",
      desc: "一年说长不长，说短不短，但和你在一起的每一天，都像是赚到的礼物。",
      img: "assets/images/photo4.jpg",
    },
  ],

  // 大图引言区（时间线后面的那一整屏图配文字）
  photoQuote: {
    eyebrow: "OUR FAVORITE MOMENTS",
    text: "晚霞替我藏了一颗心",
    img: "assets/images/moment.jpg",
  },

  // 照片墙：想增删照片，直接增删数组里的 { ... } 即可
  gallery: [
    { img: "assets/images/gallery1.jpg", date: "2023.06", title: "初夏傍晚" },
    { img: "assets/images/gallery2.jpg", date: "2023.09", title: "城市夜色" },
    { img: "assets/images/gallery3.jpg", date: "2023.10", title: "窗边" },
    { img: "assets/images/gallery4.jpg", date: "2024.01", title: "随手一拍" },
    { img: "assets/images/gallery5.jpg", date: "2024.03", title: "一起拍照" },
    { img: "assets/images/gallery6.jpg", date: "2024.12", title: "冬天的拥抱" },
  ],

  // 喜欢你的理由：数组里每一项是一句话，会按顺序编号显示
  reasons: [
    "喜欢你认真听我说话的样子",
    "喜欢我们说不完的废话",
    "喜欢你让普通日子有了期待",
    "喜欢和你并肩时，那种安心",
    "也喜欢那个因为你而更勇敢的我",
    "最喜欢的是——你恰好也在我身边",
  ],

  // 两个人的计划（心愿清单）：done 的初始状态会被浏览器记住（勾选后刷新页面也不会丢）
  bucketList: [
    { icon: "🌅", title: "一起去看海边日落", desc: "带上野餐垫，等天空慢慢变成粉色", done: false },
    { icon: "🍳", title: "做一道对方爱吃的菜", desc: "哪怕第一次有点手忙脚乱", done: false },
    { icon: "✈️", title: "去一座陌生的城市", desc: "不赶行程，只牵着手随便走走", done: false },
    { icon: "📷", title: "拍满一本我们的相册", desc: "把以后也一页一页收藏起来", done: false },
  ],

  // 情书正文：数组里每一项是一段话，会按顺序一段段打字机显示
  letterParagraphs: [
    "亲爱的，",
    "如果说人生是一场旅行，那遇见你，是我这辈子最幸运的一个转弯。",
    "我没办法把所有想说的话都写进一封信里，但我想告诉你：谢谢你出现在我的生命里，谢谢你陪我把平凡的日子，过成了值得回忆的小宇宙。",
    "以后的每一个情人节、每一个普通的星期二，我都想和你一起过。",
    "情人节快乐，我爱你。",
  ],

  // 结尾互动卡片
  final: {
    question: "未来的每一个普通日子，也继续一起过，好吗？",
    buttonText: "好呀，我们说定了",
    revealTitle: "说定了，不许反悔 ♡",
    revealText: "宝贝，往后的每一个普通日子，你的小熊都会认真陪你一起过。",
    revealNote: "这一刻，也会成为我们的新回忆。",
  },

  // 结尾彩蛋文字
  endingText: "爱有很多种表达，而这一页只属于你。",
};

/* ------------------------------------------------------------------
   第二部分：工具函数
   ------------------------------------------------------------------ */

function $(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[情书网站] 没有找到 id 为 "${id}" 的元素，请检查 index.html 结构是否被改动。`);
  }
  return el;
}

/** 计算在一起的「完整天数」与「不满一天的剩余小时数」 */
function calcDaysHoursTogether(isoDateString) {
  const start = new Date(isoDateString);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  if (Number.isNaN(diffMs)) return { days: 0, hours: 0 };
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return { days, hours };
}

/** 给图片元素挂上"加载失败就优雅隐藏"的逻辑，没有真实照片时不会出现裂图图标 */
function attachImageFallback(imgEl) {
  if (!imgEl) return;
  imgEl.addEventListener("error", () => {
    imgEl.style.display = "none";
  });
}

/* ------------------------------------------------------------------
   第三部分：封面进入逻辑
   ------------------------------------------------------------------ */
function initCover() {
  const enterBtn = $("enter-btn");
  const coverScreen = document.getElementById("cover");
  const mainContent = $("main-content");

  // 填充封面文案
  const eyebrowEl = document.getElementById("cover-eyebrow");
  const subEl = document.getElementById("cover-sub");
  const line1El = document.getElementById("cover-title-line1");
  const line2El = document.getElementById("cover-title-line2");
  const nameAEl = document.getElementById("cover-name-a");
  const nameBEl = document.getElementById("cover-name-b");

  if (eyebrowEl) eyebrowEl.textContent = CONFIG.hero.eyebrow;
  if (subEl) subEl.textContent = CONFIG.hero.subtitle;
  if (line1El) line1El.textContent = CONFIG.hero.titleLine1;
  if (line2El) line2El.textContent = CONFIG.hero.titleLine2;
  if (nameAEl) nameAEl.textContent = CONFIG.myName;
  if (nameBEl) nameBEl.textContent = CONFIG.girlName;

  if (!enterBtn || !mainContent) return;

  enterBtn.addEventListener("click", () => {
    coverScreen.style.transition = "opacity 0.6s ease";
    coverScreen.style.opacity = "0";
    setTimeout(() => {
      coverScreen.hidden = true;
      mainContent.hidden = false;
      startExperience();
    }, 600);

    tryPlayMusic();
  });
}

/* ------------------------------------------------------------------
   第四部分：背景音乐
   ------------------------------------------------------------------ */
let musicStarted = false;

function initMusic() {
  const audio = $("bg-music");
  const musicBtn = $("music-btn");
  const musicIcon = document.getElementById("music-icon");
  const musicTip = document.getElementById("music-tip");
  if (!audio || !musicBtn) return;

  audio.addEventListener(
    "error",
    () => {
      musicBtn.hidden = true;
      if (musicTip) musicTip.hidden = true;
      console.warn("[情书网站] 没有检测到背景音乐文件，请在 assets/music 文件夹放入 our-song.mp3（详见 README）。");
    },
    { once: true }
  );

  audio.addEventListener("loadedmetadata", () => {
    musicBtn.hidden = false;
  });

  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    musicBtn.classList.add("playing");
    musicIcon.textContent = "🎶";
    if (musicTip) musicTip.hidden = true;
  });
  audio.addEventListener("pause", () => {
    musicBtn.classList.remove("playing");
    musicIcon.textContent = "🎵";
  });
}

function tryPlayMusic() {
  if (musicStarted) return;
  const audio = $("bg-music");
  if (!audio) return;
  musicStarted = true;
  audio.load();
  audio.play().catch(() => {
    /* 浏览器可能阻止自动播放，用户可以点左上角音乐按钮手动播放 */
  });
}

/* ------------------------------------------------------------------
   第五部分：相恋计时区
   ------------------------------------------------------------------ */
function initCounter() {
  const img = document.getElementById("counter-img");
  const daysEl = document.getElementById("counter-days");
  const hoursEl = document.getElementById("counter-hours");
  const startEl = document.getElementById("counter-start-date");
  const avatarA = document.getElementById("avatar-a");
  const avatarB = document.getElementById("avatar-b");
  const quoteLabel = document.getElementById("daily-quote-label");
  const quoteText = document.getElementById("daily-quote-text");

  if (img) {
    img.src = CONFIG.counter.photo;
    attachImageFallback(img);
  }

  const { days, hours } = calcDaysHoursTogether(CONFIG.anniversaryDate);
  if (daysEl) daysEl.textContent = days;
  if (hoursEl) hoursEl.textContent = hours;

  if (startEl) {
    const d = new Date(CONFIG.anniversaryDate);
    if (!Number.isNaN(d.getTime())) {
      startEl.textContent = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
    }
  }

  if (avatarA) avatarA.textContent = CONFIG.myName.slice(0, 1);
  if (avatarB) avatarB.textContent = CONFIG.girlName.slice(0, 1);
  if (quoteLabel) quoteLabel.textContent = CONFIG.counter.dailyQuoteLabel;
  if (quoteText) quoteText.textContent = CONFIG.counter.dailyQuoteText;
}

/* ------------------------------------------------------------------
   第六部分：引言过渡区
   ------------------------------------------------------------------ */
function initQuoteBreak() {
  const eyebrow = document.getElementById("quote-break-eyebrow");
  const title = document.getElementById("quote-break-title");
  if (eyebrow) eyebrow.textContent = CONFIG.quoteBreak.eyebrow;
  if (title) title.textContent = CONFIG.quoteBreak.title;
}

/* ------------------------------------------------------------------
   第七部分：渲染时间线 + 滚动淡入动画
   ------------------------------------------------------------------ */
function observeFadeIn(selector, root) {
  const items = (root || document).querySelectorAll(selector);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((el) => observer.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }
}

function renderTimeline() {
  const list = $("timeline-list");
  if (!list) return;

  const fragment = document.createDocumentFragment();

  CONFIG.timeline.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const photoWrap = document.createElement("div");
    photoWrap.className = "timeline-photo";

    const indexBadge = document.createElement("span");
    indexBadge.className = "timeline-index";
    indexBadge.textContent = String(idx + 1);
    photoWrap.appendChild(indexBadge);

    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-icon";
    placeholder.textContent = "💖";
    photoWrap.appendChild(placeholder);

    if (item.img) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.title || "我们的合照";
      img.loading = "lazy";
      attachImageFallback(img);
      photoWrap.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "timeline-body";

    const dateEl = document.createElement("p");
    dateEl.className = "timeline-date";
    dateEl.textContent = item.date || "";

    const titleEl = document.createElement("h3");
    titleEl.className = "timeline-title";
    titleEl.textContent = item.title || "";

    const descEl = document.createElement("p");
    descEl.className = "timeline-desc";
    descEl.textContent = item.desc || "";

    body.appendChild(dateEl);
    body.appendChild(titleEl);
    body.appendChild(descEl);

    li.appendChild(photoWrap);
    li.appendChild(body);
    fragment.appendChild(li);
  });

  list.appendChild(fragment);
  observeFadeIn(".timeline-item", list);
}

/* ------------------------------------------------------------------
   第八部分：大图引言区
   ------------------------------------------------------------------ */
function renderPhotoQuote() {
  const img = document.getElementById("photo-quote-img");
  const eyebrow = document.getElementById("photo-quote-eyebrow");
  const text = document.getElementById("photo-quote-text");

  if (img) {
    img.src = CONFIG.photoQuote.img;
    attachImageFallback(img);
  }
  if (eyebrow) eyebrow.textContent = CONFIG.photoQuote.eyebrow;
  if (text) text.textContent = CONFIG.photoQuote.text;
}

/* ------------------------------------------------------------------
   第九部分：照片墙
   ------------------------------------------------------------------ */
function renderGallery() {
  const grid = $("gallery-grid");
  if (!grid) return;
  const fragment = document.createDocumentFragment();

  CONFIG.gallery.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = "gallery-item";

    if (item.img) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.title || "我们的照片";
      img.loading = "lazy";
      attachImageFallback(img);
      cell.appendChild(img);
    }

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    const t = document.createElement("p");
    t.className = "gc-title";
    t.textContent = item.title || "";
    const d = document.createElement("p");
    d.className = "gc-date";
    d.textContent = item.date || "";
    caption.appendChild(t);
    caption.appendChild(d);
    cell.appendChild(caption);

    fragment.appendChild(cell);
  });

  grid.appendChild(fragment);
}

/* ------------------------------------------------------------------
   第十部分：喜欢你的理由
   ------------------------------------------------------------------ */
function renderReasons() {
  const grid = $("reasons-grid");
  const titleEl = document.getElementById("reasons-title");
  if (titleEl) titleEl.textContent = `喜欢你的 ${CONFIG.reasons.length} 个理由`;
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  CONFIG.reasons.forEach((reason, idx) => {
    const card = document.createElement("div");
    card.className = "reason-card";

    const idxEl = document.createElement("p");
    idxEl.className = "reason-index";
    idxEl.textContent = String(idx + 1).padStart(2, "0");

    const textEl = document.createElement("p");
    textEl.className = "reason-text";
    textEl.textContent = reason;

    const signEl = document.createElement("p");
    signEl.className = "reason-sign";
    signEl.textContent = `♥ ${CONFIG.myName}`;

    card.appendChild(idxEl);
    card.appendChild(textEl);
    card.appendChild(signEl);
    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
}

/* ------------------------------------------------------------------
   第十一部分：两个人的计划（心愿清单，勾选状态保存在本机浏览器）
   ------------------------------------------------------------------ */
const BUCKET_STORAGE_KEY = "love-letter-bucket-list-v1";

function loadBucketState() {
  try {
    const raw = window.localStorage.getItem(BUCKET_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    // 隐私模式等场景下 localStorage 可能不可用，静默降级，不影响页面正常使用
    return {};
  }
}

function saveBucketState(state) {
  try {
    window.localStorage.setItem(BUCKET_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* 静默忽略保存失败 */
  }
}

function updateProgressUI() {
  const items = document.querySelectorAll(".bucket-item");
  const total = items.length;
  let done = 0;
  items.forEach((el) => {
    if (el.classList.contains("is-done")) done++;
  });

  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const percentEl = document.getElementById("progress-percent");
  const doneEl = document.getElementById("progress-done");
  const totalEl = document.getElementById("progress-total");
  const ringFg = document.getElementById("progress-ring-fg");

  if (percentEl) percentEl.textContent = `${percent}%`;
  if (doneEl) doneEl.textContent = String(done);
  if (totalEl) totalEl.textContent = String(total);
  if (ringFg) {
    const circumference = 238.76; // 2 * PI * 38
    const offset = circumference - (circumference * percent) / 100;
    ringFg.style.strokeDashoffset = String(offset);
  }
}

function renderBucketList() {
  const list = $("bucket-list");
  if (!list) return;

  const savedState = loadBucketState();
  const fragment = document.createDocumentFragment();

  CONFIG.bucketList.forEach((item, idx) => {
    const key = String(idx);
    const isDone = Object.prototype.hasOwnProperty.call(savedState, key) ? savedState[key] : !!item.done;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bucket-item" + (isDone ? " is-done" : "");
    btn.setAttribute("aria-pressed", String(isDone));

    const icon = document.createElement("span");
    icon.className = "bucket-icon";
    icon.textContent = item.icon || "💗";

    const body = document.createElement("span");
    body.className = "bucket-body";
    const title = document.createElement("span");
    title.className = "bucket-title";
    title.style.display = "block";
    title.textContent = item.title || "";
    const desc = document.createElement("span");
    desc.className = "bucket-desc";
    desc.style.display = "block";
    desc.textContent = item.desc || "";
    body.appendChild(title);
    body.appendChild(desc);

    const check = document.createElement("span");
    check.className = "bucket-check";
    check.textContent = isDone ? "✓" : "";

    btn.appendChild(icon);
    btn.appendChild(body);
    btn.appendChild(check);

    btn.addEventListener("click", () => {
      const nowDone = !btn.classList.contains("is-done");
      btn.classList.toggle("is-done", nowDone);
      btn.setAttribute("aria-pressed", String(nowDone));
      check.textContent = nowDone ? "✓" : "";

      const state = loadBucketState();
      state[key] = nowDone;
      saveBucketState(state);

      updateProgressUI();
    });

    fragment.appendChild(btn);
  });

  list.appendChild(fragment);
  updateProgressUI();
}

/* ------------------------------------------------------------------
   第十二部分：情书正文打字机效果
   ------------------------------------------------------------------ */
let typingTimer = null;
let typingDone = false;

function typeLetter() {
  const container = $("letter-text");
  const skipBtn = $("letter-skip");
  if (!container) return;

  const paragraphs = CONFIG.letterParagraphs;
  let pIndex = 0;
  let charIndex = 0;
  let currentP = document.createElement("p");
  currentP.classList.add("typing-cursor");
  container.appendChild(currentP);

  function typeNextChar() {
    if (typingDone) return;

    const text = paragraphs[pIndex];
    if (charIndex < text.length) {
      currentP.textContent = text.slice(0, charIndex + 1);
      charIndex++;
      typingTimer = setTimeout(typeNextChar, 45);
    } else {
      currentP.classList.remove("typing-cursor");
      pIndex++;
      if (pIndex < paragraphs.length) {
        charIndex = 0;
        currentP = document.createElement("p");
        currentP.classList.add("typing-cursor");
        container.appendChild(currentP);
        typingTimer = setTimeout(typeNextChar, 500);
      }
    }
  }

  typeNextChar();

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      clearTimeout(typingTimer);
      typingDone = true;
      container.innerHTML = "";
      paragraphs.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        container.appendChild(p);
      });
      skipBtn.hidden = true;
    });
  }
}

/* ------------------------------------------------------------------
   第十三部分：结尾互动卡片
   ------------------------------------------------------------------ */
function initFinalCard() {
  const questionEl = document.getElementById("final-question");
  const btn = $("final-btn");
  const reveal = $("final-reveal");
  const revealTitle = document.getElementById("final-reveal-title");
  const revealText = document.getElementById("final-reveal-text");
  const revealNote = document.getElementById("final-reveal-note");

  if (questionEl) questionEl.textContent = CONFIG.final.question;
  if (btn) btn.textContent = CONFIG.final.buttonText;
  if (revealTitle) revealTitle.textContent = CONFIG.final.revealTitle;
  if (revealText) revealText.textContent = CONFIG.final.revealText;
  if (revealNote) revealNote.textContent = CONFIG.final.revealNote;

  if (!btn || !reveal) return;

  btn.addEventListener("click", () => {
    btn.hidden = true;
    reveal.hidden = false;
    // 如果音乐还没有开始播放，用这次点击顺便尝试播放（符合"用户交互后才播放"的浏览器规则）
    tryPlayMusic();
    const audio = $("bg-music");
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  });
}

/* ------------------------------------------------------------------
   第十四部分：结尾彩蛋 + 爱心飘落
   ------------------------------------------------------------------ */
function renderEnding() {
  const nameA = document.getElementById("ending-name-a");
  const nameB = document.getElementById("ending-name-b");
  const textEl = document.getElementById("ending-text");

  if (nameA) nameA.textContent = CONFIG.myName;
  if (nameB) nameB.textContent = CONFIG.girlName;
  if (textEl) textEl.textContent = CONFIG.endingText;

  const heartRain = $("heart-rain");
  if (heartRain && heartRain.childElementCount === 0) {
    const hearts = ["💖", "💗", "💞", "💕", "✨"];
    for (let i = 0; i < 24; i++) {
      const span = document.createElement("span");
      span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      span.style.left = `${Math.random() * 100}%`;
      span.style.animationDuration = `${4 + Math.random() * 4}s`;
      span.style.animationDelay = `${Math.random() * 5}s`;
      heartRain.appendChild(span);
    }
  }
}

function initReplay() {
  const replayBtn = $("replay-btn");
  if (!replayBtn) return;
  replayBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ------------------------------------------------------------------
   第十五部分：进入主内容后统一初始化
   ------------------------------------------------------------------ */
function startExperience() {
  initCounter();
  initQuoteBreak();
  renderTimeline();
  renderPhotoQuote();
  renderGallery();
  renderReasons();
  renderBucketList();
  typeLetter();
  initFinalCard();
  renderEnding();
  initReplay();
}

/* ------------------------------------------------------------------
   第十六部分：页面加载后的入口
   ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initCover();
  initMusic();
});
