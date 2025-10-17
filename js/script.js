const arrayOfLoveWishes = [
    "З Новим роком! Нехай здійсняться всі мрії!",
    "Бажаю щастя, здоров’я та удачі у новому році!",
    "Нехай цей рік принесе багато радісних моментів!",
    "Хай у домі панує затишок і тепло!",
    "Бажаю нових звершень та яскравих емоцій!",
    "Нехай кожен день буде наповнений добром і любов’ю!",
    "Хай у новому році здійсниться найзаповітніше бажання!",
    "Бажаю миру, гармонії та натхнення!",
    "Нехай у серці завжди буде святковий настрій!",
    "Хай новий рік подарує багато щасливих днів!",
    "Бажаю веселих свят і приємних сюрпризів!",
    "Нехай у новому році буде багато посмішок і радості!",
    "Хай у житті буде більше чудес і приємних несподіванок!",
    "Бажаю тепла, затишку та любові у новому році!",
    "Нехай новий рік стане початком великих перемог!"
];

document.getElementById('btn_love_wishes').addEventListener('click', () => {
    let index = Math.floor(Math.random() * arrayOfLoveWishes.length);
    document.getElementById('love-wishes').innerText = arrayOfLoveWishes[index];
});

// --- Регулювання інтенсивності снігу ---
let snowInterval = 400;
let snowTimer;
let snowflakeSize = 32;
let snowflakeSpeed = 2;

function updateSnowSettings() {
    // Чим менше інтервал, тим більше сніжинок, вони дрібніші і швидші
    const minInterval = 100, maxInterval = 1200;
    const minSize = 32, maxSize = 80;      // маленькі як були великі, великі ще більші
    const minSpeed = 4, maxSpeed = 3;    // швидко для маленьких, повільно для великих
    const value = Number(document.getElementById('snowRange').value);

    // При великій інтенсивності (малий інтервал) — маленькі і швидкі
    snowflakeSize = minSize + ((value - minInterval) / (maxInterval - minInterval)) * (maxSize - minSize);
    snowflakeSpeed = minSpeed - ((value - minInterval) / (maxInterval - minInterval)) * (minSpeed - maxSpeed);

    snowInterval = value;
    clearInterval(snowTimer);
    snowTimer = setInterval(createSnowflake, snowInterval);
}

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.innerText = '❄️';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.top = '-40px';
    snowflake.style.fontSize = (Math.random() * (snowflakeSize/2) + snowflakeSize/2) + 'px';
    snowflake.style.opacity = Math.random() * 0.7 + 0.3;
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = 1000;
    document.body.appendChild(snowflake);

    let speed = Math.random() * snowflakeSpeed + snowflakeSpeed;
    let drift = (Math.random() - 0.5) * 2;

    function fall() {
        let top = parseFloat(snowflake.style.top);
        let left = parseFloat(snowflake.style.left);
        snowflake.style.top = (top + speed) + 'px';
        snowflake.style.left = (left + drift) + 'px';

        if (top < window.innerHeight) {
            requestAnimationFrame(fall);
        } else {
            snowflake.remove();
        }
    }
    fall();
}

// Ініціалізація
document.getElementById('snowRange').addEventListener('input', updateSnowSettings);
updateSnowSettings();