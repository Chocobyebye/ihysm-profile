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
    audio.play(); // Phát nhạc
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
const volumeBtn = document.getElementById('volume-btn'); // Lấy nút loa

audio.volume = volumeSlider.value / 100; // Mặc định

// Khi KÉO thanh âm lượng
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    
    // Nếu kéo về 0, tự động tắt tiếng (hiện icon gạch chéo)
    if (audio.volume === 0) {
        audio.muted = true;
        volumeBtn.classList.add('is-muted');
    } else {
        // Nếu lớn hơn 0, tự động mở tiếng lại
        audio.muted = false;
        volumeBtn.classList.remove('is-muted');
    }
});

// Khi BẤM vào icon loa
volumeBtn.addEventListener('click', () => {
    // Đảo ngược trạng thái
    audio.muted = !audio.muted;
    volumeBtn.classList.toggle('is-muted');
    
    // Nâng cao: Nếu đang tắt tiếng vì kéo slider về 0, mà bấm mở loa lại -> tự cho âm lượng lên 50%
    if (!audio.muted && audio.volume === 0) {
        audio.volume = 0.5;
        volumeSlider.value = 50;
    }
});

// --- 5. THANH THỜI LƯỢNG & TUA NHẠC ---
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

// Hàm đổi giây thành Phút:Giây (ví dụ 65s -> 1:05)
function formatTime(seconds) {
    // Nếu chưa có thời gian thực thì trả về 0:00 để tránh lỗi NaN
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00"; 
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Hàm lấy và hiển thị tổng thời gian của bài hát
function updateTotalTime() {
    if (audio.duration) {
        progressBar.max = audio.duration; // Đặt mốc max cho thanh trượt
        totalTimeEl.textContent = formatTime(audio.duration); // Hiển thị số phút
    }
}

// Bắt nhiều sự kiện khác nhau để đảm bảo lấy được tổng thời gian (SỬA LỖI Ở ĐÂY)
if (audio.readyState >= 1) {
    updateTotalTime(); // Trường hợp file nhạc đã load xong data từ trước
}
audio.addEventListener('loadedmetadata', updateTotalTime);
audio.addEventListener('durationchange', updateTotalTime);
audio.addEventListener('canplay', updateTotalTime);

// Khi bài hát đang phát, cập nhật thanh tiến độ và đồng hồ
audio.addEventListener('timeupdate', () => {
    // Đề phòng trường hợp trình duyệt vẫn "lì lợm" chưa chịu nhận tổng thời gian
    if (progressBar.max === "100" && audio.duration) {
        updateTotalTime();
    }
    
    progressBar.value = audio.currentTime; // Thanh trượt chạy theo
    currentTimeEl.textContent = formatTime(audio.currentTime); // Đồng hồ đếm
});

// Khi kéo thanh để tua nhạc
progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

// --- 6. HIỆU ỨNG GỢN SÓNG NƯỚC (MẶT HỒ) ---
const rippleContainer = document.getElementById('ripple-container');

function createRipple() {
    // Tạo 1 thẻ div gợn sóng
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    // Chọn vị trí xuất hiện ngẫu nhiên trên màn hình (từ 0 đến 100% chiều rộng/cao)
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    
    ripple.style.left = `${randomX}px`;
    ripple.style.top = `${randomY}px`;
    
    // Đưa gợn sóng vào container
    rippleContainer.appendChild(ripple);
    
    // Xóa gợn sóng đó đi sau 2 giây (khi hoạt ảnh css vừa chạy xong) để tránh nặng máy
    setTimeout(() => {
        ripple.remove();
    }, 2000);
}

// Hàm đệ quy để tạo gợn sóng "lâu lâu" xuất hiện một lần
function randomRippleLoop() {
    createRipple();
    
    // Đặt thời gian ngẫu nhiên cho lần nhiễu nước tiếp theo (từ 400ms đến 1500ms)
    const nextTime = Math.random() * 1100 + 400; 
    setTimeout(randomRippleLoop, nextTime);
}

// Bắt đầu vòng lặp tạo gợn sóng
randomRippleLoop();

// --- 7. CÀI ĐẶT PLAYLIST TỰ ĐỘNG (BẢN VVIP - ĐỌC FOLDER TRỰC TIẾP) ---
// --- 7. CÀI ĐẶT PLAYLIST TỰ ĐỘNG (BẢN CLOUD - PHÁT TRỰC TIẾP TỪ GITHUB) ---
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
            
            // Tạo link Cloud và Tên bài hát hiển thị
            mp3Files.forEach(file => {
                
                // GIẢI PHÁP TỐI THƯỢNG: Dùng link Github Pages + Lệnh mã hóa ký tự an toàn
                // Trình duyệt sẽ tự động hiểu và đọc mượt mà mọi loại chữ tượng hình
                const safeUrl = `https://${githubUser}.github.io/${githubRepo}/${folderName}/${encodeURIComponent(file.name)}?v=${new Date().getTime()}`;
                playlist.push(safeUrl);
                
                // BỘ LỌC TÊN BÀI HÁT
                let displayName = file.name; 
                displayName = displayName.replace(/\.mp3$/i, ''); // Bỏ đuôi .mp3
                displayName = displayName.replace(/^\s*\d+\s*[\.\-\_]?\s*/, ''); // Bỏ số thứ tự 1. 2. 3.
                
                songNames.push(displayName);
            });

            // Đổ HTML danh sách bài hát vào Dropdown
            playlistDropdownEl.innerHTML = songNames.map((name, index) => 
                `<div class="playlist-item" onclick="playSpecificSong(${index})">${name}</div>`
            ).join('');

            // Tự động nạp nhạc khi mới vào
            if (playlist.length > 0) {
                audio.src = playlist[0]; 
                updateUI(); // Cập nhật tên và highlight bài số 0
            }
        }
    })
    .catch(error => console.error('Lỗi tải playlist:', error));

// Hàm cập nhật Giao diện (Tên bài hát & Highlight list)
function updateUI() {
    // 1. Đổi tên bài hát ở ô vàng
    currentSongTitleEl.textContent = songNames[currentSongIndex];
    
    // 2. Highlight bài hát đang phát trong ô đỏ
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
            // Tự động cuộn list đến bài hát đó
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// Hàm phát 1 bài cụ thể (Khi click vào list)
window.playSpecificSong = function(index) {
    currentSongIndex = index;
    audio.src = playlist[currentSongIndex];
    updateUI(); // Cập nhật tên trước cho mượt
    
    audio.play().catch(err => console.log("Chưa thể phát nhạc ngay:", err));
    document.getElementById('avatar-btn').classList.add('spin');
    
    // Tự động rút gọn list nhạc lại
    document.getElementById('playlist-dropdown').classList.remove('open');
};

// Nút TỚI (Bài tiếp theo)
function playNextSong() {
    if (playlist.length === 0) return;
    currentSongIndex++; 
    if (currentSongIndex >= playlist.length) currentSongIndex = 0; 
    
    audio.src = playlist[currentSongIndex];
    updateUI();
    
    audio.play().catch(err => {
        // CÚ HACK CHỐNG SO LE: Chỉ nhảy bài nếu lỗi KHÁC lỗi AbortError (cướp cò)
        if (err.name !== 'AbortError') {
            console.warn("⚠️ Bài này bị lỗi thật, đang nhảy qua bài tiếp...");
            playNextSong(); 
        }
    });
    document.getElementById('avatar-btn').classList.add('spin');
}

// Nút LÙI (Bài trước đó)
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
// Gắn sự kiện cho các nút chuyển bài
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);
// Bắt sự kiện: Hết bài thì tự qua bài
audio.addEventListener('ended', playNextSong);