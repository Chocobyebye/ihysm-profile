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
// 2. XỬ LÝ NÚT BẮT ĐẦU VÀ NỔ MẢNH VỠ                        //
// ========================================================= //
const shardsContainer = document.createElement('div');
shardsContainer.classList.add('shards-container');
introScreen.appendChild(shardsContainer);

function createShards() {
    shardsContainer.innerHTML = '';
    const cols = 20, rows = 20;
    const shardWidth = 100 / cols, shardHeight = 100 / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const shard = document.createElement('div');
            shard.classList.add('shard');
            
            shard.style.width = (shardWidth + 0.5) + 'vw';
            shard.style.height = (shardHeight + 0.5) + 'vh';
            shard.style.left = (col * shardWidth) + 'vw';
            shard.style.top = (row * shardHeight) + 'vh';
            
            const dx = (col + 0.5) * shardWidth - 50;
            const dy = (row + 0.5) * shardHeight - 50;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const chaosAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5; 
            
            const force = Math.random() * 50 + 20; 
            shard.style.setProperty('--vx', Math.cos(chaosAngle) * force);
            shard.style.setProperty('--vy', Math.sin(chaosAngle) * force);
            shard.style.setProperty('--vz', Math.random() * 400 + 100); 
            shard.style.setProperty('--rot-x', Math.random() * 540 - 200); 
            shard.style.setProperty('--rot-y', Math.random() * 540 - 200); 
            shard.style.setProperty('--rot-z', Math.random() * 540 - 200); 
            shard.style.setProperty('--duration', (Math.random() * 3 + 7) + 's');
            shard.style.setProperty('--random-color', `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`); 
            
            shard.style.animationDelay = (distance * 0.03) + 's';
            shardsContainer.appendChild(shard);
        }
    }
}
createShards();

startBtn.addEventListener('click', () => {
    setTimeout(() => { audio.play().catch(err => console.log(err)); }, 400);
    introScreen.classList.add('open', 'flash-white');
    setTimeout(() => { profileCard.classList.add('show'); }, 600); 
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
    audio.play(); avatarBtn.classList.add('spin');
    updateUI(); playlistDropdownEl.classList.remove('open');
};

function changeSong(direction) {
    if (playlist.length === 0) return;
    currentSongIndex += direction;
    if (currentSongIndex >= playlist.length) currentSongIndex = 0; 
    else if (currentSongIndex < 0) currentSongIndex = playlist.length - 1; 
    
    audio.src = playlist[currentSongIndex];
    audio.play().catch(err => changeSong(direction));
    avatarBtn.classList.add('spin'); updateUI();
}
nextBtn.addEventListener('click', () => changeSong(1));
prevBtn.addEventListener('click', () => changeSong(-1));
audio.addEventListener('ended', () => changeSong(1));


// ========================================================= //
// 5. HIỆU ỨNG TƯƠNG TÁC CHUỘT (SÁNG THẬT & NÁM HÌNH THOI)   //
// ========================================================= //
if (profileCard) {
    profileCard.addEventListener('mouseenter', () => profileCard.style.transition = 'transform 0.1s ease-out');
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const deltaX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const deltaY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        profileCard.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
    });
    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

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

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

let mouseX = -100, mouseY = -100;
const bolts = [], particles = [], scorches = [], flashes = []; 

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if(particles.length < 40) particles.push(createParticle(mouseX, mouseY));
});
setInterval(() => { 
    if (mouseX > 0 && mouseY > 0 && particles.length < 40) {
        particles.push(createParticle(mouseX, mouseY)); 
    }
}, 80);

function createParticle(x, y) {
    return {
        x: x + (Math.random() - 0.5) * 15, y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5 - 0.5,
        life: 1.0, decay: 0.015 + Math.random() * 0.02, size: 1.5 + Math.random() * 2           
    };
}

function createSegments(x1, y1, x2, y2, displace) {
    let segments = [];
    function build(px1, py1, px2, py2, disp) {
        if (disp < 2 || segments.length > 20) {
            segments.push({ x1: px1, y1: py1, x2: px2, y2: py2 }); return;
        }
        const midX = (px1 + px2) / 2 + (Math.random() - 0.5) * disp;
        const midY = (py1 + py2) / 2 + (Math.random() - 0.5) * disp;
        build(px1, py1, midX, midY, disp / 2); build(midX, midY, px2, py2, disp / 2);
        
        if (Math.random() < 0.2) {
            const branchAngle = Math.atan2(py2 - py1, px2 - px1) + (Math.random() - 0.5) * Math.PI / 1.5;
            const branchLen = disp * (0.6 + Math.random() * 0.4);
            const bx = midX + Math.cos(branchAngle) * branchLen;
            const by = midY + Math.sin(branchAngle) * branchLen;
            build(midX, midY, bx, by, disp / 2);
        }
    }
    build(x1, y1, x2, y2, displace);
    return segments;
}


function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // --- BƯỚC 1: VẼ VẾT NÁM ĐEN ---
    ctx.globalCompositeOperation = 'source-over';
for (let i = scorches.length - 1; i >= 0; i--) {
    const s = scorches[i];
    s.life -= s.decay;
    if (s.life <= 0) { scorches.splice(i, 1); continue; }

    if (s.type === 'circle') {
        // VẼ VẾT NÁM TRÒN (Cái bóng của vệt lóe)
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
        grad.addColorStop(0, `rgba(0, 0, 0, ${s.life * 1})`); // Tâm đen mờ
        grad.addColorStop(1, `rgba(0, 0, 0, 0)`);             // Viền trong suốt
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // VẼ VẾT NÁM SÉT (Logic cũ của bạn)
        ctx.beginPath();
        ctx.lineWidth = s.thickness;
        ctx.strokeStyle = `rgba(0, 0, 0, ${s.life * 0.5})`; 
        s.segments.forEach(seg => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();
    }
}

    // --- BƯỚC 2: BẬT HIỆU ỨNG SÁNG CHO SÉT VÀ FLASH ---
    ctx.globalCompositeOperation = 'lighter'; 

    // Vẽ Flash lóe sáng (HÌNH TRÒN & GRADIENT CHÂN THỰC)
    for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= f.decay;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }

        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
        grad.addColorStop(0, `rgba(255, 255, 220, ${f.life * 0.25})`); 
        grad.addColorStop(1, `rgba(255, 255, 220, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Vẽ Hạt bụi sáng
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay; p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 220, ${p.life})`;
        ctx.fill();
    }

    // Vẽ Tia sét bằng Nét kép
    for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.life -= bolt.decay; 
        if (bolt.life <= 0) { bolts.splice(i, 1); continue; }

        const alpha = Math.min(1, bolt.life * (0.6 + Math.random() * 0.4));
        
        ctx.beginPath();
        ctx.lineWidth = bolt.thickness;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        bolt.segments.forEach(seg => {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();

        ctx.lineWidth = bolt.thickness * 3;
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
        ctx.stroke();
    }
    
    requestAnimationFrame(animateCanvas);
}
animateCanvas();