(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Live relationship counter.
  const startDate = new Date('2025-06-27T00:00:00+08:00');
  const counter = $('.counter');
  const since = $('.since');
  function updateCounter() {
    if (!counter) return;
    const elapsed = Math.max(0, Date.now() - startDate.getTime());
    const days = Math.floor(elapsed / 86400000);
    const hours = Math.floor((elapsed % 86400000) / 3600000);
    const values = counter.querySelectorAll('strong');
    if (values[0]) values[0].textContent = String(days);
    if (values[1]) values[1].textContent = String(hours);
    if (since) since.textContent = '始于 2025.06.27';
  }
  updateCounter();
  window.setInterval(updateCounter, 60_000);

  // Promise list persists locally and updates the progress ring.
  const wishes = $$('.wish-card');
  const ring = $('.progress-ring');
  const ringLabel = ring?.querySelector('strong');
  const progressText = $('.progress-card > div:last-child > strong');
  const wishStoreKey = 'qixi-wishes:local-replica';
  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem(wishStoreKey) || '[]')); } catch (_) {}
  function updateWishes() {
    let count = 0;
    wishes.forEach((button, index) => {
      const checked = done.has(String(index));
      button.setAttribute('aria-pressed', String(checked));
      button.classList.toggle('is-done', checked);
      if (checked) count++;
    });
    const percent = wishes.length ? Math.round(count / wishes.length * 100) : 0;
    if (ring) ring.style.setProperty('--progress', `${percent}%`);
    if (ringLabel) ringLabel.textContent = `${percent}%`;
    if (progressText) progressText.textContent = `${count} / ${wishes.length} 个约定`;
    try { localStorage.setItem(wishStoreKey, JSON.stringify([...done])); } catch (_) {}
  }
  wishes.forEach((button, index) => button.addEventListener('click', () => {
    const key = String(index);
    done.has(key) ? done.delete(key) : done.add(key);
    updateWishes();
  }));
  updateWishes();

  // Handwritten letter typewriter: starts when the letter section enters view.
  const letterSection = $('#letter');
  const typewriterLines = $$('.love-letter .typewriter-line');
  let letterTypingStarted = false;

  function startLetterTypewriter() {
    if (letterTypingStarted || !typewriterLines.length) return;
    letterTypingStarted = true;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const lines = typewriterLines.map(line => {
      const fullText = line.textContent || '';
      line.dataset.fullText = fullText;
      line.setAttribute('aria-label', fullText);
      line.textContent = '';
      line.classList.add('is-typewriter-pending');
      return { line, fullText, chars: Array.from(fullText) };
    });

    if (reducedMotion) {
      lines.forEach(({ line, fullText }) => {
        line.textContent = fullText;
        line.classList.remove('is-typewriter-pending', 'is-typing');
        line.classList.add('is-typed');
      });
      return;
    }

    let lineIndex = 0;
    const punctuation = new Set(['，', '。', '！', '？', '；', '：', '、', '…', '”', '’', '！', '？']);
    function typeNextLine() {
      if (lineIndex >= lines.length) return;
      const current = lines[lineIndex++];
      const { line, chars } = current;
      line.classList.remove('is-typewriter-pending');
      line.classList.add('is-typing');
      const textNode = document.createElement('span');
      textNode.className = 'typed-text';
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.textContent = '▍';
      line.append(textNode, cursor);
      let index = 0;

      function typeCharacter() {
        if (index >= chars.length) {
          cursor.remove();
          line.classList.remove('is-typing');
          line.classList.add('is-typed');
          window.setTimeout(typeNextLine, 260);
          return;
        }
        const character = chars[index++];
        textNode.textContent += character;
        const delay = punctuation.has(character) ? 145 : 27;
        window.setTimeout(typeCharacter, delay);
      }
      typeCharacter();
    }
    typeNextLine();
  }

  if (letterSection && typewriterLines.length) {
    if ('IntersectionObserver' in window) {
      const letterObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          startLetterTypewriter();
          letterObserver.disconnect();
        }
      }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
      letterObserver.observe(letterSection);
    } else {
      startLetterTypewriter();
    }
  }

  // Accessible gallery lightbox.
  const lightbox = document.createElement('div');
  lightbox.className = 'replica-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '照片预览');
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="关闭照片">×</button><div class="lightbox-panel"><img alt="照片预览"><div class="lightbox-caption"></div></div>';
  document.body.appendChild(lightbox);
  const lightboxImage = $('img', lightbox);
  const lightboxCaption = $('.lightbox-caption', lightbox);
  function closeLightbox() { lightbox.hidden = true; document.body.style.overflow = ''; }
  $$('.photo-card').forEach(button => button.addEventListener('click', () => {
    const img = $('img', button);
    const title = $('strong', button)?.textContent || button.getAttribute('aria-label') || '我们的回忆';
    lightboxImage.src = img?.src || '';
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lightbox-close', lightbox).focus();
  }));
  $('.lightbox-close', lightbox).addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  // Background music: try audible autoplay first; browsers may block it until a user gesture.
  // If the audio file is absent from the ZIP, clicking the music icon lets the visitor choose it.
  const audio = $('#background-audio');
  const musicButton = $('.music-button');
  const musicNotice = $('.music-notice');
  const musicFileInput = $('#music-file-input');
  const noticeText = musicNotice?.querySelector('p');
  let audioAvailable = false;
  let selectedAudioUrl = '';

  function setMusicNotice(text, playing, hideAfterPlay = false) {
    if (noticeText) noticeText.textContent = text;
    if (musicNotice) {
      musicNotice.className = `music-notice ${playing ? 'is-playing' : 'needs-touch'}`;
      musicNotice.hidden = false;
    }
    if (musicButton) {
      musicButton.classList.toggle('playing', !!playing);
      musicButton.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
      musicButton.title = playing ? '暂停背景音乐' : '播放背景音乐';
    }
    if (playing && hideAfterPlay && musicNotice) {
      window.setTimeout(() => { if (musicNotice.classList.contains('is-playing')) musicNotice.hidden = true; }, 3200);
    }
  }

  function chooseAudioFile() {
    if (musicFileInput) {
      musicFileInput.value = '';
      musicFileInput.click();
    }
  }

  async function startMusic({ fromUser = false } = {}) {
    if (!audio) return;
    if (!audioAvailable && audio.error && !selectedAudioUrl) {
      if (fromUser) {
        setMusicNotice('请选择本地音乐文件开始播放', false);
        chooseAudioFile();
      } else {
        setMusicNotice('没有找到音乐文件；点击音符选择音频', false);
      }
      return;
    }
    try {
      await audio.play();
      setMusicNotice('背景音乐正在播放', true, true);
    } catch (error) {
      if (error?.name === 'NotAllowedError') {
        setMusicNotice('浏览器限制自动播放，点击音符即可播放', false);
      } else if (audio.error && !selectedAudioUrl) {
        setMusicNotice('未找到配套音乐；点击音符选择音频', false);
      } else {
        setMusicNotice('音乐暂时无法播放，点击音符重试', false);
      }
    }
  }

  musicButton?.addEventListener('click', async () => {
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setMusicNotice('背景音乐已暂停', false);
      return;
    }
    if (!audioAvailable && !selectedAudioUrl) {
      // When the bundled track is absent or has not become playable yet, let the visitor choose it.
      chooseAudioFile();
      return;
    }
    await startMusic({ fromUser: true });
  });

  musicFileInput?.addEventListener('change', async () => {
    const file = musicFileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      setMusicNotice('请选择 MP3、M4A、WAV 等音频文件', false);
      return;
    }
    if (selectedAudioUrl) URL.revokeObjectURL(selectedAudioUrl);
    selectedAudioUrl = URL.createObjectURL(file);
    audioAvailable = true;
    audio.src = selectedAudioUrl;
    audio.load();
    try {
      await audio.play();
      setMusicNotice(`正在播放：${file.name}`, true, true);
    } catch (_) {
      setMusicNotice('音频已加载，请再点击音符播放', false);
    }
  });

  audio?.addEventListener('canplay', () => {
    audioAvailable = true;
  });
  audio?.addEventListener('error', () => {
    if (selectedAudioUrl) {
      setMusicNotice('所选音乐无法读取，请换一个音频文件', false);
      return;
    }
    audioAvailable = false;
    setMusicNotice('没有找到配套音乐；点击音符选择音频', false);
  });
  audio?.addEventListener('play', () => setMusicNotice('背景音乐正在播放', true, true));
  audio?.addEventListener('pause', () => {
    if (!audio.ended) setMusicNotice('背景音乐已暂停', false);
  });

  // Attempt autoplay on page load. Actual audible autoplay depends on browser policy.
  if (audio) {
    audio.load();
    startMusic();
  }

  // Confirm the promise in place: keep the full website and replace only this card's contents.
  const yesButton = $$('.answer-card button').find(button => button.textContent.includes('好呀，我们说定了'));
  yesButton?.addEventListener('click', () => {
    const answerCard = yesButton.closest('.answer-card');
    if (!answerCard || answerCard.classList.contains('promise-accepted-in-place')) return;

    answerCard.classList.add('promise-accepted-in-place');
    answerCard.setAttribute('role', 'status');
    answerCard.setAttribute('aria-live', 'polite');
    answerCard.innerHTML = `
      <span class="promise-star" aria-hidden="true">✦</span>
      <p class="promise-question">未来的每一个普通日子，<br>也继续一起过，好吗？</p>
      <div class="promise-ornament" aria-hidden="true">
        <span>✦</span><span class="promise-heart">♡</span><span>✦</span>
      </div>
      <h2 class="promise-affirmation">说定了，不许反悔 ♡</h2>
      <p class="promise-message">慧慧，往后的每一个普通日子，<br>新新都会认真陪你一起过。</p>
      <p class="promise-caption">这一刻，也会成为我们的新回忆。</p>`;
  });

  // Trigger deferred reveals when opened locally.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    $$('.atmosphere-reveal').forEach(element => {
      if (!element.classList.contains('is-visible')) observer.observe(element);
    });
  } else {
    $$('.atmosphere-reveal').forEach(element => element.classList.add('is-visible'));
  }
})();
