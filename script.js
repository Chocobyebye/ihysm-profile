// ========================================================= //
// DOM ELEMENTS CHÍNH                                        //
// ========================================================= //
const audio = document.getElementById('my-audio');
const introScreen = document.getElementById('intro');
const startBtn = document.getElementById('start-btn');
const profileCard = document.getElementById('profile');
const avatarBtn = document.getElementById('avatar-btn');

// ========================================================= //
// 1. HIỆU ỨNG TĨNH (MƯA, GỢN SÓNG, DOMINO)                  //
// ========================================================= //

// 1.1 Mưa Cyberpunk
function makeItRain() {
    const rainContainer = document.getElementById('rain');
    rainContainer.innerHTML = '';
    const createDrop = (count, background) => {
        for (let i = 0; i < count; i++) {
            let drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDuration = Math.random() * 1 + 0.5 + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.background = background;
            rainContainer.appendChild(drop);
        }
    };
    createDrop(40, 'linear-gradient(to bottom, rgba(100,255,100,0), rgba(215, 255, 248, 0.8))'); 
    createDrop(30, 'linear-gradient(to bottom, rgba(180,100,255,0), rgba(218, 196, 249, 0.8))'); 
    createDrop(30, 'linear-gradient(to bottom, rgba(100,200,255,0), rgba(191, 209, 250, 0.8))'); 
}
makeItRain();

// 1.2 Gợn sóng nước
const rippleContainer = document.getElementById('ripple-container');
function createRipple() {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${Math.random() * window.innerWidth}px`;
    ripple.style.top = `${Math.random() * window.innerHeight}px`;
    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 2000);
}
function randomRippleLoop() {
    createRipple();
    setTimeout(randomRippleLoop, Math.random() * 1100 + 400);
}
randomRippleLoop();

// 1.3 Hiệu ứng Domino Neon
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.querySelector('.name'); 
    if (nameElement) {
        const text = nameElement.innerText;
        nameElement.innerHTML = ''; 
        nameElement.style.display = 'inline-flex'; 
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char; 
            span.classList.add('domino-letter');
            span.style.animationDelay = `${index * 0.2}s`; 
            nameElement.appendChild(span);
        });
    }
});

// ========================================================= //
// 2. XỬ LÝ NÚT BẮT ĐẦU VÀ HIỆU ỨNG BONG BÓNG NƯỚC           //
// ========================================================= //
const bubblesContainer = document.createElement('div');
bubblesContainer.classList.add('bubbles-container');
introScreen.appendChild(bubblesContainer);

function createBubbles() {
    bubblesContainer.innerHTML = '';
    const bubbleCount = 100; // Số lượng bong bóng

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // =========================================================
        // Công thức: Math.random() * (Khoảng chênh lệch) + (Kích thước nhỏ nhất)
        // Ví dụ dưới đây: Nhỏ nhất là 10px, Lớn nhất là 10 + 40 = 50px
        // =========================================================
        const size = Math.random() * 70 + 40; 
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // Vị trí xuất hiện
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.top = (Math.random() * 20 + 105) + 'vh'; 
        
        // Khoảng cách bay lên
        const flyUpDistance = (Math.random() * 80 + 100) + 'vh'; 
        bubble.style.setProperty('--move-y', `-${flyUpDistance}`);
        
        // Độ lắc lư sang hai bên
        const swayDistance = (Math.random() * 40 - 20) + 'vw'; 
        bubble.style.setProperty('--move-x', swayDistance);

        // Thời gian bay và độ trễ ngẫu nhiên để bong bóng bay lên lác đác tự nhiên hơn
        bubble.style.setProperty('--duration', (Math.random() * 3 + 3) + 's');
        bubble.style.animationDelay = (Math.random() * 0.8) + 's';
        
        bubblesContainer.appendChild(bubble);
    }
}

let isCardReady = false;

startBtn.addEventListener('click', () => {
    createBubbles(); 
    setTimeout(() => { audio.play().catch(err => console.log(err)); }, 400);
    introScreen.classList.add('open', 'flash-white');
    setTimeout(() => { profileCard.classList.add('show'); }, 600); 
    setTimeout(() => { isCardReady = true; }, 1500);
    setTimeout(() => { introScreen.style.display = 'none'; }, 4000);  
});


// ========================================================= //
// 3. ĐIỀU KHIỂN ÂM THANH VÀ GIAO DIỆN MÁY NGHE NHẠC         //
// ========================================================= //
avatarBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); avatarBtn.classList.add('spin'); } 
    else { audio.pause(); avatarBtn.classList.remove('spin'); }
});
audio.addEventListener('play', () => avatarBtn.classList.add('spin'));
audio.addEventListener('pause', () => avatarBtn.classList.remove('spin'));

const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
audio.volume = volumeSlider.value / 100;

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    if (audio.volume === 0) { audio.muted = true; volumeBtn.classList.add('is-muted'); } 
    else { audio.muted = false; volumeBtn.classList.remove('is-muted'); }
});
volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeBtn.classList.toggle('is-muted');
    if (!audio.muted && audio.volume === 0) { audio.volume = 0.5; volumeSlider.value = 50; }
});

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

if (audio.readyState >= 1) updateTotalTime();
['loadedmetadata', 'durationchange', 'canplay'].forEach(evt => audio.addEventListener(evt, updateTotalTime));

audio.addEventListener('timeupdate', () => {
    if (progressBar.max === "100" && audio.duration) updateTotalTime();
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});
progressBar.addEventListener('input', () => audio.currentTime = progressBar.value);


// ========================================================= //
// 4. CHỨC NĂNG PLAYLIST TỪ GITHUB API                       //
// ========================================================= //
const githubUser = 'Chocobyebye', githubRepo = 'ihysm-profile', folderName = 'sounds';
let playlist = [], songNames = [], currentSongIndex = 0;

const currentSongTitleEl = document.getElementById('current-song-title');
const playlistDropdownEl = document.getElementById('playlist-dropdown');
const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

togglePlaylistBtn.addEventListener('click', () => playlistDropdownEl.classList.toggle('open'));

fetch(`https://api.github.com/repos/${githubUser}/${githubRepo}/contents/${folderName}`)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            const mp3Files = data.filter(file => file.name.toLowerCase().endsWith('.mp3'));
            mp3Files.forEach(file => {
                const safeUrl = `https://${githubUser}.github.io/${githubRepo}/${folderName}/${encodeURIComponent(file.name)}?v=${new Date().getTime()}`;
                playlist.push(safeUrl);
                let displayName = file.name.replace(/\.mp3$/i, '').replace(/^\s*\d+\s*[\.\-\_]?\s*/, '');
                songNames.push(displayName);
            });

            playlistDropdownEl.innerHTML = songNames.map((name, index) => 
                `<div class="playlist-item" onclick="playSpecificSong(${index})">${name}</div>`
            ).join('');

            if (playlist.length > 0) { audio.src = playlist[0]; updateUI(); }
        }
    }).catch(error => console.error('Lỗi tải playlist:', error));


// --- CÁC HÀM XỬ LÝ GIAO DIỆN & PHÁT NHẠC ---
function updateUI() {
    if(songNames.length > 0) currentSongTitleEl.textContent = songNames[currentSongIndex];
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else item.classList.remove('active');
    });
}

window.playSpecificSong = function(index) {
    currentSongIndex = index;
    audio.src = playlist[currentSongIndex];
    audio.play().then(() => {
        avatarBtn.classList.add('spin');
    }).catch(err => console.error("Lỗi phát nhạc:", err));
    updateUI(); 
    playlistDropdownEl.classList.remove('open');
};

function changeSong(direction) {
    if (playlist.length === 0) return;
    currentSongIndex += direction;
    
    // Quay vòng index
    if (currentSongIndex >= playlist.length) currentSongIndex = 0; 
    else if (currentSongIndex < 0) currentSongIndex = playlist.length - 1; 
    
    audio.src = playlist[currentSongIndex];
    
    audio.play().then(() => {
        avatarBtn.classList.add('spin'); 
        updateUI();
    }).catch(err => {
        console.error("Lỗi hoặc thao tác quá nhanh:", err);
        setTimeout(() => changeSong(direction), 1000); 
    });
}

nextBtn.addEventListener('click', () => changeSong(1));
prevBtn.addEventListener('click', () => changeSong(-1));
audio.addEventListener('ended', () => changeSong(1));

// ========================================================= //
// 5. HIỆU ỨNG TƯƠNG TÁC CHUỘT   //
// ========================================================= //

//  Hiệu ứng nghiêng thẻ Profile 3D
if (profileCard) {
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
        
        if (!isCardReady) return;

        let rectLeft = 0;
        let rectTop = 0;
        let currentElement = profileCard;
        
        while (currentElement) {
            rectLeft += currentElement.offsetLeft;
            rectTop += currentElement.offsetTop;
            currentElement = currentElement.offsetParent;
        }
        
        const rectWidth = profileCard.offsetWidth;
        const rectHeight = profileCard.offsetHeight;
        const rectRight = rectLeft + rectWidth;
        const rectBottom = rectTop + rectHeight;

        // 2. Kiểm tra xem chuột có nằm trong khung gốc tĩnh này không
        const isInside = (
            e.clientX >= rectLeft && 
            e.clientX <= rectRight && 
            e.clientY >= rectTop && 
            e.clientY <= rectBottom
        );

        if (isInside) {
            // Khi chuột ở bên trong
            if (!isHovering) {
                isHovering = true;
                profileCard.style.transition = 'transform 0.1s ease-out';
            }
            
            // Tính toán góc nghiêng
            let deltaX = (e.clientX - (rectLeft + rectWidth / 2)) / (rectWidth / 2);
            let deltaY = (e.clientY - (rectTop + rectHeight / 2)) / (rectHeight / 2);
            
            // Giới hạn góc để thẻ không bị lật ngược (Chốt từ -1 đến 1)
            deltaX = Math.max(-1, Math.min(1, deltaX));
            deltaY = Math.max(-1, Math.min(1, deltaY));

            profileCard.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
        } else {
            // Khi chuột ra ngoài
            if (isHovering) {
                isHovering = false;
                profileCard.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
        }
    });
}

//  Setup Canvas cho hiệu ứng hạt bụi sáng (Particles)
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed'; 
canvas.style.top = '0'; 
canvas.style.left = '0';
canvas.style.pointerEvents = 'none'; 
canvas.style.zIndex = '100000'; 
document.body.appendChild(canvas);

window.addEventListener('resize', () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
});

//  Quản lý hạt sáng theo chuột
let mouseX = -100, mouseY = -100;
const particles = [];

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; 
    mouseY = e.clientY;
    if(particles.length < 40) particles.push(createParticle(mouseX, mouseY));
});

setInterval(() => { 
    if (mouseX > 0 && mouseY > 0 && particles.length < 40) {
        particles.push(createParticle(mouseX, mouseY)); 
    }
}, 80);

function createParticle(x, y) {
    return {
        x: x + (Math.random() - 0.5) * 15, 
        y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 1.5, 
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        life: 1.0, 
        decay: 0.015 + Math.random() * 0.02, 
        size: 1.5 + Math.random() * 2          
    };
}

//  Vòng lặp Render 
function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; 

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay; 
        p.x += p.vx; 
        p.y += p.vy;
    
        if (p.life <= 0) { 
            particles.splice(i, 1); 
            continue; 
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 220, ${p.life})`;
        ctx.fill();
    }
    
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// HIỆU ỨNG HẠT SÁNG BẮN TUNG TÓE KHI CLICK CHUỘT

document.addEventListener('click', function(e) {
    const particleCount = 20; 
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2; 
        const speed = Math.random() * 5 + 1; 

        particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed, 
            vy: Math.sin(angle) * speed, 
            life: 1.0, 
            decay: 0.02 + Math.random() * 0.03, 
            size: 2 + Math.random() * 3 
        });
    }
});