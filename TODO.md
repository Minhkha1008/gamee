# Kế hoạch sửa chữa ✅ HOÀN THÀNH

## Việc cần làm:

### 1. Fix background image paths ✅
- [x] Sửa `hinhnen1.jpg` → `hinhnen1.webp` và thêm `hinhnen.jpg` trong CSS
- [x] Thêm bg-gradient0 cho hinhnen.jpg

### 2. Thêm scripts sound và settings ✅
- [x] Thêm `<script src="js/sound.js">` và `<script src="js/settings.js">` vào simple-game.html

### 3. Thêm hiệu ứng âm thanh ✅
- [x] `shoot()` → gọi `soundManager.createShootSound()`
- [x] `activatePowerUp()` → gọi `soundManager.createPowerupSound()`
- [x] `showQuiz()` → gọi `soundManager.createClickSound()`
- [x] `handleAnswer()` → đúng gọi `createCorrectSound()`, sai gọi `createWrongSound()`
- [x] `gameOver()` → gọi `createGameOverSound()` và `stopBackgroundMusic()`
- [x] `startGame()` → gọi `playBackgroundMusic()`
- [x] Va chạm enemy-player → gọi `createDamageSound()`

### 4. Settings screen controls âm thanh ✅
- [x] Thêm volume slider, music toggle, SFX toggle
- [x] Sửa CSS chữ cài đặt nhỏ lại (0.85rem), cùng 1 hàng trên mobile (flex-wrap)

### 5. Background persistence ✅
- [x] Lưu background vào localStorage
- [x] Load background khi start game

### 6. Khởi tạo SoundManager & SettingsManager ✅
- [x] Gọi `soundManager.init()` khi game start
- [x] Gọi `settingsManager.applySettings()` khi game start
- [x] Gọi `soundManager.resumeAudioContext()` khi game start
</｜｜DSML｜｜parameter>
</create_file>
