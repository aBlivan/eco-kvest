let foundItems = 0;
const totalItems = 4;
let collected = [false, false, false, false];
let gameFinished = false;
let arStarted = false;

const scoreElement = document.getElementById('scoreValue');
const infoTextElement = document.getElementById('infoText');
const scene = document.getElementById('scene');

function updateScore() {
    scoreElement.textContent = foundItems;
    
    if (foundItems === totalItems && !gameFinished) {
        gameFinished = true;
        showCongrats();
    }
}

function showCongrats() {
    const congratsDiv = document.createElement('div');
    congratsDiv.className = 'congrats';
    congratsDiv.innerHTML = '🎉 ПОЗДРАВЛЯЕМ! 🎉<br>Ты эко-герой!<br><small>Ты собрал все 4 предмета!</small>';
    document.body.appendChild(congratsDiv);
    
    setTimeout(() => {
        congratsDiv.remove();
    }, 5000);
}

function onTargetFound(targetIndex) {
    if (!collected[targetIndex] && !gameFinished) {
        collected[targetIndex] = true;
        foundItems++;
        updateScore();
        
        const messages = [
            "🔋 Батарейка найдена! +1 балл. Сдавай батарейки в специальные пункты приёма!",
            "🍼 Бутылка найдена! +1 балл. Используй многоразовую бутылку!",
            "🥤 Стаканчик найден! +1 балл. Бери с собой термокружку!",
            "💨 Баллончик найден! +1 балл. Выбирай продукты без аэрозоля!"
        ];
        infoTextElement.textContent = messages[targetIndex];
        
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        setTimeout(() => {
            if (foundItems < totalItems) {
                infoTextElement.textContent = "Отлично! Ищи дальше: батарейка, бутылка, стаканчик, баллончик";
            } else {
                infoTextElement.textContent = "Ура! Ты собрал все 4 предмета! 🌿";
            }
        }, 3000);
    }
}

// Автоматический запуск AR при загрузке
window.addEventListener('load', async () => {
    infoTextElement.textContent = "Запуск камеры...";
    
    setTimeout(async () => {
        try {
            await scene.components['mindar-image'].start();
            arStarted = true;
            infoTextElement.textContent = "Камера работает! Наведи на: батарейку, бутылку, стаканчик, баллончик";
        } catch (err) {
            console.error(err);
            infoTextElement.textContent = "Ошибка камеры. Обнови страницу и разреши доступ к камере.";
        }
    }, 500);
    
    // Слушаем нахождение целей
    setTimeout(() => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            sceneEl.addEventListener('mindar-image-target-found', (e) => {
                const targetIndex = e.detail.targetIndex;
                onTargetFound(targetIndex);
            });
        }
    }, 1000);
});
