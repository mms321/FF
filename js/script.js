// ...existing code...
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

  if (btn && loveEl) {
    btn.addEventListener('click', () => {
      const index = Math.floor(Math.random() * arrayOfLoveWishes.length);
      loveEl.innerText = arrayOfLoveWishes[index];
    });
  }

  // Параметри анімації листочків
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

  function updateSettings() {
    if (!rangeEl) return;
    const min = 100, max = 1200;
    const minSize = 18, maxSize = 48;
    const minSpeed = 0.9, maxSpeed = 4.0;
    const value = Number(rangeEl.value);
    const t = Math.max(0, Math.min(1, (value - min) / (max - min))); // 0..1
    // Інтенсивність: повзунок вправо → більше листя
    createInterval = Math.round(lerp(max, min, t)); // більше t → менший інтервал
    leafSize = Math.round(lerp(maxSize, minSize, t)); // більше t → дрібніші листки
    leafSpeed = lerp(minSpeed, maxSpeed, t); // більше t → швидше падіння

    updateRangeLabel(t);

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(createLeaf, Math.max(20, createInterval));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerText = '🍃';
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * (leafSize * 0.5) + leafSize * 0.5;
    leaf.style.left = startX + 'px';
    leaf.style.top = '-48px';
    leaf.style.fontSize = size + 'px';
    leaf.style.opacity = (Math.random() * 0.6 + 0.35).toString();
    document.body.appendChild(leaf);

    // Параметри руху
    const speed = Math.random() * leafSpeed + leafSpeed * 0.5;
    let drift = (Math.random() - 0.5) * 2.8;
    let rot = (Math.random() - 0.5) * 0.06;
    let top = -48;
    let left = startX;

    function fall() {
      top += speed;
      left += drift;
      rot += (Math.random() - 0.5) * 0.02;
      leaf.style.top = top + 'px';
      leaf.style.left = left + 'px';
      leaf.style.transform = `rotate(${rot}turn)`;
      if (top < window.innerHeight + 60) {
        requestAnimationFrame(fall);
      } else {
        leaf.remove();
      }
    }
    requestAnimationFrame(fall);
  }

  // Ініціалізація
  if (rangeEl) {
    rangeEl.addEventListener('input', updateSettings);
  }
  updateSettings();

  // Очистка при виході
  window.addEventListener('beforeunload', () => {
    if (intervalId) clearInterval(intervalId);
  });

});
// ...existing code...