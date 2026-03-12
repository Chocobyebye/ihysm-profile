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

// ... (GIỮ NGUYÊN PHẦN MƯA VÀ MÀN HÌNH CHỜ BÊN TRÊN) ...

// --- 4. ĐIỀU CHỈNH ÂM LƯỢNG SIÊU NGẮN ---
// Sửa lại ID thành volume-slider cho đúng với HTML
const volumeSlider = document.getElementById('volume-slider');
audio.volume = volumeSlider.value / 100; // Mặc định 50%

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

// --- 5. THANH THỜI LƯỢNG & TUA NHẠC ---
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