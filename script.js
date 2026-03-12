// --- 1. HIỆU ỨNG MƯA CYBERPUNK ---
function makeItRain() {
    const rainContainer = document.getElementById('rain');
    rainContainer.innerHTML = '';
    
    function createDrop(count, background) {
        for (let i = 0; i < count; i++) {
            let drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDuration = Math.random() * 1 + 0.5 + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.background = background;
            rainContainer.appendChild(drop);
        }
    }

    createDrop(40, 'linear-gradient(to bottom, rgba(100,255,100,0), rgba(215, 255, 248, 0.8))'); 
    createDrop(30, 'linear-gradient(to bottom, rgba(180,100,255,0), rgba(218, 196, 249, 0.8))'); 
    createDrop(30, 'linear-gradient(to bottom, rgba(100,200,255,0), rgba(191, 209, 250, 0.8))'); 
}
makeItRain();

// --- 2. XỬ LÝ NÚT BẮT ĐẦU ---
const startBtn = document.getElementById('start-btn');
const introScreen = document.getElementById('intro');
const profileCard = document.getElementById('profile');
const audio = document.getElementById('my-audio');
const avatarBtn = document.getElementById('avatar-btn');

startBtn.addEventListener('click', () => {
    audio.play();
    introScreen.classList.add('open'); 
    
    setTimeout(() => {
        profileCard.classList.add('show');
    }, 500);

    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1500); 
});

// --- 3. ĐIỀU KHIỂN NHẠC BẰNG AVATAR ---
avatarBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        avatarBtn.classList.add('spin');
    } else {
        audio.pause();
        avatarBtn.classList.remove('spin');
    }
});

audio.addEventListener('play', () => avatarBtn.classList.add('spin'));
audio.addEventListener('pause', () => avatarBtn.classList.remove('spin'));

// --- 4. ĐIỀU CHỈNH ÂM LƯỢNG SIÊU NGẮN ---
const volumeSlider = document.getElementById('volume-slider');
audio.volume = volumeSlider.value / 100;

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

// --- 5. THANH THỜI LƯỢNG & TUA NHẠC ---
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00"; 
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateTotalTime() {
    if (audio.duration) {
        progressBar.max = audio.duration;
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

if (audio.readyState >= 1) {
    updateTotalTime();
}
audio.addEventListener('loadedmetadata', updateTotalTime);
audio.addEventListener('durationchange', updateTotalTime);
audio.addEventListener('canplay', updateTotalTime);

audio.addEventListener('timeupdate', () => {
    if (progressBar.max === "100" && audio.duration) {
        updateTotalTime();
    }
    
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

// --- 6. HIỆU ỨNG GỢN SÓNG NƯỚC (MẶT HỒ) ---
const rippleContainer = document.getElementById('ripple-container');

function createRipple() {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    
    ripple.style.left = `${randomX}px`;
    ripple.style.top = `${randomY}px`;
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

function randomRippleLoop() {
    createRipple();
    
    const nextTime = Math.random() * 1100 + 400; 
    setTimeout(randomRippleLoop, nextTime);
}

randomRippleLoop();
