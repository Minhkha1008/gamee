// Achievements Module
class AchievementManager {
    constructor() {
        this.achievements = {
            firstBlood: { id: 'firstBlood', name: 'First Blood', description: 'Tiêu diệt quái vật đầu tiên', icon: '🩸', unlocked: false },
            comboMaster: { id: 'comboMaster', name: 'Combo Master', description: 'Đạt combo x5', icon: '🔥', unlocked: false },
            perfectGame: { id: 'perfectGame', name: 'Perfect Game', description: 'Hoàn thành level mà không mất máu', icon: '💎', unlocked: false },
            speedDemon: { id: 'speedDemon', name: 'Speed Demon', description: 'Hoàn thành game trong dưới 5 phút', icon: '⚡', unlocked: false },
            quizMaster: { id: 'quizMaster', name: 'Quiz Master', description: 'Trả lời đúng 10 câu liên tiếp', icon: '🧠', unlocked: false },
            bossSlayer: { id: 'bossSlayer', name: 'Boss Slayer', description: 'Tiêu diệt boss đầu tiên', icon: '👑', unlocked: false },
            survivor: { id: 'survivor', name: 'Survivor', description: 'Sống sót với 1 máu', icon: '❤️', unlocked: false },
            highScorer: { id: 'highScorer', name: 'High Scorer', description: 'Đạt trên 1000 điểm', icon: '🏆', unlocked: false },
            powerupCollector: { id: 'powerupCollector', name: 'Power-up Collector', description: 'Nhập 5 power-up', icon: '🎁', unlocked: false },
            levelMaster: { id: 'levelMaster', name: 'Level Master', description: 'Hoàn thành tất cả 5 level', icon: '🎯', unlocked: false }
        };
        this.unlockedAchievements = [];
        this.loadAchievements();
    }

    loadAchievements() {
        const saved = localStorage.getItem('quizPlaneAchievements');
        if (saved) {
            try {
                const savedAchievements = JSON.parse(saved);
                this.unlockedAchievements = savedAchievements;
                // Update unlocked status
                this.unlockedAchievements.forEach(id => {
                    if (this.achievements[id]) {
                        this.achievements[id].unlocked = true;
                    }
                });
            } catch (error) {
                console.error('Error loading achievements:', error);
            }
        }
    }

    saveAchievements() {
        localStorage.setItem('quizPlaneAchievements', JSON.stringify(this.unlockedAchievements));
    }

    unlock(achievementId) {
        if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
            this.achievements[achievementId].unlocked = true;
            this.unlockedAchievements.push(achievementId);
            this.saveAchievements();
            this.showAchievementPopup(this.achievements[achievementId]);
            soundManager.createPowerupSound();
            return true;
        }
        return false;
    }

    showAchievementPopup(achievement) {
        const popup = document.getElementById('achievement-popup');
        const nameElement = document.getElementById('achievement-name');
        
        if (popup && nameElement) {
            nameElement.textContent = achievement.name;
            popup.classList.remove('hidden');
            
            setTimeout(() => {
                popup.classList.add('hidden');
            }, 3000);
        }
    }

    checkFirstBlood() {
        this.unlock('firstBlood');
    }

    checkCombo(combo) {
        if (combo >= 5) {
            this.unlock('comboMaster');
        }
    }

    checkPerfectGame(livesLost) {
        if (livesLost === 0) {
            this.unlock('perfectGame');
        }
    }

    checkSpeedDemon(elapsedTime) {
        if (elapsedTime < 300) { // 5 minutes = 300 seconds
            this.unlock('speedDemon');
        }
    }

    checkQuizMaster(correctStreak) {
        if (correctStreak >= 10) {
            this.unlock('quizMaster');
        }
    }

    checkBossSlayer() {
        this.unlock('bossSlayer');
    }

    checkSurvivor(lives) {
        if (lives === 1) {
            this.unlock('survivor');
        }
    }

    checkHighScorer(score) {
        if (score >= 1000) {
            this.unlock('highScorer');
        }
    }

    checkPowerupCollector(count) {
        if (count >= 5) {
            this.unlock('powerupCollector');
        }
    }

    checkLevelMaster(level) {
        if (level >= 5) {
            this.unlock('levelMaster');
        }
    }

    getUnlockedAchievements() {
        return this.unlockedAchievements.map(id => this.achievements[id]).filter(a => a);
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }

    reset() {
        this.unlockedAchievements = [];
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
        });
        this.saveAchievements();
    }

    displayAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        container.innerHTML = '';
        const unlocked = this.getUnlockedAchievements();

        if (unlocked.length === 0) {
            container.innerHTML = '<p>Chưa có achievement nào</p>';
            return;
        }

        unlocked.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.textContent = achievement.icon;
            badge.title = `${achievement.name}: ${achievement.description}`;
            container.appendChild(badge);
        });
    }
}

// Create global instance
const achievementManager = new AchievementManager();
