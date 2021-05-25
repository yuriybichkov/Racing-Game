const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement("div");

const maxEnemy = 8;
const heightElem = 100;

const keys = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false
}

const setting = {
    start: false,
    score: 0,
    speed: 2,
    traffic: 6
}

const audio = document.createElement('embed');
audio.src = 'music/track2.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = 'position:absolute; top:-200px';


car.classList.add('car');


gameArea.style.height = Math.floor(document.documentElement.clientHeight / heightElem) * heightElem;


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


function getQuantityElements(heightElement) {
    return gameArea.offsetHeight / heightElement +1;
}

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    gameArea.append(audio);


    for (let i = 0; i < getQuantityElements(heightElem); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * heightElem) + 'px';
        line.y = i * heightElem;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(heightElem * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * maxEnemy) + 1;
        enemy.classList.add('enemy');
        enemy.y = -heightElem * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
        gameArea.append(enemy);
    }

    setting.score = 0
    setting.start = true;
    gameArea.append(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);

}

function playGame() {
    if (setting.start) {
        score.style.top = '0';
        setting.score += setting.speed / 20;
        score.innerHTML = "SCORE <br>" + Math.round(setting.score);
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 10)) {
            setting.y += setting.speed
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame)
    }

}

function startRun(event) {
    //if (event.key in keys) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event) {
    if (event.key in keys) {
        event.preventDefault();
        keys[event.key] = false;
    }
}

function moveRoad() {

    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.style.left = gameArea.offsetWidth / 2 - line.offsetWidth / 2;
        line.y += setting.speed * 2;
        line.style.top = line.y + 'px';
        if (line.y > gameArea.offsetHeight) {
            line.y = -90;
        }
    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(item => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top + 5 <= enemyRect.bottom &&
            carRect.right - 5 >= enemyRect.left &&
            carRect.left + 5 <= enemyRect.right &&
            carRect.bottom - 5 >= enemyRect.top) {
            setting.start = false;
            audio.remove();
            start.classList.remove('hide');
            score.style.top = start.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight) {
            item.y = -heightElem * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
        }
    })
}