document.addEventListener('DOMContentLoaded', () => {
  const arrayOfLoveWishes = [
    "Нехай зелень життя приносить спокій і натхнення!",
    "Бажаю росту, відновлення й гармонії — у зелених тонах!",
    "Нехай кожен день буде як свіжа весняна трава — наповнений енергією.",
    "Хай життя цвіте, як сад після дощу — більше зелених миттєвостей!",
    "Бажаю миру, здоров'я та гармонії, що дає зелений колір.",
    "Нехай у вашому домі буде більше рослин, тепла і зелені!",
    "Бажаю нових починань і стабільного зростання, як у дерева.",
    "Нехай ваші мрії ростуть і міцнішають, як коріння в землі.",
    "Бажаю затишку, балансу і свіжого погляду на життя.",
    "Хай колір вашої мрії буде джерелом радості та спокою!",
    "Нехай зелень навколо надихає на добрі вчинки й творчість.",
    "Бажаю знайти внутрішній баланс і силу, як у міцного дерева."
  ];

  const btn = document.getElementById('btn_love_wishes');
  const loveEl = document.getElementById('love-wishes');
  const rangeEl = document.getElementById('snowRange');
  const rangeValueEl = document.getElementById('range-value');

  // Побажання — вартість 1 бал
  const WISH_COST = 1;

  if (btn && loveEl) {
    btn.addEventListener('click', () => {
      const stored = Number(localStorage.getItem('ff_score') || 0);
      if (stored >= WISH_COST) {
        const index = Math.floor(Math.random() * arrayOfLoveWishes.length);
        loveEl.textContent = arrayOfLoveWishes[index];
        localStorage.setItem('ff_score', String(stored - WISH_COST));
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) scoreEl.textContent = String(stored - WISH_COST);
        loveEl.style.opacity = 0;
        requestAnimationFrame(() => {
          loveEl.style.transition = 'opacity 0.45s ease';
          loveEl.style.opacity = 1;
        });
      } else {
        loveEl.textContent = `Потрібно ще ${WISH_COST - stored} бал(ів) для побажання. Грайте у міні-грну, щоб заробити бали.`;
        loveEl.style.opacity = 0;
        requestAnimationFrame(() => {
          loveEl.style.transition = 'opacity 0.35s ease';
          loveEl.style.opacity = 1;
        });
      }
    });
  }

  // --- Листочки / повзунок (залишити як є) ---
  // (скорочено для ясності — збережено функціонал створення листочків)
  let intervalId = null;
  let createInterval = 400;
  let leafSize = 28;
  let leafSpeed = 2.2;
  function lerp(a,b,t){ return a + (b - a) * t; }
  function updateRangeLabel(t){
    if (!rangeValueEl) return;
    if (t < 0.33) rangeValueEl.textContent = 'Низька';
    else if (t < 0.66) rangeValueEl.textContent = 'Середня';
    else rangeValueEl.textContent = 'Висока';
  }
  function updateSettings(){
    if (!rangeEl) return;
    const min = 100, max = 1200;
    const minSize = 18, maxSize = 48;
    const minSpeed = 0.9, maxSpeed = 4.0;
    const value = Number(rangeEl.value);
    const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
    createInterval = Math.max(30, Math.round(lerp(max, min, t)));
    leafSize = Math.round(lerp(maxSize, minSize, t));
    leafSpeed = lerp(minSpeed, maxSpeed, t);
    updateRangeLabel(t);
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(createLeaf, Math.max(20, createInterval));
  }
  function createLeaf(){
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerText = '🍃';
    const startX = Math.random() * (window.innerWidth - 40);
    const size = Math.random() * (leafSize * 0.5) + leafSize * 0.5;
    leaf.style.left = `${startX}px`;
    leaf.style.top = '-64px';
    leaf.style.fontSize = `${size}px`;
    leaf.style.opacity = (Math.random() * 0.6 + 0.35).toString();
    document.body.appendChild(leaf);
    const speed = Math.random() * leafSpeed + leafSpeed * 0.5;
    let drift = (Math.random() - 0.5) * 2.8;
    let rot = (Math.random() - 0.5) * 20;
    let top = -64;
    let left = startX;
    function fall(){
      top += speed;
      left += drift;
      rot += (Math.random() - 0.5) * 4;
      leaf.style.transform = `translate(${left}px, ${top}px) rotate(${rot}deg)`;
      if (top < window.innerHeight + 80) requestAnimationFrame(fall);
      else leaf.remove();
    }
    requestAnimationFrame(fall);
  }
  if (rangeEl){ rangeEl.addEventListener('input', updateSettings); updateSettings(); }
  window.addEventListener('beforeunload', () => { if (intervalId) clearInterval(intervalId); });

  // --- Міні-гра: вгадай відтінок зеленого з обмеженою кількістю спроб ---
  (function colorMatchGame(){
    const optionsCount = 6;
    const targetEl = document.getElementById('game-target');
    const optionsWrap = document.getElementById('game-options');
    const newBtn = document.getElementById('game-new');
    const scoreEl = document.getElementById('game-score');
    const attemptsEl = document.getElementById('game-attempts');
    const messageEl = document.getElementById('game-message');

    if (!targetEl || !optionsWrap || !newBtn) return;

    const MAX_ATTEMPTS = 3;
    let score = Number(localStorage.getItem('ff_score') || 0);
    let attemptsLeft = MAX_ATTEMPTS;
    let targetColor = '';

    function rand(min,max){ return Math.random()*(max-min)+min; }
    function makeShade(baseLightness){
      const h = 122 + Math.round(rand(-6,6));
      const s = Math.round(rand(40,85));
      const l = Math.round(Math.max(14, Math.min(78, baseLightness + rand(-6,6))));
      return `hsl(${h} ${s}% ${l}%)`;
    }
    function pickColors(){
      const base = Math.round(rand(28,62));
      const colors = [];
      for(let i=0;i<optionsCount;i++) colors.push(makeShade(base + (i - Math.floor(optionsCount/2))*6));
      return colors.sort(()=>Math.random()-0.5);
    }
    function updateUI(){
      if (scoreEl) scoreEl.textContent = String(score);
      if (attemptsEl) attemptsEl.textContent = String(attemptsLeft);
    }
    function startRound(){
      clearOptions();
      messageEl.textContent = `Нова спроба: у вас ${MAX_ATTEMPTS} спроб(и).`;
      attemptsLeft = MAX_ATTEMPTS;
      updateUI();
      const colors = pickColors();
      targetColor = colors[Math.floor(Math.random()*colors.length)];
      targetEl.style.background = targetColor;
      colors.forEach(c=>{
        const btn = document.createElement('button');
        btn.className = 'game-option';
        btn.type = 'button';
        btn.style.background = c;
        btn.dataset.color = c;
        btn.addEventListener('click', () => onChoose(btn));
        optionsWrap.appendChild(btn);
      });
    }
    function clearOptions(){ while(optionsWrap.firstChild) optionsWrap.removeChild(optionsWrap.firstChild); }

    function onChoose(btn){
      const color = btn.dataset.color;
      const all = Array.from(optionsWrap.children);
      all.forEach(el=> el.style.pointerEvents='none');

      if (color === targetColor){
        btn.classList.add('correct');
        score++;
        messageEl.textContent = `Правильно! Ви отримали 1 бал. Загалом: ${score} бал(ів).`;
        localStorage.setItem('ff_score', String(score));
        setTimeout(startRound, 900);
      } else {
        btn.classList.add('wrong');
        attemptsLeft--;
        if (attemptsLeft > 0){
          messageEl.textContent = `Неправильно — залишилось ${attemptsLeft} спроб(и).`;
          // дозволяємо продовжити поточний раунд — розблокувати інші кнопки
          all.forEach(el=> el.style.pointerEvents='auto');
          // блокувати саме цей елемент далі
          btn.style.pointerEvents = 'none';
          if (attemptsEl) attemptsEl.textContent = String(attemptsLeft);
          return;
        } else {
          // спроб не лишилось — показати правильний варіант і почати новий раунд
          messageEl.textContent = 'Спроби вичерпані — правильний варіант підсвічено.';
          const correct = all.find(el => el.dataset.color === targetColor);
          if (correct) correct.classList.add('correct');
          setTimeout(startRound, 1200);
        }
      }

      // оновити збереження і UI при вдалому вгадуванні
      localStorage.setItem('ff_score', String(score));
      updateUI();
    }

    newBtn.addEventListener('click', () => {
      score = 0;
      localStorage.setItem('ff_score', String(score));
      attemptsLeft = MAX_ATTEMPTS;
      updateUI();
      startRound();
    });

    updateUI();
    startRound();
  })();
  (function colorMatchGame(){
    const optionsCount = 5; // змінив з 6 на 5
    const targetEl = document.getElementById('game-target');
    const optionsWrap = document.getElementById('game-options');
    const newBtn = document.getElementById('game-new');
    const scoreEl = document.getElementById('game-score');
    const attemptsEl = document.getElementById('game-attempts');
    const messageEl = document.getElementById('game-message');

    if (!targetEl || !optionsWrap || !newBtn) return;

    // ...existing code (без змін) ...

    function pickColors(){
      const base = Math.round(rand(28,62));
      const colors = [];
      for(let i=0;i<optionsCount;i++) colors.push(makeShade(base + (i - Math.floor(optionsCount/2))*6));
      return colors.sort(()=>Math.random()-0.5);
    }

    // ...existing code (без змін) ...
  })();

});