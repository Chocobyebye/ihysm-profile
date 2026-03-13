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

// --- 4. ĐIỀU CHỈNH ÂM LƯỢNG & NÚT BẬT/TẮT TIẾNG ---
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');

audio.volume = volumeSlider.value / 100;

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    
    if (audio.volume === 0) {
        audio.muted = true;
        volumeBtn.classList.add('is-muted');
    } else {
        audio.muted = false;
        volumeBtn.classList.remove('is-muted');
    }
});

volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeBtn.classList.toggle('is-muted');
    
    if (!audio.muted && audio.volume === 0) {
        audio.volume = 0.5;
        volumeSlider.value = 50;
    }
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

// --- 7. CÀI ĐẶT PLAYLIST TỰ ĐỘNG ---
const githubUser = 'Chocobyebye'; 
const githubRepo = 'ihysm-profile'; 
const folderName = 'sounds';

let playlist = []; 
let currentSongIndex = 0;
let songNames = [];

const currentSongTitleEl = document.getElementById('current-song-title');
const playlistDropdownEl = document.getElementById('playlist-dropdown');
const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

togglePlaylistBtn.addEventListener('click', () => {
    playlistDropdownEl.classList.toggle('open');
});

fetch(`https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${folderName}`)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            const mp3Files = data.filter(file => file.name.toLowerCase().endsWith('.mp3'));
        
            mp3Files.forEach(file => {
                
                const safeUrl = `https://${githubUser}.github.io/${githubRepo}/${folderName}/${encodeURIComponent(file.name)}?v=${new Date().getTime()}`;
                playlist.push(safeUrl);
                
                let displayName = file.name; 
                displayName = displayName.replace(/\.mp3$/i, '');
                displayName = displayName.replace(/^\s*\d+\s*[\.\-\_]?\s*/, '');
                
                songNames.push(displayName);
            });

            playlistDropdownEl.innerHTML = songNames.map((name, index) => 
                `<div class="playlist-item" onclick="playSpecificSong(${index})">${name}</div>`
            ).join('');

            if (playlist.length > 0) {
                audio.src = playlist[0]; 
                updateUI();
            }
        }
    })
    .catch(error => console.error('Lỗi tải playlist:', error));

function updateUI() {
    currentSongTitleEl.textContent = songNames[currentSongIndex];
    
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

window.playSpecificSong = function(index) {
    currentSongIndex = index;
    audio.src = playlist[currentSongIndex];
    updateUI();
    
    audio.play().catch(err => console.log("Chưa thể phát nhạc ngay:", err));
    document.getElementById('avatar-btn').classList.add('spin');
    
    document.getElementById('playlist-dropdown').classList.remove('open');
};

function playNextSong() {
    if (playlist.length === 0) return;
    currentSongIndex++; 
    if (currentSongIndex >= playlist.length) currentSongIndex = 0; 
    
    audio.src = playlist[currentSongIndex];
    updateUI();
    
    audio.play().catch(err => {
        if (err.name !== 'AbortError') {
            console.warn("⚠️ Bài này bị lỗi thật, đang nhảy qua bài tiếp...");
            playNextSong(); 
        }
    });
    document.getElementById('avatar-btn').classList.add('spin');
}

function playPrevSong() {
    if (playlist.length === 0) return;
    currentSongIndex--; 
    if (currentSongIndex < 0) currentSongIndex = playlist.length - 1; 
    
    audio.src = playlist[currentSongIndex];
    updateUI();
    
    audio.play().catch(err => {
        if (err.name !== 'AbortError') {
            playPrevSong();
        }
    });
    document.getElementById('avatar-btn').classList.add('spin');
}
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);
audio.addEventListener('ended', playNextSong);
