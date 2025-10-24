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

  // Обробка кнопки побажань
  if (btn && loveEl) {
    btn.addEventListener('click', () => {
      const index = Math.floor(Math.random() * arrayOfLoveWishes.length);
      loveEl.innerText = arrayOfLoveWishes[index];
      loveEl.style.opacity = 0;
      requestAnimationFrame(() => {
        loveEl.style.transition = 'opacity 0.5s ease';
        loveEl.style.opacity = 1;
      });
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

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerText = '🌿';
    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * (leafSize * 0.5) + leafSize * 0.5;
    
    leaf.style.cssText = `
      left: ${startX}px;
      top: -48px;
      font-size: ${size}px;
      opacity: ${Math.random() * 0.6 + 0.35};
    `;
    
    document.body.appendChild(leaf);

    const speed = Math.random() * leafSpeed + leafSpeed * 0.5;
    let drift = (Math.random() - 0.5) * 2.8;
    let rotation = 0;
    let top = -48;
    let left = startX;

    function fall() {
      top += speed;
      left += drift;
      rotation += 2;
      
      leaf.style.transform = `translate(${left}px, ${top}px) rotate(${rotation}deg)`;
      
      if (top < window.innerHeight + 60) {
        requestAnimationFrame(fall);
      } else {
        leaf.remove();
      }
    }
    
    requestAnimationFrame(fall);
  }

  function updateSettings() {
    if (!rangeEl) return;
    
    const value = Number(rangeEl.value);
    const t = (value - 100) / (1200 - 100); // нормалізація до 0..1
    
    createInterval = Math.max(50, 1200 - value); // інвертуємо для інтуїтивності
    leafSize = Math.max(20, 40 - (t * 20));
    leafSpeed = 1 + (t * 3);

    updateRangeLabel(t);

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(createLeaf, createInterval);
  }

  // Ініціалізація
  if (rangeEl) {
    rangeEl.addEventListener('input', updateSettings);
    updateSettings();
  }

  // Очистка при виході
  window.addEventListener('beforeunload', () => {
    if (intervalId) clearInterval(intervalId);
  });
});