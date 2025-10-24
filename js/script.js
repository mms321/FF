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

  // Побажання
  if (btn && loveEl) {
    btn.addEventListener('click', () => {
      const index = Math.floor(Math.random() * arrayOfLoveWishes.length);
      loveEl.textContent = arrayOfLoveWishes[index];
      loveEl.style.opacity = 0;
      requestAnimationFrame(() => {
        loveEl.style.transition = 'opacity 0.45s ease';
        loveEl.style.opacity = 1;
      });
    });
  }

  // Листочки — параметри та логіка
  let intervalId = null;
  let createInterval = 400;
  let leafSize = 28;
  let leafSpeed = 2.2;

  function updateRangeLabel(t) {
    if (!rangeValueEl) return;
    if (t < 0.33) rangeValueEl.textContent = 'Низька';
    else if (t < 0.66) rangeValueEl.textContent = 'Середня';
    else rangeValueEl.textContent = 'Висока';
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateSettings() {
    if (!rangeEl) return;
    const min = 100, max = 1200;
    const minSize = 18, maxSize = 48;
    const minSpeed = 0.9, maxSpeed = 4.0;
    const value = Number(rangeEl.value);
    const t = Math.max(0, Math.min(1, (value - min) / (max - min))); // 0..1

    // більше t (повзунок вправо) — більше інтенсивності
    createInterval = Math.max(30, Math.round(lerp(max, min, t))); // інтервал зменшується при рості t
    leafSize = Math.round(lerp(maxSize, minSize, t)); // розмір зменшується при рості t
    leafSpeed = lerp(minSpeed, maxSpeed, t); // швидкість зростає при рості t

    updateRangeLabel(t);

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(createLeaf, Math.max(20, createInterval));
  }

  function createLeaf() {
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

    function fall() {
      top += speed;
      left += drift;
      rot += (Math.random() - 0.5) * 4;
      leaf.style.transform = `translate(${left}px, ${top}px) rotate(${rot}deg)`;
      if (top < window.innerHeight + 80) {
        requestAnimationFrame(fall);
      } else {
        leaf.remove();
      }
    }
    requestAnimationFrame(fall);
  }

  if (rangeEl) {
    rangeEl.addEventListener('input', updateSettings);
    updateSettings();
  }

  window.addEventListener('beforeunload', () => {
    if (intervalId) clearInterval(intervalId);
  });

  // --- Міні-гра: Вгадай відтінок зеленого ---
  (function colorMatchGame(){
    const optionsCount = 6;
    const targetEl = document.getElementById('game-target');
    const optionsWrap = document.getElementById('game-options');
    const newBtn = document.getElementById('game-new');
    const scoreEl = document.getElementById('game-score');
    const messageEl = document.getElementById('game-message');

    if (!targetEl || !optionsWrap || !newBtn) return;

    let score = 0;
    let targetColor = '';

    function rand(min, max){ return Math.random()*(max-min)+min; }

    function makeShade(baseLightness){
      const h = 122 + Math.round(rand(-6,6));
      const s = Math.round(rand(40,85));
      const l = Math.round(Math.max(14, Math.min(78, baseLightness + rand(-6,6))));
      return `hsl(${h} ${s}% ${l}%)`;
    }

    function pickColors(){
      const base = Math.round(rand(28,62));
      const colors = [];
      for(let i=0;i<optionsCount;i++){
        colors.push(makeShade(base + (i - Math.floor(optionsCount/2))*6));
      }
      return colors.sort(()=>Math.random()-0.5);
    }

    function startRound(){
      clearOptions();
      messageEl.textContent = '';
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

    function clearOptions(){
      while(optionsWrap.firstChild) optionsWrap.removeChild(optionsWrap.firstChild);
    }

    function onChoose(btn){
      const color = btn.dataset.color;
      const all = Array.from(optionsWrap.children);
      all.forEach(el=> el.style.pointerEvents='none');

      if (color === targetColor) {
        btn.classList.add('correct');
        messageEl.textContent = 'Правильно! +1';
        score++;
      } else {
        btn.classList.add('wrong');
        messageEl.textContent = 'Ні. Спробуй ще.';
        const correct = all.find(el => el.dataset.color === targetColor);
        if (correct) correct.classList.add('correct');
      }
      updateScore();
      setTimeout(startRound, 900);
    }

    function updateScore(){ if (scoreEl) scoreEl.textContent = String(score); }

    newBtn.addEventListener('click', () => {
      score = 0;
      updateScore();
      startRound();
    });

    startRound();
  })();

});