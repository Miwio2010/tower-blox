let tower: number[][] = [];  // масив щоб блоки були 1x2
let currentBlockX: number = 2;  // позиція по X
let currentBlockY: number = 0;  // позиція Y
let direction: number = 1;   // напрямок блока
let gameOver: boolean = false;  // патерн закінчення гри

// функція для гри
function initGame() {
    tower = [];  // очищеня гри
    currentBlockX = 2;  // Ставимо блок по X
    currentBlockY = 0;  // Ставимо блок по Y
    direction = 1;  // Встановлюємо напрямок руху вправо
    gameOver = false;  // скидаємо закінчення гри
    basic.clearScreen();  // очищаємо екран
    draw();  // відтворюємо поточну сцену
}

// функція для скидання блоку
function dropBlock() {
    if (gameOver) return;  // якщо гра закінчена нічого не робим

    // цикл, щоб блок швидко падав поки не досягне нижньої межі або блоку в башті
    while (currentBlockY < 4 && !isBlockBelow())
    {
        currentBlockY++;  // переміщуємо блок вниз
        basic.pause(100); // пауза для анімації швидкого падіння
        draw();  // перемальовуємо сцену
    }

    // перевіряємо, чи рівно став блок
    if (isAligned()) {
        tower.push([currentBlockX, currentBlockX + 1]);  // додаємо поточний блок в масив башти
        if (tower.length === 5) {  // якщо башта складається з 5 блоків
            gameOver = true;  // встановлюємо прапор закінчення гри
            basic.showString("Win!");  // відображаємо повідомлення про перемогу
            return;  // завершуємо функцію
        }
        // скидаємо поточний блок для наступного
        currentBlockY = 0;  // ставимо поточний блок в початкову позицію по осі Y
        currentBlockX = 2;  // ставимо поточний блок в початкову позицію по осі X
        direction = 1;  // встановлюємо напрямок руху вправо
    } else {
        gameOver = true;  // встановлюємо прапор закінчення гри
        basic.showString("Game Over");  // відображаємо повідомлення про закінчена гри
    }

    draw();  // перемальовуємо сцену
}

// Функція для перевірки, чи є блок під поточним блоком
function isBlockBelow(): boolean {
    if (tower.length === 0) return false;  // якщо башта порожня повертаємо false
    for (let i = 0; i < tower.length; i++) {  // проходимо по кожному блоку в башті
        let block = tower[i];  // отримуємо поточний блок
        // перевіряємо чи є блок під поточною позицією
        if ((block[0] === currentBlockX || block[1] === currentBlockX + 1) && currentBlockY + 1 === 4 - i) {
            return true;  // повертаємо true, якщо є блок під поточним блоком
        }
    }
    return false;  // повертаємо false, якщо під поточним блоком немає блоків
}

// функція для перевірки чи рівно став блок
function isAligned(): boolean {
    if (tower.length === 0) return true;  // якщо башта порожня повертаємо true
    let lastBlock = tower[tower.length - 1];  // отримуємо останній блок в башті
    return currentBlockX === lastBlock[0];  // перевіряємо чи співпадає позиція поточного блоку з останнім блоком
}

// функція для відтворення сцени
function draw() {
    basic.clearScreen();  // очищаємо екран
    for (let i = 0; i < tower.length; i++) {  // проходимо по кожному блоку в башті
        let block = tower[i];  // отримуємо поточний блок
        led.plot(block[0], 4 - i);  // Малюємо першу частину блоку
        led.plot(block[1], 4 - i);  // Малюємо другу частину блоку
    }
    if (currentBlockY < 5) {  // якщо поточний блок ще не досяг нижньої межі
        led.plot(currentBlockX, currentBlockY);  // малюємо першу частину поточного блоку
        led.plot(currentBlockX + 1, currentBlockY);  // малюємо другу частину поточного блоку
    }
}

// функція для руху блоку вліво і вправо
function moveBlock() {
    if (gameOver) return;  // якщо гра закінчена, нічого не робимо
    currentBlockX += direction;  // переміщуємо блок в поточному напрямку
    if (currentBlockX <= 0 || currentBlockX >= 3) {  // якщо блок досягає краю екрану
        direction = -direction;  // міняємо напрямок руху
    }
    draw();  // перемальовуємо сцену
}

// обробник натискання кнопки B для скидання блоку
input.onButtonPressed(Button.B, function () {
    if (gameOver) return;  // якщо гра закінчена, нічого не робимо
    dropBlock();  // скидаємо блок
})

// обробник натискання кнопки AB для перезапуску гри
input.onButtonPressed(Button.AB, function () {
    if (gameOver) {  // якщо гра закінчена
        initGame();  // ініціалізуємо гру
    }
})

initGame();  // ініціалізуємо гру при старті

// цикл для автоматичного руху блоку
basic.forever(function () {
    if (!gameOver) {  // якщо гра не закінчена
        basic.pause(200);  // пауза перед наступною ітерацією
        moveBlock();  // рухаємо блок
    }
})

