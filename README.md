# ✈️ Sky Quiz Defender - Ultimate Edition

Một game bắn máy bay kết hợp trả lời câu hỏi trắc nghiệm để bảo vệ cánh đồng lúa khỏi quái vật từ trên trời rơi xuống. Phiên bản nâng cấp với nhiều tính năng mới và cải tiến.

## 🎮 Tính năng mới trong Ultimate Edition

### 🆕 Tính năng mới
- **Hệ thống Power-ups**: ❤️ Hồi máu, ⚡ Tăng tốc bắn, 🛡️ Khiên bảo vệ, 💣 Bom nổ toàn màn hình
- **Hệ thống Achievements**: 10 achievements để mở khóa với các icon đặc biệt
- **Bảng xếp hạng High Score**: Lưu và hiển thị 10 điểm cao nhất
- **Cài đặt game**: Điều chỉnh âm lượng, nhạc nền, hiệu ứng âm thanh, và độ khó
- **Quiz Timer**: Thời gian giới hạn 15 giây cho mỗi câu hỏi
- **Pause Game**: Tạm dừng game bằng phím P hoặc nút pause
- **Độ khó tùy chỉnh**: 3 mức độ khó (Dễ, Normal, Khó)
- **Hiệu ứng nâng cấp**: Animation mượt mà hơn, particle effects, và visual improvements
- **Boss Battle cải tiến**: Boss với emoji đa dạng và hiệu ứng xuất hiện đặc biệt

### 🎯 Cách chơi

#### Điều khiển
- **← →** : Di chuyển máy bay sang trái/phải
- **Space** : Bắn đạn
- **1 - 4** : Chọn đáp án câu hỏi
- **P** : Pause game
- **Enter** : Xác nhận lựa chọn

#### Luật chơi
1. **Mục tiêu**: Bắn hạ quái vật và trả lời đúng câu hỏi để ghi điểm
2. **Máu**: Bạn có 3 mạng (❤❤❤)
   - Trả lời sai: Mất 1 máu
   - Quái chạm máy bay: Mất 1 máu
   - Mất hết 3 máu: Game Over
3. **Điểm số**:
   - Bắn trúng: +10 điểm
   - Giết quái: +50 điểm
   - Trả lời đúng: +100 điểm
   - Combo: Tăng điểm thưởng (x2, x3, x5)
4. **Level**: Game có 5 level với độ khó tăng dần
   - Level 1-3: Quái vật thường với tốc độ tăng dần
   - Level 4-5: Xuất hiện Boss với HP cao
5. **Power-ups**: Thu thập các vật phẩm hỗ trợ để tăng sức mạnh
6. **Quiz Timer**: Mỗi câu hỏi có 15 giây để trả lời

## 🏆 Achievements

- **First Blood** 🩸: Tiêu diệt quái vật đầu tiên
- **Combo Master** 🔥: Đạt combo x5
- **Perfect Game** 💎: Hoàn thành level mà không mất máu
- **Speed Demon** ⚡: Hoàn thành game trong dưới 5 phút
- **Quiz Master** 🧠: Trả lời đúng 10 câu liên tiếp
- **Boss Slayer** 👑: Tiêu diệt boss đầu tiên
- **Survivor** ❤️: Sống sót với 1 máu
- **High Scorer** 🏆: Đạt trên 1000 điểm
- **Power-up Collector** 🎁: Nhập 5 power-up
- **Level Master** 🎯: Hoàn thành tất cả 5 level

## 📁 Cấu trúc thư mục

```
quiz-plane-game-upgraded/
│
├── index.html              # File HTML chính
├── README.md               # Hướng dẫn sử dụng
│
├── css/
│     style.css            # Style chính với UI/UX nâng cấp
│     animation.css         # Animation và hiệu ứng mở rộng
│
├── js/
│     game.js              # Game loop và quản lý chính
│     player.js            # Điều khiển máy bay
│     enemy.js             # Quản lý quái vật
│     bullet.js            # Quản lý đạn
│     collision.js         # Phát hiện va chạm
│     quiz.js              # Hệ thống câu hỏi với timer
│     level.js             # Quản lý level với độ khó
│     ui.js                # UI và HUD nâng cấp
│     sound.js             # Quản lý âm thanh cải tiến
│     questions.js         # Tải câu hỏi với fallback
│     settings.js          # Quản lý cài đặt game
│     highscore.js         # Quản lý bảng xếp hạng
│     achievements.js      # Hệ thống achievements
│     powerups.js          # Quản lý power-ups
│
└── assets/
     ├── images/           # Hình ảnh (placeholder)
     ├── sounds/           # File âm thanh (placeholder)
     └── data/
            questions.json # Dữ liệu câu hỏi
```

## 🚀 Cách chạy game

### Cách 1: Mở trực tiếp
1. Tải hoặc clone project
2. Mở file `index.html` bằng trình duyệt web
3. Bắt đầu chơi!

### Cách 2: Sử dụng local server (khuyến nghị)
```bash
# Sử dụng Python
cd quiz-plane-game-upgraded
python -m http.server 8000

# Hoặc sử dụng Node.js với http-server
npx http-server -p 8000
```

Sau đó mở trình duyệt và truy cập `http://localhost:8000`

## ⚙️ Cài đặt

Game có thể tùy chỉnh qua menu Cài đặt:

- **🔊 Âm lượng**: Điều chỉnh âm lượng tổng thể (0-100%)
- **🎵 Nhạc nền**: Bật/tắt nhạc nền
- **🔔 Hiệu ứng âm thanh**: Bật/tắt hiệu ứng âm thanh
- **📱 Chế độ khó**: Chọn độ khó (Dễ, Normal, Khó)

### Tác động của độ khó:
- **Dễ**: Tốc độ spawn chậm hơn, quái vật chậm hơn, boss yếu hơn
- **Normal**: Cân bằng (mặc định)
- **Khó**: Tốc độ spawn nhanh hơn, quái vật nhanh hơn, boss mạnh hơn

## 🛠️ Tùy chỉnh nâng cao

### Thêm câu hỏi mới
Mở file `assets/data/questions.json` và thêm câu hỏi theo format:

```json
{
  "id": 101,
  "category": "Category",
  "question": "Câu hỏi của bạn?",
  "options": [
    "Đáp án A",
    "Đáp án B",
    "Đáp án C",
    "Đáp án D"
  ],
  "correct": 0  // Index của đáp án đúng (0-3)
}
```

### Điều chỉnh độ khó
Mở file `js/level.js` và chỉnh sửa `levelConfigs` và `difficultyMultipliers`.

### Thay đổi âm lượng
Trong file `js/settings.js`, chỉnh sửa giá trị mặc định của `this.settings.volume` (0.0 - 1.0)

### Thêm achievements mới
Mở file `js/achievements.js` và thêm achievement mới vào object `this.achievements`.

### Thêm power-ups mới
Mở file `js/powerups.js` và thêm type mới vào array `this.powerUpTypes`.

## 🎨 Cải tiến UI/UX

### Visual Improvements
- Gradient backgrounds với animation
- Particle effects cho explosions
- Smooth transitions và animations
- Responsive design cho mobile
- Enhanced HUD với thông tin chi tiết
- Achievement popups với animation
- High score display với ranking

### Audio Improvements
- Web Audio API cho âm thanh chất lượng cao
- Sound effects cho mọi hành động
- Background music (tùy chọn)
- Volume control riêng cho music và SFX

## 🐛 Sửa lỗi và cải tiến từ phiên bản gốc

### Các lỗi đã sửa:
- ✅ Sửa lỗi countdown overlay không biến mất
- ✅ Sửa lỗi game screen không hiển thị đúng
- ✅ Thêm fallback khi không tải được questions.json
- ✅ Sửa lỗi collision detection không chính xác
- ✅ Cải thiện memory leak bằng cách cleanup đúng cách
- ✅ Sửa lỗi audio context bị suspend

### Cải tiến code:
- ✅ Code structure rõ ràng hơn với module separation
- ✅ Error handling tốt hơn
- ✅ Comments chi tiết hơn
- ✅ Performance optimization
- ✅ Better variable naming
- ✅ Consistent coding style

## 📊 Thống kê game

Game theo dõi các thống kê sau:
- Điểm số
- Số câu đúng/sai
- Combo hiện tại
- Thời gian chơi
- Số quái đã tiêu diệt
- Số power-up đã thu thập
- Achievements đã mở khóa

## 💾 Lưu trữ dữ liệu

Game sử dụng localStorage để lưu:
- Cài đặt game
- Bảng xếp hạng high score
- Achievements đã mở khóa

Dữ liệu được lưu trữ locally trên trình duyệt của người dùng.

## 🔒 Privacy

Game không thu thập bất kỳ dữ liệu cá nhân nào. Tất cả dữ liệu được lưu trữ locally trên trình duyệt của người dùng.

## 📝 Future Improvements

- [ ] Thêm nhiều loại quái và boss
- [ ] Thêm chế độ multiplayer
- [ ] Tối ưu mobile experience thêm
- [ ] Thêm background music thực tế
- [ ] Thêm leaderboard online
- [ ] Thêm skins cho máy bay
- [ ] Thêm daily challenges
- [ ] Thêm tutorial mode

## 🤝 Đóng góp

Mọi đóng góp và đề xuất đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện game.

## 📄 License

This project is open source and available for educational purposes.

---

**Phiên bản**: 2.0 - Ultimate Edition  
**Cập nhật**: Nâng cấp hoàn toàn với tính năng mới và cải tiến  
**Chúc bạn chơi vui vẻ! 🎮✈️**
