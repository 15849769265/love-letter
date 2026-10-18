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
  // 她的名字 / 你的名字
  girlName: "宝贝",
  myName: "你的小熊",

  // 纪念日（第一次见面 / 正式在一起的日期），格式必须是 "YYYY-MM-DDTHH:mm:ss"
  anniversaryDate: "2023-02-14T00:00:00",

  // 回忆时间线：按时间顺序排列，想增删回忆，直接增删数组里的 { ... } 即可
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

  // 情书正文：数组里每一项是一段话，会按顺序一段段打字机显示
  letterParagraphs: [
    "亲爱的，",
    "如果说人生是一场旅行，那遇见你，是我这辈子最幸运的一个转弯。",
    "我没办法把所有想说的话都写进一封信里，但我想告诉你：谢谢你出现在我的生命里，谢谢你陪我把平凡的日子，过成了值得回忆的小宇宙。",
    "以后的每一个情人节、每一个普通的星期二，我都想和你一起过。",
    "情人节快乐，我爱你。",
  ],

  // 结尾彩蛋区文字
  endingTitle: "愿我们的小宇宙，永远有光 ✨",
  endingText: "从第一次见面，到未来的每一天，往后余生，请多指教。",
};

/* ------------------------------------------------------------------
   第二部分：工具函数
   ------------------------------------------------------------------ */

/**
 * 安全地获取元素，找不到时在控制台给出提示但不会让整个脚本崩溃
 * @param {string} id 元素 id
 */
function $(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`[情书网站] 没有找到 id 为 "${id}" 的元素，请检查 index.html 结构是否被改动。`);
  }
  return el;
}

/**
 * 计算在一起的天数（向下取整，从纪念日 0 点到今天）
 * @param {string} isoDateString
 * @returns {number}
 */
function calcDaysTogether(isoDateString) {
  const start = new Date(isoDateString);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return days;
}

/* ------------------------------------------------------------------
   第三部分：封面进入逻辑
   ------------------------------------------------------------------ */
function initCover() {
  const enterBtn = $("enter-btn");
  const coverScreen = document.getElementById("cover");
  const mainContent = $("main-content");
  const coverGirlName = document.getElementById("cover-girl-name");

  if (coverGirlName) {
    coverGirlName.textContent = CONFIG.girlName;
  }

  if (!enterBtn || !mainContent) return;

  enterBtn.addEventListener("click", () => {
    // 淡出封面，显示正文
    coverScreen.style.transition = "opacity 0.6s ease";
    coverScreen.style.opacity = "0";
    setTimeout(() => {
      coverScreen.hidden = true;
      mainContent.hidden = false;
      // 进入主内容后再初始化各个模块，节省首屏加载时间
      startExperience();
    }, 600);

    // 用户点击属于一次"用户交互"，此时才尝试播放音乐，符合浏览器自动播放限制
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
  if (!audio || !musicBtn) return;

  // 先检测音乐文件是否真实存在：不存在就直接隐藏按钮，避免用户点了没反应
  audio.addEventListener(
    "error",
    () => {
      musicBtn.hidden = true;
      console.warn("[情书网站] 没有检测到背景音乐文件，请在 assets/music 文件夹放入 our-song.mp3（详见 README）。");
    },
    { once: true }
  );

  audio.addEventListener("loadedmetadata", () => {
    musicBtn.hidden = false;
  });

  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        /* 部分浏览器策略限制，静默处理，不打断用户体验 */
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    musicBtn.classList.add("playing");
    musicIcon.textContent = "🎶";
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
  // preload="none"，这里手动触发一次加载
  audio.load();
  audio.play().catch(() => {
    /* 如果浏览器阻止自动播放，用户可以点悬浮音乐按钮手动播放 */
  });
}

/* ------------------------------------------------------------------
   第五部分：在一起天数徽章
   ------------------------------------------------------------------ */
function initDaysBadge() {
  const badge = $("days-badge");
  if (!badge) return;
  const days = calcDaysTogether(CONFIG.anniversaryDate);
  if (Number.isNaN(days)) {
    badge.hidden = true;
    return;
  }
  badge.textContent = days >= 0 ? `💑 在一起第 ${days} 天` : `⏳ 还有 ${Math.abs(days)} 天纪念日`;
}

/* ------------------------------------------------------------------
   第六部分：渲染时间线 + 滚动淡入动画
   ------------------------------------------------------------------ */
function renderTimeline() {
  const list = $("timeline-list");
  if (!list) return;

  // 用 DocumentFragment 批量插入，减少重排次数，提升性能
  const fragment = document.createDocumentFragment();

  CONFIG.timeline.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const photoWrap = document.createElement("div");
    photoWrap.className = "timeline-photo";

    const placeholder = document.createElement("span");
    placeholder.className = "placeholder-icon";
    placeholder.textContent = "💖";
    photoWrap.appendChild(placeholder);

    if (item.img) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.title || "我们的合照";
      img.loading = "lazy"; // 懒加载，提升首屏速度
      // 照片不存在时，自动隐藏 <img>，保留渐变占位背景，不出现"裂图"图标
      img.addEventListener("error", () => {
        img.remove();
      });
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

  // 使用 IntersectionObserver 实现滚动到视口内才淡入，兼容性好且性能优于 scroll 事件监听
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
    list.querySelectorAll(".timeline-item").forEach((el) => observer.observe(el));
  } else {
    // 不支持 IntersectionObserver 的老浏览器，直接全部显示，保证兼容性
    list.querySelectorAll(".timeline-item").forEach((el) => el.classList.add("is-visible"));
  }
}

/* ------------------------------------------------------------------
   第七部分：情书正文打字机效果
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
    if (typingDone) return; // 已跳过动画

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
        typingTimer = setTimeout(typeNextChar, 500); // 段落之间稍作停顿
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
   第八部分：结尾彩蛋 + 爱心飘落
   ------------------------------------------------------------------ */
function renderEnding() {
  const titleEl = $("ending-title");
  const textEl = $("ending-text");
  const myNameEl = $("ending-my-name");

  if (titleEl) titleEl.textContent = CONFIG.endingTitle;
  if (textEl) textEl.textContent = CONFIG.endingText;
  if (myNameEl) myNameEl.textContent = CONFIG.myName;

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
   第九部分：进入主内容后统一初始化
   ------------------------------------------------------------------ */
function startExperience() {
  renderTimeline();
  typeLetter();
  renderEnding();
  initReplay();
  initDaysBadge();
}

/* ------------------------------------------------------------------
   第十部分：页面加载后的入口
   ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initCover();
  initMusic();
});
